import { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { listenToAuthChanges } from "./rtk/Reducers/AuthReducer";
import { Outlet, Route, Routes } from "react-router-dom";
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react";

// Lazy-loaded components
import Header from "./components/commen/Header";
const PageLoader = lazy(()=> import("./components/uncommen/PageLoader"));
const Player = lazy(() => import("./components/commen/Player"));
import Sidebar from "./components/commen/Sidebar";
import IsAuth from "./auth/IsAuth";
import ProtectAuthPages from "./auth/ProtectAuthPages";
import AccessibilityEnhancements from "./components/commen/AccessibilityEnhancements";
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
    dispatch(listenToAuthChanges());
    
  }, [dispatch]);

  return (
    <>
    <SpeedInsights />
     <Analytics />
     <AccessibilityEnhancements />
      {/* <Home /> */}
      <div className="min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <div className="hero flex gap-1.5 mx-1 my-1 top-[100px]  h-screen"> 
                  <Sidebar />
                  <div className="main-display w-full min-h-screen overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:appearance-none [&::-webkit-scrollbar]:w-0">
                    <Suspense
                      fallback={
                        <div className="h-screen flex items-center justify-center ">
                          <PageLoader />
                        </div>
                      }
                    >
                      <Outlet />
                    </Suspense>
                    <Footer />
                  </div>
                </div>
              </>
            }
          >
            <Route path="/" element={<Home />} />
            {/* Protected Routes */}
            <Route element={<IsAuth />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Public Routes */}
            <Route path="/reciters" element={<AllReciters />} />
            <Route path="/reciter/:reciterId" element={<ListSurahOfReciter />} />
            <Route path="/library/:libraryId" element={<LibraryContent />} />
            <Route path="/search/:reciterId" element={<ListSurahOfReciter />} />
            <Route path="/surah/:surahId" element={<SurahInfoPage />} />
            <Route path="/chapters" element={<AllSurah />} />
            <Route path="/live" element={<YouTubeLive />} />
          </Route>

            {/* Auth Routes  */}
          <Route element={<ProtectAuthPages />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          </Route>

          {/* Error Route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Player />
      </div>
    </>
  );
}

export default App;
