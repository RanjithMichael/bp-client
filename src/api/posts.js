import { get, post, put, remove } from "./axiosConfig.js";

// POSTS

// Get all posts
export const getAllPosts = () => get("/posts");

// Get post by slug
export const getPostBySlug = (slug) => get(`/posts/slug/${slug}`);

// Create post
export const createPost = (postData) => post("/posts", postData);

// Update post
export const updatePost = (id, postData) => put(`/posts/${id}`, postData);

// Delete post
export const deletePost = (id) => remove(`/posts/${id}`);

// Pagination + Search
export const getPaginatedPosts = (page, limit, search = "") =>
  get(`/posts?page=${page}&limit=${limit}&search=${search}`);

// LIKES & COMMENTS

// Toggle like/unlike
export const toggleLikePost = (id) => put(`/posts/${id}/like`);

// Add comment to a post
export const addCommentToPost = (postId, text) =>
  post(`/posts/${postId}/comments`, { text });

// Get all comments for a post
export const getCommentsByPost = (postId) =>
  get(`/posts/${postId}/comments`);

// Delete comment from a post
export const deleteCommentFromPost = (postId, commentId) =>
  remove(`/posts/${postId}/comments/${commentId}`);

// PROFILE

// Current user profile
export const getMyProfile = () => get("/auth/profile");

// Admin: get user by ID
export const getUserProfileById = (userId) => get(`/users/${userId}`);

// ANALYTICS
export const getAnalytics = (id) => get(`/posts/${id}/analytics`);