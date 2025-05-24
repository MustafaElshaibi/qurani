import { useState, useEffect } from "react";
import { BsApple } from "react-icons/bs";
import { CgGoogle } from "react-icons/cg";
import { FaFacebook, FaQuran } from "react-icons/fa";
import { GrGoogle } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {  registerWithEmail, signWithFacebook, signWithGoogle } from "../rtk/Reducers/AuthReducer";
import { FcGoogle } from "react-icons/fc";
import { ImAppleinc } from "react-icons/im";
import { ErrorPage } from "./Error";
import { Helmet } from "react-helmet-async";

function Register() {
  const { user, loading, error: authError } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.uid) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setError(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, number, and special character";
      isValid = false;
    }

    // Confirm Password validation
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await dispatch(
        registerWithEmail({
          email: formData.email,
          password: formData.password
        })
      ).unwrap();
      
      // Redirect after successful registration
      navigate('/');
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle specific Firebase errors
      if (error.includes('email-already-in-use')) {
        setError(prev => ({ ...prev, email: "Email already exists" }));
      }
    }
  };

  if(authError) <ErrorPage />

  return (
    <div className="bg-second-black py-20 px-5 mx-auto min-h-screen w-full ">
      <Helmet>
      <title>Register | Qurani</title>
      <meta name="description" content="Create your free Qurani account to bookmark surahs, track your progress, and enjoy a personalized Quran experience." />
      <meta name="robots" content="noindex, follow" />
      <meta name="author" content="Elshaibi" />
      <link rel="canonical" href="https://qurani-opal.vercel.app/register" />
      {/* Open Graph */}
      <meta property="og:title" content="Register | Qurani" />
      <meta property="og:description" content="Create your free Qurani account to bookmark surahs, track your progress, and enjoy a personalized Quran experience." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://qurani-opal.vercel.app/register" />
      <meta property="og:image" content="/quranLogo.svg" />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Register | Qurani" />
      <meta name="twitter:description" content="Create your free Qurani account to bookmark surahs, track your progress, and enjoy a personalized Quran experience." />
      <meta name="twitter:image" content="/quranLogo.svg" />
    </Helmet>
      <div className="login  flex flex-col items-center max-sm:w-[350px] mx-auto sm:w-[500px]  ">
        <div className="logo flex items-center justify-center w-[40px] h-[40px] rounded-full bg-heading p-1 ">
          <FaQuran className="text-main-black size-5" />
        </div>
        <div className="text-white text-2xl font-bold capitalize mt-5">
          Register to start peace
        </div>

        <div className="top  w-full">
          <div className="flex flex-col gap-3 mt-5 w-full">
                      <div onClick={()=> dispatch(signWithGoogle())} className="auth-with cursor-pointer w-full py-2  flex  items-center  px-3 border-1 border-white rounded-full">
                        <FcGoogle className=" mr-23 max-sm:mr-9 size-7 ml-5" />
                        <span className="text-white  capitalize max-sm:text-sm text-nowrap  ">
                          continue with google
                        </span>
                      </div>
                      <div onClick={()=> dispatch(signWithFacebook())} className="auth-with cursor-pointer w-full py-2  flex  items-center  px-3 border-1 border-white rounded-full">
                        <FaFacebook className="text-[#1877f2] mr-23 max-sm:mr-9 size-7 ml-5" />
                        <span className="text-white  capitalize   max-sm:text-sm text-nowrap">
                          continue with facebook
                        </span>
                      </div>
                      <div className="auth-with cursor-pointer w-full py-2  flex  items-center  px-3 border-1 border-white rounded-full">
                        <ImAppleinc className="text-white mr-23 max-sm:mr-9 size-7 ml-5 " />
                        <span className="text-white  capitalize max-sm:text-sm text-nowrap  ">
                          continue with apple
                        </span>
                      </div>
                    </div>
        </div>
        <span className="w-full relative block my-8">
          <span className="w-full block h-px bg-white"></span>
          <span className="bg-second-black text-white px-5 z-20 absolute left-[50%] top-[50%] -translate-[50%] ">
            or
          </span>
        </span>
        <div className="down w-full my-5">
          <form
            action=""
            className="flex w-full flex-col "
            onSubmit={handleSubmit}
            noValidate
          >
           <div className="mt-5 mb-11">
           <div className="input   relative w-full py-2 px-3 border-1 border-gray rounded-lg text-gray ">
              <input
                type="email"
                name="email"
                id="email"
                className="peer  border-none focus:outline-none text-white bg-transparent w-full h-full "
                value={formData.email}
                onChange={handleChange}
              />
              <label
                htmlFor="email"
                className={`text-white absolute transition-all  duration-300 -top-6 left-2 text-sm capitalize peer-focus:hidden ${formData.email ? 'hidden' : 'block'}`}
              >
                username or email
              </label>
              <label
                htmlFor="email"
                className={` absolute transition-all  duration-300 peer-focus:-top-6   peer-focus:text-white peer-focus:text-sm peer-focus:translate-0  left-2  -translate-y-[50%] capitalize ${formData.email ? ' translate-0 text-sm text-white -top-3.5 ' : ' top-[50%]'}`}
              >
                username
              </label>
              
            </div>
            {error.email && (
                <p className="error text-pink-600 text-sm mt-1">{error.email}</p>
              )}
           </div>

              <div className=" mb-2">
                
            <div className="input  relative w-full py-2 px-3 border-1 border-gray rounded-lg text-gray ">
              <input
                type="password"
                name="password"
                id="password"
                className="peer  border-none focus:outline-none text-white w-full h-full "
                value={formData.password}
                onChange={handleChange}
              />
               <label
                htmlFor="password"
                className={`text-white absolute transition-all  duration-300 -top-6 left-2 text-sm capitalize peer-focus:hidden ${formData.password ? 'hidden' : 'block'}`}
              >
                Password
              </label>
              <label
                htmlFor="password"
                className={` absolute transition-all  duration-300 peer-focus:-top-6   peer-focus:text-white peer-focus:text-sm peer-focus:translate-0  left-2  -translate-y-[50%] capitalize ${formData.password ? ' translate-0 text-sm text-white -top-3.5 ' : ' top-[50%]'}`}
              >
                Password
              </label>
            </div>
            {error.password && (
                <p className="error text-pink-600 text-sm mt-1">{error.password}</p>
              )}
              </div>

            <div className="mt-9 mb-2">
            <div className="input  relative w-full py-2 px-3 border-1 border-gray rounded-lg text-gray ">
              <input
                type="password"
                name="passwordConfirm"
                id="passwordConfirm"
                className="peer  border-none focus:outline-none text-white w-full h-full "
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
               <label
                htmlFor="passwordConfirm"
                className={`text-white absolute transition-all  duration-300 -top-6 left-2 text-sm capitalize peer-focus:hidden ${formData.passwordConfirm ? 'hidden' : 'block'}`}
              >
                Password Confirm
              </label>
              <label
                htmlFor="passwordConfirm"
                className={` absolute transition-all  duration-300 peer-focus:-top-6   peer-focus:text-white peer-focus:text-sm peer-focus:translate-0  left-2  -translate-y-[50%] capitalize ${formData.passwordConfirm ? ' translate-0 text-sm text-white -top-3.5 ' : ' top-[50%]'}`}
              >
                Password Confirm
              </label>
            </div>
            {error.passwordConfirm && (
                <p className="error text-pink-600 text-sm mt-1">{error.passwordConfirm}</p>
              )}
            </div>
            <Link 
            to={'/forget-password'}
              className="text-white text-sm ml-auto block w-full  underline"
            >
              Forget Password?
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="capitalize cursor-pointer mt-3 block w-full py-2 bg-green transition-colors duration-300 hover:bg-green/80 text-white font-bold rounded-full disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <hr className="bg-gray w-full h-[2px] mb-2 block mt-5 " />
          <p className="text-gray">
            Already have an account?{" "}
            <Link to={"/login"} className="text-cyan-400">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;