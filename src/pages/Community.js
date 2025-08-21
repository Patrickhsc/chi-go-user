import React, { useState, useEffect } from "react";
import { Eye, Calendar } from "react-feather";
import { useAuth } from "../components/AuthContext";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=bbb&color=fff";

// Utility to format date
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    // Fetch posts from API or use mock data
    async function fetchPosts() {
      setLoading(true);
      try {
        // Replace this with your real API call
        const response = await fetch("/api/community/posts");
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setPosts([]);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  function openPostDetail(post) {
    setSelectedPost(post);
  }

  function closePostDetail() {
    setSelectedPost(null);
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Community</h1>

      {loading && <div className="text-center text-gray-500">Loading posts...</div>}

      {!loading && posts.length === 0 && (
        <div className="text-center text-gray-500 my-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600">Be the first to share your Chicago trip!</p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Post Header: avatar, username, and date in a row */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {/* User Avatar */}
                    <img
                      src={post.avatar || DEFAULT_AVATAR}
                      alt={post.username || "User"}
                      className="w-10 h-10 rounded-full object-cover bg-gray-200"
                      onError={e => { e.target.src = DEFAULT_AVATAR; }}
                    />
                    {/* Username and date */}
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {post.username ? post.username : "User"}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        {formatDate(post.created_at || post.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openPostDetail(post)}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={14} />
                    <span>View Details</span>
                  </button>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">{post.description}</p>
              </div>

              {/* Checklist Preview */}
              {Array.isArray(post.checklist) && post.checklist.length > 0 && (
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {post.checklist.slice(0, 4).map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 text-center"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-16 object-cover rounded-lg mb-2"
                          onError={e => {
                            e.target.src =
                              item.itemType === "restaurant"
                                ? "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop"
                                : "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=100&h=100&fit=crop";
                          }}
                        />
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Post details modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPost.title}</h2>
                  {/* Show 'by username' or fallback to 'User' */}
                  <p className="text-gray-600 mt-1">
                    by {selectedPost.username ? selectedPost.username : "User"}
                  </p>
                </div>
                <button
                  onClick={closePostDetail}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-700 mb-6">{selectedPost.description}</p>
              <h3 className="text-lg font-semibold mb-4">Complete Itinerary</h3>
              <div className="space-y-3">
                {selectedPost.checklist &&
                  selectedPost.checklist.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={e => {
                          e.target.src =
                            item.itemType === "restaurant"
                              ? "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop"
                              : "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=100&h=100&fit=crop";
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.itemType}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
