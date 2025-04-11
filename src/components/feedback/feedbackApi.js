import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL + "/feedback";

const feedbackApi = {
  // Submit new feedback
  submitFeedback: async (message) => {
    try {
      const res = await axios.post(
        `${API_BASE}/submit-feedback`,
        { message },
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.error || "Failed to submit feedback"
      );
    }
  },
  
  

  // Get all non-deleted and non-blocked feedbacks
  getAllFeedbacks: async () => {
    const res = await axios.get(`${API_BASE}/all`);
    return res.data;
  },

  // Like or unlike a feedback
  toggleLike: async (feedbackId) => {
    const res = await axios.post(
      `${API_BASE}/like/${feedbackId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  },

  // Add a comment to a feedback
  addComment: async (feedbackId, message) => {
    const res = await axios.post(
      `${API_BASE}/add-comment/${feedbackId}`,
      { message },
      {
        withCredentials: true,
      }
    );
    return res.data;
  },

  // Add a reply to a comment
  addReply: async (feedbackId, commentId, message, token) => {
    const res = await axios.post(
      `${API_BASE}/reply/${feedbackId}/${commentId}`,
      { message },
      {
        withCredentials: true,
      }
    );
    return res.data;
  },

  // Admin - block/unblock a feedback
  toggleBlock: async (feedbackId, token) => {
    const res = await axios.put(
      `${API_BASE}/block/${feedbackId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  // Admin - soft delete a feedback
  deleteFeedback: async (feedbackId, token) => {
    const res = await axios.delete(`${API_BASE}/delete/${feedbackId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
};

export default feedbackApi;
