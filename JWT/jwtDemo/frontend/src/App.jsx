import { useEffect, useState } from "react";
import api from "./api";
import AuthForm from "./AuthForm";
import PostForm from "./PostForm";

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("username"));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    try {
      setError("");
      const { data } = await api.get("/posts");
      setPosts(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load posts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
              <span className="text-white text-xl font-bold">J</span>
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-gray-900">
                JWT Blog
              </h1>
              <p className="text-xs text-gray-500">
                Share your thoughts
              </p>
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="text-sm font-bold text-gray-800">
                  {user}
                </p>
              </div>

              <button
                onClick={logout}
                className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors"
              >
                Logout ↗
              </button>
            </div>
          ) : (
            <span className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-semibold">
              Guest User
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

        {/* Welcome Section */}
        {user && (
          <div className="mb-10 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 p-7 sm:p-10 text-white shadow-xl shadow-indigo-200/50">
            <p className="text-indigo-200 text-sm font-semibold mb-2">
              YOUR PERSONAL BLOG SPACE
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
              Welcome back, {user}! 👋
            </h2>

            <p className="text-indigo-100 max-w-xl">
              Share your ideas, express your thoughts, and explore
              what others are writing.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-indigo-100">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Authenticated successfully
            </div>
          </div>
        )}

        {/* Authentication and Post Form */}
        {user ? (
          <section className="mb-14">
            <PostForm onCreated={loadPosts} />
          </section>
        ) : (
          <section className="mb-14">
            <AuthForm onLogin={setUser} />
          </section>
        )}

        {/* Posts Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">

            <div>
              <p className="text-indigo-600 text-sm font-bold uppercase tracking-wider mb-2">
                Community Feed
              </p>

              <h2 className="text-3xl font-extrabold text-gray-900">
                Explore Posts
              </h2>

              <p className="text-gray-500 mt-2">
                Discover thoughts and ideas shared by the community.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
              <span className="text-indigo-600 font-bold text-xl">
                {posts.length}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                {posts.length === 1 ? "Post" : "Posts"} published
              </span>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-16 flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4 text-sm">
                Loading posts...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-600">
              {error}
              <button
                onClick={loadPosts}
                className="ml-3 font-bold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && posts.length === 0 && (
            <div className="bg-white rounded-3xl border border-gray-200 border-dashed p-12 text-center">
              <div className="text-5xl mb-4">📝</div>

              <h3 className="text-xl font-bold text-gray-800">
                No posts yet!
              </h3>

              <p className="text-gray-500 mt-2">
                Be the first one to share something interesting.
              </p>
            </div>
          )}

          {/* Posts Grid */}
          {!loading && !error && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {posts.map((p) => (
                <article
                  key={p.id}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold">
                      BLOG POST
                    </span>

                    <span className="text-gray-300 group-hover:text-indigo-500 transition-colors">
                      ✦
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors break-words">
                    {p.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-7 whitespace-pre-wrap break-words">
                    {p.content}
                  </p>

                  <div className="mt-7 pt-5 border-t border-gray-100 flex items-center justify-between gap-3">

                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold">
                        {p.author?.charAt(0).toUpperCase() || "U"}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">
                          Written by
                        </p>

                        <p className="text-sm font-bold text-gray-800 truncate">
                          {p.author || "Unknown"}
                        </p>
                      </div>
                    </div>

                    <time
                      dateTime={p.createdAt}
                      className="text-xs text-gray-400 text-right shrink-0"
                    >
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : ""}
                    </time>
                  </div>
                </article>
              ))}

            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} JWT Blog Demo
          </p>

          <p className="text-sm text-gray-400">
            Built with React, Spring Boot & JWT Authentication
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;