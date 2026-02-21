import { get, post, put, remove } from "./axiosConfig.js";

// POSTS

// Get all posts
export const getAllPosts = () => get("/posts");

// Get post by slug
export const getPostBySlug = (slug) =>
  get(`/posts/slug/${slug}`);

// Create post
export const createPost = (postData) =>
  post("/posts", postData);

// Update post
export const updatePost = (id, postData) =>
  put(`/posts/${id}`, postData);

// Delete post
export const deletePost = (id) =>
  remove(`/posts/${id}`);

// Pagination + Search
export const getPaginatedPosts = (page, limit, search = "") =>
  get(`/posts?page=${page}&limit=${limit}&search=${search}`);


// LIKES & COMMENTS

// ✅ Toggle like (PATCH in backend)
export const toggleLike = (id) =>
  put(`/posts/${id}/like`);

// Add comment
export const addComment = (id, text) =>
  post(`/posts/${id}/comments`, { text });


// PROFILE

export const getUserPosts = (userId) =>
  get(`/users/${userId}/posts`);


// ANALYTICS

export const getAnalytics = (id) =>
  get(`/posts/${id}/analytics`);
