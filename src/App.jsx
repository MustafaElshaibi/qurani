import { Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/commen/Header";
import Player from "./components/commen/Player";
import Sidebar from "./components/commen/Sidebar";
import Home from "./pages/Home";
import ListSurahOfReciter from "./pages/ListSurahOfReciter";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ErrorPage } from "./pages/Error";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { listenToAuthChanges } from "./rtk/Reducers/AuthReducer";
import AllReciters from "./pages/AllReciters";
import LibraryContent from "./components/libraries/LibraryContent";
import SearchResults from "./pages/SearchResults";
import SurahInfoPage from "./pages/SurahInfoPage";
import AllSurah from "./pages/AllSurah";
import YouTubeLive from "./pages/LiveList";


function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
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
                    <Outlet />
                  </div>
                </div>
              </>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/reciters" element={<AllReciters />} />
            <Route path="/reciter/:id" element={<ListSurahOfReciter />} />
            <Route path="/library/:libraryId" element={<LibraryContent />} />
            <Route path="/search" element={<SearchResults />} />
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
