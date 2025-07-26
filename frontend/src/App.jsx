import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import SignUpPage from "./components/SignUpPage";
import LogInPage from "./components/LogInPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import DashboardPage from "./components/DashboardPage";
import OverviewPage from "./components/OverviewPage";
import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#F1EFE1] flex flex-col">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/login" element={<LogInPage />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPasswordPage />}
                    />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;