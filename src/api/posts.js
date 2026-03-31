import { get, post, put, remove } from "./axiosConfig.js";

//SAFE WRAPPER (prevents app crash)
const safeRequest = async (apiCall) => {
  try {
    return await apiCall();
  } catch (err) {
    console.error("API Error:", err?.response?.data || err.message);
    throw err?.response?.data || err;
  }
};

//POSTS

//Get all posts
export const getAllPosts = () =>
  safeRequest(() => get("/posts"));

//Get post by slug
export const getPostBySlug = (slug) =>
  safeRequest(() => get(`/posts/slug/${slug}`));

//Create post
export const createPost = (postData) =>
  safeRequest(() => post("/posts", postData));

//Update post
export const updatePost = (id, postData) =>
  safeRequest(() => put(`/posts/${id}`, postData));

//Delete post
export const deletePost = (id) =>
  safeRequest(() => remove(`/posts/${id}`));

// Pagination + Search (FIXED query params)
export const getPaginatedPosts = (page = 1, limit = 10, search = "") =>
  safeRequest(() =>
    get("/posts", {
      page,
      limit,
      search,
    })
  );

//LIKES & COMMENTS

// Toggle like/unlike
export const toggleLikePost = (id) =>
  safeRequest(() => put(`/posts/${id}/like`));

// Add comment
export const addCommentToPost = (postId, text) =>
  safeRequest(() =>
    post(`/posts/${postId}/comments`, { text })
  );

// Get comments
export const getCommentsByPost = (postId) =>
  safeRequest(() => get(`/posts/${postId}/comments`));

// Delete comment
export const deleteCommentFromPost = (postId, commentId) =>
  safeRequest(() =>
    remove(`/posts/${postId}/comments/${commentId}`)
  );

//PROFILE

// Current user profile
export const getMyProfile = () =>
  safeRequest(() => get("/auth/profile"));

// Admin: get user by ID
export const getUserProfileById = (userId) =>
  safeRequest(() => get(`/users/${userId}`));

//ANALYTICS

export const getAnalytics = (id) =>
  safeRequest(() => get(`/posts/${id}/analytics`));