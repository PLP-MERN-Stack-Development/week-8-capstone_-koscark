import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import landingComplete from '../assets/landing-page-complete.png';
import landingMental from '../assets/landing-page-mental.png';
import landingPhysical from '../assets/landing-page-physical.png';
import landingSocial from '../assets/landing-page-social.png';
import landingFinancial from '../assets/landing-page-financial.png';
import landingMore from '../assets/landing-page-more.png';

function LandingPage() {
  const [wellbeings, setWellbeings] = useState([]);

  useEffect(() => {
    const fetchWellbeings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Use fallback well-beings for non-authenticated users
        setWellbeings([
          { name: 'General', accentColor: '#3F48CC' },
          { name: 'Mental', accentColor: '#764986' },
          { name: 'Physical', accentColor: '#0F7D97' },
          { name: 'Social', accentColor: '#E55118' },
          { name: 'Financial', accentColor: '#379587' },
          { name: 'Add yours...', accentColor: '#915941' },
        ]);
        return;
      }

      try {
        const res = await axios.get('/api/wellbeings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWellbeings(res.data);
      } catch {
        // Fallback to default well-beings if API fails
        setWellbeings([
          { name: 'General', accentColor: '#3F48CC' },
          { name: 'Mental', accentColor: '#764986' },
          { name: 'Physical', accentColor: '#0F7D97' },
          { name: 'Social', accentColor: '#E55118' },
          { name: 'Financial', accentColor: '#379587' },
          { name: 'Add yours...', accentColor: '#915941' },
        ]);
      }
    };
    fetchWellbeings();
  }, []);

  const wellbeingImages = {
    General: landingComplete,
    Mental: landingMental,
    Physical: landingPhysical,
    Social: landingSocial,
    Financial: landingFinancial,
    'Add yours...': landingMore,
  };

  const wellbeingBackgrounds = {
    General: '#3a3f6d',
    Mental: '#493039',
    Physical: '#325058',
    Social: '#944d30',
    Financial: '#2c4743',
    'Add yours...': '#4f3a30',
  };

  return (
    <div className="min-h-screen bg-[#F1EFE1]">
      <Navbar />
      <main className="pt-16 sm:pt-20 md:pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-[#E55118] text-4xl sm:text-5xl font-extrabold mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-16 text-center sm:text-left pl-2 sm:pl-4 md:pl-6">
            Simple, Personal,
            <br className="block sm:hidden" /> Insightful.
          </h1>
          <div className="flex justify-center sm:justify-start mb-12 sm:mb-16">
            <Link
              to="/signup"
              className="bg-[#3F48CC] text-white text-lg font-medium py-3 px-6 rounded-[10px] hover:bg-[#2E37A4] transition-all duration-200"
            >
              Get Stated
            </Link>
          </div>

          <div className="space-y-20 sm:space-y-24 md:space-y-28">
            {wellbeings.map(({ name, accentColor }, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 1 ? 'sm:flex-row-reverse' : 'sm:flex-row'
                } items-center sm:justify-between gap-4 sm:gap-6`}
              >
                {/* Text */}
                <div className="sm:w-2/5 flex flex-col justify-center">
                  <h2
                    className="text-xl sm:text-2xl md:text-3xl font-bold mb-4"
                    style={{ color: accentColor }}
                  >
                    {name}
                  </h2>
                  <p className="text-[#000000]/80 text-lg sm:text-xl md:text-2xl font-medium">
                    {name === 'Add yours...'
                      ? 'Add a wellbeing you would like to log and review your notes to reflect on your progress.'
                      : 'Log your wellbeing and review your notes to reflect on your progress. Logging is as simple as selecting a state from a set of options and writing how you feel.'}
                  </p>
                  {name === 'Add yours...' && (
                    <Link
                      to="/login"
                      className="mt-4 bg-[#915941] text-white text-lg font-medium py-2 px-4 rounded-[10px] hover:bg-[#7a4a35] transition-all duration-200 w-fit"
                    >
                      Add
                    </Link>
                  )}
                </div>

                {/* Image Container */}
                <div
                  className="w-full sm:w-1/2 h-[200px] sm:h-[250px] md:h-[300px] bg-cover bg-center overflow-hidden rounded-none sm:rounded-[10px]"
                  style={{ backgroundColor: wellbeingBackgrounds[name] }}
                >
                  <img
                    src={wellbeingImages[name]}
                    alt={`${name} Wellbeing`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <div />
    </div>
  );
}

export default LandingPage;