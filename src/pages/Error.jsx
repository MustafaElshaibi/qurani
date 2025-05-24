import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export const ErrorPage = () => (
  <>
    <Helmet>
      <title>404 | Qurani</title>
      <meta name="robots" content="noindex, follow" />
      <meta
        name="description"
        content="Page not found. Qurani - a Holy Quran Platform."
      />
    </Helmet>
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Some Error</h1>
      <p className="text-gray-600 mb-8">
        Something went wrong during authentication or fetching
      </p>
      <Link
        to="/"
        className="bg-heading text-main-black px-6 py-3 rounded-full hover:bg-heading/90"
      >
        Return Home
      </Link>
    </div>
  </>
);