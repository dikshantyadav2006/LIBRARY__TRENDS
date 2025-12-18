import { useNavigate } from "react-router-dom";
import SignupForm from "./components/SignupForm";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen my-2 mx-2 rounded-[3vw] flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-4">
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20">
        
        {/* LEFT SIDE – BRANDING */}
        <div className="hidden md:flex flex-col justify-center p-10 text-white">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Join the <span className="text-yellow-300">Next-Gen</span><br />
            Community 🚀
          </h1>
          <p className="text-white/80 text-lg">
            Create your account and unlock powerful features made just for you.
          </p>
        </div>

        {/* RIGHT SIDE – FORM */}
        <div className="bg-white dark:bg-[--primary-dark-color] p-8 md:p-10">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">
            Create Account
          </h2>
          <p className="text-center text-gray-500 mb-6">
            It only takes a minute
          </p>

          <SignupForm navigate={navigate} />
        </div>

      </div>
    </div>
  );
}
