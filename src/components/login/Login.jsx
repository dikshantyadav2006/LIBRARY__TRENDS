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
    <div className="flex justify-center items-center h-screen">
      <div className="dark:bg-[--primary-dark-color] bg-[--primary-light-color] p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username or Mobile"
            className="w-full p-2 border rounded focus:outline-none text-black focus:ring-2 focus:ring-blue-500"
            value={credentials.identifier}
            onChange={(e) => setCredentials({ ...credentials, identifier: e.target.value })}
            autoComplete="username"
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-2 pr-10 border text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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

          {message && <p className="text-red-500">{message}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={!credentials.identifier || !credentials.password}
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium">Continue with Google</span>
          </button>

          <div className="flex justify-center items-center">
            <Link
              className="w-full signup border p-2 text-center hover:text-white rounded-xl hover:bg-gray-800"
              to="/signup"
            >
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
