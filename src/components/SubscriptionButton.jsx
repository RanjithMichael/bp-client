export default function SubscriptionButton({ isSubscribed, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded ${
        isSubscribed
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  );
}
