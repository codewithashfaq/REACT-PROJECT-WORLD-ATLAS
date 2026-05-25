import { NavLink } from "react-router-dom";

// ============================================================
// CountryCard
//
// Renders a single country card in the listing grid.
// Receives one country object as a prop and displays its flag,
// name, population, region, and capital.
//
// @prop {object} country — a country object from the REST
//   Countries API containing: name, capital, region,
//   population, and flags.
// ============================================================
export const CountryCard = ({ country }) => {
  const { name, capital, region, population, flags } = country;

  return (
    <li className="country-card card">
      <div className="container-card bg-white-box">
        {/* Country flag — falls back gracefully if alt text is missing */}
        <img src={flags.svg} alt={flags.alt} />

        <div className="countryInfo">
          {/* Truncate long country names so they don't break the card layout */}
          <p className="card-title">
            {name.common.length > 10
              ? name.common.slice(0, 10) + "..."
              : name.common}
          </p>

          {/* toLocaleString adds thousand separators: 1324216107 → 1,324,216,107 */}
          <p>
            <span className="card-description">Population: </span>
            {population.toLocaleString()}
          </p>

          <p>
            <span className="card-description">Region: </span>
            {region}
          </p>

          {/* capital is an array — most countries have one, we always show the first */}
          <p>
            <span className="card-description">Capital: </span>
            {capital[0]}
          </p>

          {/* Links to the detail page using the country's common name as the URL param */}
          <NavLink to={`/country/${name.common}`}>
            <button>Read More</button>
          </NavLink>
        </div>
      </div>
    </li>
  );
};
