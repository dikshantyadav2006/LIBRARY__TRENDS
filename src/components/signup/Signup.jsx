import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../utils/authApi"; // adjust path as needed

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    mobile: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validate = (name, value) => {
    const newErrors = { ...errors };

    if (name === "fullname") {
      if (!/^[A-Za-z\s]{3,}$/.test(value)) {
        newErrors.fullname = "Full name must be at least 3 letters (A-Z only).";
      } else {
        delete newErrors.fullname;
      }
    }

    if (name === "username") {
      if (!/^[A-Za-z0-9!@#$%^&*(.)_+]{6,}$/.test(value)) {
        newErrors.username = "Username must be at least 6 characters (A-Z, 0-9, special characters allowed), without spaces.";
      } else {
        delete newErrors.username;
      }
    }

    if (name === "mobile") {
      if (!/^\d{10}$/.test(value)) {
        newErrors.mobile = "Mobile number must be exactly 10 digits.";
      } else {
        delete newErrors.mobile;
      }
    }

    if (name === "password") {
      if (value.length < 3) {
        newErrors.password = "Password must be at least 3 characters.";
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate all before submission
    Object.entries(formData).forEach(([name, value]) => validate(name, value));
    if (Object.keys(errors).length > 0) return;

    try {
      const res = await signup(formData);
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);

      setFormData({ fullname: "", username: "", mobile: "", password: "" });
    } catch (error) {
      const msg =
        error.response?.data?.message || "Signup failed. Please try again.";
      setMessage(msg);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {message && <p className="text-center text-green-500">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name (min 3 letters)"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
          </div>

          <div>
            <input
              type="text"
              name="username"
              placeholder="Username (min 6 characters)"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          <div>
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password (min 3 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={Object.keys(errors).length > 0}
          >
            Sign Up
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Google Signup Button */}
          <button
            type="button"
            onClick={() => {
              const api = import.meta.env.VITE_API_BASE_URL;
              window.location.href = `${api}/auth/google`;
            }}
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

          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
