import { useState } from 'react';
import axios from 'axios';
import moreImage from '../assets/landing-page-more.png';

const AddWellbeingModal = ({ isOpen, onClose, onSave }) => {
  const [newWellbeingName, setNewWellbeingName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!newWellbeingName.trim()) {
      setError('Well-being name is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/wellbeings',
        { name: newWellbeingName }, // Send original name with spaces
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSave(res.data); // Pass full well-being object
      setNewWellbeingName('');
      setError('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to add well-being');
      console.error('AddWellbeingModal: Failed to add well-being:', err.response?.data || err.message);
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#F1EFE1] py-16 px-10 rounded-[10px] max-w-2xl w-[90%] sm:w-[80%] mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={moreImage}
          alt="Add Wellbeing"
          className="w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-6 sm:mb-8 object-contain rounded-[8px]"
        />
        <h2 className="text-[#915941] text-4xl sm:text-5xl font-extrabold text-center mb-6 sm:mb-8">
          Add a Well-being
        </h2>
        <div className="flex flex-col items-center">
          <label className="text-[#000000]/80 text-lg sm:text-xl font-medium mb-2 w-[90%] sm:w-[80%] text-left pl-5">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your well-being"
            className="w-[90%] sm:w-[80%] bg-[#D9D9D9] text-[#000000]/80 text-base sm:text-lg font-normal py-3 px-4 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#915941] transition-all duration-200 mb-6 sm:mb-8"
            value={newWellbeingName}
            onChange={(e) => {
              setNewWellbeingName(e.target.value);
              setError('');
            }}
          />
          {error && (
            <p className="text-red-500 text-sm mb-4 w-[90%] sm:w-[80%] text-left pl-5">
              {error}
            </p>
          )}
          <button
            className="w-auto bg-[#915941] text-[#FFFFFF] text-sm sm:text-xl font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-[10px] hover:bg-[#7a4a35] active:opacity-80 transition-all duration-200 whitespace-nowrap"
            onClick={handleSave}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWellbeingModal;