import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics");
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAnalytics();
  }, []);

  if (!stats) return <p className="text-center mt-10">Loading analytics...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Analytics Overview</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold">Total Posts</h2>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalPosts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold">Total Views</h2>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalViews}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold">Total Comments</h2>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalComments}</p>
        </div>
      </div>
    </div>
  );
}
