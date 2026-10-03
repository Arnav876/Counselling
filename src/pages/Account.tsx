import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { authService } from '../services/authService';
import type { SavedCollegeItem, ConversationItem, StudentEnquiry, DirectContact } from '../types/auth';

export const Account: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading, logout, openAuthModal, toggleSaveCollege } = useAuth();
  const { showToast } = useCompare();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') || 'saved';

  const [savedColleges, setSavedColleges] = useState<SavedCollegeItem[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);
  const [enquiries, setEnquiries] = useState<StudentEnquiry[]>([]);
  const [contacts, setContacts] = useState<DirectContact[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      openAuthModal();
    }
  }, [authLoading, isAuthenticated, openAuthModal]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadTabData = async () => {
      setLoadingData(true);
      try {
        if (activeTab === 'saved') {
          const list = await authService.getSavedColleges();
          setSavedColleges(list);
        } else if (activeTab === 'chat') {
          const list = await authService.getMyConversations();
          setConversations(list);
        } else if (activeTab === 'enquiries') {
          const [enqList, conList] = await Promise.all([
            authService.getMyEnquiries(),
            authService.getMyContacts()
          ]);
          setEnquiries(enqList);
          setContacts(conList);
        }
      } catch (err) {
        console.error('Error loading account tab data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadTabData();
  }, [activeTab, isAuthenticated]);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
    setSelectedConversation(null);
  };

  const handleRemoveSaved = async (collegeId: string, collegeName: string) => {
    try {
      await toggleSaveCollege(collegeId);
      setSavedColleges(prev => prev.filter(item => item.college.id !== collegeId));
      showToast(`${collegeName} removed from saved list`);
    } catch {
      showToast('Failed to remove college');
    }
  };

  const handleViewConversation = async (convId: string) => {
    try {
      setLoadingData(true);
      const conv = await authService.getMyConversationById(convId);
      setSelectedConversation(conv);
    } catch {
      showToast('Failed to load conversation details');
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteConversation = async (convId: string) => {
    try {
      await authService.deleteMyConversation(convId);
      setConversations(prev => prev.filter(c => c.id !== convId));
      if (selectedConversation?.id === convId) {
        setSelectedConversation(null);
      }
      showToast('Conversation deleted');
    } catch {
      showToast('Failed to delete conversation');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7FAFD] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0757C9] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-[#12305A]">Loading student account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#F7FAFD] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#DCE5EF] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#0757C9]/10 text-[#0757C9] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">lock</span>
          </div>
          <h2 className="text-2xl font-bold text-[#12305A] mb-2">Student Portal Sign In</h2>
          <p className="text-sm text-[#5F6F82] mb-6">
            Please sign in with your Google account to access your saved colleges, AI chat history, and admission requests.
          </p>
          <button
            onClick={openAuthModal}
            className="w-full py-3 px-4 rounded-xl bg-[#0757C9] hover:bg-[#06449E] text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFD] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Banner */}
        <div className="bg-white rounded-2xl border border-[#DCE5EF] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0757C9&color=fff&size=128`}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-[#0757C9]/10 border border-[#DCE5EF]"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-extrabold text-[#12305A]">{user.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  user.role === 'SUPER_ADMIN'
                    ? 'bg-[#12305A] text-white border border-[#12305A]'
                    : user.role === 'ADMIN'
                    ? 'bg-[#0757C9]/10 text-[#0757C9] border border-[#0757C9]/30'
                    : 'bg-[#159EAE]/10 text-[#159EAE] border border-[#159EAE]/30'
                }`}>
                  {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'ADMIN' ? 'Administrator' : 'Verified Student'}
                </span>
              </div>
              <p className="text-sm text-[#5F6F82] flex items-center gap-1.5 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">mail</span>
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {user.role !== 'STUDENT' && (
              <Link
                to="/admin"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0757C9] text-white text-xs font-semibold hover:bg-[#06449E] transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                <span>Admin Portal</span>
              </Link>
            )}

            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/');
                showToast('Signed out successfully');
              }}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DCE5EF] bg-white text-[#12305A] text-xs font-semibold hover:bg-[#F7FAFD] hover:text-red-600 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#DCE5EF] gap-2 overflow-x-auto pb-px">
          <button
            type="button"
            onClick={() => handleTabChange('saved')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'saved'
                ? 'border-[#0757C9] text-[#0757C9]'
                : 'border-transparent text-[#5F6F82] hover:text-[#12305A]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
            <span>Saved Colleges</span>
            {savedColleges.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-[#0757C9]/10 text-[#0757C9] text-xs">
                {savedColleges.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('chat')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-[#0757C9] text-[#0757C9]'
                : 'border-transparent text-[#5F6F82] hover:text-[#12305A]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            <span>AI Conversations</span>
            {conversations.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-[#159EAE]/10 text-[#087C8B] text-xs">
                {conversations.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('enquiries')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'enquiries'
                ? 'border-[#0757C9] text-[#0757C9]'
                : 'border-transparent text-[#5F6F82] hover:text-[#12305A]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">assignment</span>
            <span>My Enquiries & Requests</span>
            {(enquiries.length > 0 || contacts.length > 0) && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-[#FFBE2E]/20 text-[#8F6500] text-xs font-bold">
                {enquiries.length + contacts.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('profile')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[#0757C9] text-[#0757C9]'
                : 'border-transparent text-[#5F6F82] hover:text-[#12305A]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            <span>Account Details</span>
          </button>
        </div>

        {/* Tab Content */}
        {loadingData ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-3 border-[#0757C9] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-[#5F6F82]">Loading your records...</p>
          </div>
        ) : (
          <div>
            {/* 1. SAVED COLLEGES TAB */}
            {activeTab === 'saved' && (
              <div className="space-y-4">
                {savedColleges.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#DCE5EF] p-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-[#0757C9]/10 text-[#0757C9] flex items-center justify-center mx-auto mb-3">
                      <span className="material-symbols-outlined text-[28px]">bookmark_border</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#12305A] mb-1">No Saved Colleges Yet</h3>
                    <p className="text-xs text-[#5F6F82] max-w-sm mx-auto mb-5">
                      Explore colleges and click the bookmark button on any college card to save it for quick review and comparison.
                    </p>
                    <Link
                      to="/colleges"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0757C9] text-white text-xs font-semibold hover:bg-[#06449E] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">search</span>
                      <span>Explore Medical Colleges</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedColleges.map(({ college }) => (
                      <div
                        key={college.id}
                        className="bg-white rounded-2xl border border-[#DCE5EF] hover:border-[#0757C9] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div className="relative h-44 overflow-hidden bg-slate-100">
                          <img
                            src={college.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80'}
                            alt={college.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-[#12305A] shadow-xs">
                            ⭐ {college.rating} ★
                          </div>
                          <button
                            type="button"
                            title="Remove from saved"
                            onClick={() => handleRemoveSaved(college.id, college.name)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 text-[#0757C9] flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[20px] font-fill">bookmark</span>
                          </button>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-[#5F6F82] mb-1">
                              <span className="material-symbols-outlined text-[14px]">location_on</span>
                              <span>{college.city}, {college.state}</span>
                            </div>
                            <h4 className="font-bold text-[#12305A] text-base line-clamp-2 mb-2">
                              {college.name}
                            </h4>
                            <div className="flex items-center gap-2 flex-wrap mb-4">
                              <span className="px-2 py-0.5 rounded-md bg-[#F7FAFD] border border-[#DCE5EF] text-[11px] font-medium text-[#12305A]">
                                {college.management || 'Private'}
                              </span>
                              {college.mbbsSeats && college.mbbsSeats > 0 ? (
                                <span className="px-2 py-0.5 rounded-md bg-teal-50 text-[#087C8B] border border-teal-100 text-[11px] font-semibold">
                                  {college.mbbsSeats} MBBS Seats
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#DCE5EF] flex items-center gap-2">
                            <Link
                              to={`/colleges?search=${encodeURIComponent(college.name)}`}
                              className="flex-1 py-2 px-3 rounded-lg bg-[#0757C9] hover:bg-[#06449E] text-white text-xs font-semibold text-center transition-colors shadow-xs"
                            >
                              View College
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleRemoveSaved(college.id, college.name)}
                              className="p-2 rounded-lg border border-[#DCE5EF] hover:bg-red-50 text-[#5F6F82] hover:text-red-600 transition-colors"
                              title="Remove"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. AI CONVERSATIONS TAB */}
            {activeTab === 'chat' && (
              <div className="space-y-4">
                {selectedConversation ? (
                  <div className="bg-white rounded-2xl border border-[#DCE5EF] p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-[#DCE5EF]">
                      <div>
                        <button
                          type="button"
                          onClick={() => setSelectedConversation(null)}
                          className="inline-flex items-center gap-1 text-xs text-[#0757C9] hover:underline font-semibold mb-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                          <span>Back to all conversations</span>
                        </button>
                        <h3 className="text-lg font-bold text-[#12305A]">{selectedConversation.title}</h3>
                        <p className="text-xs text-[#5F6F82]">
                          Saved on {new Date(selectedConversation.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteConversation(selectedConversation.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto p-2">
                      {selectedConversation.messages?.map((msg, i) => (
                        <div
                          key={msg.id || i}
                          className={`flex gap-3 ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.role === 'ASSISTANT' && (
                            <div className="w-8 h-8 rounded-full bg-[#0757C9] text-white flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                            </div>
                          )}
                          <div
                            className={`max-w-[85%] rounded-2xl p-4 text-xs ${
                              msg.role === 'USER'
                                ? 'bg-[#0757C9] text-white rounded-tr-xs'
                                : 'bg-[#F7FAFD] border border-[#DCE5EF] text-[#12305A] rounded-tl-xs whitespace-pre-wrap'
                            }`}
                          >
                            <p className="font-semibold mb-1 opacity-75">
                              {msg.role === 'USER' ? 'You' : 'College Advisor AI'}
                            </p>
                            <div>{msg.content}</div>
                          </div>
                          {msg.role === 'USER' && (
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 font-bold text-xs text-[#12305A]">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#DCE5EF] p-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-[#159EAE]/10 text-[#087C8B] flex items-center justify-center mx-auto mb-3">
                      <span className="material-symbols-outlined text-[28px]">smart_toy</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#12305A] mb-1">No AI Conversations Yet</h3>
                    <p className="text-xs text-[#5F6F82] max-w-sm mx-auto mb-5">
                      Open the College Advisor AI chatbot at the bottom right corner to get personalized medical admission recommendations.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className="bg-white rounded-2xl border border-[#DCE5EF] hover:border-[#0757C9] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-[#159EAE]/10 text-[#087C8B] text-[10px] font-bold uppercase tracking-wider">
                              AI Advisory Session
                            </span>
                            <span className="text-[11px] text-[#5F6F82]">
                              {new Date(conv.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-bold text-[#12305A] text-sm group-hover:text-[#0757C9] transition-colors line-clamp-1 mb-1">
                            {conv.title}
                          </h4>
                          {conv.messages?.[0] && (
                            <p className="text-xs text-[#5F6F82] line-clamp-2">
                              {conv.messages[0].content}
                            </p>
                          )}
                        </div>

                        <div className="pt-4 mt-4 border-t border-[#DCE5EF] flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleViewConversation(conv.id)}
                            className="text-xs font-semibold text-[#0757C9] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>View Full Dialogue</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteConversation(conv.id)}
                            className="p-1 rounded text-[#5F6F82] hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. MY ENQUIRIES TAB */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6">
                {/* College Enquiries */}
                <div className="bg-white rounded-2xl border border-[#DCE5EF] p-6 shadow-sm">
                  <h3 className="text-base font-bold text-[#12305A] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#0757C9]">assignment</span>
                    <span>Direct College Enquiries</span>
                  </h3>
                  {enquiries.length === 0 ? (
                    <p className="text-xs text-[#5F6F82] italic py-2">No college admission enquiries registered yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {enquiries.map((enq) => (
                        <div
                          key={enq.id}
                          className="p-4 rounded-xl border border-[#DCE5EF] bg-[#F7FAFD] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm text-[#12305A]">{enq.collegeName}</span>
                              <span className="text-xs text-[#5F6F82]">({enq.preferredCourse})</span>
                            </div>
                            <p className="text-xs text-[#5F6F82]">
                              Student: <span className="font-semibold text-[#12305A]">{enq.studentName}</span> • Phone: {enq.phone}
                            </p>
                            {enq.notes && <p className="text-xs text-[#5F6F82] mt-1">Note: {enq.notes}</p>}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              enq.status === 'RESOLVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : enq.status === 'IN_PROGRESS'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {enq.status === 'RESOLVED' ? 'Resolved' : enq.status === 'IN_PROGRESS' ? 'In Progress' : 'New / Submitted'}
                            </span>
                            <span className="text-[11px] text-[#5F6F82]">
                              {new Date(enq.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* General Consultation Requests */}
                <div className="bg-white rounded-2xl border border-[#DCE5EF] p-6 shadow-sm">
                  <h3 className="text-base font-bold text-[#12305A] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#159EAE]">contact_support</span>
                    <span>General Counseling & Contact Requests</span>
                  </h3>
                  {contacts.length === 0 ? (
                    <p className="text-xs text-[#5F6F82] italic py-2">No contact requests submitted yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {contacts.map((con) => (
                        <div
                          key={con.id}
                          className="p-4 rounded-xl border border-[#DCE5EF] bg-[#F7FAFD] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <span className="font-bold text-sm text-[#12305A]">{con.subject}</span>
                            <p className="text-xs text-[#5F6F82] mt-0.5">{con.message}</p>
                            <p className="text-[11px] text-[#5F6F82] mt-1">
                              Phone: {con.phone} {con.preferredState ? `• Preferred State: ${con.preferredState}` : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              con.status === 'RESOLVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : con.status === 'IN_PROGRESS'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {con.status}
                            </span>
                            <span className="text-[11px] text-[#5F6F82]">
                              {new Date(con.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-[#DCE5EF] p-6 shadow-sm max-w-2xl space-y-6">
                <h3 className="text-base font-bold text-[#12305A] border-b border-[#DCE5EF] pb-3">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#5F6F82] block mb-1">Full Name</span>
                    <p className="font-bold text-[#12305A] text-sm">{user.name}</p>
                  </div>
                  <div>
                    <span className="text-[#5F6F82] block mb-1">Google Email</span>
                    <p className="font-bold text-[#12305A] text-sm">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-[#5F6F82] block mb-1">Assigned Role</span>
                    <p className="font-bold text-[#0757C9] text-sm">{user.role}</p>
                  </div>
                  <div>
                    <span className="text-[#5F6F82] block mb-1">Account Status</span>
                    <p className="font-bold text-emerald-700 text-sm">{user.status}</p>
                  </div>
                  <div>
                    <span className="text-[#5F6F82] block mb-1">Account Created</span>
                    <p className="text-[#12305A]">{new Date(user.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[#5F6F82] block mb-1">Last Sign In</span>
                    <p className="text-[#12305A]">{new Date(user.lastLoginAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs text-[#06449E]">
                  💡 <strong>Security Notice:</strong> Your identity is verified through Google OAuth 2.0. Account privileges are securely managed server-side by the PostgreSQL database.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
