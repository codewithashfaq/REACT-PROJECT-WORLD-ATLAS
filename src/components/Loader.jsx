import "../App.css";

// ============================================================
// Loader
//
// Full-page loading spinner shown while async data is in
// flight (e.g. while country data is being fetched from the
// REST Countries API).
//
// The visual is a pure CSS spinning arc — no external library.
// The animation and shape are defined in App.css under the
// .loader class using a conic-gradient mask technique.
//
// This component is purely presentational — no props,
// no state, no side effects.
// ============================================================
export const Loader = () => {
  return (
    /* loader-section centers the spinner vertically and
       horizontally within a 50vh tall container */
    <div className="container loader-section">
      <div className="loader"></div>
    </div>
  );
};
