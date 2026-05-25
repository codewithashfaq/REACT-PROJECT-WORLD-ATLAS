import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Country } from "./pages/Country";
import { Contact } from "./pages/Contact";
import { ErrorPage } from "./pages/ErrorPage";
import { CountryDetails } from "./components/CountryDetails";

// ============================================================
// Router Configuration
//
// Defines the complete route tree for the app using the
// Data Router API (createBrowserRouter), which is the
// recommended approach in React Router v6.4+.
//
// Structure:
//   /                → AppLayout (persistent shell)
//   ├── index        → Home
//   ├── about        → About
//   ├── country      → Country (listing page)
//   ├── country/:id  → CountryDetails (detail page)
//   └── contact      → Contact
//
// AppLayout is the parent of every route — it renders the
// Header, Footer, ScrollToTop, and AIChatBot once and swaps
// only the child page via <Outlet> on navigation.
//
// errorElement on the root route means ErrorPage catches any
// unhandled error from ANY route in the tree — a single
// error boundary for the whole app.
// ============================================================
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,

    // Catches unhandled errors from any route in the tree
    errorElement: <ErrorPage />,

    children: [
      {
        // index: true renders Home at exactly "/" with no extra path segment
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        // Listing page — shows all countries with search / filter
        path: "country",
        element: <Country />,
      },
      {
        // Detail page — :id is the country's common name from the URL,
        // e.g. /country/Germany → id === "Germany"
        path: "country/:id",
        element: <CountryDetails />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
]);

// ============================================================
// App
//
// Root component mounted in main.jsx. RouterProvider connects
// the router configuration above to the React component tree,
// enabling all routing and navigation throughout the app.
// ============================================================
const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
