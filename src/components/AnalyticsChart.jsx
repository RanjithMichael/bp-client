import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AnalyticsChart = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get(`/posts/${id}/analytics`);
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
      }
    };
    fetchAnalytics();
  }, [id]);

  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;
  if (!analytics) return <p className="text-center mt-4">Loading analytics...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-6" aria-label="Post performance analytics chart">
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