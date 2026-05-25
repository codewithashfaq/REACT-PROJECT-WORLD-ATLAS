// ============================================================
// SearchFilter
//
// Toolbar that lets the user search, sort, and filter the
// country listing in real time. All state lives in the parent
// (CountryPage) — this component only receives values and
// setter callbacks as props, keeping it fully controlled.
//
// @prop {string}   search       — current search input value
// @prop {function} setSearch    — updates the search string
// @prop {string}   filter       — currently selected region
// @prop {function} setFilter    — updates the region filter
// @prop {Array}    countries    — the full countries array
// @prop {function} setCountries — updates the sorted array
// ============================================================
export const SearchFilter = ({
  search,
  setSearch,
  filter,
  setFilter,
  countries,
  setCountries,
}) => {
  // ── Search handler ───────────────────────────────────────
  // Controlled input — every keystroke updates the search
  // string in the parent which re-filters the displayed list.
  const handleInputChange = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
  };

  // ── Region filter handler ────────────────────────────────
  // Controlled select — changing the dropdown instantly
  // updates the region filter in the parent.
  const handleSelectChange = (event) => {
    event.preventDefault();
    setFilter(event.target.value);
  };

  // ── Sort handler ─────────────────────────────────────────
  // Sorts a shallow copy of the countries array alphabetically
  // by common name. We spread into a new array first because
  // Array.sort() mutates in place — mutating the original
  // would bypass React's state update detection.
  //
  // localeCompare handles accented characters correctly, e.g.
  // "Åland Islands" sorts before "Albania" as expected.
  //
  // @param {string} value — "asc" for A→Z, "desc" for Z→A
  const sortCountries = (value) => {
    const sortCountry = [...countries].sort((a, b) => {
      return value === "asc"
        ? a.name.common.localeCompare(b.name.common)
        : b.name.common.localeCompare(a.name.common);
    });

    setCountries(sortCountry);
  };

  return (
    <section className="section-searchFilter container">
      {/* Live search input — filters the list as the user types */}
      <input
        type="text"
        placeholder="search"
        value={search}
        onChange={handleInputChange}
      />

      {/* Sort A → Z */}
      <div>
        <button onClick={() => sortCountries("asc")}>Asc</button>
      </div>

      {/* Sort Z → A */}
      <div>
        <button onClick={() => sortCountries("desc")}>Desc</button>
      </div>

      {/* Region filter — "All" shows every country regardless of region */}
      <div>
        <select
          className="select-section"
          value={filter}
          onChange={handleSelectChange}
        >
          <option value="all">All</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>
    </section>
  );
};
