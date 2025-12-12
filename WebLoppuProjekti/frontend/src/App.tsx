import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { RecipeListPage } from "./pages/RecipeListPage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
import { RecipeCreatePage } from "./pages/RecipeCreatePage";
import { RecipeEditPage } from "./pages/RecipeEditPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { AuthProvider } from "./auth/AuthContext";
import { PrivateRoute } from "./auth/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-base-100">
          <Navbar />
          <Routes>
          <Route path="/" element={<RecipeListPage />} />
          <Route path="/recipes/new" element={
            <PrivateRoute>
              <RecipeCreatePage />
            </PrivateRoute>
          } />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/recipes/:id/edit" element={
            <PrivateRoute>
              <RecipeEditPage />
            </PrivateRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/favorites" element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          } />
          <Route path="*" element={
            <div className="container mx-auto px-4 py-8">
              <div className="alert alert-warning">
                <span>Sivua ei löydy</span>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}
