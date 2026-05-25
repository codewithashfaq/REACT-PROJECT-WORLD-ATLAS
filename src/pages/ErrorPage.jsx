import { NavLink, useRouteError } from "react-router-dom";

// ============================================================
// ErrorPage
//
// A catch-all error boundary rendered by React Router whenever
// an unhandled error occurs during routing or data loading.
// Configured as the "errorElement" on the root route in the
// router definition, so it automatically intercepts:
//   - 404s (navigating to a route that doesn't exist)
//   - Loader / action errors thrown inside route components
//   - Any uncaught runtime error in the component tree
//
// useRouteError() gives us the error object React Router
// caught — it may be a standard JS Error (has .message) or
// an HTTP response error (has .status and .statusText), so
// both cases are handled below.
//
// The "Go Home" button always gives the user a safe exit
// back to the home page regardless of what broke.
// ============================================================
export const ErrorPage = () => {
  // useRouteError returns whatever was thrown — could be an
  // Error object, a Response, or a plain string depending on
  // where the error originated.
  const error = useRouteError();
  console.log(error);

  return (
    <div>
      {/* Generic heading — shown for all error types */}
      <h2>Oops! Something went wrong.</h2>

      {/* error.message is present on standard JS Error objects.
          Falls back to a generic string if it's missing.      */}
      <p>{error.message || "An unexpected error occurred."}</p>

      {/* error.status is only present on HTTP response errors
          (e.g. 404 Not Found). Guard with && so this paragraph
          is skipped entirely for non-HTTP errors.              */}
      {error.status && (
        <p>
          Error {error.status}: {error.statusText}
        </p>
      )}

      {/* Safe exit — always navigates back to the home page */}
      <NavLink to={"/"}>
        <button>Go Home</button>
      </NavLink>
    </div>
  );
};
