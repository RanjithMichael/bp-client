import API from "./axiosConfig";

// Subscribe to an author
export const subscribeAuthor = async (authorId) => {
  const { data } = await API.post(`/subscriptions/author/${authorId}`);
  return data;
};

// Unsubscribe from an author
export const unsubscribeAuthor = async (authorId) => {
  const { data } = await API.delete(`/subscriptions/author/${authorId}`);
  return data;
};

// Check subscription status for a specific author
export const getSubscriptionStatus = async (authorId) => {
  const { data } = await API.get(`/subscriptions/status/${authorId}`);
  // Normalize response to always return { subscribed: boolean }
  return { subscribed: !!data?.subscribed };
};

// Get all my subscriptions
export const getMySubscriptions = async () => {
  const { data } = await API.get(`/subscriptions`);
  return data;
};

// Delete a subscription by its ID
export const deleteSubscription = async (subscriptionId) => {
  const { data } = await API.delete(`/subscriptions/${subscriptionId}`);
  return data;
};