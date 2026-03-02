import { get, post, remove } from "./axiosConfig.js";

// COMMENTS
export const addCommentToPost = (postId, text) =>
  post(`/comments/${postId}`, { text });

export const getCommentsByPost = (postId) =>
  get(`/comments/${postId}`);

export const deleteCommentFromPost = (postId, commentId) =>
  remove(`/comments/${postId}/comments/${commentId}`);