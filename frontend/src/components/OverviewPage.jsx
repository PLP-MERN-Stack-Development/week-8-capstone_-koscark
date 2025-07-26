import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import DashboardNavbar from "./DashboardNavbar";
import Footer from "./Footer";
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

// Utility to darken hex color
function darkenHex(hex) {
  const amt = 25;
  const col = hex.replace("#", "");
  const r = Math.max(0, parseInt(col.substring(0, 2), 16) - amt);
  const g = Math.max(0, parseInt(col.substring(2, 4), 16) - amt);
  const b = Math.max(0, parseInt(col.substring(4, 6), 16) - amt);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function OverviewPage() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentDate, setCurrentDate] = useState("");
  const [loggedDays, setLoggedDays] = useState(0);
  const [wellbeings, setWellbeings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const authToken = token || localStorage.getItem('token');
    console.log('OverviewPage useEffect: ', { loading, token, user, authToken });

    // Set current date based on selected date
    const date = new Date(selectedDate);
    setCurrentDate(
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    // Fetch logged days and well-being logs
    const fetchData = async () => {
      try {
        // Fetch total logged days
        const daysResponse = await axios.get("/api/logs/count", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setLoggedDays(daysResponse.data.count);

        // Fetch logs for selected date
        const logsResponse = await axios.get(`/api/logs?date=${selectedDate}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setWellbeings(logsResponse.data.map(log => ({
          name: log.wellbeingName,
          state: log.state,
          note: log.note,
          color: log.wellbeingAccentColor,
          image: wellBeingImages[log.wellbeingName.trim()] || landingComplete,
        })));
        setError("");
      } catch (err) {
        const errorMessage =
          err.response?.data?.error?.message || "Failed to fetch data";
        setError(errorMessage);
        console.error('Fetch data error:', err.response?.data || err.message);
        if (err.response?.status === 401) {
          console.log('Redirecting to /login due to 401');
          navigate("/login", { replace: true });
        }
      }
    };

    if (!loading && authToken) {
      fetchData();
    } else if (!loading && !authToken) {
      console.log('Redirecting to /login due to missing token');
      navigate("/login", { replace: true });
    }
  }, [loading, token, user, selectedDate, navigate]);

  return (
    <div className="min-h-screen bg-[#F1EFE1] flex flex-col overflow-x-hidden relative">
      <DashboardNavbar />
      <main className="flex-grow pt-16 sm:pt-20 md:pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-[#915941] text-4xl sm:text-5xl font-extrabold my-12 sm:mt-16 md:mt-24 sm:mb-16 md:mb-24 text-left pl-2 sm:pl-4 md:pl-6">
            Overview
          </h1>

          <p className="text-[#000000]/80 text-xl sm:text-2xl md:text-3xl font-medium text-center mb-6 sm:mb-8 md:mb-10">
            You've logged for{" "}
            <span className="text-[#3F48CC] font-bold">{loggedDays}</span> days!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 sm:mb-8 md:mb-10">
            <p className="text-[#000000]/80 text-xl sm:text-2xl md:text-3xl font-normal text-left mb-2 sm:mb-0">
              Viewing logged wellbeing for:
            </p>
            <input
              type="date"
              className="bg-[#D9D9D9] text-[#000000]/80 text-base sm:text-lg font-normal py-2 px-4 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#3F48CC] transition-all duration-200 w-1/2 sm:w-auto sm:h-[38px] md:h-[42px]"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <p className="text-[#000000]/80 text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-10 sm:mb-12 md:mb-14">
            {currentDate}
          </p>

          {error && (
            <p className="text-red-500 text-sm sm:text-base text-center mb-6 sm:mb-8">
              {error}
            </p>
          )}

          {wellbeings.length === 0 ? (
            <p className="text-[#000000]/80 text-lg sm:text-xl md:text-2xl font-normal text-center mb-0 ml-[5%]">
              You did not log your wellbeing on this day.
            </p>
          ) : (
            wellbeings.map((wellbeing, index) => {
              const hoverColor = darkenHex(wellbeing.color);
              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 sm:gap-4 mb-6 sm:mb-[84px]"
                >
                  {/* Image and State */}
                  <div className="flex flex-col sm:flex-row items-center w-full sm:w-1/3 gap-4">
                    <img
                      src={wellbeing.image}
                      alt={`${wellbeing.name} Wellbeing`}
                      className="w-48 h-auto sm:w-[150px] sm:h-[150px] rounded-[5px]"
                    />
                    <div className="flex flex-col items-center sm:items-start w-full max-w-xs">
                      <p
                        className="text-xl sm:text-2xl font-semibold mb-2"
                        style={{ color: wellbeing.color }}
                      >
                        {wellbeing.name}
                      </p>
                      <p className="text-[#000000]/80 text-lg sm:text-xl font-medium">
                        {wellbeing.state}
                      </p>
                    </div>
                  </div>

                  {/* Note Section */}
                  <div className="w-full sm:w-1/3 flex flex-col items-start justify-center gap-2">
                    <p className="text-[#000000]/80 text-lg sm:text-xl md:text-2xl font-medium mb-0 ml-[5%]">
                      Your note:
                    </p>
                    <p
                      className="w-[90%] text-[#000000]/80 text-base sm:text-xl md:text-2xl font-medium py-3 px-4 rounded-[10px]"
                    >
                      {wellbeing.note || "No note provided."}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default OverviewPage;