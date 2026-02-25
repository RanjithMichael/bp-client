import { useState, useEffect } from "react";
import {
  subscribeAuthor,
  unsubscribeAuthor,
  getSubscriptionStatus,
} from "../api/subscriptions";
import { toast } from "react-toastify";

export default function SubscribeButton({ authorId }) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch subscription status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      if (!authorId) return;
      try {
        const res = await getSubscriptionStatus(authorId);
        setSubscribed(res?.subscribed ?? false);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.info("Please login to manage subscriptions.");
        } else {
          console.error("Error fetching subscription status:", err);
          toast.error("Failed to load subscription status.");
        }
      }
    };
    fetchStatus();
  }, [authorId]);

  // Toggle subscription
  const toggleSubscription = async () => {
    if (!authorId) {
      toast.error("Author ID missing.");
      return;
    }

    setLoading(true);

    try {
      if (subscribed) {
        await unsubscribeAuthor(authorId);
        setSubscribed(false);
        toast.info("❌ Unsubscribed from author.");
      } else {
        await subscribeAuthor(authorId);
        setSubscribed(true);
        toast.success("✅ Subscribed to author!");
      }
    } catch (err) {
      console.error("Error toggling subscription:", err);
      toast.error(err.response?.data?.message || "Failed to update subscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}