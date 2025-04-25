import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackForm from './FeedbackForm';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [adminComments, setAdminComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState(null);
  const [errorComments, setErrorComments] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const [newFeedback, setNewFeedback] = useState({ rating: 1, text: '', img: '' });
  const [submitting, setSubmitting] = useState(false);
  const baseurl=import.meta.env.VITE_API_BASE_URL

  // Fetch user and feedbacks once
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser._id;

        const { data: userData } = await axios.get(
          `${baseurl}/api/user/findbyid/${userId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
        );
        setUser(userData.user);

        const { data: fbData } = await axios.get(
          `${baseurl}/api/feedback/findAllfeedbackByUserId/${userId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
        );
        setFeedbacks(fbData.feedback || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile or feedbacks');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch admin comments when tab changes
  useEffect(() => {
    if (activeTab === 'Admincomments') {
      fetchAdminComments();
    }
  }, [activeTab, user]);

  const fetchAdminComments = async () => {
    setLoadingComments(true);
    setErrorComments(null);
    try {
      const userId = user._id;
      const res = await axios.get(
        `${baseurl}/api/feedback/admin-comments/${userId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      setAdminComments(res.data.comments || []);
    } catch (err) {
      console.error(err);
      setErrorComments(err.response?.data?.message || 'Failed to load admin comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser._id;
      const response = await axios.post(
        `${baseurl}/api/feedback/submit`,
        { userId, ...newFeedback },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      setFeedbacks([response.data.feedback, ...feedbacks]);
      setNewFeedback({ rating: 1, text: '', img: '' });
      setActiveTab('feedbacks');
    } catch (err) {
      console.error(err);
      setError('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-l-4 border-r-4 border-b-4 border-purple-500 border-opacity-50 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-t-4 border-purple-600 rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="bg-red-500 bg-opacity-20 backdrop-blur-lg text-white px-8 py-6 rounded-xl shadow-2xl border border-red-500 border-opacity-30">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-red-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-xl font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="bg-yellow-500 bg-opacity-20 backdrop-blur-lg text-white px-8 py-6 rounded-xl shadow-2xl border border-yellow-500 border-opacity-30">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-yellow-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <span className="text-xl font-medium">User not found</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black bg-fixed text-white">
      {/* Glass-like overlay container */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto bg-black bg-opacity-40 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-indigo-500 border-opacity-20">
          
          {/* Header with curved design */}
          <div className="relative">
            {/* Background header with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-90"></div>
            
            {/* Profile content */}
            <div className="relative p-8 flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center mb-6 md:mb-0">
                <div className="relative mb-4 md:mb-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-50 blur-md transform -translate-x-1 translate-y-1"></div>
                  <img
                    src={user.img || 'https://public.nftstatic.com/static/nft/webp/nft-cex/S3/1710350400683_2qnd8b95pwcg2g2exno3qndzxg4bt3h7_600x600.webp'}
                    alt="Profile"
                    className="relative w-28 h-28 rounded-full border-4 border-white object-cover shadow-xl"
                  />
                </div>
                <div className="md:ml-8 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <p className="text-indigo-200 mt-1">{user.email}</p>
                  <div className="mt-2 inline-block px-3 py-1 rounded-full bg-blue-800 bg-opacity-20 text-sm backdrop-blur-sm">
                    {user.role === 'admin' ? (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clipRule="evenodd"></path>
                        </svg>
                        Administrator
                      </span>
                    ) : (
                      <span>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => { localStorage.clear(); window.location.replace('/login'); }}
                className="bg-red-600 bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center space-x-2 hover:shadow-indigo-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Logout</span>
              </button>
            </div>
            
            {/* Curved bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 24" className="w-full h-full">
                <path fill="rgba(0,0,0,0.4)" fillOpacity="1" d="M0,0 C480,24 960,24 1440,0 L1440,24 L0,24 Z"></path>
              </svg>
            </div>
          </div>

          {/* Tabs with beautiful indicators */}
          <div className="px-6 bg-black bg-opacity-50">
            <nav className="flex overflow-x-auto hide-scrollbar">
              {['profile', 'feedbacks', 'addFeedback', 'Admincomments'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-4 font-medium text-sm transition-all duration-300 flex-shrink-0 ${
                    activeTab === tab
                      ? 'text-white'
                      : 'text-gray-400 hover:text-indigo-300'
                  }`}
                >
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
                  )}
                  {{ profile: 'Profile', feedbacks: `Feedbacks (${feedbacks.length})`, addFeedback: 'Add Feedback', Admincomments: 'Admin Comments' }[tab]}
                </button>
              ))}
            </nav>
          </div>

          {/* Content area with custom styling for each tab */}
          <div className="p-8">
            {activeTab === 'profile' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-semibold mb-6 text-indigo-300">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: 'Full Name', value: user.name },
                    { label: 'Email', value: user.email },
                    { label: 'Account Type', value: user.role },
                    { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString() }
                  ].map((item, i) => (
                    <div key={i} className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-6 border border-indigo-500 border-opacity-20 hover:border-opacity-40 transition-all duration-300">
                      <h3 className="text-indigo-300 font-medium mb-2">{item.label}</h3>
                      <p className="text-white text-lg">{item.value}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-6 border border-indigo-500 border-opacity-20">
                  <h3 className="text-xl font-semibold mb-4 text-indigo-300">Account Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{feedbacks.length}</div>
                      <div className="text-gray-400 text-sm">Total Feedbacks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{adminComments.length}</div>
                      <div className="text-gray-400 text-sm">Admin Comments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {Math.round(feedbacks.reduce((acc, fb) => acc + fb.rating, 0) / (feedbacks.length || 1))}
                      </div>
                      <div className="text-gray-400 text-sm">Avg. Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {Math.round((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-gray-400 text-sm">Days Active</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'feedbacks' && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-indigo-300">Feedback History</h2>
                  <button 
                    onClick={() => setActiveTab('addFeedback')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add New
                  </button>
                </div>
                
                {feedbacks.length === 0 ? (
                  <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-12 text-center border border-indigo-500 border-opacity-20">
                    <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                    <p className="text-lg text-gray-400">No feedback submitted yet</p>
                    <button 
                      onClick={() => setActiveTab('addFeedback')}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md transition inline-flex items-center"
                    >
                      Submit Your First Feedback
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {feedbacks.map(fb => (
                      <div key={fb._id} className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-6 border border-indigo-500 border-opacity-20 hover:border-opacity-40 transition-all duration-300">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex items-center mb-4 md:mb-0">
                            <div className="flex items-center bg-black bg-opacity-40 px-3 py-1 rounded-lg">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`w-5 h-5 ${i < fb.rating ? 'text-yellow-400' : 'text-gray-600'}`} 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                              ))}
                            </div>
                            <span className="ml-4 text-gray-400 text-sm flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              {new Date(fb.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {fb.adminComment && (
                            <div className="bg-purple-900 bg-opacity-30 px-3 py-1 rounded-lg text-sm text-purple-300 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                              </svg>
                              Admin Responded
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-white">{fb.text}</p>
                        </div>
                        
                        {fb.img && (
                          <div className="mt-4">
                            <img src={fb.img} alt="Feedback image" className="rounded-lg max-h-48 object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addFeedback' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-semibold mb-6 text-indigo-300">Submit New Feedback</h2>
                <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-8 border border-indigo-500 border-opacity-20">
                  <FeedbackForm />
                </div>
              </div>
            )}

            {activeTab === 'Admincomments' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-semibold mb-6 text-indigo-300">Admin Responses</h2>
                
                {loadingComments ? (
                  <div className="flex justify-center items-center p-12">
                    <div className="w-10 h-10 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                  </div>
                ) : errorComments ? (
                  <div className="bg-red-500 bg-opacity-20 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-lg border border-red-500 border-opacity-30">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{errorComments}</span>
                    </div>
                  </div>
                ) : adminComments.length === 0 ? (
                  <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-12 text-center border border-indigo-500 border-opacity-20">
                    <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <p className="text-lg text-gray-400">No admin comments yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {adminComments.map(c => (
                      <div key={c.feedbackId} className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-6 border border-purple-500 border-opacity-30 hover:border-opacity-50 transition-all duration-300">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-white font-medium">Administrator</h3>
                            <p className="text-gray-400 text-sm">
                              {new Date(c.commentedAt).toLocaleDateString()} at {new Date(c.commentedAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="ml-13 pl-13">
                          <div className="bg-purple-900 bg-opacity-20 rounded-xl p-4 border border-purple-500 border-opacity-20">
                            <p className="text-white">{c.adminComment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-5xl mx-auto mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Your Application. All rights reserved.</p>
        </div>
      </div>
      
      {/* Add global styles */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;