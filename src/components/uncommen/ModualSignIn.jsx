
import { FaQuran, FaSignInAlt } from 'react-icons/fa';

const ModualSignIn = ({ isOpen, onClose, onSignIn }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50  z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        {/* Modal Content */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 text-4xl text-emerald-600">
            <FaQuran className="inline-block" />
          </div>

          {/* Heading */}
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Enjoy Full Access
          </h3>
          
          {/* Message */}
          <p className="text-gray-600 mb-6">
            Sign in to listen to the Holy Quran, bookmark verses, and track your progress.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onSignIn}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <FaSignInAlt className="text-lg" />
              Sign In
            </button>
            
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModualSignIn;

// Usage Example:
// const [showSignInModal, setShowSignInModal] = useState(false);
// 
// <SignInModal 
//   isOpen={showSignInModal}
//   onClose={() => setShowSignInModal(false)}
//   onSignIn={() => {
//     // Your sign in logic
//     router.push('/signin');
//   }}
// />