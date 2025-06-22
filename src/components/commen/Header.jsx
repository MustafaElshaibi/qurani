// import { Link, useNavigate } from "react-router-dom";
// import { FaQuran } from "react-icons/fa";
// import { GoHomeFill } from "react-icons/go";
// import { IoCloudDownloadOutline } from "react-icons/io5";
// import { BiDownload, BiMenu, BiSupport, BiLogOut } from "react-icons/bi";
// import { useSelector, useDispatch } from "react-redux";
// import { logOut } from "../../rtk/Reducers/AuthReducer"; // Import your logout action
// import  SearchInput  from "./SearchInput";
// import Cookies from "universal-cookie";
// import { useState, useRef, useEffect, useCallback } from "react";
// import { BiUser, BiCog } from "react-icons/bi";
// import { RiSearchLine } from "react-icons/ri";
// import logo from "../../assets/images/quranLogo.svg";
// const cookies = new Cookies();

// export default function Header() {
//   const { user } = useSelector((state) => state.auth);
//   const lang = useSelector((state)=> state.lang);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [showMenu, setShowMenu] = useState(false);
//   const searchRef = useRef(null);
//   const searchRefMobile = useRef(null);
//   const [searchValue, setSearchValue] = useState('');
//   const [isInputFocused, setIsInputFocused] = useState(false);
//   const token = cookies.get("auth-token");

//   const toggleMenu = () => setShowMenu((prev) => !prev);
//   const closeMenu = () => setShowMenu(false);

//   const handleSearch = useCallback((query) => {
//     if(!searchValue.trim() && isInputFocused) {
//       navigate('/');
//       return;
//     }
//     if(query && query != undefined){
//       if ('makkia' in query) {
//         navigate(`/surah/${encodeURIComponent(query?.id)}`);
//         closeMenu();
//         return;
//       }
//       navigate(`/search/${encodeURIComponent(query?.id)}`);
//       closeMenu();
//     }else if(!query && isInputFocused) {
//       navigate(`/`);
//     }
//   }, [searchValue, navigate, isInputFocused]);



//   const handleLogout = () => {
//     dispatch(logOut());
//     closeMenu();
//     navigate("/login");
//     window.location.reload();
//   };

//   const toggleSearch = ()=> {
//     toggleMenu();
//     searchRef.current.focus();
//   }

//   return (
//     <header className="header sticky top-0 z-30 bg-main-black shadow-lg w-full">
//       <nav className="mx-auto px-5 py-1 flex items-center max-sm:justify-between h-20 sm:gap-6 gap-4 w-full">
//         {/* Logo Section */}
//         <Link
//           to="/"
//           className="flex items-center justify-center size-10  rounded-full bg-main-black p-1 hover:bg-main-black/90 transition-colors focus:outline-none ring-2 ring-white"
//         >
//           {/* <FaQuran className="text-main-black size-5" /> */}
//           <img src={logo} alt="Logo" loading="lazy" title="logo" className="size-10" />

//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden sm:flex items-center gap-6 flex-1">
//           <Link
//             to="/"
//             className="p-3 rounded-full bg-search-dark transition-colors"
//           >
//             <GoHomeFill className="text-heading text-2xl" />
//           </Link>

//           <SearchInput onSearch={handleSearch} className="flex-1  relative max-w-2xl " refSe={searchRef} setSearch={setSearchValue} onFocus={setIsInputFocused} />
//         </div>

//         {/* Desktop Actions */}
//         <div className="hidden lg:flex items-center gap-6 text-gray ml-auto">
//           <DownloadLinks />
//           <span className="h-6 w-px bg-gray/50" />
//           <ActionButton
//             icon={<IoCloudDownloadOutline className="text-xl" />}
//             label="Install App"
//           />
//         </div>

