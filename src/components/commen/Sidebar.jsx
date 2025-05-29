import { useState } from "react";
import { BiX } from "react-icons/bi";
import { FaReadme } from "react-icons/fa";
import { GiSoundOn } from "react-icons/gi";
import { GoHomeFill } from "react-icons/go";
import { IoIosRadio } from "react-icons/io";
import { PiPlus } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createLibrary,
  deleteLibrary,
} from "../../rtk/Reducers/LibraryReducer";
import LibraryList from "../libraries/LibraryList";
import LanguageBtn from "../uncommen/LanguageBtn";

const Sidebar = () => {
  const dispatch = useDispatch();
  const lang = useSelector((state)=> state.lang);
  const [showOnMobile, setShowOnMobile] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newLibraryName, setNewLibraryName] = useState("");
  const [editLibraryName, setEditLibraryName] = useState("");
  const [editingLibraryId, setEditingLibraryId] = useState(null);

  const handleCreateLibrary = () => {
    if (newLibraryName.trim()) {
      dispatch(createLibrary(newLibraryName.trim()));
      setNewLibraryName("");
      setIsCreating(false);
    }
  };

  return (
    <>
      <div className="sidebar bg-second-black overflow-y-auto overflow-x-hidden rounded-lg p-2 sm:p-4  sticky top-[80px] max-h-[calc(100vh-80px)] sm:w-[300px] lg:w-[400px] xl:w-[500px] w-[70px] transition-all duration-300 [&::-webkit-scrollbar]:appearance-none [&::-webkit-scrollbar]:w-0">
        <div className="flex flex-col gap-4">
          <RxHamburgerMenu
            onClick={() => setShowOnMobile(!showOnMobile)}
            className="sm:hidden cursor-pointer text-white font-bold size-5 mx-auto mt-3"
          />

          <div className="liblary hidden sm:block">
            <div className="top flex flex-col sm:flex-row justify-between items-center mt-2 mb-4 gap-2">
              <h1 className="text-gray text-nowrap font-bold text-xs sm:text-xl opacity-85">
                {lang === 'eng' ? 'Your Libraries' : "مكتباتك"}
              </h1>
              <button
                onClick={() => setIsCreating(true)}
                className="text-white hover:text-btns transition-colors"
              >
                <PiPlus className="size-3 font-bold cursor-pointer sm:size-5" />
              </button>
            </div>

            {isCreating && (
              <div className="mb-4 p-2 bg-hover-black rounded">
                <input
                  type="text"
                  value={newLibraryName}
                  onChange={(e) => setNewLibraryName(e.target.value)}
                  placeholder="Library name"
                  className="w-full p-2 bg-transparent text-white border-b border-gray-600"
                  onKeyPress={(e) => e.key === "Enter" && handleCreateLibrary()}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateLibrary}
                    className="bg-btns px-4 py-1 rounded-full"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            <LibraryList
              setContextMenu={setContextMenu}
              setEditingLibraryId={setEditingLibraryId}
              editingLibraryId={editingLibraryId}
              editLibraryName={editLibraryName}
              setEditLibraryName={setEditLibraryName}
              setShowOnMobile={setShowOnMobile}
            />
          </div>

          <hr className="text-[#b5b5b5] h-px w-full mt-4 mb-2" />

          <div className="mb-2 mx-1 flex flex-col gap-5 items-start">
            <h3 className="text-gray capitalize font-semibold hidden sm:block">
              menu
            </h3>
            <ul className="flex flex-col gap-3 max-sm:gap-7  w-full ">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center w-full gap-1 p-1 max-sm:rounded-full sm:gap-3 md:gap-3 max-sm:justify-center 
     sm:py-2 sm:px-3 hover:bg-hover-black cursor-pointer 
     transition-colors rounded-sm 
     ${isActive ? "bg-gray/50" : ""}`
                }
              >
                <GoHomeFill className="text-btns w-5 h-5" />
                <span
                  className="text-heading font-medium text-nowrap 
                  hidden sm:block sm:text-sm  md:text-[19px] "
                >
                  {lang === 'ar' ? 'الرئيسية' : 'Home'}
                </span>
              </NavLink>

              <NavLink
                to={"/reciters"}
                className={({ isActive }) =>
                  `flex items-center w-full gap-1 sm:gap-3 md:gap-3 max-sm:justify-center 
     sm:py-2 sm:px-3 hover:bg-hover-black cursor-pointer 
     transition-colors rounded-sm 
     ${isActive ? "bg-gray/50" : ""}`
                }
              >
                <GiSoundOn className="size-5 text-btns" />
                <span className="text-heading font-medium md:text-[19px] hidden  sm:block sm:text-sm  text-nowrap  ">
                  {lang === 'ar' ? "القراء" : 'Reciters'}
                </span>
              </NavLink>
              <NavLink
                to={"/chapters"}
                className={({ isActive }) =>
                  `flex items-center w-full gap-1 sm:gap-3 md:gap-3 max-sm:justify-center 
     sm:py-2 sm:px-3 hover:bg-hover-black cursor-pointer 
     transition-colors rounded-sm 
     ${isActive ? "bg-gray/50" : ""}`
                }
              >
                <FaReadme className="size-5 text-btns" />
                <span className="text-heading font-medium md:text-[19px] hidden  sm:block sm:text-sm  text-nowrap  ">
                  {lang === 'ar' ? "السور" : "Chapters"}
                </span>
              </NavLink>
              <NavLink
                to={"/live"}
                className={({ isActive }) =>
                  `flex items-center w-full gap-1 sm:gap-3 md:gap-3 max-sm:justify-center 
     sm:py-2 sm:px-3 hover:bg-hover-black cursor-pointer 
     transition-colors rounded-sm 
     ${isActive ? "bg-gray/50" : ""}`
                }
              >
                <IoIosRadio className="size-5 text-btns" />
                <span className="text-heading font-medium md:text-[19px] hidden  sm:block sm:text-sm  text-nowrap  ">
                  {lang === 'ar' ? "مباشر" : "Live"}
                </span>
              </NavLink>
            </ul>
          </div>
            <LanguageBtn className={''} />
        </div>
      </div>

      {/* Mobile full Sidebar */}
      {showOnMobile && (
        <div
          className={`sidebar w-full z-30 bg-second-black rounded-lg sm:hidden transition-transform duration-300 p-3 min-h-screen fixed top-[80px] ${
            showOnMobile ? "translate-x-0" : "-translate-x-full"
          } bottom-0 h-screen`}
        >
          <BiX
            onClick={() => setShowOnMobile(false)}
            className="text-white size-7 cursor-pointer ml-auto mb-2"
          />

          <div className="liblary block sm:hidden">
            <div className="top flex flex-row justify-between items-center mt-2 mb-4 gap-2">
              <h3 className="text-gray text-nowrap font-bold text-sm sm:text-xl opacity-85">
                Your Library
              </h3>
              <button
                onClick={() => setIsCreating(true)}
                className="text-white mr-2 hover:text-btns transition-colors"
              >
                <PiPlus className="size-4 font-bold cursor-pointer sm:size-5" />
              </button>
            </div>

            {isCreating && (
              <div className="mb-4 p-2 bg-hover-black rounded">
                <input
                  type="text"
                  value={newLibraryName}
                  onChange={(e) => setNewLibraryName(e.target.value)}
                  placeholder="Library name"
                  className="w-full p-2 bg-transparent text-white border-b border-gray-600"
                  onKeyPress={(e) => e.key === "Enter" && handleCreateLibrary()}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateLibrary}
                    className="bg-btns px-4 py-1 rounded-full"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            <LibraryList
              setContextMenu={setContextMenu}
              setEditingLibraryId={setEditingLibraryId}
              editingLibraryId={editingLibraryId}
              editLibraryName={editLibraryName}
              setEditLibraryName={setEditLibraryName}
              setShowOnMobile={setShowOnMobile}
            />
          </div>
          <hr className="text-[#b5b5b5] h-px w-full mt-4 mb-2 " />
          <div className="mb-2 mx-1 flex flex-col gap-5 items-start">
            <h3 className="text-gray capitalize font-semibold hidden sm:block">
              menu
            </h3>
            <ul className="flex flex-col gap-3  w-full ">
              <NavLink
                to="/"
                onClick={()=> setShowOnMobile(false)}
                className={({ isActive }) =>
                  `flex items-center w-full gap-2 sm:gap-3  
     py-1.5 px-3 hover:bg-hover-black cursor-pointer 
     transition-colors rounded-sm 
     ${isActive ? "bg-gray/50" : ""}`
                }
              >
                <GoHomeFill className="text-btns w-5 h-5" />
                <span
                  className="text-heading font-medium text-nowrap 
                  block  md:text-[19px]"
                >
                  {lang === 'ar' ? 'الرئيسية' : 'Home'}
                </span>
              </NavLink>

              <NavLink
                to={"/reciters"}
                onClick={()=> setShowOnMobile(false)}
                className={({ isActive }) =>
                  `flex items-center w-full gap-2 sm:gap-3  
     py-1.5 px-3 hover:bg-hover-black cursor-pointer 
     transition-colors rounded-sm 
     ${isActive ? "bg-gray/50" : ""}`
                }
              >
                <GiSoundOn className="size-5 text-btns" />
                <span className="text-heading font-medium md:text-[19px] block   text-nowrap  ">
                  {lang === 'ar' ? "القراء" : 'Reciters'}
                </span>
              </NavLink>
              <NavLink
                to={"/chapters"}
                onClick={()=> setShowOnMobile(false)}
                className={({ isActive }) =>
                  `flex items-center w-full gap-2 sm:gap-3  
     py-1.5 px-3 hover:bg-hover-black cursor-pointer 
     transition-colors rounded-sm 
     ${isActive ? "bg-gray/50" : ""}`
                }
              >
                <FaReadme className="size-5 text-btns" />
                <span className="text-heading font-medium md:text-[19px] block   text-nowrap  ">
                  {lang === 'ar' ? "السور" : "Chapters"}
                </span>
              </NavLink>
              <NavLink
                to={"/radio"}
                onClick={()=> setShowOnMobile(false)}
                className={({ isActive }) =>
                  `flex items-center w-full gap-2 sm:gap-3  
     py-1.5 px-3 hover:bg-hover-black cursor-pointer 
     transition-colors rounded-sm 
     ${isActive ? "bg-gray/50" : ""}`
                }
              >
                <IoIosRadio className="size-5 text-btns" />
                <span className="text-heading font-medium md:text-[19px] block   text-nowrap  ">
                  {lang === 'ar' ? "مباشر" : "Live"}
                </span>
              </NavLink>
            </ul>
            <LanguageBtn classname={'mt-8! px-3 py-2 justify-baseline '}  />
          </div>
          
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-hover-black rounded-lg p-2 shadow-lg z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button
            onClick={() => {
              setEditingLibraryId(contextMenu.library.id);
              setEditLibraryName(contextMenu.library.name);
              setContextMenu(null);
            }}
            className="w-full text-white p-2 hover:bg-gray-700 rounded text-left"
          >
            Rename
          </button>
          <button
            onClick={() => {
              dispatch(deleteLibrary(contextMenu.library.id));
              setContextMenu(null);
            }}
            className="w-full p-2 hover:bg-gray-700 rounded text-left text-red-400"
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
