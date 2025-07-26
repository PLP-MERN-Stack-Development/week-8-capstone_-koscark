import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import DashboardNavbar from "./DashboardNavbar";
import Footer from "./Footer";
import AddWellbeingModal from "./AddWellbeingModal";
import landingComplete from "../assets/landing-page-complete.png";
import landingMental from "../assets/landing-page-mental.png";
import landingPhysical from "../assets/landing-page-physical.png";
import landingSocial from "../assets/landing-page-social.png";
import landingFinancial from "../assets/landing-page-financial.png";

// Map well-being names to images
const wellBeingImages = {
  General: landingComplete,
  Mental: landingMental,
  Physical: landingPhysical,
  Social: landingSocial,
  Financial: landingFinancial,
};

// Utility to darken hex color (10%)
function darkenHex(hex) {
  const amt = 25;
  const col = hex.replace("#", "");
  const r = Math.max(0, parseInt(col.substring(0, 2), 16) - amt);
  const g = Math.max(0, parseInt(col.substring(2, 4), 16) - amt);
  const b = Math.max(0, parseInt(col.substring(4, 6), 16) - amt);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function DashboardPage() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const [wellbeings, setWellbeings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [wellbeingStates, setWellbeingStates] = useState({});
  const [wellbeingNotes, setWellbeingNotes] = useState({});

  useEffect(() => {
    const authToken = token || localStorage.getItem('token');
    console.log('DashboardPage useEffect: ', { loading, token, user, authToken });

    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(`Today: ${today.toLocaleDateString("en-US", options)}`);

    const fetchWellbeings = async () => {
      try {
        const response = await axios.get("/api/wellbeings", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setWellbeings(response.data);
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
      setIsModalOpen(false);
      setError("");
      console.log('Well-being added to state:', wellbeing);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message || "Failed to add well-being";
      setError(errorMessage);
      console.error('Add well-being error:', err.response?.data || err.message);
    }
  };

  const handleLogWellbeing = async (wellbeingId) => {
    const authToken = token || localStorage.getItem('token');
    const state = wellbeingStates[wellbeingId] || "";
    const note = wellbeingNotes[wellbeingId] || "";
    if (!state) {
      setError("Please select a state for the well-being");
      return;
    }
    try {
      const response = await axios.post(
        "/api/logs",
        { wellbeingId, state, note, date: new Date().toISOString() },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setWellbeingStates((prev) => ({ ...prev, [wellbeingId]: "" }));
      setWellbeingNotes((prev) => ({ ...prev, [wellbeingId]: "" }));
      setError("");
      console.log('Well-being log added to database:', response.data);
      alert("Well-being logged successfully");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message || "Failed to log well-being";
      setError(errorMessage);
      console.error('Log well-being error:', err.response?.data || err.message);
    }
  };

  const handleStateChange = (wellbeingId, value) => {
    setWellbeingStates((prev) => ({ ...prev, [wellbeingId]: value }));
  };

  const handleNoteChange = (wellbeingId, value) => {
    setWellbeingNotes((prev) => ({ ...prev, [wellbeingId]: value }));
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
            Dashboard
          </h1>
          <p className="text-[#000000]/80 text-xl sm:text-2xl md:text-3xl font-medium text-center mb-6 sm:mb-8 md:mb-10">
            Log your wellbeing today{" "}
            <span className="text-[#3F48CC] font-bold">
              {user?.name || "User"}
            </span>
            !
          </p>
          <p className="text-[#000000]/80 text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-6 sm:mb-8 md:mb-10">
            {currentDate}
          </p>
          {error && (
            <p className="text-red-500 text-sm sm:text-base text-center mb-6 sm:mb-8">
              {error}
            </p>
          )}
          <div className="flex flex-row flex-wrap sm:flex-row justify-center items-center gap-4 mb-6 sm:mb-8 md:mb-10">
            <p className="text-[#000000]/80 text-xl sm:text-2xl md:text-3xl font-medium text-center sm:text-left">
              Add a wellbeing to Log
            </p>
            <button
              className="w-auto bg-[#915941] text-[#FFFFFF] text-lg sm:text-xl font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-[10px] hover:bg-[#7A4C36] active:opacity-80 transition-all duration-200"
              onClick={() => setIsModalOpen(true)}
            >
              Add
            </button>
          </div>
          <p className="text-[#000000]/80 text-lg sm:text-xl md:text-2xl font-normal text-left mb-6 sm:mb-8">
            How are you doing today?
          </p>
          {wellbeings.length === 0 ? (
            <p className="text-[#000000]/80 text-lg sm:text-xl text-center">
              No well-beings found. Add one to start logging!
            </p>
          ) : (
            wellbeings.map((wellbeing) => {
              const hoverColor = darkenHex(wellbeing.accentColor);
              return (
                <div
                  key={wellbeing._id}
                  className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 sm:gap-4 mb-10 sm:mb-14"
                >
                  <div className="flex flex-col sm:flex-row items-center w-full sm:w-1/3 gap-4">
                    <img
                      src={wellBeingImages[wellbeing.name.trim()] || landingComplete}
                      alt={`${wellbeing.name} Wellbeing`}
                      className="w-48 h-auto sm:w-[150px] sm:h-[150px] rounded-[5px]"
                    />
                    <div className="flex flex-col items-center sm:items-start w-full max-w-xs">
                      <p
                        className="text-xl sm:text-2xl font-semibold mb-2"
                        style={{ color: wellbeing.accentColor }}
                      >
                        {wellbeing.name}
                      </p>
                      <select
                        className="w-1/2 sm:w-full bg-[#D9D9D9] text-[#000000]/80 text-base sm:text-lg font-normal py-2 px-4 rounded-[10px] focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ "--tw-ring-color": wellbeing.accentColor }}
                        value={wellbeingStates[wellbeing._id] || ""}
                        onChange={(e) =>
                          handleStateChange(wellbeing._id, e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Select state
                        </option>
                        {[
                          "Very Bad",
                          "Bad",
                          "Slightly Bad",
                          "Okay",
                          "Slightly Good",
                          "Good",
                          "Very Good",
                        ].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3 flex flex-col items-center sm:items-start">
                    <p className="text-[#000000]/80 text-lg sm:text-xl md:text-2xl font-medium mb-2 w-[90%] sm:w-full text-left ml-3 sm:ml-4">
                      Describe your wellbeing:
                    </p>
                    <textarea
                      className="w-[90%] sm:w-full max-w-none bg-[#D9D9D9] text-[#000000]/80 text-base sm:text-lg font-normal py-3 px-4 rounded-[10px] focus:outline-none focus:ring-2 transition-all duration-200 h-24 sm:h-32"
                      style={{ "--tw-ring-color": wellbeing.accentColor }}
                      value={wellbeingNotes[wellbeing._id] || ""}
                      onChange={(e) =>
                        handleNoteChange(wellbeing._id, e.target.value)
                      }
                      placeholder="Enter your notes"
                    />
                  </div>
                  <div className="w-full sm:w-auto flex justify-center sm:justify-end sm:flex-col sm:items-end">
                    <button
                      className="text-white text-base sm:text-lg font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-[10px] hover:brightness-90 active:opacity-80 transition-all duration-200 w-auto"
                      style={{ backgroundColor: wellbeing.accentColor }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = hoverColor)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = wellbeing.accentColor)
                      }
                      onClick={() => handleLogWellbeing(wellbeing._id)}
                    >
                      Log
                    </button>
                  </div>
                </div>
              );
            })
          )}
          <AddWellbeingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddWellbeing}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default DashboardPage;