//         {/* Auth Section */}
//         <div className="flex items-center gap-4 ml-4">
//         <RiSearchLine onClick={toggleSearch} className="text-white size-5 sm:hidden" />
//           {token ? (
//             <div className="flex items-center gap-4">
//               <ProfileButton user={user} onLogout={handleLogout} lang={lang} />
//             </div>
//           ) : (
//             <div className=" items-center hidden sm:flex gap-2">
//               <Link
//                 to="/register"
//                 className="text-white py-2 px-5 font-bold rounded-full cursor-pointer hover:bg-white/10 transition-colors"
//               >
//                 {lang === 'eng' ? 'Register' : 'أنشاء حساب'}
//               </Link>
//               <Link
//                 to="/login"
//                 className="text-black py-2 px-5 font-bold rounded-full cursor-pointer bg-white hover:bg-white/90 transition-colors"
//               >
//                 {lang === 'eng' ? 'Login' : 'تسجيل الدخول'}
//               </Link>
//             </div>
//           )}
//           <BiMenu
//             className="text-white size-7 text-2xl cursor-pointer ml-auto sm:hidden"
//             onClick={toggleMenu}
//             aria-label="Toggle menu"
//           />
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div
//         className={`fixed inset-0 top-20 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
//           showMenu
//             ? "opacity-100 pointer-events-auto"
//             : "opacity-0 pointer-events-none"
//         }`}
//         onClick={closeMenu}
//       >
//         <div
//           className="bg-main-black p-6 overflow-y-auto"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="flex flex-col gap-6">
//             <SearchInput onSearch={handleSearch} className="w-full" refSe={searchRefMobile} setSearch={setSearchValue} mobile={true} onFocus={setIsInputFocused} />

//             <div className="flex flex-col gap-4 text-gray">
//               <DownloadLinks mobile />
//               <ActionButton
//                 icon={<IoCloudDownloadOutline className="text-xl" />}
//                 label="Install App"
//                 mobile
//               />
//               {user?.uid || token ? (
//                 <>
//                   <LogOutBtn onLogout={handleLogout} />
//                 </>
//               ) : (
//                 <>
//                   <div className="border-t border-gray" />
//                   <div className="flex items-center gap-4 ">
//                   <AuthLink to="/register" label="Sign Up" />
//                   <AuthLink to="/login" label="Login" />
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// // Sub-components
// const DownloadLinks = ({ mobile }) => (
//   <>
//     <ActionButton
//       icon={<BiDownload className="text-xl" />}
//       label="Download"
//       mobile={mobile}
//     />
//     <ActionButton
//       icon={<BiSupport className="text-xl" />}
//       label="Support"
//       mobile={mobile}
//     />
//   </>
// );

// const ActionButton = ({ icon, label, mobile, ...props }) => (
//   <button
//     className={`flex items-center gap-3 p-3 rounded-lg hover:bg-search-dark transition-colors ${
//       mobile ? "w-full" : ""
//     }`}
//     {...props}
//   >
//     {icon}
//     <span>{label}</span>
//   </button>
// );

// const AuthLink = ({ to, label }) => (
//   <Link
//     to={to}
//     className="p-3 rounded-lg flex items-center justify-center font-bold flex-1 hover:bg-search-dark transition-colors text-left"
//   >
//     {label}
//   </Link>
// );

