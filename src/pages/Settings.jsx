// SettingsPage.tsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../rtk/Reducers/langSlice";
import PageLoader from "../components/uncommen/PageLoader";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  const [localSettings, setLocalSettings] = useState({
    playbackQuality: 'high',
    theme: 'dark',
    fontSize: 16,
    autoPlay: true,
    downloadQuality: 'medium',
  });

  const handleLanguageChange = (newLang) => {
    dispatch(setLanguage(newLang));
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang == 'ar' ? 'rtl' : 'ltr';
  };

  const handleSettingChange = (field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }));
    // Here you would typically persist to your backend
  };

  if (!localSettings) return <div className="min-h-screen"><PageLoader /></div>;

  return (
    <div className="w-full bg-[#121212] rounded-lg p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {lang === 'ar' ? 'الإعدادات' : 'Settings'}
          </h1>
          <p className="text-gray-400 mt-2">
            {lang === 'ar' ? 'إدارة تفضيلات التطبيق' : 'Manage application preferences'}
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Language Settings */}
          <div className="bg-[#1a1a1a] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {lang === 'ar' ? 'إعدادات اللغة' : 'Language Settings'}
            </h2>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-gray-300 text-sm">
                  {lang === 'ar' ? 'اختر اللغة' : 'Select Language'}
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleLanguageChange('eng')}
                    className={`px-6 py-2 rounded-full flex items-center gap-2 ${
                      lang === 'eng' 
                        ? 'bg-white text-black' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="fi fi-us"></span>
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ar')}
                    className={`px-6 py-2 rounded-full flex items-center gap-2 ${
                      lang === 'ar' 
                        ? 'bg-white text-black' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="fi fi-sa"></span>
                    العربية
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="bg-[#1a1a1a] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {lang === 'ar' ? 'إعدادات الصوت' : 'Audio Settings'}
            </h2>
            
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label className="text-gray-300 text-sm">
                  {lang === 'ar' ? 'جودة التشغيل' : 'Playback Quality'}
                </label>
                <select 
                  value={localSettings.playbackQuality}
                  onChange={(e) => handleSettingChange('playbackQuality', e.target.value)}
                  className="bg-gray-800 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="low">{lang === 'ar' ? 'منخفضة' : 'Low'}</option>
                  <option value="medium">{lang === 'ar' ? 'متوسطة' : 'Medium'}</option>
                  <option value="high">{lang === 'ar' ? 'عالية' : 'High'}</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-gray-300 text-sm">
                  {lang === 'ar' ? 'مستوى الصوت الافتراضي' : 'Default Volume Level'}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localSettings.volume}
                    onChange={(e) => handleSettingChange('volume', e.target.value)}
                    className="w-full bg-gray-800 rounded-lg appearance-none h-2"
                  />
                  <span className="text-white w-12">{localSettings.volume}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300">
                    {lang === 'ar' ? 'التشغيل التلقائي' : 'Auto-Play'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {lang === 'ar' 
                      ? 'تشغيل السورة التالية تلقائياً' 
                      : 'Automatically play next surah'}
                  </p>
                </div>
                <button
                  onClick={() => handleSettingChange('autoPlay', !localSettings.autoPlay)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    localSettings.autoPlay ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
                    localSettings.autoPlay ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-[#1a1a1a] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {lang === 'ar' ? 'إعدادات العرض' : 'Display Settings'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-gray-300 text-sm">
                  {lang === 'ar' ? 'حجم الخط' : 'Font Size'}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={localSettings.fontSize}
                    onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                    className="w-full bg-gray-800 rounded-lg appearance-none h-2"
                  />
                  <span className="text-white w-12">{localSettings.fontSize}px</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-gray-300 text-sm">
                  {lang === 'ar' ? 'السمة' : 'Theme'}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSettingChange('theme', 'dark')}
                    className={`p-4 rounded-lg border-2 ${
                      localSettings.theme === 'dark'
                        ? 'border-purple-500 bg-gray-800'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="h-12 rounded bg-gradient-to-r from-gray-700 to-gray-800" />
                    <span className="text-white mt-2 block">
                      {lang === 'ar' ? 'مظلم' : 'Dark'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleSettingChange('theme', 'light')}
                    className={`p-4 rounded-lg border-2 ${
                      localSettings.theme === 'light'
                        ? 'border-purple-500 bg-gray-100'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="h-12 rounded bg-gradient-to-r from-gray-200 to-gray-300" />
                    <span className="text-gray-800 mt-2 block">
                      {lang === 'ar' ? 'فاتح' : 'Light'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-[#1a1a1a] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {lang === 'ar' ? 'إدارة البيانات' : 'Data Management'}
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300">
                    {lang === 'ar' ? 'جودة التنزيل' : 'Download Quality'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {lang === 'ar' 
                      ? 'جودة ملفات التنزيل الصوتية' 
                      : 'Audio file download quality'}
                  </p>
                </div>
                <select 
                  value={localSettings.downloadQuality}
                  onChange={(e) => handleSettingChange('downloadQuality', e.target.value)}
                  className="bg-gray-800 text-white rounded-lg p-2 px-4 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="low">{lang === 'ar' ? 'منخفضة' : 'Low'}</option>
                  <option value="medium">{lang === 'ar' ? 'متوسطة' : 'Medium'}</option>
                  <option value="high">{lang === 'ar' ? 'عالية' : 'High'}</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300">
                    {lang === 'ar' ? 'مسح الذاكرة المؤقتة' : 'Clear Cache'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {lang === 'ar' 
                      ? 'إزالة جميع البيانات المخزنة مؤقتًا' 
                      : 'Remove all temporarily stored data'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    localStorage.clear();
                    // Add any additional cache clearing logic
                  }}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm"
                >
                  {lang === 'ar' ? 'مسح' : 'Clear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;