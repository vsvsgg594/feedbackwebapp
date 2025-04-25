import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    text: '',
    rating: 5,
    img: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const baseurl=import.meta.env.VITE_API_BASE_URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, img: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, img: null }));
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const fd = new FormData();
      fd.append('text', formData.text);
      fd.append('rating', formData.rating);
      formData.img && fd.append('img', formData.img);

      await axios.post(`${baseurl}/api/feedback/submit`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setMessage({ text: 'Feedback submitted successfully!', type: 'success' });
      setFormData({ text: '', rating: 5, img: null });
      setPreviewImage(null);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to submit feedback',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl backdrop-blur-sm border flex items-center ${
            message.type === 'success'
              ? 'bg-green-500 bg-opacity-10 border-green-500 border-opacity-20 text-white'
              : 'bg-red-500 bg-opacity-10 border-red-500 border-opacity-20 text-red-400'
          }`}
        >
          <div className="mr-3">
            {message.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
          </div>
          <p>{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Section */}
        <div>
          <label htmlFor="rating" className="block text-indigo-300 font-medium mb-2">
            Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                className="focus:outline-none mr-1"
              >
                <svg 
                  className={`w-10 h-10 transition-all duration-200 ${
                    star <= formData.rating ? 'text-yellow-400 transform scale-105' : 'text-gray-600 hover:text-gray-400'
                  }`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </button>
            ))}
            <span className="ml-3 text-gray-300">
              {formData.rating} Star{formData.rating !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Feedback Text */}
        <div>
          <label htmlFor="text" className="block text-indigo-300 font-medium mb-2">
            Your Feedback
          </label>
          <div className="relative">
            <textarea
              id="text"
              name="text"
              rows="5"
              value={formData.text}
              onChange={handleChange}
              placeholder="Share your thoughts and experience..."
              className="w-full bg-black bg-opacity-40 backdrop-blur-sm placeholder-gray-500 text-white border border-indigo-500 border-opacity-30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner transition-all duration-200"
              required
            />
            <div className="absolute bottom-3 right-3 text-gray-500 text-sm">
              {formData.text.length} characters
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="img" className="block text-indigo-300 font-medium mb-2">
            Add Image (Optional)
          </label>
          
          {previewImage ? (
            <div className="relative mt-2 bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-4 border border-indigo-500 border-opacity-30">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full max-h-60 object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 bg-opacity-70 hover:bg-opacity-100 text-white rounded-full p-1 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ) : (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-indigo-500 border-opacity-30 border-dashed rounded-xl hover:border-opacity-50 transition-all duration-200 bg-black bg-opacity-40 backdrop-blur-sm">
              <div className="space-y-2 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-400">
                  <label
                    htmlFor="img"
                    className="relative cursor-pointer bg-indigo-600 rounded-md font-medium text-white hover:bg-indigo-500 px-3 py-2 transition-all duration-200"
                  >
                    <span>Upload Image</span>
                    <input 
                      id="img" 
                      name="img" 
                      type="file" 
                      accept="image/*"
                      className="sr-only" 
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-3 pt-2">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 ${
              isSubmitting
                ? 'bg-gray-600 cursor-wait'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transform hover:translate-y-0.5 shadow-lg hover:shadow-indigo-500/30'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;