// src/api/commentApi.js
import { get, post, remove } from "./axiosConfig.js";

// COMMENTS

// Add a new comment to a post
export const addCommentToPost = (postId, text) =>
  post(`/comments/${postId}`, { text });

// Get all comments for a post
export const getCommentsByPost = (postId) =>
  get(`/comments/${postId}`);

// Delete a comment from a post
export const deleteCommentFromPost = (postId, commentId) =>
  remove(`/comments/${postId}/${commentId}`);