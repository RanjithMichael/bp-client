import { get, post, put, remove } from "./axiosConfig.js";

// ---------- Posts ----------
export const getAllPosts = () => get("/posts");

export const getPostBySlug = (slug) => get(`/posts/${slug}`);

export const createPost = (postData) => post("/posts", postData);

export const updatePost = (id, postData) => put(`/posts/${id}`, postData); // ✅ added for editing posts

export const deletePost = (id) => remove(`/posts/${id}`);

export const getPaginatedPosts = (page, limit, search = "") =>
  get(`/posts?page=${page}&limit=${limit}&search=${search}`); // ✅ added for pagination support

// ---------- Likes & Comments ----------
export const likePost = (id) => put(`/posts/${id}/like`);

export const addComment = (id, text) => post(`/posts/${id}/comment`, { text });

// ---------- Profile ----------
export const getUserPosts = () => get("/posts/user/myposts");

// ---------- Analytics ----------
export const getAnalytics = () => get("/analytics");