import { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { listenToAuthChanges } from "./rtk/Reducers/AuthReducer";
import { Outlet, Route, Routes } from "react-router-dom";
import PageLoader from "./components/uncommen/PageLoader";
import {fetchReciterDescription} from "./utility/gemini";


// Lazy-loaded components
const Header = lazy(() => import("./components/commen/Header"));
const Player = lazy(() => import("./components/commen/Player"));
const Sidebar = lazy(() => import("./components/commen/Sidebar"));
const Home = lazy(() => import("./pages/Home"));
const ListSurahOfReciter = lazy(() => import("./pages/ListSurahOfReciter"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ErrorPage = lazy(() => import("./pages/Error"));
const AllReciters = lazy(() => import("./pages/AllReciters"));
const LibraryContent = lazy(() =>
  import("./components/libraries/LibraryContent")
);
const SurahInfoPage = lazy(() => import("./pages/SurahInfoPage"));
const AllSurah = lazy(() => import("./pages/AllSurah"));
const YouTubeLive = lazy(() => import("./pages/LiveList"));
const Footer = lazy(() => import("./components/commen/Footer"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const SettingsPage = lazy(() => import("./pages/Settings"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchReciterDescription("Abdul Basit Abdul Samad").then((description) => {
      console.log("Reciter Description:", description);
    })
    dispatch(listenToAuthChanges());
  }, [dispatch]);

  return (
    <>
      {/* <Home /> */}
      <div className="min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <div className="hero flex gap-2 m-2 sticky min-h-screen top-[100px] ">
                  <Sidebar />
                  <div className="main-display w-full">
                    <Suspense fallback={<div className="min-h-screen flex items-center justify-center "><PageLoader /></div>}>
                      <Outlet />
                    </Suspense>
                    <Footer />
                  </div>
                </div>
              </>
            }
          >
            <Route path="/" element={<Home />} />
            <Route
              path="/profile"
              element={
                
                  <ProfilePage />
                
              }
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/reciters" element={<AllReciters />} />
            <Route path="/reciter" element={<ListSurahOfReciter />} />
            <Route path="/library/:libraryId" element={<LibraryContent />} />
            <Route path="/search" element={<ListSurahOfReciter />} />
            <Route path="/surah" element={<SurahInfoPage />} />
            <Route path="/all-surah" element={<AllSurah />} />
            <Route path="/live" element={<YouTubeLive />} />
          </Route>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Player />
      </div>
    </>
  );
}

export default App;
