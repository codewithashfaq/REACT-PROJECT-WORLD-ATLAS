import { useEffect, useTransition, useState } from "react";
import { getCountriesData } from "../api/CountriesData";
import { Loader } from "../components/Loader";
import { CountryCard } from "../components/CountryCard";
import { SearchFilter } from "../components/SearchFilter";

// ============================================================
// Country
//
// The main country listing page. Fetches all countries from
// the REST Countries API on mount, then lets the user search,
// filter by region, and sort the results in real time.
//
// State:
//   countries  — the full array returned by the API. SearchFilter
//                can reorder this via the sort buttons, which is
//                why the setter is passed down as a prop.
//   search     — the current text input value; filters by name.
//   filter     — the selected region ("all" shows everything).
//   error      — holds the error message if the API call fails.
//   isPending  — true while the API call is in flight; drives
//                the full-page loading spinner.
//
// Filtering happens on every render by deriving filterCountries
// from the current state — no extra useEffect needed.
// ============================================================
export const Country = () => {
  const [isPending, startTransition] = useTransition();
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  // ── Data fetching ────────────────────────────────────────
  // Runs once on mount. startTransition marks the state update
  // as non-urgent so React keeps the UI responsive while the
  // network request is in flight.
  // try/catch stores any network or API error in state so we
  // can show a helpful message instead of a blank screen.
  useEffect(() => {
    startTransition(async () => {
      try {
        const cached = sessionStorage.getItem("countriesData");
        if (cached) {
          setCountries(JSON.parse(cached));
          return;
        }

        const data = await getCountriesData();
        sessionStorage.setItem("countriesData", JSON.stringify(data));
        setCountries(data);
      } catch (err) {
        setError(err.message);
      }
    });
  }, []);

  // Show the spinner while the API call is still in flight
  if (isPending) return <Loader />;

  // Show an inline error message if the fetch failed
  if (error) return <p className="error">Failed to load countries: {error}</p>;

  // ── Search predicate ─────────────────────────────────────
  // Returns true if the country name contains the search string
  // (case-insensitive). Returns true for every country when
  // the search input is empty so the full list shows by default.
  const searchCountry = (country) => {
    if (search) {
      return country.names?.common
        ?.toLowerCase()
        .includes(search.toLowerCase());
    }
    return country;
  };

  // ── Region filter predicate ──────────────────────────────
  // Returns true for every country when "all" is selected.
  // Otherwise only returns countries whose region matches the
  // dropdown value exactly.
  const filterRegion = (country) => {
    if (filter === "all") {
      return country;
    }
    return country.region === filter;
  };

  // ── Derived filtered list ────────────────────────────────
  // Both predicates must pass for a country to appear in the
  // list. Recomputed on every render so search and filter
  // results are always in sync with the current state.
  const filterCountries = countries.filter(
    (country) => searchCountry(country) && filterRegion(country),
  );

  return (
    <section className="country-section">
      {/* Search input, sort buttons, and region dropdown.
          countries + setCountries are passed so SearchFilter
          can sort the source array directly via the Asc/Desc buttons */}
      <SearchFilter
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        countries={countries}
        setCountries={setCountries}
      />

      {/* Render one CountryCard per filtered result.
          Index is used as key here because the array can be
          reordered by the sort buttons — a stable id from the
          API would be preferable if one were available        */}
      <ul className="grid grid-four-cols">
        {filterCountries.map((currentCountry, index) => {
          return <CountryCard country={currentCountry} key={index} />;
        })}
      </ul>
    </section>
  );
};
