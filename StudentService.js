import axios from "axios";

export const addStudent = async (studentData) => {
  try {
    const res = await axios.post("http://localhost:5000/admin/add-student", studentData);
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || "Error adding student" };
  }
};

export const getAllStudents = async () => {
  try {
    const res = await axios.get("http://localhost:5000/admin/students");
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: "Error fetching students" };
  }
};
