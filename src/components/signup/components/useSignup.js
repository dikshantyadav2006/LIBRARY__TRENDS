import { useState } from "react";
import { signup } from "../../../utils/authApi";

export const useSignup = (navigate) => {
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

    if (name === "fullname" && !/^[A-Za-z\s]{3,}$/.test(value))
      newErrors.fullname = "Full name must be at least 3 letters.";
    else if (name === "fullname") delete newErrors.fullname;

    if (name === "username" && !/^[A-Za-z0-9!@#$%^&*(.)_+]{6,}$/.test(value))
      newErrors.username = "Username must be at least 6 characters.";
    else if (name === "username") delete newErrors.username;

    if (name === "mobile" && !/^\d{10}$/.test(value))
      newErrors.mobile = "Mobile number must be 10 digits.";
    else if (name === "mobile") delete newErrors.mobile;

    if (name === "password" && value.length < 3)
      newErrors.password = "Password must be at least 3 characters.";
    else if (name === "password") delete newErrors.password;

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

    Object.entries(formData).forEach(([n, v]) => validate(n, v));
    if (Object.keys(errors).length) return;

    try {
      await signup(formData);
      setMessage("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return { formData, errors, message, handleChange, handleSubmit };
};