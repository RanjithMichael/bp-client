import { useState, useEffect } from "react";
import API from "../api/axiosConfig"; // use your configured axios instance

export default function Subscription({ authorId }) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch subscription status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await API.get(`/subscriptions/status/${authorId}`);
        setSubscribed(res.data.subscribed);
      } catch (err) {
        console.error("Error fetching subscription status:", err);
      }
    };
    if (authorId) fetchStatus();
  }, [authorId]);

  // Toggle subscription
  const toggleSubscription = async () => {
    try {
      setLoading(true);
      if (subscribed) {
        await API.delete(`/subscriptions/${authorId}`);
      } else {
        await API.post(`/subscriptions/${authorId}`);
      }
      setSubscribed(!subscribed);
    } catch (err) {
      console.error("Error toggling subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleSubscription}
      disabled={loading}
      className={`px-4 py-2 rounded font-semibold text-white transition ${
        subscribed
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-500 hover:bg-green-600"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? "Please wait..." : subscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  );
}
