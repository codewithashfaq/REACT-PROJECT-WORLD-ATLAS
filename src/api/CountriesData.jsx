import axios from "axios";

// ============================================================
// API CLIENT — REST Countries
//
// Centralised Axios instance for all REST Countries API calls.
// Setting a baseURL here means every request function below
// only needs to specify the path, not the full URL.
//
// timeout: 10s — if the server doesn't respond in 10 seconds,
// Axios cancels the request and throws an error instead of
// hanging the UI forever.
// ============================================================
const api = axios.create({
  baseURL: "https://restcountries.com/v3.1",
  timeout: 10000,
});

// ============================================================
// getCountriesData
//
// Fetches a lightweight list of ALL countries for the home /
// country listing page.
//
// The "fields" query param tells the API to return only the
// five fields we actually render in the country cards —
// this cuts the response payload significantly compared to
// fetching the full country object (~30+ fields each).
//
// Returns: Axios response promise → response.data is an array
// of country objects: { name, population, region, capital, flags }
// ============================================================
export const getCountriesData = () => {
  return api.get("/all?fields=name,population,region,capital,flags");
};

// ============================================================
// getCountryData
//
// Fetches the full detail object for a SINGLE country by name.
// Used on the individual country detail page.
//
// fullText=true — requires an exact name match so searching
// "Georgia" doesn't accidentally return "Georgia (country)"
// and "South Georgia" at the same time.
//
// The "fields" param is expanded here to include everything
// the detail page displays: subregion, top-level domain,
// currencies, languages, borders, and flags.
//
// @param {string} name — the country's common name as it
//   appears in the URL, e.g. "Germany" or "New Zealand"
//
// Returns: Axios response promise → response.data is an array
// with one element; callers use response.data[0]
// ============================================================
export const getCountryData = (name) => {
  return api.get(
    `/name/${name}?fullText=true&fields=name,population,region,subregion,capital,tld,currencies,languages,borders,flags`,
  );
};
