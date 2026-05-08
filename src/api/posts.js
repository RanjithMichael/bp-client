import { toast } from "react-toastify";
import { get, post, put, remove } from "./axiosConfig.js";

// SAFE WRAPPER
const safeRequest = async (apiCall) => {
  try {
    const res = await apiCall();
    return res.data;
  } catch (err) {
    toast.error(`API Error: ${err?.response?.data?.message || err.message}`);
    throw err?.response?.data || err;
  }
};

// POSTS
export const getAllPosts = () => safeRequest(() => get("/posts"));

export const getPostBySlug = (slug) => safeRequest(() => get(`/posts/slug/${slug}`));

export const createPost = (postData) =>
  safeRequest(() => post("/posts", postData)).then((data) => {
    toast.success("Post created successfully!");
    return data;
  });

  export const updatePost = (id, postData) =>
  safeRequest(() => put(`/posts/${id}`, postData)).then((data) => {
    toast.success("Post updated successfully!");
    return data;
  });

  export const deletePost = (id) =>
  safeRequest(() => remove(`/posts/${id}`)).then((data) => {
    toast.success("Post deleted successfully!");
    return data;
  });

// Pagination + Search
export const getPaginatedPosts = (page = 1, limit = 10, search = "") =>
  safeRequest(() =>
    get("/posts", {
      params: { page, limit, search },
    })
  );

// LIKES & COMMENTS
export const toggleLikePost = (id) =>
  safeRequest(() => put(`/posts/${id}/like`)).then((data) => {
    toast.success("Like toggled!");
    return data;
  });

  export const addCommentToPost = (postId, text) =>
  safeRequest(() => post(`/posts/${postId}/comments`, { text })).then((data) => {
    toast.success("Comment added!");
    return data;
  });

  export const getCommentsByPost = (postId) =>
  safeRequest(() => get(`/posts/${postId}/comments`));

export const deleteCommentFromPost = (postId, commentId) =>
  safeRequest(() => remove(`/posts/${postId}/comments/${commentId}`)).then((data) => {
    toast.success("Comment deleted!");
    return data;
  });

// PROFILE
export const getMyProfile = () => safeRequest(() => get("/auth/profile"));

export const getUserProfileById = (userId) => safeRequest(() => get(`/users/${userId}`));

// ANALYTICS
export const getAnalytics = (id) => safeRequest(() => get(`/posts/${id}/analytics`));
