import axios from "axios";
const API_KEY = import.meta.env.VITE_RESTCOUNTRIES_API_KEY;

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
  baseURL: "https://api.restcountries.com/countries/v5",
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
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
export const getCountriesData = async () => {
  const fields = "names,population,region,capitals,flag";

  const page1 = await api.get("", {
    params: { response_fields: fields, limit: 100, offset: 0 },
  });
  const page2 = await api.get("", {
    params: { response_fields: fields, limit: 100, offset: 100 },
  });
  const page3 = await api.get("", {
    params: { response_fields: fields, limit: 100, offset: 200 },
  });

  return [
    ...page1.data.data.objects,
    ...page2.data.data.objects,
    ...page3.data.data.objects,
  ];
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
  return api.get(`/names.common/${encodeURIComponent(name)}`, {
    params: {
      response_fields:
        "names,population,region,subregion,capitals,tlds,currencies,languages,borders,flag",
    },
  });
};
