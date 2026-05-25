import countryFacts from "../api/CountryData.json";

// ============================================================
// About
//
// Renders the "Interesting Facts" section of the About page.
// Displays a responsive grid of country fact cards, each
// showing a country's name, capital, population, and one
// interesting fact.
//
// Data source: CountryData.json — a local static JSON file
// that contains a hand-curated list of country facts. Using
// local JSON here instead of the REST Countries API keeps
// this page fast and avoids an unnecessary network request
// for content that doesn't change often.
//
// This component is purely presentational — no props,
// no state, no side effects.
// ============================================================
export const About = () => {
  return (
    <section className="section-about container">
      {/* Section heading */}
      <h2 className="container-title">
        Here are the Interesting Facts <br />
        we're proud of
      </h2>

      {/* ── Fact cards grid ───────────────────────────────
          Maps over the JSON array to render one card per
          country. Each entry has a stable numeric id from
          the JSON file so we use that as the React key
          instead of the array index — safer if the list
          ever gets reordered or filtered.                  */}
      <div className="gradient-cards">
        {countryFacts.map((currentCountry) => {
          const { id, countryName, capital, population, interestingFact } =
            currentCountry;

          return (
            <div className="card" key={id}>
              <div className="container-card bg-blue-box">
                {/* Country name — styled as the card heading */}
                <p className="card-title">{countryName}</p>

                <p>
                  <span className="card-description">Capital: </span>
                  {capital}
                </p>

                {/* Population comes pre-formatted as a string in the
                    JSON (e.g. "1,444,216,107") so no toLocaleString
                    needed here unlike the live API data               */}
                <p>
                  <span className="card-description">Population: </span>
                  {population}
                </p>

                <p>
                  <span className="card-description">Interesting Facts: </span>
                  {interestingFact}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