// const ProfileButton = ({ user, mobile, onLogout, lang }) => {
//   const [showMenu, setShowMenu] = useState(false);
//   const menuRef = useRef(null);

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowMenu(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className={`relative flex items-center justify-center `} ref={menuRef}>
//       <button
//         onClick={() => setShowMenu(!showMenu)}
//         className="flex items-center p-[3px] ring-2 ring-offset-2 ring-offset-white rounded-full justify-center hover:opacity-80 transition-opacity"
//         aria-label="Profile menu"
//         aria-expanded={showMenu}
//       >
//         {user?.photoURL ? (
//           <img
//             src={user?.photoURL}
//             alt="Profile"
//             className="size-8 rounded-full object-cover"
//           />
//         ) : (
//           // <FaCircleUser className="size-8 text-gray" />
//           <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
//                   <span className="text-sm font-bold text-white">
//                     { user?.email?.[0].toUpperCase() || 'U'}
//                   </span>
//                 </div>
//         )}
//       </button>

//       {showMenu && (
//         <div className={`absolute ${lang === 'eng' ? 'right-0' : 'left-0'} top-12 bg-search-dark border border-gray-700 rounded-lg shadow-xl min-w-[200px] z-50`}>
//           <div className="p-2">
//             <Link
//               to="/profile"
//               className="flex items-center gap-3 p-3 hover:bg-gray-500/50 rounded-lg"
//               onClick={() => setShowMenu(false)}
//             >
//               <BiUser className="text-xl text-gray-300" />
//               <span className="text-gray-300">Profile</span>
//             </Link>

//             <Link
//               to="/settings"
//               className="flex items-center gap-3 p-3 hover:bg-gray-500/50 rounded-lg"
//               onClick={() => setShowMenu(false)}
//             >
//               <BiCog className="text-xl text-gray-300" />
//               <span className="text-gray-300">Settings</span>
//             </Link>
//           </div>

//           <div className="border-t border-gray-500">
//             <button
//               onClick={onLogout}
//               className="w-full flex items-center gap-3 p-3 hover:bg-gray-500/50 rounded-b-lg"
//             >
//               <BiLogOut className="text-xl text-red-500" />
//               <span className="text-red-500">Logout</span>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const LogOutBtn = ({ onLogout }) => {
//   return (
//     <div className="border-t border-gray">
//       <button
//         onClick={onLogout}
//         className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-b-lg"
//       >
//         <BiLogOut className="text-xl text-red-500" />
//         <span className="text-red-500">Logout</span>
//       </button>
//     </div>
//   );
// };






import { Link, useNavigate } from "react-router-dom";
import { FaQuran } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { BiDownload, BiMenu, BiSupport, BiLogOut } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../rtk/Reducers/AuthReducer"; // Import your logout action
import  SearchInput  from "./SearchInput";
import Cookies from "universal-cookie";
import { useState, useRef, useEffect, useCallback } from "react";
import { BiUser, BiCog } from "react-icons/bi";
import { RiSearchLine } from "react-icons/ri";
import logo from "../../assets/images/quranLogo.svg";
const cookies = new Cookies();

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const lang = useSelector((state)=> state.lang);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const searchRef = useRef(null);
  const searchRefMobile = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const token = cookies.get("auth-token");

  const toggleMenu = () => setShowMenu((prev) => !prev);
  const closeMenu = () => setShowMenu(false);

  const handleSearch = useCallback((query) => {
    if(!searchValue.trim() && isInputFocused) {
      navigate('/');
      return;
    }
    if(query && query != undefined){
      if ('makkia' in query) {
        navigate(`/surah/${encodeURIComponent(query?.id)}`);
        closeMenu();
        return;
      }
      navigate(`/search/${encodeURIComponent(query?.id)}`);
      closeMenu();
    }else if(!query && isInputFocused) {
      navigate(`/`);
    }
  }, [searchValue, navigate, isInputFocused]);



  const handleLogout = () => {
    dispatch(logOut());
    closeMenu();
    navigate("/");
    window.location.reload();
  };

  const toggleSearch = ()=> {
    toggleMenu();
    searchRef.current.focus();
  }

  return (
    <header className="header sticky top-0 z-30 bg-main-black shadow-lg w-full">
      <nav className="mx-auto px-5 py-1 flex items-center max-sm:justify-between h-20 sm:gap-6 gap-4 w-full">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center justify-center size-10  rounded-full bg-main-black p-1 hover:bg-main-black/90 transition-colors focus:outline-none ring-2 ring-white"
        >
          {/* <FaQuran className="text-main-black size-5" /> */}
          <img src={logo} alt="Logo" loading="lazy" title="logo" className="size-10" />

        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-6 flex-1">
          <Link
            to="/"
            className="p-3 rounded-full bg-search-dark transition-colors"
          >
            <GoHomeFill className="text-heading text-2xl" />
          </Link>

          <SearchInput onSearch={handleSearch} className="flex-1  relative max-w-2xl " refSe={searchRef} setSearch={setSearchValue} onFocus={setIsInputFocused} />
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6 text-gray ml-auto">
          <DownloadLinks />
          <span className="h-6 w-px bg-gray/50" />
          <ActionButton
            icon={<IoCloudDownloadOutline className="text-xl" />}
            label="Install App"
          />
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4 ml-4">
        <RiSearchLine onClick={toggleSearch} className="text-white size-5 sm:hidden" />
          {token ? (
            <div className="flex items-center gap-4">
              <ProfileButton user={user} onLogout={handleLogout} lang={lang} />
            </div>
          ) : (
            <div className=" items-center hidden sm:flex gap-2">
              <Link
                to="/register"
                className="text-white py-2 px-5 font-bold rounded-full cursor-pointer hover:bg-white/10 transition-colors"
              >
                {lang === 'eng' ? 'Register' : 'أنشاء حساب'}
              </Link>
              <Link
                to="/login"
                className="text-black py-2 px-5 font-bold rounded-full cursor-pointer bg-white hover:bg-white/90 transition-colors"
              >
                {lang === 'eng' ? 'Login' : 'تسجيل الدخول'}
              </Link>
            </div>
          )}
          <BiMenu
            className="text-white size-7 text-2xl cursor-pointer ml-auto sm:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          />
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 top-20 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          showMenu
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      >
        <div
          className="bg-main-black p-6 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-6">
            <SearchInput onSearch={handleSearch} className="w-full" refSe={searchRefMobile} setSearch={setSearchValue} mobile={true} onFocus={setIsInputFocused} />

            <div className="flex flex-col gap-4 text-gray">
              <DownloadLinks mobile />
              <ActionButton
                icon={<IoCloudDownloadOutline className="text-xl" />}
                label="Install App"
                mobile
              />
              {user?.uid || token ? (
                <>
                  <LogOutBtn onLogout={handleLogout} />
                </>
              ) : (
                <>
                  <div className="border-t border-gray" />
                  <div className="flex items-center gap-4 ">
                  <AuthLink to="/register" label="Sign Up" />
                  <AuthLink to="/login" label="Login" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Sub-components
const DownloadLinks = ({ mobile }) => (
  <>
    <ActionButton
      icon={<BiDownload className="text-xl" />}
      label="Download"
      mobile={mobile}
    />
    <ActionButton
      icon={<BiSupport className="text-xl" />}
      label="Support"
      mobile={mobile}
    />
  </>
);

const ActionButton = ({ icon, label, mobile, ...props }) => (
  <button
    className={`flex items-center gap-3 p-3 rounded-lg hover:bg-search-dark transition-colors ${
      mobile ? "w-full" : ""
    }`}
    {...props}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const AuthLink = ({ to, label }) => (
  <Link
    to={to}
    className="p-3 rounded-lg flex items-center justify-center font-bold flex-1 hover:bg-search-dark transition-colors text-left"
  >
    {label}
  </Link>
);

const ProfileButton = ({ user, mobile, onLogout, lang }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative flex items-center justify-center `} ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center p-[3px] ring-2 ring-offset-2 ring-offset-white rounded-full justify-center hover:opacity-80 transition-opacity"
        aria-label="Profile menu"
        aria-expanded={showMenu}
      >
        {user?.photoURL ? (
          <img
            src={user?.photoURL}
            alt="Profile"
            className="size-8 rounded-full object-cover"
          />
        ) : (
          // <FaCircleUser className="size-8 text-gray" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    { user?.email?.[0].toUpperCase() || 'U'}
                  </span>
                </div>
        )}
      </button>

      {showMenu && (
        <div className={`absolute ${lang === 'eng' ? 'right-0' : 'left-0'} top-12 bg-search-dark border border-gray-700 rounded-lg shadow-xl min-w-[200px] z-50`}>
          <div className="p-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 p-3 hover:bg-gray-500/50 rounded-lg"
              onClick={() => setShowMenu(false)}
            >
              <BiUser className="text-xl text-gray-300" />
              <span className="text-gray-300">Profile</span>
            </Link>

            <Link
              to="/settings"
              className="flex items-center gap-3 p-3 hover:bg-gray-500/50 rounded-lg"
              onClick={() => setShowMenu(false)}
            >
              <BiCog className="text-xl text-gray-300" />
              <span className="text-gray-300">Settings</span>
            </Link>
          </div>

          <div className="border-t border-gray-500">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-500/50 rounded-b-lg"
            >
              <BiLogOut className="text-xl text-red-500" />
              <span className="text-red-500">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const LogOutBtn = ({ onLogout }) => {
  return (
    <div className="border-t border-gray">
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-b-lg"
      >
        <BiLogOut className="text-xl text-red-500" />
        <span className="text-red-500">Logout</span>
      </button>
    </div>
  );
};
