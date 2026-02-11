import { useState, useEffect } from "react";
import API from "../api/axiosConfig";

export default function SubscribeButton({ authorId }) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch subscription status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await API.get(`/subscriptions/status/${authorId}`);
        setSubscribed(res.data.subscribed ?? false);
      } catch (err) {
        console.error("Error fetching subscription status:", err);
        setError("Failed to load subscription status.");
      }
    };
    if (authorId) fetchStatus();
  }, [authorId]);

  // Toggle subscription
  const toggleSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      let res;
      if (subscribed) {
        res = await API.delete(`/subscriptions/${authorId}`);
      } else {
        res = await API.post(`/subscriptions/${authorId}`);
      }

      if (res.data.subscribed !== undefined) {
        setSubscribed(res.data.subscribed);
      } else {
        setSubscribed(!subscribed);
      }
    } catch (err) {
      console.error("Error toggling subscription:", err);
      setError("Failed to update subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={toggleSubscription}
        disabled={loading}
        aria-label={subscribed ? "Unsubscribe from author" : "Subscribe to author"}
        className={`px-4 py-2 rounded font-semibold text-white transition ${
          subscribed
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading
          ? subscribed
            ? "Unsubscribing..."
            : "Subscribing..."
          : subscribed
          ? "Unsubscribe"
          : "Subscribe"}
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}