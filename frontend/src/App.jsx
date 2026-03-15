import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CursorBubble from "./components/CursorBubble";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Docs from "./pages/Docs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ApiDashboard from "./pages/ApiDashboard";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import SubmitRecipe from "./pages/SubmitRecipe";
import MyRecipes from "./pages/MyRecipes";
import AdminDashboard from "./pages/AdminDashboard";
import "./index.css";


function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  if (loading) return null;
  if (!user || user.email !== adminEmail) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CursorBubble />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/api-dashboard" element={<ApiDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/submit-recipe" element={<SubmitRecipe />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
