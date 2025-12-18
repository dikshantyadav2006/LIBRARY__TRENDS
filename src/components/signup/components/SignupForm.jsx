import { useSignup } from "./useSignup";
import FormInput from "./FormInput";
import Divider from "./Divider";
import GoogleSignupButton from "./GoogleSignupButton";

export default function SignupForm({ navigate }) {
  const { formData, errors, message, handleChange, handleSubmit } =
    useSignup(navigate);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      {message && (
        <p className="text-center text-green-500 font-medium">{message}</p>
      )}

      <FormInput
        name="fullname"
        placeholder="Full Name"
        value={formData.fullname}
        onChange={handleChange}
        error={errors.fullname}
      />

      <FormInput
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
      />

      <FormInput
        name="mobile"
        placeholder="Mobile"
        value={formData.mobile}
        onChange={handleChange}
        error={errors.mobile}
      />

      <FormInput
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:scale-[1.02] transition-transform"
      >
        Create Account
      </button>

      <Divider />

      <GoogleSignupButton />

      <p className="text-center text-gray-500 text-sm mt-4">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-blue-600 font-medium hover:underline"
        >
          Login
        </button>
      </p>
    </form>
  );
}
