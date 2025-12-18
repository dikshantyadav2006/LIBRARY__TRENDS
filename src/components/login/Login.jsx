import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../../utils/authApi"; // <-- Import from your authApi file

const Login = ({ onUserSet }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [credentials, setCredentials] = useState({ identifier: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const api = import.meta.env.VITE_API_BASE_URL;

  // Check for OAuth error in URL params
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      if (error === "google_auth_failed") {
        setMessage("Google authentication failed. Please try again.");
      } else if (error === "no_user") {
        setMessage("Could not retrieve user information from Google.");
      } else {
        setMessage("Authentication error. Please try again.");
      }
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await login(credentials); // ✅ Using authApi
      onUserSet(res.data.user);
      navigate("/dashboard");
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Login failed";
      setMessage(errMsg);
      console.error("Login failed:", error);
    }
  };

  // Handle Google Login - redirect to backend OAuth endpoint
  const handleGoogleLogin = () => {
    window.location.href = `${api}/auth/google`;
  };

  return (
  <div className="min-h-screen m-2 rounded-[3vw] flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-4">
    
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20">

      {/* LEFT – BRAND / MESSAGE */}
      <div className="hidden md:flex flex-col justify-center p-10 text-white">
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          Welcome Back 👋<br />
          <span className="text-yellow-300">We missed you</span>
        </h1>
        <p className="text-white/80 text-lg">
          Login to continue your journey and explore powerful features.
        </p>
      </div>

      {/* RIGHT – LOGIN FORM */}
      <div className="bg-white dark:bg-[--primary-dark-color] p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          Login Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your credentials to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* USERNAME / MOBILE */}
          <input
            type="text"
            placeholder="Username or Mobile"
            className="w-full p-2.5 border rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-blue-500"
            value={credentials.identifier}
            onChange={(e) =>
              setCredentials({ ...credentials, identifier: e.target.value })
            }
            autoComplete="username"
          />

          {/* PASSWORD */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-2.5 pr-10 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* ERROR MESSAGE */}
          {message && (
            <p className="text-red-500 text-sm text-center">{message}</p>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={!credentials.identifier || !credentials.password}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            Login
          </button>

          {/* DIVIDER */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600" />
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600" />
          </div>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 p-2.5 rounded-lg hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* SIGNUP LINK */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Signup
            </Link>
          </p>

        </form>
      </div>
    </div>
  </div>
);

};

export default Login;
