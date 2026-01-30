import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axiosConfig";

const AuthorPage = () => {
  const { username } = useParams(); // ✅ use username instead of id
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await API.get(`/users/author/${username}`); 
        setAuthor(res.data.author);
        setPosts(res.data.posts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [username]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!author) return <p className="text-center mt-10">Author not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center space-x-4 mb-6">
        {author.profilePic && ( // ✅ use profilePic
          <img
            src={author.profilePic}
            alt={author.name}
            className="w-20 h-20 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{author.name}</h1>
          {author.bio && <p className="text-gray-600">{author.bio}</p>}
          {author.socialLinks && author.socialLinks.length > 0 && (
            <div className="flex space-x-2 mt-1">
              {author.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Posts by {author.name}</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post._id} className="p-4 border rounded hover:shadow">
              <Link
                to={`/post/${post.slug}`}
                className="text-xl font-medium hover:text-blue-600"
              >
                {post.title}
              </Link>
              <p className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuthorPage;
