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
