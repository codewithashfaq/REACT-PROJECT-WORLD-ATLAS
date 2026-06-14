import { createContext, useContext, useState } from "react";

const CountryContext = createContext();

export const CountryProvider = ({ children }) => {
  const [activeCountry, setActiveCountry] = useState(null);
  return (
    <CountryContext.Provider value={{ activeCountry, setActiveCountry }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => useContext(CountryContext);
