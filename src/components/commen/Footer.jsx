import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setLanguage } from "../../rtk/Reducers/langSlice";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);

  const handleLang = (lang)=> { 
    dispatch(setLanguage(lang));
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  return (
    <footer className="bg-[#121212] border-t border-gray-800 mt-2 rounded-lg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Quran Section */}
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase text-sm">Quran</h3>
            <ul className="space-y-2">
              {['About Quran', 'Reciters', 'Translations', 'Tafsir'].map((item) => (
                <li key={item}>
                  <Link to={'/'} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase text-sm">Legal</h3>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Use', 'Contact Us', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link to={'/'} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase text-sm">{lang === 'eng' ? 'Connect' : "تواصل"}</h3>
            <div className="flex flex-col gap-4 space-x-4">
              {['twitter', 'github'].map((platform) => (
                <a
                  key={platform}
                  target="_blank"
                  href={`${platform == 'twitter' ? 'https://x.com/MustafaElshaibi' : 'https://github.com/MustafaElshaibi'}`}
                  className="text-gray-300 flex gap-1.5 items-center hover:text-white transition-colors"
                >
                 { platform == 'twitter' ? <FaSquareXTwitter className="size-5 " /> : <FaGithub className="size-5" />}
                  <span className="text-sm">{platform}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase text-sm">{lang === 'eng' ? 'Language' : "اللغة"}</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => handleLang('ar')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  lang === 'ar' ? 'bg-white text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => handleLang('eng')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  lang === 'eng' ? 'bg-white text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Qurani . All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Made with &lt;3 by Elshaibi
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;