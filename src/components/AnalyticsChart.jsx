import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AnalyticsChart = ({ postId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const { data } = await API.get(`/posts/${postId}/analytics`, { headers });

        if (data.success && data.analytics) {
          setAnalytics([
            { name: "Views", value: data.analytics.views || 0 },
            { name: "Likes", value: data.analytics.likes || 0 },
            { name: "Shares", value: data.analytics.shares || 0 },
            { name: "Comments", value: data.analytics.comments || 0 },
          ]);
        } else {
          setError("No analytics available for this post.");
        }
      } catch (err) {
        console.error("Analytics fetch failed:", err);
        setError("Failed to load analytics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [postId]);

  if (loading) return <p className="text-center mt-4">Loading analytics...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;
  if (!analytics || analytics.length === 0)
    return <p className="text-center mt-4">No analytics data available.</p>;

  return (
    <div
      className="max-w-2xl mx-auto mt-6"
      aria-label="Post performance analytics chart"
    >
      <h2 className="text-xl font-bold mb-4">Post Performance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={analytics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;

