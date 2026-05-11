import { useEffect } from "react";
import { getCountriesData } from "../api/CountriesData";
import { useTransition } from "react";
import { useState } from "react";
import { Loader } from "../components/Loader";
import { CountryCard } from "../components/CountryCard";
import { SearchFilter } from "../components/SearchFilter";

export const Country = () => {
  const [isPending, startTransition] = useTransition();
  const [countries, setCountries] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [error, setError] = useState(null);

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getCountriesData();
        setCountries(res.data);
      } catch (err) {
        setError(err.message);
      }
    });
  }, []);

  if (isPending) return <Loader />;
  if (error) return <p className="error">Failed to load countries: {error}</p>;

  const searchCountry = (country) => {
    if (search) {
      return country.name.common.toLowerCase().includes(search.toLowerCase());
    }
    return country;
  };

  const filterRegion = (country) => {
    if (filter === "all") {
      return country;
    }
    return country.region === filter;
  };
  const filterCountries = countries.filter(
    (country) => searchCountry(country) && filterRegion(country),
  );

  return (
    <section className="country-section">
      <SearchFilter
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        countries={countries}
        setCountries={setCountries}
      />

      <ul className="grid grid-four-cols">
        {filterCountries.map((currentCountry, index) => {
          return <CountryCard country={currentCountry} key={index} />;
        })}
      </ul>
    </section>
  );
};
