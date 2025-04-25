import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaSort, FaUser, FaFilter, FaComment, FaReply, FaHeart, FaEye } from 'react-icons/fa';

const AdminDashboard = () => {
const baseurl=import.meta.env.VITE_API_BASE_URL
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [filterRating, setFilterRating] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUser, setSelectedUser] = useState('');

  // Admin comment input state per feedback
  const [commentText, setCommentText] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [filterRating, sortOrder, selectedUser, activeTab]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${baseurl}/api/user/getuser`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setUsers(Array.isArray(res.data.users) ? res.data.users : []);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError('');

    try {
      let res;
      if (selectedUser) {
        res = await axios.get(
          `${baseurl}/api/feedback/findAllfeedbackByUserId/${selectedUser}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
        );
        console.log("hskjdckzsjc",feedbacks);
        
        
        setFeedbacks(res.data.feedback || []);
      } else {
        let url = `${baseurl}/api/feedback`;
        const params = [];
        if (filterRating) params.push(`rating=${filterRating}`);
        if (sortOrder) params.push(`sort=${sortOrder === 'desc' ? '-createdAt' : 'createdAt'}`);
        if (params.length) url += `?${params.join('&')}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        let result = Array.isArray(response.data.feedback) ? response.data.feedback : [];
        
        // Filter by tab
        if (activeTab === 'pending') {
          result = result.filter(fb => !fb.adminComment || fb.adminComment.trim() === '');
        } else if (activeTab === 'replied') {
          result = result.filter(fb => fb.adminComment && fb.adminComment.trim() !== '');
        }
        console.log("skjdc",feedbacks);
        
        
        setFeedbacks(result);
      }
    } catch (err) {
      console.error(err);
    //   setError('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (feedbackId) => {
    const text = commentText[feedbackId];
    if (!text) return;
    setSubmittingComment(prev => ({ ...prev, [feedbackId]: true }));

    try {
      await axios.put(

        `${baseurl}/api/auth/feedback/${feedbackId}/admin-comment`,
        { adminComment: text },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      fetchFeedbacks();
      setCommentText(prev => ({ ...prev, [feedbackId]: '' }));
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmittingComment(prev => ({ ...prev, [feedbackId]: false }));
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filterRating !== null) count++;
    if (selectedUser !== '') count++;
    return count;
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 5: return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 4: return 'bg-gradient-to-r from-blue-500 to-teal-400';
      case 3: return 'bg-gradient-to-r from-green-500 to-lime-400';
      case 2: return 'bg-gradient-to-r from-yellow-500 to-amber-400';
      case 1: return 'bg-gradient-to-r from-red-500 to-orange-400';
      default: return 'bg-gray-200';
    }
  };

  const getRatingTextColor = (rating) => {
    switch (rating) {
      case 5: return 'text-purple-600';
      case 4: return 'text-blue-600';
      case 3: return 'text-green-600';
      case 2: return 'text-yellow-600';
      case 1: return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              Admin Dashboard
            </h1>
            <p className="text-purple-200 mt-1">Manage user feedback with style</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gray-800 bg-opacity-50 backdrop-blur-sm px-4 py-2 rounded-lg text-pink-300 border border-purple-500/30 hover:border-pink-500/50 hover:text-pink-200 transition shadow-lg hover:shadow-pink-500/20"
            >
              <FaFilter />
              <span>Filters</span>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => fetchFeedbacks()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg hover:shadow-pink-500/20"
            >
              Refresh
            </button>
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
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-xl shadow-xl border border-purple-500/20 p-6 mb-8 animate-fadeIn">
            <h2 className="text-lg font-semibold text-pink-300 mb-4">Filter Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Filter by User</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-purple-400" />
                  <select
                    value={selectedUser}
                    onChange={e => setSelectedUser(e.target.value)}
                    className="pl-10 w-full py-2 bg-gray-900 bg-opacity-70 border border-purple-500/40 text-white rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">All Users</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Filter by Rating</label>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map(r => (
                    <button
                      key={r}
                      onClick={() => setFilterRating(filterRating === r ? null : r)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition shadow-lg ${
                        filterRating === r 
                          ? getRatingColor(r) + ' text-white' 
                          : 'bg-gray-900 bg-opacity-70 border border-purple-500/40 ' + getRatingTextColor(r)
                      }`}
                    >
                      <FaStar className={filterRating === r ? 'text-white' : 'text-yellow-400'} />
                      <span>{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Sort by Date</label>
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 bg-opacity-70 w-full text-purple-200 rounded-lg hover:bg-purple-900 hover:bg-opacity-50 border border-purple-500/40 transition"
                >
                  <FaSort className="text-purple-400" />
                  <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
                </button>

              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => {
                  setFilterRating(null);
                  setSelectedUser('');
                  setSortOrder('desc');
                }}
                className="text-pink-300 hover:text-pink-200 mr-4 hover:underline"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="bg-gray-900 bg-opacity-70 text-pink-300 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-lg transition ${
              activeTab === 'all' 
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-purple-500/30' 
              : 'bg-gray-800 bg-opacity-50 text-gray-300 hover:text-white'
            }`}
          >
            All Feedback
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 rounded-lg transition ${
              activeTab === 'pending' 
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-orange-500/30' 
              : 'bg-gray-800 bg-opacity-50 text-gray-300 hover:text-white'
            }`}
          >
            Pending Replies
          </button>
          <button 
            onClick={() => setActiveTab('replied')}
            className={`px-6 py-2 rounded-lg transition ${
              activeTab === 'replied' 
              ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg shadow-green-500/30' 
              : 'bg-gray-800 bg-opacity-50 text-gray-300 hover:text-white'
            }`}
          >
            Replied
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border-l-4 border-purple-500 backdrop-blur-lg">
            <div className="text-sm text-purple-300 mb-1">Total Feedbacks</div>
            <div className="text-3xl font-bold text-white">{feedbacks.length}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border-l-4 border-pink-500 backdrop-blur-lg">
            <div className="text-sm text-pink-300 mb-1">Average Rating</div>
            <div className="text-3xl font-bold text-white">
              {feedbacks.length ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1) : '0.0'}
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border-l-4 border-green-500 backdrop-blur-lg">
            <div className="text-sm text-green-300 mb-1">Replied</div>
            <div className="text-3xl font-bold text-white">
              {feedbacks.filter(fb => fb.adminComment && fb.adminComment.trim() !== '').length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border-l-4 border-orange-500 backdrop-blur-lg">
            <div className="text-sm text-orange-300 mb-1">Pending Replies</div>
            <div className="text-3xl font-bold text-white">
              {feedbacks.filter(fb => !fb.adminComment || fb.adminComment.trim() === '').length}
            </div>
          </div>
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-t-4 border-b-4 border-pink-500 rounded-full animate-spin mb-4"></div>
              <p className="text-purple-300">Loading feedbacks...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-30 border border-red-500 text-red-200 p-6 rounded-xl text-center">
            <p className="font-medium text-xl mb-2">{error}</p>
            <button 
              onClick={fetchFeedbacks}
              className="mt-2 bg-red-700 px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Try Again
            </button>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-xl border border-purple-500/20 flex flex-col items-center justify-center py-16">
            <FaComment className="text-purple-400 text-5xl mb-4" />
            <p className="text-pink-300 text-xl mb-1">No feedbacks found</p>
            <p className="text-purple-300 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {feedbacks.map(fb => (
              <div 
                key={fb._id} 
                className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-xl border border-purple-500/20 hover:border-pink-500/30 overflow-hidden group transition-all duration-300 hover:shadow-pink-500/20"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            size={20}
                            className={`${i < fb.rating ? 'text-yellow-400' : 'text-gray-600'} transform ${i < fb.rating ? 'scale-110' : 'scale-100'} transition-transform`}
                          />
                        ))}
                        <span className={`ml-2 font-bold ${getRatingTextColor(fb.rating)}`}>{fb.rating}/5</span>
                      </div>
                      <span className="text-purple-300 text-sm mt-2">
                        {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'Unknown date'}
                      </span>
                    </div>
                    <div className="flex items-center bg-purple-900 bg-opacity-50 px-3 py-1 rounded-full">
                      <FaUser className="text-pink-300 mr-2" size={12} />
                      <span className="text-sm text-purple-200 font-medium">{fb.user?.name ?? 'Unknown user'}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-white leading-relaxed">{fb.text}</p>
                  </div>
                  
                  {fb.img && (
                    <div className="mb-6 rounded-lg overflow-hidden relative group">
                      <img 
                        src={fb.img} 
                        alt="Feedback image" 
                        className="w-full h-48 object-cover transition transform duration-300 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <button className="bg-pink-600 text-white px-4 py-1 rounded-full flex items-center gap-1 text-sm">
                          <FaEye /> View Full Image
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Admin Comment Section */}
                  <div className="mt-6 pt-4 border-t border-purple-500/20">
                    <div className="flex items-center mb-3">
                      <FaReply className="text-pink-400 mr-2" />
                      <h4 className="font-medium text-pink-300">Admin Response</h4>
                    </div>
                    
                    {fb.adminComment ? (
                      <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg text-purple-100 mb-4 border border-purple-500/20">
                        {fb.adminComment}
                      </div>
                    ) : (
                      <div className="bg-orange-900 bg-opacity-20 p-3 rounded-lg text-orange-300 text-sm mb-4 border border-orange-500/20">
                        <span className="flex items-center gap-2">
                          <FaHeart className="text-pink-500 animate-pulse" /> No response yet
                        </span>
                      </div>
                    )}

                    <div className="flex mt-4">
                      <input
                        type="text"
                        placeholder="Add or update response..."
                        value={commentText[fb._id] || ''}
                        onChange={e => setCommentText(prev => ({ ...prev, [fb._id]: e.target.value }))}
                        className="flex-1 bg-gray-900 bg-opacity-70 border border-purple-500/40 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-purple-300"
                      />
                      <button
                        onClick={() => handleAddComment(fb._id)}
                        disabled={submittingComment[fb._id] || !commentText[fb._id]}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 rounded-r-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-pink-500/30"
                      >
                        {submittingComment[fb._id] ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;