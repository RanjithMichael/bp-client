import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const AnalyticsChart = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get(`/posts/${id}/analytics`);
        setAnalytics([
          { name: "Views", value: data.views },
          { name: "Likes", value: data.likes },
          { name: "Shares", value: data.shares },
          { name: "Comments", value: data.comments },
        ]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, [id]);

  if (!analytics) return <p className="text-center mt-4">Loading analytics...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-6">
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
