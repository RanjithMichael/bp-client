import { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';

export default function Subscription({ authorId }) {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    axios.get(`/subscriptions/${authorId}`).then(res => setSubscribed(res.data.subscribed));
  }, [authorId]);

  const toggleSubscription = () => {
    const method = subscribed ? 'delete' : 'post';
    axios[method](`/subscriptions/${authorId}`).then(() => setSubscribed(!subscribed));
  };

  return (
    <button
      onClick={toggleSubscription}
      className={`px-4 py-2 rounded ${subscribed ? 'bg-red-500' : 'bg-green-500'} text-white`}
    >
      {subscribed ? 'Unsubscribe' : 'Subscribe'}
    </button>
  );
}