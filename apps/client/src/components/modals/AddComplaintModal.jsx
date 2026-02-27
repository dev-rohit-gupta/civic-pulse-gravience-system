import React, { useState, useRef } from 'react';
import { Save, XCircle, MapPin, Upload, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AddComplaintModal = ({ onClose }) => {
  const { handleAddComplaint } = useApp();
  const fileInputRef = useRef(null);
  
  const [complaintForm, setComplaintForm] = useState({
    title: '',
    description: '',
    location: {
      address: '',
      coordinates: null, // [lng, lat]
    },
    image: null,
  });
  
  const [errors, setErrors] = useState({});
  const [gpsLoading, setGpsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (field, value) => {
    setComplaintForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleLocationChange = (field, value) => {
    setComplaintForm(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
    setErrors(prev => ({ ...prev, location: null }));
  };

  const fetchGPS = () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, location: 'GPS not supported by your browser' }));
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleLocationChange('coordinates', [longitude, latitude]);
        setGpsLoading(false);
      },
      (error) => {
        console.error('GPS Error:', error);
        setErrors(prev => ({ ...prev, location: 'Unable to get location. Please enter manually.' }));
        setGpsLoading(false);
      }
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
      return;
    }

    setComplaintForm(prev => ({ ...prev, image: file }));
    setErrors(prev => ({ ...prev, image: null }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setComplaintForm(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!complaintForm.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (complaintForm.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (complaintForm.title.trim().length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }

    if (!complaintForm.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (complaintForm.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (complaintForm.description.trim().length > 2000) {
      newErrors.description = 'Description must not exceed 2000 characters';
    }

    // Location is optional, but if provided, validate the address
    // No validation error if location is empty

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const success = await handleAddComplaint(complaintForm);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white overflow-y-auto max-h-full rounded-lg p-8 max-w-2xl w-full my-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Submit New Complaint</h2>
            <p className="text-sm text-gray-500 mt-1">AI will automatically categorize and prioritize your complaint</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Complaint Title *
            </label>
            <input
              type="text"
              value={complaintForm.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-4 py-2.5 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Brief summary of the issue"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={complaintForm.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-2.5 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
              placeholder="Describe the issue in detail..."
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-red-500 text-xs">{errors.description}</p>
              ) : (
                <p className="text-gray-400 text-xs">Min 10 characters</p>
              )}
              <p className="text-gray-400 text-xs">{complaintForm.description.length}/2000</p>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location Address (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={complaintForm.location.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
                className={`flex-1 px-4 py-2.5 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Street, area, city..."
              />
              <button
                type="button"
                onClick={fetchGPS}
                disabled={gpsLoading}
                className="px-4 py-2.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                title="Get current location"
              >
                <MapPin className="w-4 h-4" />
                {gpsLoading ? 'Getting...' : 'GPS'}
              </button>
            </div>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            {complaintForm.location.coordinates && (
              <p className="text-green-600 text-xs mt-1">
                ✓ GPS coordinates captured: {complaintForm.location.coordinates[1].toFixed(4)}, {complaintForm.location.coordinates[0].toFixed(4)}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Supporting Image (Optional)
            </label>
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload image</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>🤖 AI-Powered Processing:</strong> Your complaint will be automatically:
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4">
              <li>• Categorized by type (Roads, Water, Electricity, etc.)</li>
              <li>• Prioritized based on severity and impact</li>
              <li>• Assigned to the relevant department and operator</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Submit Complaint
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddComplaintModal;
