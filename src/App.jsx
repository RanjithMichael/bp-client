import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthorPage from './pages/AuthorPage'; 
import Analytics from './pages/Analytics';   

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/author/:authorId" element={<AuthorPage />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
          </AuthProvider>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


