import { useState, useEffect } from "react";
import {
  subscribeAuthor,
  unsubscribeAuthor,
  getSubscriptionStatus,
} from "../api/subscriptions";

export default function SubscribeButton({ authorId }) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch subscription status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      if (!authorId) return; // avoid undefined ID
      try {
        const res = await getSubscriptionStatus(authorId);
        setSubscribed(res?.subscribed ?? false);
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error("Error fetching subscription status:", err);
          setError("Failed to load subscription status.");
        }
      }
    };
    fetchStatus();
  }, [authorId]);

  // Toggle subscription
  const toggleSubscription = async () => {
    if (!authorId) return;

    setLoading(true);
    setError(null);

    try {
      if (subscribed) {
        await unsubscribeAuthor(authorId);
        setSubscribed(false);
      } else {
        await subscribeAuthor(authorId);
        setSubscribed(true);
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
          subscribed ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
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