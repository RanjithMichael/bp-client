import API, { get, put } from "./axiosConfig.js";

// Get logged-in user's profile
export const getUserProfile = async () => {
  const res = await API.get("/auth/profile");
  return res.data.user; // always return the user object
};

// Update logged-in user's profile
export const updateUserProfile = async (profileData) => {
  const res = await API.put("/auth/profile", profileData);
  return res.data.user; // return updated user
};

// Get logged-in user's posts
export const getMyPosts = async () => {
  const res = await API.get("/posts/user/me"); 
  return res.data.posts; // return posts array
};

// Get posts by a specific user (public route)
export const getUserPosts = async (userId) => {
  const res = await API.get(`/posts/user/${userId}`);
  return res.data.posts; 
};

