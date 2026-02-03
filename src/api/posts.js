import { get, post, put, remove } from "./axiosConfig.js";

// Posts 
export const getAllPosts = () => get("/posts");

export const getPostBySlug = (slug) => get(`/posts/slug/${slug}`);

export const createPost = (postData) => post("/posts", postData);

export const updatePost = (id, postData) => put(`/posts/${id}`, postData);

export const deletePost = (id) => remove(`/posts/${id}`);

export const getPaginatedPosts = (page, limit, search = "") =>
  get(`/posts?page=${page}&limit=${limit}&search=${search}`);

// Likes & Comments 
export const likePost = (id) => get(`/posts/${id}/like`); // PATCH in backend, use axios.patch if available

export const addComment = (id, text) => post(`/posts/${id}/comments`, { text });

// Profile 
export const getUserPosts = (userId) => get(`/users/${userId}/posts`);

// Analytics
export const getAnalytics = (id) => get(`/posts/${id}/analytics`);