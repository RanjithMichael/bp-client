import { get, put } from "./axiosConfig.js";

// Get logged-in user's profile
export const getUserProfile = () => get("/users/profile");

// Update logged-in user's profile
export const updateUserProfile = (profileData) =>
  put("/users/profile", profileData);

// Get logged-in user's posts
export const getMyPosts = () => get("/users/myposts");

// Get posts by a specific user (public route)
export const getUserPosts = (userId) => get(`/users/${userId}/posts`);