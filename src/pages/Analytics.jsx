import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Analytics() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await API.get("/posts");
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Per-post chart
  const chartData = {
    labels: posts.map((post) => post.title?.slice(0, 20) || "Untitled"),
    datasets: [
      {
        label: "Views",
        data: posts.map((post) => post.analytics?.views || 0),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
      {
        label: "Likes",
        data: posts.map((post) => post.analytics?.likes?.length || 0),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
      },
      {
        label: "Shares",
        data: posts.map((post) => post.analytics?.shares || 0),
        backgroundColor: "rgba(168, 85, 247, 0.6)",
      },
      {
        label: "Comments",
        data: posts.map((post) => post.comments?.length || 0),
        backgroundColor: "rgba(239, 68, 68, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Post Performance Analytics" },
    },
  };

  // Per-author aggregation
  const authorStats = posts.reduce((acc, post) => {
    const authorName = post.author?.name || "Unknown Author";
    if (!acc[authorName]) {
      acc[authorName] = { views: 0, likes: 0, shares: 0, comments: 0 };
    }
    acc[authorName].views += post.analytics?.views || 0;
    acc[authorName].likes += post.analytics?.likes?.length || 0;
    acc[authorName].shares += post.analytics?.shares || 0;
    acc[authorName].comments += post.comments?.length || 0;
    return acc;
  }, {});

  const authorLabels = Object.keys(authorStats);
  const authorData = {
    labels: authorLabels,
    datasets: [
      {
        label: "Views",
        data: authorLabels.map((a) => authorStats[a].views),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
      {
        label: "Likes",
        data: authorLabels.map((a) => authorStats[a].likes),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
      },
      {
        label: "Shares",
        data: authorLabels.map((a) => authorStats[a].shares),
        backgroundColor: "rgba(168, 85, 247, 0.6)",
      },
      {
        label: "Comments",
        data: authorLabels.map((a) => authorStats[a].comments),
        backgroundColor: "rgba(239, 68, 68, 0.6)",
      },
    ],
  };

  const authorOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Author Performance Analytics" },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📊 Post Analytics</h2>
      <Bar data={chartData} options={chartOptions} aria-label="Post analytics chart" />

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-xl font-bold text-blue-700">
            {posts.reduce((sum, p) => sum + (p.analytics?.views || 0), 0)}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Total Likes</p>
          <p className="text-xl font-bold text-green-700">
            {posts.reduce((sum, p) => sum + (p.analytics?.likes?.length || 0), 0)}
          </p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Total Shares</p>
          <p className="text-xl font-bold text-purple-700">
            {posts.reduce((sum, p) => sum + (p.analytics?.shares || 0), 0)}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Total Comments</p>
          <p className="text-xl font-bold text-red-700">
            {posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0)}
          </p>
        </div>
      </div>

      {/* Author Breakdown */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">👩‍💻 Author Analytics</h2>
        <Bar data={authorData} options={authorOptions} aria-label="Author analytics chart" />
      </div>
    </div>
  );
}