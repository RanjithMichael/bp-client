import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SearchPage from "./pages/SearchPage";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthorPage from "./pages/AuthorPage";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard"; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* Header */}
          <header className="sticky top-0 z-50 shadow bg-white">
            <Header />
          </header>

          {/* Main Content */}
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              {/* ---------- Public Routes ---------- */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* ---------- Post Routes ---------- */}
              <Route path="/post/:slug" element={<PostDetails />} />

              {/* Author page route (use username for consistency) */}
              <Route path="/author/:username" element={<AuthorPage />} />

              {/* ---------- Protected Routes ---------- */}
              <Route
                path="/create-post"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard /> {/* ✅ new route */}
                  </ProtectedRoute>
                }
              />

              {/* ---------- 404 Fallback ---------- */}
              <Route
                path="*"
                element={
                  <div className="text-center py-20 text-gray-600 text-xl">
                    404 - Page Not Found <br />
                    <Link to="/" className="text-blue-600 hover:underline">
                      Go Home
                    </Link>
                  </div>
                }
              />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="mt-auto bg-white shadow-inner">
            <Footer />
          </footer>

          {/* ✅ Toast container (global notifications) */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            limit={3}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;