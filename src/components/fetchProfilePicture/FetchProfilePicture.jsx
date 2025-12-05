import profile from "../../assets/images/profile.jpg";

// Fetches the profile-pic endpoint which now returns JSON { profilePic: string }
// Returns the profile URL or the default image.
const FetchProfilePicture = async (id) => {
  if (!id) return profile;
  const api = import.meta.env.VITE_API_BASE_URL;

  try {
    const res = await fetch(`${api}/student/profile-pic/${id}`, {
      credentials: "include",
    });

    if (!res.ok) return profile;

    const json = await res.json();
    // Expecting { profilePic: "https://res.cloudinary.com/..." }
    if (json && json.profilePic) return json.profilePic;
    return profile;
  } catch (err) {
    return profile;
  }
};

export default FetchProfilePicture;
