import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import DashboardNavbar from "./DashboardNavbar";
import Footer from "./Footer";
import AddWellbeingModal from "./AddWellbeingModal";

function ProfilePage() {
  const { user, token, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [wellbeings, setWellbeings] = useState([]);
  const [isAddWellbeingModalOpen, setIsAddWellbeingModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [wellbeingToDelete, setWellbeingToDelete] = useState(null);
  const [newName, setNewName] = useState(user?.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const authToken = token || localStorage.getItem('token');
    console.log('ProfilePage useEffect: ', { loading, token, user, authToken });

    const fetchWellbeings = async () => {
      try {
        const response = await axios.get("/api/wellbeings", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setWellbeings(response.data);
        setError("");
      } catch (err) {
        const errorMessage =
          err.response?.data?.error?.message || "Failed to fetch well-beings";
        setError(errorMessage);
        console.error('Fetch well-beings error:', err.response?.data || err.message);
        if (err.response?.status === 401) {
          console.log('Redirecting to /login due to 401 on wellbeings');
          navigate("/login", { replace: true });
        }
      }
    };

    if (!loading && authToken) {
      fetchWellbeings();
    } else if (!loading && !authToken) {
      console.log('Redirecting to /login due to missing token');
      navigate("/login", { replace: true });
    }
  }, [loading, token, user, navigate]);

  const handleAddWellbeing = async (wellbeing) => {
    if (typeof wellbeing !== 'object' || !wellbeing.name) {
      setError("Invalid well-being data");
      console.error('Invalid wellbeing data:', wellbeing);
      return;
    }
    const trimmedName = wellbeing.name.trim();
    if (!trimmedName) {
      setError("Well-being name is required");
      return;
    }
    const existingNames = wellbeings.map(w => w.name.trim().toLowerCase());
    if (existingNames.includes(trimmedName.toLowerCase())) {
      setError("Well-being name already exists");
      return;
    }
    try {
      setWellbeings([...wellbeings, wellbeing]);
      setIsAddWellbeingModalOpen(false);
      setError("");
      console.log('Well-being added to state:', wellbeing);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message || "Failed to add well-being";
      setError(errorMessage);
      console.error('Add well-being error:', err.response?.data || err.message);
    }
  };

  const handleRemoveWellbeing = async (wellbeingId) => {
    try {
      const authToken = token || localStorage.getItem('token');
      await axios.delete(`/api/wellbeings/${wellbeingId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setWellbeings(wellbeings.filter(w => w._id !== wellbeingId));
      setIsDeleteModalOpen(false);
      setWellbeingToDelete(null);
      setError("");
      console.log('Well-being removed:', wellbeingId);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message || "Failed to remove well-being";
      setError(errorMessage);
      console.error('Remove well-being error:', err.response?.data || err.message);
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim()) {
      setError("Name is required");
      return;
    }
    try {
      const authToken = token || localStorage.getItem('token');
      const response = await axios.put(
        "/api/users/profile",
        { fullName: newName },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      // Update user in AuthContext
      // Note: AuthContext should handle user update; for now, rely on page refresh
      setIsNameModalOpen(false);
      setNewName("");
      setError("");
      console.log('Name updated:', response.data);
      // Force refresh to update user in AuthContext
      window.location.reload();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message || "Failed to update name";
      setError(errorMessage);
      console.error('Update name error:', err.response?.data || err.message);
    }
  };

  const handleSavePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password must match");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    try {
      const authToken = token || localStorage.getItem('token');
      await axios.put(
        "/api/users/profile",
        { oldPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setIsPasswordModalOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      console.log('Password updated successfully');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message || "Failed to update password";
      setError(errorMessage);
      console.error('Update password error:', err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
    console.log('User logged out');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1EFE1] flex items-center justify-center">
        <p className="text-[#3F48CC] text-xl font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1EFE1] flex flex-col overflow-x-hidden relative">
      <DashboardNavbar />
      <main className="flex-grow pt-16 sm:pt-20 md:pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-[#915941] text-4xl sm:text-5xl font-extrabold my-12 sm:mt-16 md:mt-24 sm:mb-16 md:mb-24 text-left pl-2 sm:pl-4 md:pl-6">
            Profile
          </h1>

          {error && (
            <p className="text-red-500 text-sm sm:text-base text-center mb-6 sm:mb-8">
              {error}
            </p>
          )}

          {/* Personal Details */}
          <div className="mb-10 sm:mb-12">
            <h2 className="text-[#000000]/80 text-2xl sm:text-3xl md:text-4xl font-semibold text-left mb-4">
              Personal Details
            </h2>
            <div className="pl-4 sm:pl-6 md:pl-8">
              {[
                {
                  label: "Full Name",
                  value: user?.name || "Loading...",
                  action: (
                    <button
                      className="text-[#3F48CC] text-lg font-normal hover:underline"
                      onClick={() => {
                        setNewName(user?.name || "");
                        setIsNameModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                  ),
                },
                {
                  label: "Email",
                  value: user?.email || "Loading...",
                  action: null,
                },
                {
                  label: "Password",
                  value: "********",
                  action: (
                    <button
                      className="text-[#3F48CC] text-lg font-normal hover:underline"
                      onClick={() => setIsPasswordModalOpen(true)}
                    >
                      Change
                    </button>
                  ),
                },
              ].map(({ label, value, action }, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between w-full sm:max-w-[50%] mb-4 sm:gap-12 py-4"
                >
                  <p className="text-[#000000]/80 text-lg sm:text-xl font-extrabold w-full sm:w-auto">
                    {label}
                  </p>
                  <div className="flex flex-row items-center justify-between w-full sm:w-auto sm:flex-1 gap-4">
                    <p className="text-[#000000]/80 text-lg sm:text-xl font-normal truncate flex-1">
                      {value}
                    </p>
                    {action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Well-beings */}
          <div className="mb-10 sm:mb-12">
            <h2 className="text-[#000000]/80 text-2xl sm:text-3xl md:text-4xl font-semibold text-left mb-4">
              Well-beings
            </h2>
            <div className="pl-4 sm:pl-6 md:pl-8">
              {wellbeings.length === 0 ? (
                <p className="text-[#000000]/80 text-lg sm:text-xl font-normal">
                  No well-beings found. Add one below.
                </p>
              ) : (
                wellbeings.map((wellbeing) => (
                  <div
                    key={wellbeing._id}
                    className="flex flex-row items-center justify-between w-full sm:max-w-[50%] mb-4"
                  >
                    <p className="text-[#000000]/80 text-lg sm:text-xl font-extrabold truncate">
                      {wellbeing.name}
                    </p>
                    {wellbeing.isRemovable && (
                      <button
                        className="bg-[#C82727] text-[#FFFFFF] text-base sm:text-lg font-medium py-1 px-3 sm:py-2 sm:px-4 rounded-[10px] hover:bg-[#A82323] active:opacity-80 transition-all duration-200"
                        onClick={() => {
                          setWellbeingToDelete(wellbeing);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))
              )}
              <button
                className="bg-[#915941] text-[#FFFFFF] text-lg sm:text-xl font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-[10px] hover:bg-[#7A4C36] active:opacity-80 transition-all duration-200 mt-4 sm:mt-6"
                onClick={() => setIsAddWellbeingModalOpen(true)}
              >
                Add
              </button>
              <AddWellbeingModal
                isOpen={isAddWellbeingModalOpen}
                onClose={() => {
                  setIsAddWellbeingModalOpen(false);
                  setError("");
                }}
                onSave={handleAddWellbeing}
              />
            </div>
          </div>

          {/* Log Out */}
          <div className="w-full flex justify-end mt-12 sm:mt-16 px-4 sm:px-6 md:px-8">
            <button
              className="bg-[#C82727] text-[#FFFFFF] text-lg sm:text-xl font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-[10px] hover:bg-[#A82323] active:opacity-80 transition-all duration-200"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </main>
      <Footer />

      {/* Name Modal */}
      {isNameModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
          onClick={() => {
            setIsNameModalOpen(false);
            setError("");
          }}
        >
          <div
            className="bg-[#F1EFE1] py-16 px-10 rounded-[10px] max-w-2xl w-[90%] sm:w-[80%]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-[#915941]">
              Update Full Name
            </h2>
            <div className="flex flex-col items-center">
              <label className="text-[#000000]/80 text-lg sm:text-xl font-medium mb-2 w-[90%] text-left pl-5">
                Full Name
              </label>
              <input
                type="text"
                className="w-[90%] bg-[#D9D9D9] text-[#000000]/80 text-base sm:text-lg font-normal py-3 px-4 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#915941] mb-4"
                placeholder="Enter your full name"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setError("");
                }}
              />
              {error && (
                <p className="text-red-500 text-sm mb-4 w-[90%] text-left pl-5">
                  {error}
                </p>
              )}
              <button
                className="bg-[#915941] text-[#FFFFFF] text-sm sm:text-xl font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-[10px] hover:bg-[#7A4C36] active:opacity-80 transition-all duration-200"
                onClick={handleSaveName}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
          onClick={() => {
            setIsPasswordModalOpen(false);
            setError("");
          }}
        >
          <div
            className="bg-[#F1EFE1] py-16 px-10 rounded-[10px] max-w-2xl w-[90%] sm:w-[80%]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-[#915941]">
              Change Password
            </h2>
            <div className="flex flex-col items-center w-full">
              {[
                {
                  label: "Current Password",
                  value: oldPassword,
                  setter: setOldPassword,
                },
                {
                  label: "New Password",
                  value: newPassword,
                  setter: setNewPassword,
                },
                {
                  label: "Confirm New Password",
                  value: confirmPassword,
                  setter: setConfirmPassword,
                },
              ].map(({ label, value, setter }, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col items-center mb-4"
                >
                  <label className="text-[#000000]/80 text-lg sm:text-xl font-medium mb-2 w-[90%] text-left pl-5">
                    {label}
                  </label>
                  <input
                    type="password"
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    value={value}
                    onChange={(e) => {
                      setter(e.target.value);
                      setError("");
                    }}
                    className="w-[90%] bg-[#D9D9D9] text-[#000000]/80 text-base sm:text-lg font-normal py-3 px-4 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#915941]"
                  />
                </div>
              ))}
              {error && (
                <p className="text-red-500 text-sm mb-4 w-[90%] text-left pl-5">
                  {error}
                </p>
              )}
              <p className="text-[#000000]/80 text-sm sm:text-base font-normal w-[90%] text-left pl-5 mb-4">
                New password must be at least 6 characters.
              </p>
              <button
                className="bg-[#915941] text-[#FFFFFF] text-sm sm:text-xl font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-[10px] hover:bg-[#7A4C36] active:opacity-80 transition-all duration-200"
                onClick={handleSavePassword}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && wellbeingToDelete && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
          onClick={() => {
            setIsDeleteModalOpen(false);
            setError("");
          }}
        >
          <div
            className="bg-[#F1EFE1] py-16 px-10 rounded-[10px] max-w-2xl w-[90%] sm:w-[80%]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-4xl sm:text-5xl font-extrabold text-center mb-8"
              style={{ color: wellbeingToDelete.accentColor }}
            >
              {wellbeingToDelete.name}
            </h2>
            <p className="text-[#000000]/80 text-lg sm:text-xl font-normal text-center mb-8">
              Are you sure you want to remove this well-being? Existing logs will remain.
            </p>
            {error && (
              <p className="text-red-500 text-sm mb-4 w-[90%] text-center">
                {error}
              </p>
            )}
            <div className="flex justify-center">
              <button
                className="bg-[#C82727] text-[#FFFFFF] text-sm sm:text-xl font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-[10px] hover:bg-[#A82323] active:opacity-80 transition-all duration-200"
                onClick={() => handleRemoveWellbeing(wellbeingToDelete._id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;