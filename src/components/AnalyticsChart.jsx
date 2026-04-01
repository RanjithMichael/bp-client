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

        //Only attach token if exists
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const { data } = await API.get(
          `/posts/${postId}/analytics`,
          config
        );

        //Normalize backend response
        const analyticsData = data?.analytics || data;

        if (!analyticsData) {
          setError("No analytics available for this post.");
          return;
        }

        setAnalytics([
          { name: "Views", value: analyticsData.views || 0 },
          { name: "Likes", value: analyticsData.likesCount || 0 },
          { name: "Shares", value: analyticsData.sharesCount || 0 },
          { name: "Comments", value: analyticsData.commentsCount || 0 },
        ]);
      } catch (err) {
        console.error("Analytics fetch failed:", err);

        //Smart error handling
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          
          // Optional auto logout:
          // localStorage.clear();
          // window.location.href = "/login";
        } else if (err.response?.status === 404) {
          setError("Analytics not found for this post.");
        } else {
          setError("Failed to load analytics. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [postId]);

  if (loading)
    return (
      <p className="text-center mt-4 text-gray-500">
        📊 Loading analytics...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-4 text-red-500 font-medium">
        {error}
      </p>
    );

  if (!analytics || analytics.length === 0)
    return (
      <p className="text-center mt-4 text-gray-500">
        No analytics data available.
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        📊 Post Performance
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={analytics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;