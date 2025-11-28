import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CompleteProfile = ({ loggedInUser, setLoggedInUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingMobile, setCheckingMobile] = useState(false);

  const api = import.meta.env.VITE_API_BASE_URL;

  // Redirect if profile is already completed
  useEffect(() => {
    if (loggedInUser?.profileCompleted) {
      navigate("/dashboard");
    }
  }, [loggedInUser, navigate]);

  // Validate username
  const validateUsername = async (value) => {
    const newErrors = { ...errors };
    
    if (!/^[A-Za-z0-9!@#$%^&*(.)_+]{6,}$/.test(value)) {
      newErrors.username = "Username must be at least 6 characters (A-Z, 0-9, special characters allowed)";
      setErrors(newErrors);
      return;
    }

    // Check if username is available
    setCheckingUsername(true);
    try {
      const res = await fetch(`${api}/user/find-username/${value}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.available) {
        newErrors.username = "Username already taken";
      } else {
        delete newErrors.username;
      }
    } catch (error) {
      console.error("Error checking username:", error);
    }
    setCheckingUsername(false);
    setErrors(newErrors);
  };

  // Validate mobile
  const validateMobile = async (value) => {
    const newErrors = { ...errors };
    
    if (!/^\d{10}$/.test(value)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
      setErrors(newErrors);
      return;
    }

    // Check if mobile is available
    setCheckingMobile(true);
    try {
      const res = await fetch(`${api}/user/find-mobile/${value}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.available) {
        newErrors.mobile = "Mobile number already registered";
      } else {
        delete newErrors.mobile;
      }
    } catch (error) {
      console.error("Error checking mobile:", error);
    }
    setCheckingMobile(false);
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Debounced validation
    if (name === "username" && value.length >= 6) {
      validateUsername(value);
    } else if (name === "mobile" && value.length === 10) {
      validateMobile(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // Final validation
    await validateUsername(formData.username);
    await validateMobile(formData.mobile);

    if (Object.keys(errors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${api}/user/complete-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Profile completed successfully!");
        if (setLoggedInUser) setLoggedInUser(data.user);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage(data.message || "Failed to complete profile");
      }
    } catch (error) {
      console.error("Error completing profile:", error);
      setMessage("Something went wrong. Please try again.");
    }
    setIsLoading(false);
  };

  const isFormValid = 
    formData.username.length >= 6 && 
    formData.mobile.length === 10 && 
    Object.keys(errors).length === 0;

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <div className="bg-[--primary-light-color] dark:bg-[--primary-dark-color] p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Welcome to SHAI Library!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your profile to continue
          </p>
          {loggedInUser?.fullname && (
            <p className="text-sm text-gray-500 mt-2">
              Signed in as: <span className="font-semibold">{loggedInUser.fullname}</span>
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Choose a Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                placeholder="Enter username (min 6 characters)"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {checkingUsername && (
                <span className="absolute right-3 top-3 text-gray-400">⏳</span>
              )}
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                name="mobile"
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                className="w-full p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {checkingMobile && (
                <span className="absolute right-3 top-3 text-gray-400">⏳</span>
              )}
            </div>
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Message */}
          {message && (
            <p className={`text-center ${message.includes("✅") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Complete Profile →"}
          </button>

          {/* Info */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            This information is required to book seats and receive notifications.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;

