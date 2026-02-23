import { post, remove, get } from "./axiosConfig";

// Subscribe to an author
export const subscribeAuthor = async (authorId) => {
  const { data } = await post(`/subscriptions/author/${authorId}`, {});
  return data;
};

// Unsubscribe from an author
export const unsubscribeAuthor = async (authorId) => {
  const { data } = await remove(`/subscriptions/author/${authorId}`);
  return data;
};

// Check subscription status for a specific author
export const getSubscriptionStatus = async (authorId) => {
  const { data } = await get(`/subscriptions/status/${authorId}`);
  return data;
};

// Get all my subscriptions
export const getMySubscriptions = async () => {
  const { data } = await get(`/subscriptions`);
  return data;
};

// Delete a subscription by its ID
export const deleteSubscription = async (subscriptionId) => {
  const { data } = await remove(`/subscriptions/${subscriptionId}`);
  return data;
};