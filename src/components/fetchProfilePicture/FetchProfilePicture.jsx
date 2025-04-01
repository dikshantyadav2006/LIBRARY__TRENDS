import axios from "axios";
import profile from "../../assets/images/profile.jpg";

// ✅ Fetch profile picture function
const FetchProfilePicture = async (id) => {
  if (!id) return profile; // Return default image if no ID is provided

  try {
    const response = await axios.get(
      `http://localhost:5000/student/profile-pic/${id}`,
      { responseType: "arraybuffer" }
    );
    // console.log(response);
    const base64String = arrayBufferToBase64(response.data);
    const mimeType = response.headers["content-type"];
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error("Error fetching image for user:", id, error);
    return profile; // Return default image if fetching fails
  }
};

// ✅ Helper function to convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export default FetchProfilePicture;
