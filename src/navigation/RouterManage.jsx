import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/Authcontext";
import { ProtectedRoute } from "../context/ProtectedRoute";
import AdminLoginPage from "../pages/authentication/Login";
import AdminRegister from "../pages/authentication/Register";
import ChangeScanner from "../pages/chnagescanner/ChangeScanner";
import Dashboard from "../pages/dashboard/Dashboard";

function Layout() {
  const location = useLocation();

  const hideNavRoute = ["/admin/login", "/admin/register"];
  const showNavbar = !hideNavRoute.includes(location.pathname);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {showNavbar &&
        <ProtectedRoute>
          <Navbar />
        </ProtectedRoute>
      }
      <main
        className={`
          flex-1 transition-all duration-300
          ${showNavbar ? "md:ml-64" : ""}
          ${showNavbar ? "mt-16 md:mt-0" : ""}
          p-4 md:p-6
        `}
      >
        <div className="max-w-7xl mx-auto w-full">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-scanner"
              element={
                <ProtectedRoute>
                  <ChangeScanner />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/register" element={<AdminRegister />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function RouterManage() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default RouterManage;
