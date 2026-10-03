import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { blogService } from '../services/blogService';
import type { Blog, BlogCategory, BlogCategoryStats } from '../types/blog';
import { StaggerContainer, StaggerItem } from '../components/ui/motion';

export const Blogs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active category from path
  const getCategoryFromPath = (): BlogCategory | 'ALL' => {
    if (location.pathname.includes('/blogs/private')) return 'PRIVATE';
    if (location.pathname.includes('/blogs/government')) return 'GOVERNMENT';
    return 'ALL';
  };

  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'ALL'>(getCategoryFromPath());
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<BlogCategoryStats>({ total: 0, privateCount: 0, governmentCount: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveCategory(getCategoryFromPath());
  }, [location.pathname]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const [blogData, statData] = await Promise.all([
          blogService.getPublicBlogs({
            category: activeCategory === 'ALL' ? undefined : activeCategory,
            search: search.trim() || undefined
          }),
          blogService.getCategoryStats()
        ]);
        setBlogs(blogData.blogs);
        setStats(statData);
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [activeCategory, search]);

  const handleCategorySelect = (cat: BlogCategory | 'ALL') => {
    setActiveCategory(cat);
    if (cat === 'PRIVATE') navigate('/blogs/private');
    else if (cat === 'GOVERNMENT') navigate('/blogs/government');
    else navigate('/blogs');
  };

  return (
    <div className="min-h-screen bg-[#F7FAFD]">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-[#12305A] via-[#0757C9] to-[#06449E] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100">
            <span className="material-symbols-outlined text-[16px] text-[#FFBE2E]">auto_stories</span>
            <span>Admission Insights & College Guides</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Medical & Engineering <span className="text-[#FFBE2E]">Admissions Blog</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto">
            Expert analysis on cutoffs, management quota seat matrices, state counseling procedures, and institution reviews.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#5F6F82] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles, cutoffs, states, colleges..."
                className="w-full pl-10 pr-4 py-2.5 bg-white text-[#12305A] text-xs sm:text-sm rounded-xl shadow-lg border border-white/20 focus:outline-hidden placeholder-[#5F6F82]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#DCE5EF] pb-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => handleCategorySelect('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeCategory === 'ALL'
                  ? 'bg-[#12305A] text-white shadow-sm'
                  : 'bg-white text-[#5F6F82] border border-[#DCE5EF] hover:bg-[#F7FAFD]'
              }`}
            >
              <span>All Articles</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                {stats.total}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCategorySelect('PRIVATE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeCategory === 'PRIVATE'
                  ? 'bg-[#0757C9] text-white shadow-sm'
                  : 'bg-white text-[#0757C9] border border-[#0757C9]/30 hover:bg-blue-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#0757C9]"></span>
              <span>Private Colleges</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeCategory === 'PRIVATE' ? 'bg-white/20' : 'bg-blue-100 text-[#0757C9]'
              }`}>
                {stats.privateCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCategorySelect('GOVERNMENT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeCategory === 'GOVERNMENT'
                  ? 'bg-[#159EAE] text-white shadow-sm'
                  : 'bg-white text-[#087C8B] border border-[#159EAE]/30 hover:bg-teal-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#159EAE]"></span>
              <span>Government Colleges</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeCategory === 'GOVERNMENT' ? 'bg-white/20' : 'bg-teal-100 text-[#087C8B]'
              }`}>
                {stats.governmentCount}
              </span>
            </button>
          </div>

          <span className="text-xs text-[#5F6F82] font-semibold">
            Showing {blogs.length} published guide{blogs.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Blog Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-[#0757C9] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-[#5F6F82]">Loading admissions articles...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#DCE5EF] p-12 text-center max-w-lg mx-auto">
            <span className="material-symbols-outlined text-[40px] text-[#5F6F82] mb-2">menu_book</span>
            <h3 className="text-lg font-bold text-[#12305A]">No Articles Found</h3>
            <p className="text-xs text-[#5F6F82] mt-1">
              No published articles match your current category or search filter.
            </p>
          </div>
        ) : (
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => {
                const isPrivate = blog.category === 'PRIVATE';
                return (
                  <StaggerItem key={blog.id}>
                    <article className="bg-white rounded-2xl border border-[#DCE5EF] hover:border-[#0757C9] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group h-full">
                      <div>
                        {/* Cover Image */}
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                              isPrivate
                                ? 'bg-blue-600/90 text-white'
                                : 'bg-[#087C8B]/90 text-white'
                            }`}>
                              {isPrivate ? 'Private College Guide' : 'Government College Guide'}
                            </span>
                          </div>
                        </div>

                        {/* Text Details */}
                        <div className="p-6">
                          <div className="flex items-center gap-2 text-[11px] text-[#5F6F82] mb-2">
                            <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span>•</span>
                            <span>{blog.author}</span>
                          </div>

                          <h2 className="text-base font-bold text-[#12305A] group-hover:text-[#0757C9] transition-colors line-clamp-2 mb-2 leading-snug">
                            {blog.title}
                          </h2>

                          <p className="text-xs text-[#5F6F82] line-clamp-3 leading-relaxed">
                            {blog.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Footer Link */}
                      <div className="px-6 pb-6 pt-3 border-t border-[#DCE5EF] flex items-center justify-between text-xs">
                        <Link
                          to={`/blogs/${blog.slug}`}
                          className={`font-bold flex items-center gap-1 transition-colors ${
                            isPrivate ? 'text-[#0757C9] group-hover:text-[#06449E]' : 'text-[#087C8B] group-hover:text-[#065b66]'
                          }`}
                        >
                          <span>Read Full Guide</span>
                          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                            arrow_forward
                          </span>
                        </Link>
                        <span className="text-[11px] text-[#5F6F82] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                          {blog.views}
                        </span>
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>
        )}
      </div>
    </div>
  );
};
