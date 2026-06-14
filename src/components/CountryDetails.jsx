import { useEffect, useState, useTransition } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getCountryData } from "../api/CountriesData";
import { Loader } from "./Loader";
import { useCountry } from "../context/CountryContext";

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

  const { setActiveCountry } = useCountry();
  const [isPending, startTransition] = useTransition();
  const [country, setCountry] = useState();

  // Go Back context reset
  useEffect(() => {
    return () => {
      setActiveCountry(null);
    };
  }, []);

  // ── Data fetching ────────────────────────────────────────
  // Runs once on mount. Wrapping the async call in
  // startTransition marks the resulting state update as
  // non-urgent so React can batch it without blocking the UI.
  useEffect(() => {
    startTransition(async () => {
      const res = await getCountryData(prams.id);

      // Only update state on a successful response —
      // avoids rendering broken data on network errors.
      if (res.status === 200) {
        const data = res.data.data.objects[0];
        setCountry(data);
        setActiveCountry(data);
      }
    });
  }, []);

  // Show the spinner while the API call is still in flight
  if (isPending) return <Loader />;

  return (
    <>
      <section className="card country-details-card container">
        <div className="container-card bg-white-box">
          {/* Guard: only render country details once data has arrived */}
          {country && (
            <div className="country-image grid grid-two-cols">
              {/* Country flag */}
              {country.flag?.url_svg ? (
                <img
                  src={country.flag.url_svg}
                  alt={country.names?.common}
                  className="flag"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    maxWidth: "30rem",
                    height: "20rem",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    justifySelf: "center",
                  }}
                >
                  <span style={{ fontSize: "6rem" }}>🏳️</span>
                  <span
                    style={{
                      fontSize: "1.4rem",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    No flag available
                  </span>
                </div>
              )}

              <div className="country-content">
                {/* Official (legal) name, e.g. "Federal Republic of Germany" */}
                <p className="card-title">{country.names?.official}</p>

                <div className="infoContainer">
                  {/* nativeName is a keyed object ({ deu: { common, official } })
                      so we extract the values and join them into a readable string */}
                  <p>
                    <span className="card-description">Native Names: </span>
                    {country.names?.native
                      ? Object.values(country.names.native)
                          .map((n) => n.common)
                          .join(", ")
                      : "N/A"}
                  </p>

                  {/* toLocaleString formats the number with thousand separators */}
                  <p>
                    <span className="card-description">Population: </span>
                    {country.population?.toLocaleString()}
                  </p>

                  <p>
                    <span className="card-description">Region: </span>
                    {country.region}
                  </p>

                  <p>
                    <span className="card-description">Sub Region: </span>
                    {country.subregion}
                  </p>

                  {/* capital is an array; most countries have one primary capital */}
                  <p>
                    <span className="card-description">Capital: </span>
                    {country.capitals?.[0]?.name ?? "N/A"}
                  </p>

                  {/* tld (top-level domain) is an array, e.g. [".de"] — show the first */}
                  <p>
                    <span className="card-description">Top Level Domain: </span>
                    {country.tlds?.[0] ?? "N/A"}
                  </p>

                  {/* currencies is a keyed object ({ EUR: { name, symbol } })
                      so we extract just the name for each currency */}
                  <p>
                    <span className="card-description">Currencies: </span>
                    {country.currencies
                      ? Object.values(country.currencies)
                          .map((c) => c.name)
                          .join(", ")
                      : "N/A"}
                  </p>

                  {/* languages is a keyed object ({ deu: "German" })
                      so we extract the values directly */}
                  <p>
                    <span className="card-description">Languages: </span>
                    {country.languages
                      ? Object.values(country.languages)
                          .map((lang) => lang.name)
                          .join(", ")
                      : "N/A"}
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
