
import { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { Bar } from 'react-chartjs-2';

export default function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/posts/analytics').then(res => setData(res.data));
  }, []);

  const chartData = {
    labels: data.map(post => post.title),
    datasets: [
      {
        label: 'Views',
        data: data.map(post => post.views),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Post Analytics</h2>
      <Bar data={chartData} />
    </div>
  );
}