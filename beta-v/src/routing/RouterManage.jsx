import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../context/ProtectedRoute";
import LoginPage from "../pages/Authentication/Login";
import SignupPage from "../pages/Authentication/Signup";
import KYCPage from "../pages/Details/KYC";
import Plans from "../pages/Details/Plans";
import Home from "../pages/Home/Home";
import ProfilePage from "../pages/profile/ProfilePage";
import Wallet from "../pages/Wallet/Wallet";

function Layout() {
  const location = useLocation();
  const hideNavbarPath = ["/login", "/register"];

  return (
    <>
      {!hideNavbarPath.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route
          path="/kyc"
          element={
            <ProtectedRoute>
              <KYCPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <ProtectedRoute>
                <Plans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route 
        path="/wallet"
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        }
        />
      </Routes>
    </>
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
