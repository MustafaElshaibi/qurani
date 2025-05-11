// ProfilePage.tsx
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "../components/uncommen/PageLoader";
import { logOut } from "../rtk/Reducers/AuthReducer";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user); // Assuming you have auth state
  const lang = useSelector((state) => state.lang);
  const dispatch = useDispatch();
  const naviagte = useNavigate();

  function handleLogOut() {
    dispatch(logOut());
    naviagte("/login", { replace: true });
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center"><PageLoader /></div>;

  return (
    <div className="w-full bg-[#121212] rounded-lg p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{lang === 'ar' ? 'الملف الشخصي' : 'Profile'}</h1>
          <p className="text-gray-400 mt-2">
            {lang === 'ar' ? 'عرض معلومات الحساب' : 'View your account information'}
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar Section */}
            <div className="w-full md:w-auto">
              <div className="relative group">
                {
                  user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center" />
                  ): 
                  (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user.displayName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                  )
                }
              </div>
            </div>

            {/* Details Section */}
            <div className="flex-1 space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-gray-400">
                    {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </span>
                  <p className="text-white text-xl font-medium">
                    {user.displayName || 'N/A'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-400">
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </span>
                    <p className="text-white">{user?.email || 'N/A'}</p>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-400">
                      {lang === 'ar' ? 'تاريخ الانضمام' : 'Joined Date'}
                    </span>
                    <p className="text-white">
                      {user?.creationTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-800 my-6" />

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  {lang === 'ar' ? 'التفضيلات' : 'Preferences'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-400">
                      {lang === 'ar' ? 'اللغة' : 'Language'}
                    </span>
                    <p className="text-white capitalize">
                      {lang === 'ar' ? 'العربية' : 'English'}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-400">
                      {lang === 'ar' ? 'الحالة' : 'Account Status'}
                    </span>
                    <p className="text-green-500">
                      {user.emailVerified ? 
                        (lang === 'ar' ? 'نشط' : 'Active') : 
                        (lang === 'ar' ? 'غير نشط' : 'Inactive')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-[#1a1a1a] p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'الجلسات' : 'Sessions'}
                </p>
                <p className="text-2xl font-bold text-white mt-2">24</p>
              </div>
              <div className="text-blue-500 text-2xl">⏳</div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'السور المحفوظة' : 'Saved Surahs'}
                </p>
                <p className="text-2xl font-bold text-white mt-2">18</p>
              </div>
              <div className="text-green-500 text-2xl">📖</div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">
                  {lang === 'ar' ? 'المفضلة' : 'Favorites'}
                </p>
                <p className="text-2xl font-bold text-white mt-2">{localStorage.getItem('musicLib') && JSON.parse(localStorage.getItem('musicLib')).favoritesItems.length || 0}</p>
              </div>
              <div className="text-purple-500 text-2xl">❤️</div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 flex justify-end">
          <button onClick={handleLogOut} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors">
            {lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;