import { useEffect, useState, useTransition } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getCountryData } from "../api/CountriesData";
import { Loader } from "./Loader";

// ============================================================
// CountryDetails
//
// Detail page for a single country. Reads the country name
// from the URL param (:id), fetches its full data from the
// REST Countries API, and renders all available fields.
//
// State:
//   isPending — true while the API call is in flight;
//               drives the full-page loading spinner.
//   country   — the country object once the fetch succeeds;
//               undefined until then so the JSX guards with
//               a conditional render.
//
// useTransition is used instead of a plain loading boolean so
// React can keep the previous UI interactive while the new
// data loads in the background (non-blocking update).
// ============================================================
export const CountryDetails = () => {
  // useParams pulls the country name out of the URL, e.g.
  // /country/Germany → prams.id === "Germany"
  const prams = useParams();
  console.log(prams);

  const [isPending, startTransition] = useTransition();
  const [country, setCountry] = useState();

  // ── Data fetching ────────────────────────────────────────
  // Runs once on mount. Wrapping the async call in
  // startTransition marks the resulting state update as
  // non-urgent so React can batch it without blocking the UI.
  useEffect(() => {
    startTransition(async () => {
      const res = await getCountryData(prams.id);
      console.log(res);

      // Only update state on a successful response —
      // avoids rendering broken data on network errors.
      if (res.status === 200) {
        setCountry(res.data[0]);
      }
    });
  }, []);

  // Show the spinner while the API call is still in flight
  if (isPending) return <Loader />;

  console.log(country);

  return (
    <>
      <section className="card country-details-card container">
        <div className="container-card bg-white-box">
          {/* Guard: only render country details once data has arrived */}
          {country && (
            <div className="country-image grid grid-two-cols">
              {/* Country flag */}
              <img
                src={country.flags.svg}
                alt={country.flags.alt}
                className="flag"
              />

              <div className="country-content">
                {/* Official (legal) name, e.g. "Federal Republic of Germany" */}
                <p className="card-title"> {country.name.official} </p>

                <div className="infoContainer">
                  {/* nativeName is a keyed object ({ deu: { common, official } })
                      so we extract the values and join them into a readable string */}
                  <p>
                    <span className="card-description"> Native Names: </span>
                    {Object.keys(country.name.nativeName)
                      .map((key) => country.name.nativeName[key].common)
                      .join(", ")}
                  </p>

                  {/* toLocaleString formats the number with thousand separators */}
                  <p>
                    <span className="card-description"> Population: </span>
                    {country.population.toLocaleString()}
                  </p>

                  <p>
                    <span className="card-description"> Region: </span>
                    {country.region}
                  </p>

                  <p>
                    <span className="card-description"> Sub Region: </span>
                    {country.subregion}
                  </p>

                  {/* capital is an array; most countries have one primary capital */}
                  <p>
                    <span className="card-description"> Capital: </span>
                    {country.capital}
                  </p>

                  {/* tld (top-level domain) is an array, e.g. [".de"] — show the first */}
                  <p>
                    <span className="card-description">Top Level Domain: </span>
                    {country.tld[0]}
                  </p>

                  {/* currencies is a keyed object ({ EUR: { name, symbol } })
                      so we extract just the name for each currency */}
                  <p>
                    <span className="card-description"> Currencies: </span>
                    {Object.keys(country.currencies)
                      .map((key) => country.currencies[key].name)
                      .join(", ")}
                  </p>

                  {/* languages is a keyed object ({ deu: "German" })
                      so we extract the values directly */}
                  <p>
                    <span className="card-description">Languages: </span>
                    {Object.keys(country.languages)
                      .map((key) => country.languages[key])
                      .join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Back button — always visible so the user can navigate
              away even if the country data failed to load */}
          <div className="country-card-backBtn">
            <NavLink to="/country" className="backBtn">
              <button>Go Back</button>
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
};
