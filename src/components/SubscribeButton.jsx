import { useState, useEffect } from "react";
import API from "../api/axiosConfig";

export default function SubscribeButton({ authorId }) {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch subscription status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      if (!authorId) return; // avoid undefined ID
      const token = localStorage.getItem("token");
      if (!token) return; // skip if not logged in

      try {
        const res = await API.get(`/api/subscribe/status/${authorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubscribed(res?.data?.subscribed ?? false);
      } catch (err) {
        // ignore 401 (not logged in)
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
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let res;
      if (subscribed) {
        // Unsubscribe
        res = await API.delete(`/unsubscribe/${authorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Subscribe
        res = await API.post(
          `/subscribe/${authorId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setSubscribed(res?.data?.subscribed ?? !subscribed);
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
        {loading ? (subscribed ? "Unsubscribing..." : "Subscribing...") : subscribed ? "Unsubscribe" : "Subscribe"}
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}


