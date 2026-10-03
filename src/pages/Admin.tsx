import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { adminService, type AdminOverviewStats } from '../services/adminService';
import { blogService } from '../services/blogService';
import type { College } from '../types/college';
import type { User, AuthorizedAdmin, StudentEnquiry, DirectContact, ConversationItem } from '../types/auth';
import type { Blog } from '../types/blog';

export const Admin: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isSuperAdmin, logout } = useAuth();
  const { showToast } = useCompare();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'colleges' | 'courses' | 'enquiries' | 'blogs' | 'chat' | 'users' | 'admins' | 'settings'>('overview');
  const [loading, setLoading] = useState(false);

  // Overview Data
  const [overview, setOverview] = useState<AdminOverviewStats | null>(null);

  // Colleges Data
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegeTotal, setCollegeTotal] = useState(0);
  const [collegePage, setCollegePage] = useState(1);
  const [collegeTotalPages, setCollegeTotalPages] = useState(1);
  const [searchCollege, setSearchCollege] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  // Modals for College
  const [isEditCollegeModalOpen, setIsEditCollegeModalOpen] = useState(false);
  const [isAddCollegeModalOpen, setIsAddCollegeModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<any | null>(null);
  const [newCollegeData, setNewCollegeData] = useState<any>({
    name: '',
    city: '',
    state: 'Karnataka',
    management: 'Private',
    mbbsSeats: 150,
    rating: 4.5,
    nirfRank: '',
    shortDescription: '',
    fullDescription: '',
    website: 'https://admissionbychoice.com',
    annualFee: '₹14,50,000 / year'
  });

  // Enquiries Data
  const [enquiries, setEnquiries] = useState<StudentEnquiry[]>([]);
  const [contacts, setContacts] = useState<DirectContact[]>([]);
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('ALL');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquirySort, setEnquirySort] = useState<'newest' | 'oldest'>('newest');
  const [editingNoteEnquiryId, setEditingNoteEnquiryId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  // Blog Management Data
  const [adminBlogs, setAdminBlogs] = useState<Blog[]>([]);
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('ALL');
  const [isAddBlogModalOpen, setIsAddBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [newBlogData, setNewBlogData] = useState<{
    title: string;
    slug: string;
    category: 'PRIVATE' | 'GOVERNMENT';
    excerpt: string;
    content: string;
    coverImage: string;
    author: string;
    status: 'DRAFT' | 'PUBLISHED';
    tags: string;
  }>({
    title: '',
    slug: '',
    category: 'PRIVATE',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
    author: 'Admission by Choice Advisory',
    status: 'PUBLISHED',
    tags: 'MBBS, Admissions 2026, Counseling'
  });

  // AI Conversations Data
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConvAudit, setSelectedConvAudit] = useState<ConversationItem | null>(null);

  // Users Data
  const [users, setUsers] = useState<User[]>([]);

  // Admins Data (Super Admin)
  const [authorizedAdmins, setAuthorizedAdmins] = useState<AuthorizedAdmin[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const loadTabData = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const stats = await adminService.getOverview();
        setOverview(stats);
      } else if (activeTab === 'colleges' || activeTab === 'courses') {
        const res = await adminService.getColleges({
          page: collegePage,
          limit: 15,
          search: searchCollege,
          state: stateFilter
        });
        setColleges(res.colleges);
        setCollegeTotal(res.total);
        setCollegeTotalPages(res.totalPages);
      } else if (activeTab === 'enquiries') {
        const [enqRes, conRes] = await Promise.all([
          adminService.getEnquiries({
            status: enquiryStatusFilter,
            search: enquirySearch,
            sort: enquirySort,
            limit: 40
          }),
          adminService.getContacts({ status: enquiryStatusFilter, limit: 30 })
        ]);
        setEnquiries(enqRes.enquiries);
        setContacts(conRes.contacts);
      } else if (activeTab === 'blogs') {
        const res = await blogService.getAdminBlogs({
          category: blogCategoryFilter === 'ALL' ? undefined : blogCategoryFilter,
          limit: 30
        });
        setAdminBlogs(res.blogs);
      } else if (activeTab === 'chat') {
        const res = await adminService.getConversations({ limit: 30 });
        setConversations(res.conversations);
      } else if (activeTab === 'users') {
        const res = await adminService.getUsers({ limit: 40 });
        setUsers(res.users);
      } else if (activeTab === 'admins' && isSuperAdmin) {
        const res = await adminService.getAdmins();
        setAuthorizedAdmins(res.authorizedAdmins);
      }
    } catch (err: any) {
      console.error('Failed to load admin tab data:', err);
      showToast(err.message || 'Error loading admin data');
    } finally {
      setLoading(false);
    }
  }, [activeTab, isAdmin, collegePage, searchCollege, stateFilter, enquiryStatusFilter, enquirySearch, enquirySort, blogCategoryFilter, isSuperAdmin, showToast]);

  useEffect(() => {
    loadTabData();
  }, [loadTabData]);

  // College Operations
  const handleSaveEditedCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollege) return;
    try {
      await adminService.updateCollege(editingCollege.id, editingCollege);
      showToast(`Updated "${editingCollege.name}" in PostgreSQL database`);
      setIsEditCollegeModalOpen(false);
      loadTabData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update college');
    }
  };

  const handleCreateCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createCollege(newCollegeData);
      showToast(`College "${newCollegeData.name}" created successfully in PostgreSQL`);
      setIsAddCollegeModalOpen(false);
      setNewCollegeData({
        name: '',
        city: '',
        state: 'Karnataka',
        management: 'Private',
        mbbsSeats: 150,
        rating: 4.5,
        nirfRank: '',
        shortDescription: '',
        fullDescription: '',
        website: 'https://admissionbychoice.com',
        annualFee: '₹14,50,000 / year'
      });
      loadTabData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create college');
    }
  };

  const handleDeleteCollege = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from PostgreSQL database?`)) {
      return;
    }
    try {
      await adminService.deleteCollege(id);
      showToast(`College "${name}" deleted`);
      loadTabData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete college');
    }
  };

  // Enquiry Operations
  const handleUpdateEnquiryStatus = async (id: string, status: string) => {
    try {
      await adminService.updateEnquiryStatus(id, status);
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: status as any } : e));
      showToast(`Enquiry marked as ${status}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update status');
    }
  };

  const handleSaveEnquiryNote = async (id: string) => {
    try {
      await adminService.updateEnquiryStatus(id, undefined, noteText);
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, notes: noteText } : e));
      setEditingNoteEnquiryId(null);
      showToast('Internal counselor note saved.');
      loadTabData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save note');
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await adminService.exportEnquiriesCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admission_by_choice_enquiries_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('Enquiries exported to CSV (ready for Google Sheets/Excel).');
    } catch {
      showToast('Failed to export CSV');
    }
  };

  // Blog Operations
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await blogService.createAdminBlog({
        title: newBlogData.title,
        slug: newBlogData.slug || undefined,
        category: newBlogData.category,
        excerpt: newBlogData.excerpt,
        content: newBlogData.content,
        coverImage: newBlogData.coverImage,
        author: newBlogData.author,
        status: newBlogData.status,
        tags: newBlogData.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      showToast(`Blog post "${newBlogData.title}" created successfully.`);
      setIsAddBlogModalOpen(false);
      setNewBlogData({
        title: '',
        slug: '',
        category: 'PRIVATE',
        excerpt: '',
        content: '',
        coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
        author: 'Admission by Choice Advisory',
        status: 'PUBLISHED',
        tags: 'MBBS, Admissions 2026, Counseling'
      });
      loadTabData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create blog');
    }
  };

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    try {
      await blogService.updateAdminBlog(editingBlog.id, {
        title: editingBlog.title,
        slug: editingBlog.slug,
        category: editingBlog.category,
        excerpt: editingBlog.excerpt,
        content: editingBlog.content,
        coverImage: editingBlog.coverImage,
        author: editingBlog.author,
        status: editingBlog.status,
        tags: editingBlog.tags
      });
      showToast(`Blog "${editingBlog.title}" updated.`);
      setEditingBlog(null);
      loadTabData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update blog');
    }
  };

  const handleDeleteBlog = async (id: string, title: string) => {
    if (!window.confirm(`Delete article "${title}"?`)) return;
    try {
      await blogService.deleteAdminBlog(id);
      showToast(`Article deleted.`);
      loadTabData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete blog');
    }
  };

  // Super Admin: Add Admin
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      showToast('Please enter a valid Google account email');
      return;
    }
    try {
      await adminService.addAdmin(newAdminEmail.trim());
      showToast(`Admin authorized: ${newAdminEmail}`);
      setNewAdminEmail('');
      loadTabData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add admin');
    }
  };

  const handleRevokeAdmin = async (id: string, email: string) => {
    if (!window.confirm(`Revoke admin privileges for ${email}?`)) return;
    try {
      await adminService.revokeAdmin(id);
      showToast(`Admin privileges revoked for ${email}`);
      loadTabData();
    } catch (err: any) {
      showToast(err.message || 'Failed to revoke admin');
    }
  };

  // Guard Check: Redirect to dedicated login if not authenticated or not admin
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#F7FAFD] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-[#DCE5EF] p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <span className="material-symbols-outlined text-[32px]">lock</span>
          </div>
          <h2 className="text-2xl font-black text-[#12305A] mb-2">Restricted Admin Access</h2>
          <p className="text-xs text-[#5F6F82] mb-6">
            Please sign in through the official Admin Login page to manage colleges, student enquiries, and articles.
          </p>
          <Link
            to="/admin/login"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0757C9] hover:bg-[#06449E] text-white font-bold text-xs transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span>Go to Admin Login Page</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F7FAFD] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-red-200 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">block</span>
          </div>
          <h2 className="text-2xl font-bold text-[#12305A] mb-2">403 — Unauthorized Access</h2>
          <p className="text-xs text-[#5F6F82] mb-4">
            Your account (<strong className="text-[#12305A]">{user.email}</strong>) is verified as a <strong>STUDENT</strong>. Administrative endpoints are strictly forbidden.
          </p>
          <div className="flex gap-3">
            <Link
              to="/account"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#0757C9] text-white text-xs font-semibold hover:bg-[#06449E] text-center"
            >
              Student Portal
            </Link>
            <Link
              to="/"
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#DCE5EF] text-[#12305A] text-xs font-semibold hover:bg-[#F7FAFD] text-center"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFD]">
      {/* Top Admin Header */}
      <div className="bg-[#12305A] text-white border-b border-[#06449E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-[24px] text-[#FFBE2E]">admin_panel_settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight">Admission by Choice — Admin Center</h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isSuperAdmin ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30' : 'bg-blue-500/20 text-blue-200'
                }`}>
                  {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Connected as {user.name} ({user.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/blogs"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span>View Blogs</span>
            </Link>
            <Link
              to="/colleges"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Public Portal</span>
            </Link>
            <button
              onClick={async () => {
                await logout();
                navigate('/admin/login');
              }}
              className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-[#DCE5EF] p-2 shadow-xs flex gap-1.5 overflow-x-auto">
          {[
            { id: 'overview', label: 'Dashboard', icon: 'dashboard' },
            { id: 'colleges', label: 'Colleges', icon: 'school' },
            { id: 'courses', label: 'Courses & Seats', icon: 'auto_stories' },
            { id: 'enquiries', label: 'Enquiries', icon: 'assignment' },
            { id: 'blogs', label: 'Blogs & Guides', icon: 'menu_book' },
            { id: 'chat', label: 'AI Conversations', icon: 'smart_toy' },
            { id: 'users', label: 'Students', icon: 'people' },
            { id: 'admins', label: 'Admins', icon: 'shield_person', superAdminOnly: true },
            { id: 'settings', label: 'Settings', icon: 'settings' }
          ].map((tab) => {
            if (tab.superAdminOnly && !isSuperAdmin) return null;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#0757C9] text-white shadow-xs'
                    : 'text-[#5F6F82] hover:text-[#12305A] hover:bg-[#F7FAFD]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#0757C9] font-semibold">
            <div className="w-4 h-4 border-2 border-[#0757C9] border-t-transparent rounded-full animate-spin"></div>
            <span>Syncing database records...</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {overview && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Colleges in DB', val: overview.stats.colleges, icon: 'school', color: 'text-[#0757C9]', bg: 'bg-blue-50' },
                  { label: 'Courses Tracked', val: overview.stats.courses, icon: 'auto_stories', color: 'text-[#159EAE]', bg: 'bg-teal-50' },
                  { label: 'Enquiries & Leads', val: overview.stats.enquiries, icon: 'assignment', color: 'text-[#F04A35]', bg: 'bg-orange-50' },
                  { label: 'Published Blogs', val: overview.stats.blogs || 4, icon: 'menu_book', color: 'text-indigo-700', bg: 'bg-indigo-50' },
                  { label: 'Verified Students', val: overview.stats.students, icon: 'groups', color: 'text-emerald-700', bg: 'bg-emerald-50' },
                  { label: 'AI Chat Sessions', val: overview.stats.conversations, icon: 'smart_toy', color: 'text-[#FFBE2E]', bg: 'bg-amber-50' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#DCE5EF] p-4 shadow-xs">
                    <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-2`}>
                      <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                    </div>
                    <p className="text-2xl font-black text-[#12305A]">{stat.val.toLocaleString()}</p>
                    <p className="text-[11px] font-medium text-[#5F6F82] mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Enquiries */}
              <div className="bg-white rounded-2xl border border-[#DCE5EF] p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#DCE5EF] mb-3">
                  <h3 className="font-bold text-[#12305A] text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#0757C9]">assignment</span>
                    <span>Recent Student Enquiries</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs text-[#0757C9] hover:underline font-semibold cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {overview?.recentEnquiries?.map((enq) => (
                    <div key={enq.id} className="p-3 rounded-xl bg-[#F7FAFD] border border-[#DCE5EF] flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#12305A]">{enq.studentName} — {enq.collegeName}</p>
                        <p className="text-[#5F6F82] text-[11px]">📞 {enq.phone} • {enq.preferredCourse}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        enq.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : enq.status === 'CONTACTED' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-[#0757C9]'
                      }`}>
                        {enq.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Registered Users */}
              <div className="bg-white rounded-2xl border border-[#DCE5EF] p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#DCE5EF] mb-3">
                  <h3 className="font-bold text-[#12305A] text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#159EAE]">people</span>
                    <span>Recent Student Registrations</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('users')}
                    className="text-xs text-[#0757C9] hover:underline font-semibold cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {overview?.recentUsers?.map((u) => (
                    <div key={u.id} className="p-3 rounded-xl bg-[#F7FAFD] border border-[#DCE5EF] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0757C9] text-white flex items-center justify-center font-bold text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#12305A]">{u.name}</p>
                          <p className="text-[#5F6F82] text-[11px]">{u.email}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[#12305A] font-bold text-[10px]">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COLLEGES MANAGEMENT */}
        {(activeTab === 'colleges' || activeTab === 'courses') && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#DCE5EF] p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 flex-wrap">
                <div className="relative flex-1 min-w-[240px]">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#5F6F82] text-[18px]">search</span>
                  <input
                    type="text"
                    value={searchCollege}
                    onChange={(e) => {
                      setSearchCollege(e.target.value);
                      setCollegePage(1);
                    }}
                    placeholder="Search by college name, city, state..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#DCE5EF] rounded-xl focus:border-[#0757C9] focus:outline-hidden"
                  />
                </div>

                <select
                  value={stateFilter}
                  onChange={(e) => {
                    setStateFilter(e.target.value);
                    setCollegePage(1);
                  }}
                  className="px-3 py-2 text-xs border border-[#DCE5EF] rounded-xl bg-white text-[#12305A]"
                >
                  <option value="">All States</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setIsAddCollegeModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0757C9] hover:bg-[#06449E] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Add New College</span>
              </button>
            </div>

            {/* Colleges Table */}
            <div className="bg-white rounded-2xl border border-[#DCE5EF] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7FAFD] text-[#5F6F82] font-semibold border-b border-[#DCE5EF]">
                    <tr>
                      <th className="py-3 px-4">College Name</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Management</th>
                      <th className="py-3 px-4">MBBS Seats</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE5EF]">
                    {colleges.map((col) => (
                      <tr key={col.id} className="hover:bg-[#F7FAFD]/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={col.logo || col.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&auto=format&fit=crop&q=80'}
                              alt={col.name}
                              className="w-8 h-8 rounded-lg object-cover border border-[#DCE5EF]"
                            />
                            <div>
                              <p className="font-bold text-[#12305A] max-w-xs truncate">{col.name}</p>
                              <p className="text-[10px] text-[#5F6F82]">Code: {col.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#5F6F82]">
                          {col.city}, {col.state}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-[#F7FAFD] border border-[#DCE5EF] text-[10px] font-medium text-[#12305A]">
                            {col.management || 'Private'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#12305A]">
                          {col.mbbsSeats || 0}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#0757C9]">
                          ⭐ {col.rating} ★
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCollege(col);
                              setIsEditCollegeModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-[#DCE5EF] hover:bg-blue-50 text-[#0757C9] transition-colors cursor-pointer"
                            title="Edit College"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCollege(col.id, col.name)}
                            className="p-1.5 rounded-lg border border-[#DCE5EF] hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                            title="Delete College"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-[#DCE5EF] flex items-center justify-between text-xs text-[#5F6F82]">
                <p>Showing <strong>{colleges.length}</strong> of <strong>{collegeTotal}</strong> colleges in PostgreSQL</p>
                <div className="flex gap-2">
                  <button
                    disabled={collegePage <= 1}
                    onClick={() => setCollegePage(p => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-[#DCE5EF] bg-white disabled:opacity-50 cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 font-bold text-[#12305A]">Page {collegePage} of {collegeTotalPages}</span>
                  <button
                    disabled={collegePage >= collegeTotalPages}
                    onClick={() => setCollegePage(p => p + 1)}
                    className="px-3 py-1.5 rounded-lg border border-[#DCE5EF] bg-white disabled:opacity-50 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#DCE5EF] p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 flex-wrap">
                <h3 className="font-bold text-[#12305A] text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#0757C9]">assignment</span>
                  <span>Enquiries & Leads ({enquiries.length})</span>
                </h3>

                <input
                  type="text"
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  placeholder="Search student, college, phone..."
                  className="px-3 py-1.5 text-xs border border-[#DCE5EF] rounded-xl focus:border-[#0757C9] focus:outline-hidden min-w-[200px]"
                />

                <select
                  value={enquiryStatusFilter}
                  onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-[#DCE5EF] rounded-xl bg-white text-xs text-[#12305A]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">NEW</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>

                <select
                  value={enquirySort}
                  onChange={(e) => setEnquirySort(e.target.value as any)}
                  className="px-2.5 py-1.5 border border-[#DCE5EF] rounded-xl bg-white text-xs text-[#12305A]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Export to CSV / Google Sheets</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#DCE5EF] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7FAFD] text-[#5F6F82] font-semibold border-b border-[#DCE5EF]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">College Requested</th>
                    <th className="py-3 px-4">Phone / Email</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Internal Counselor Note</th>
                    <th className="py-3 px-4 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5EF]">
                  {enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-[#F7FAFD]/70">
                      <td className="py-3 px-4 font-bold text-[#12305A]">{enq.studentName}</td>
                      <td className="py-3 px-4 font-semibold text-[#0757C9]">{enq.collegeName}</td>
                      <td className="py-3 px-4 text-[#5F6F82]">
                        <p>📞 {enq.phone}</p>
                        {enq.email && <p className="text-[10px]">✉️ {enq.email}</p>}
                      </td>
                      <td className="py-3 px-4">{enq.preferredCourse}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          enq.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enq.status === 'CONTACTED'
                            ? 'bg-indigo-100 text-indigo-800'
                            : enq.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        {editingNoteEnquiryId === enq.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Add counselor note..."
                              className="px-2 py-1 text-xs border border-[#0757C9] rounded-md w-full"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEnquiryNote(enq.id)}
                              className="p-1 bg-[#0757C9] text-white rounded cursor-pointer"
                              title="Save"
                            >
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingNoteEnquiryId(enq.id);
                              setNoteText(enq.notes || '');
                            }}
                            className="text-[#5F6F82] hover:text-[#12305A] cursor-pointer group flex items-center gap-1"
                          >
                            <span className="truncate">{enq.notes || 'Click to add internal note...'}</span>
                            <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100">edit</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={enq.status}
                          onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-[#DCE5EF] rounded-md bg-white cursor-pointer"
                        >
                          <option value="NEW">Mark NEW</option>
                          <option value="IN_PROGRESS">Mark IN PROGRESS</option>
                          <option value="CONTACTED">Mark CONTACTED</option>
                          <option value="RESOLVED">Mark RESOLVED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Direct Contact Form Messages */}
            {contacts.length > 0 && (
              <div className="mt-8 space-y-3">
                <h4 className="font-bold text-[#12305A] text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#159EAE]">mail</span>
                  <span>Direct Contact Form Messages ({contacts.length})</span>
                </h4>
                <div className="bg-white rounded-2xl border border-[#DCE5EF] overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7FAFD] text-[#5F6F82] font-semibold border-b border-[#DCE5EF]">
                      <tr>
                        <th className="py-2.5 px-4">Name</th>
                        <th className="py-2.5 px-4">Email</th>
                        <th className="py-2.5 px-4">Subject</th>
                        <th className="py-2.5 px-4">Message</th>
                        <th className="py-2.5 px-4">Date</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCE5EF]">
                      {contacts.map((con) => (
                        <tr key={con.id} className="hover:bg-[#F7FAFD]/70">
                          <td className="py-2.5 px-4 font-bold text-[#12305A]">{con.fullName}</td>
                          <td className="py-2.5 px-4 text-[#0757C9]">{con.email}</td>
                          <td className="py-2.5 px-4 font-medium text-[#12305A]">{con.subject}</td>
                          <td className="py-2.5 px-4 text-[#5F6F82] max-w-xs truncate">{con.message}</td>
                          <td className="py-2.5 px-4 text-[#5F6F82]">{new Date(con.createdAt).toLocaleDateString()}</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-700">
                              {con.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BLOGS & GUIDES MANAGEMENT */}
        {activeTab === 'blogs' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#DCE5EF] p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-[#12305A] text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#0757C9]">menu_book</span>
                  <span>Articles & College Guides ({adminBlogs.length})</span>
                </h3>

                <select
                  value={blogCategoryFilter}
                  onChange={(e) => setBlogCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-[#DCE5EF] rounded-xl bg-white text-[#12305A]"
                >
                  <option value="ALL">All Categories</option>
                  <option value="PRIVATE">Private Colleges Only</option>
                  <option value="GOVERNMENT">Government Colleges Only</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setIsAddBlogModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0757C9] hover:bg-[#06449E] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">post_add</span>
                <span>Write New Article</span>
              </button>
            </div>

            {/* Blogs Table */}
            <div className="bg-white rounded-2xl border border-[#DCE5EF] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7FAFD] text-[#5F6F82] font-semibold border-b border-[#DCE5EF]">
                  <tr>
                    <th className="py-3 px-4">Title & Excerpt</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4">Published Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5EF]">
                  {adminBlogs.map((b) => (
                    <tr key={b.id} className="hover:bg-[#F7FAFD]/70">
                      <td className="py-3 px-4">
                        <p className="font-bold text-[#12305A]">{b.title}</p>
                        <p className="text-[11px] text-[#5F6F82] max-w-md truncate">{b.excerpt}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          b.category === 'PRIVATE' ? 'bg-blue-100 text-[#0757C9]' : 'bg-teal-100 text-[#087C8B]'
                        }`}>
                          {b.category === 'PRIVATE' ? 'Private' : 'Government'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          b.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#12305A]">{b.views}</td>
                      <td className="py-3 px-4 text-[#5F6F82]">
                        {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : 'Draft'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingBlog(b)}
                          className="p-1.5 rounded-lg border border-[#DCE5EF] hover:bg-blue-50 text-[#0757C9] cursor-pointer"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlog(b.id, b.title)}
                          className="p-1.5 rounded-lg border border-[#DCE5EF] hover:bg-red-50 text-red-600 cursor-pointer"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: AI ADVISORY AUDIT */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#DCE5EF] p-4 shadow-xs">
              <h3 className="font-bold text-[#12305A] text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#159EAE]">smart_toy</span>
                <span>AI Advisory Interactions Audit Log</span>
              </h3>
            </div>

            <div className="bg-white rounded-2xl border border-[#DCE5EF] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7FAFD] text-[#5F6F82] font-semibold border-b border-[#DCE5EF]">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Chat Topic</th>
                    <th className="py-3 px-4">Messages</th>
                    <th className="py-3 px-4">Last Updated</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5EF]">
                  {conversations.map((conv) => (
                    <tr key={conv.id} className="hover:bg-[#F7FAFD]/70">
                      <td className="py-3 px-4">
                        <p className="font-bold text-[#12305A]">{conv.user?.name || 'Student'}</p>
                        <p className="text-[11px] text-[#5F6F82]">{conv.user?.email || 'Authenticated'}</p>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#12305A] max-w-sm truncate">
                        {conv.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-teal-50 text-[#087C8B] font-bold text-[10px]">
                          {conv._count?.messages || 2} msgs
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#5F6F82]">{new Date(conv.updatedAt).toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={async () => {
                            const full = await adminService.getConversationById(conv.id);
                            setSelectedConvAudit(full);
                          }}
                          className="px-3 py-1 rounded-lg border border-[#DCE5EF] text-[#0757C9] hover:bg-blue-50 font-semibold cursor-pointer"
                        >
                          View Transcript
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: USERS */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#DCE5EF] p-4 shadow-xs">
              <h3 className="font-bold text-[#12305A] text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-purple-700">people</span>
                <span>Registered Students & Accounts</span>
              </h3>
            </div>

            <div className="bg-white rounded-2xl border border-[#DCE5EF] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7FAFD] text-[#5F6F82] font-semibold border-b border-[#DCE5EF]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5EF]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#F7FAFD]/70">
                      <td className="py-3 px-4 font-bold text-[#12305A]">{u.name}</td>
                      <td className="py-3 px-4 text-[#5F6F82]">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          u.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' : u.role === 'ADMIN' ? 'bg-blue-100 text-[#0757C9]' : 'bg-teal-50 text-[#087C8B]'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-700">{u.status}</td>
                      <td className="py-3 px-4 text-[#5F6F82]">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-[#5F6F82]">{new Date(u.lastLoginAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: ADMIN MANAGEMENT (SUPER ADMIN ONLY) */}
        {activeTab === 'admins' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#DCE5EF] p-6 shadow-xs max-w-2xl">
              <h3 className="font-bold text-[#12305A] text-base mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#0757C9]">person_add</span>
                <span>Authorize New Administrator</span>
              </h3>
              <p className="text-xs text-[#5F6F82] mb-4">
                Enter the Google account email of the administrator you wish to authorize.
              </p>
              <form onSubmit={handleAddAdmin} className="flex gap-3">
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin.colleague@gmail.com"
                  className="flex-1 px-4 py-2.5 text-xs border border-[#DCE5EF] rounded-xl focus:border-[#0757C9] focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0757C9] hover:bg-[#06449E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Authorize Admin
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-[#DCE5EF] overflow-hidden shadow-xs">
              <div className="p-4 border-b border-[#DCE5EF]">
                <h4 className="font-bold text-[#12305A] text-sm">Authorized Administrator Accounts</h4>
              </div>
              <div className="divide-y divide-[#DCE5EF]">
                <div className="p-4 flex items-center justify-between bg-purple-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                      👑
                    </div>
                    <div>
                      <p className="font-bold text-[#12305A]">admissionbychoice@gmail.com / bmsit8@gmail.com</p>
                      <p className="text-[11px] text-purple-700 font-semibold">Primary Super Admin Accounts</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                    SUPER_ADMIN
                  </span>
                </div>

                {authorizedAdmins.map((admin) => (
                  <div key={admin.id} className="p-4 flex items-center justify-between hover:bg-[#F7FAFD]">
                    <div>
                      <p className="font-bold text-[#12305A]">{admin.email}</p>
                      <p className="text-[11px] text-[#5F6F82]">
                        Added by {admin.addedBy || 'Super Admin'} on {new Date(admin.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0757C9] font-bold text-[10px]">
                        ADMIN
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRevokeAdmin(admin.id, admin.email)}
                        className="px-3 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer"
                      >
                        Revoke Access
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS & PRODUCTION CHECKLIST */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-[#DCE5EF] p-6 shadow-xs max-w-3xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#12305A]">Vercel Deployment & Environment Settings</h3>
              <p className="text-xs text-[#5F6F82] mt-0.5">
                Verify that all production environment variables are properly defined in your Vercel Project Settings.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { name: 'DATABASE_URL', desc: 'PostgreSQL connection string (Supabase / Neon / AWS RDS)', required: true },
                { name: 'ADMIN_EMAIL', desc: 'admissionbychoice@gmail.com', required: true },
                { name: 'ADMIN_PASSWORD_HASH', desc: 'bcrypt hash of production admin password', required: true },
                { name: 'JWT_SECRET', desc: 'Cryptographic secret key for signing admin & student tokens', required: true },
                { name: 'SMTP_HOST / SMTP_USER / SMTP_PASS', desc: 'Email provider credentials for new enquiry alerts', required: false },
                { name: 'GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET', desc: 'Google OAuth verification keys for student portal', required: false }
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#F7FAFD] border border-[#DCE5EF] flex items-center justify-between">
                  <div>
                    <code className="font-bold text-[#0757C9]">{item.name}</code>
                    <p className="text-[#5F6F82] text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.required ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-[#12305A]'
                  }`}>
                    {item.required ? 'REQUIRED' : 'OPTIONAL'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: CREATE NEW BLOG ARTICLE */}
      {isAddBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
              <h3 className="font-bold text-base text-[#12305A]">Publish New Admissions Article</h3>
              <button onClick={() => setIsAddBlogModalOpen(false)} className="text-[#5F6F82] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateBlog} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[#5F6F82] font-semibold mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={newBlogData.title}
                    onChange={(e) => setNewBlogData({ ...newBlogData, title: e.target.value })}
                    placeholder="e.g. Top Private Medical Colleges in Karnataka 2026"
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">Category *</label>
                  <select
                    value={newBlogData.category}
                    onChange={(e) => setNewBlogData({ ...newBlogData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-xl bg-white"
                  >
                    <option value="PRIVATE">Private Colleges</option>
                    <option value="GOVERNMENT">Government Colleges</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">Status</label>
                  <select
                    value={newBlogData.status}
                    onChange={(e) => setNewBlogData({ ...newBlogData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-xl bg-white"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">Author Name</label>
                  <input
                    type="text"
                    value={newBlogData.author}
                    onChange={(e) => setNewBlogData({ ...newBlogData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={newBlogData.coverImage}
                    onChange={(e) => setNewBlogData({ ...newBlogData, coverImage: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5F6F82] font-semibold mb-1">Short Summary / Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={newBlogData.excerpt}
                  onChange={(e) => setNewBlogData({ ...newBlogData, excerpt: e.target.value })}
                  placeholder="Summary of the article for cards and SEO..."
                  className="w-full px-3 py-2 border border-[#DCE5EF] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[#5F6F82] font-semibold mb-1">Article Content (Markdown Supported) *</label>
                <textarea
                  rows={8}
                  required
                  value={newBlogData.content}
                  onChange={(e) => setNewBlogData({ ...newBlogData, content: e.target.value })}
                  placeholder="Write the full admissions guide, headings, bullet points, and advice..."
                  className="w-full px-3 py-2 border border-[#DCE5EF] rounded-xl font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCE5EF]">
                <button
                  type="button"
                  onClick={() => setIsAddBlogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DCE5EF] text-[#5F6F82]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0757C9] text-white font-bold"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT BLOG ARTICLE */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
              <h3 className="font-bold text-base text-[#12305A]">Edit Article: {editingBlog.title}</h3>
              <button onClick={() => setEditingBlog(null)} className="text-[#5F6F82] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateBlog} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5F6F82] font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DCE5EF] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">Category</label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-xl bg-white"
                  >
                    <option value="PRIVATE">Private Colleges</option>
                    <option value="GOVERNMENT">Government Colleges</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">Status</label>
                  <select
                    value={editingBlog.status}
                    onChange={(e) => setEditingBlog({ ...editingBlog, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-xl bg-white"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#5F6F82] font-semibold mb-1">Excerpt</label>
                <textarea
                  rows={2}
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DCE5EF] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[#5F6F82] font-semibold mb-1">Content</label>
                <textarea
                  rows={8}
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DCE5EF] rounded-xl font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCE5EF]">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 rounded-xl border border-[#DCE5EF] text-[#5F6F82]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0757C9] text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT COLLEGE */}
      {isEditCollegeModalOpen && editingCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
              <h3 className="font-bold text-base text-[#12305A]">Edit College in PostgreSQL Database</h3>
              <button onClick={() => setIsEditCollegeModalOpen(false)} className="text-[#5F6F82] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEditedCollege} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">College Name</label>
                  <input
                    type="text"
                    required
                    value={editingCollege.name || ''}
                    onChange={(e) => setEditingCollege({ ...editingCollege, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editingCollege.city || ''}
                    onChange={(e) => setEditingCollege({ ...editingCollege, city: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={editingCollege.state || ''}
                    onChange={(e) => setEditingCollege({ ...editingCollege, state: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">Management Type</label>
                  <select
                    value={editingCollege.management || 'Private'}
                    onChange={(e) => setEditingCollege({ ...editingCollege, management: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg bg-white"
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Deemed">Deemed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">Rating (★)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingCollege.rating || 4.5}
                    onChange={(e) => setEditingCollege({ ...editingCollege, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">MBBS Seats</label>
                  <input
                    type="number"
                    value={editingCollege.mbbsSeats || 0}
                    onChange={(e) => setEditingCollege({ ...editingCollege, mbbsSeats: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5F6F82] font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingCollege.shortDescription || ''}
                  onChange={(e) => setEditingCollege({ ...editingCollege, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[#5F6F82] font-semibold mb-1">Website URL</label>
                <input
                  type="text"
                  value={editingCollege.website || ''}
                  onChange={(e) => setEditingCollege({ ...editingCollege, website: e.target.value })}
                  className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCE5EF]">
                <button
                  type="button"
                  onClick={() => setIsEditCollegeModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#DCE5EF] text-[#5F6F82] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0757C9] text-white font-semibold cursor-pointer"
                >
                  Save Changes to PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW COLLEGE */}
      {isAddCollegeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
              <h3 className="font-bold text-base text-[#12305A]">Add New College to PostgreSQL</h3>
              <button onClick={() => setIsAddCollegeModalOpen(false)} className="text-[#5F6F82] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCollege} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">College Name *</label>
                  <input
                    type="text"
                    required
                    value={newCollegeData.name}
                    onChange={(e) => setNewCollegeData({ ...newCollegeData, name: e.target.value })}
                    placeholder="e.g. Apex Institute of Medical Sciences"
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newCollegeData.city}
                    onChange={(e) => setNewCollegeData({ ...newCollegeData, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={newCollegeData.state}
                    onChange={(e) => setNewCollegeData({ ...newCollegeData, state: e.target.value })}
                    placeholder="e.g. Karnataka"
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">Management</label>
                  <select
                    value={newCollegeData.management}
                    onChange={(e) => setNewCollegeData({ ...newCollegeData, management: e.target.value })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg bg-white"
                  >
                    <option value="Private">Private</option>
                    <option value="Government">Government</option>
                    <option value="Deemed">Deemed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">MBBS Seats</label>
                  <input
                    type="number"
                    value={newCollegeData.mbbsSeats}
                    onChange={(e) => setNewCollegeData({ ...newCollegeData, mbbsSeats: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#5F6F82] font-semibold mb-1">Annual Tuition Fee</label>
                  <input
                    type="text"
                    value={newCollegeData.annualFee}
                    onChange={(e) => setNewCollegeData({ ...newCollegeData, annualFee: e.target.value })}
                    placeholder="₹14,50,000 / year"
                    className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5F6F82] font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newCollegeData.shortDescription}
                  onChange={(e) => setNewCollegeData({ ...newCollegeData, shortDescription: e.target.value })}
                  placeholder="Premier institution with modern infrastructure..."
                  className="w-full px-3 py-2 border border-[#DCE5EF] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#DCE5EF]">
                <button
                  type="button"
                  onClick={() => setIsAddCollegeModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#DCE5EF] text-[#5F6F82] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0757C9] text-white font-semibold cursor-pointer"
                >
                  Insert College into PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AI CHAT TRANSCRIPT AUDIT */}
      {selectedConvAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#12305A]">{selectedConvAudit.title}</h3>
                <p className="text-xs text-[#5F6F82]">
                  Student: {selectedConvAudit.user?.name} ({selectedConvAudit.user?.email})
                </p>
              </div>
              <button onClick={() => setSelectedConvAudit(null)} className="text-[#5F6F82] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              {selectedConvAudit.messages?.map((msg, idx) => (
                <div key={idx} className={`p-3 rounded-xl text-xs ${
                  msg.role === 'USER' ? 'bg-[#0757C9]/10 text-[#12305A] font-semibold' : 'bg-[#F7FAFD] border border-[#DCE5EF] text-[#12305A] whitespace-pre-wrap'
                }`}>
                  <p className="font-bold mb-1 text-[#0757C9]">{msg.role === 'USER' ? 'Student Query:' : 'College Advisor AI Response:'}</p>
                  <div>{msg.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
