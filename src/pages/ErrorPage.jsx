import { NavLink, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();
  console.log(error);

  return (
    <div>
      <h2>Oops! Something went wrong.</h2>
      <p>{error.message || "An unexpected error occurred."}</p>
      {error.status && (
        <p>
          Error {error.status}: {error.statusText}
        </p>
      )}
      <NavLink to={"/"}>
        <button>Go Home</button>
      </NavLink>
    </div>
  );
};
