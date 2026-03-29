import API from "./axiosConfig";

// Get posts created by the logged-in user
export const getMyPosts = async () => {
  const { data } = await API.get("/users/myposts");
  return data;
};

// Update user profile (with optional profile picture)
export const updateProfile = async (formData) => {
  const { data } = await API.put("/users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Get author page by username
export const getAuthorPage = async (username) => {
  const { data } = await API.get(`/users/author/${username}`);
  return data;
};

// Admin: get all users
export const getUsers = async () => {
  const { data } = await API.get("/users");
  return data;
};

// Admin: get user by ID
export const getUserById = async (id) => {
  const { data } = await API.get(`/users/${id}`);
  return data;
};