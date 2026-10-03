import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { useCompare } from '../context/CompareContext';
import type { Blog } from '../types/blog';

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { openEnquiry } = useCompare();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await blogService.getPublicBlogBySlug(slug);
        setBlog(data.blog);
        setRelatedBlogs(data.relatedBlogs || []);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFD] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0757C9] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-[#12305A]">Loading article guide...</p>
        </div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-[70vh] bg-[#F7FAFD] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#DCE5EF] p-8 text-center shadow-lg">
          <span className="material-symbols-outlined text-[48px] text-[#5F6F82] mb-3">article</span>
          <h2 className="text-2xl font-bold text-[#12305A] mb-2">Article Not Found</h2>
          <p className="text-xs text-[#5F6F82] mb-6">
            The admissions guide you requested could not be located or may have been updated.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0757C9] text-white text-xs font-semibold hover:bg-[#06449E]"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Browse All Blogs</span>
          </Link>
        </div>
      </div>
    );
  }

  const isPrivate = blog.category === 'PRIVATE';

  return (
    <div className="min-h-screen bg-[#F7FAFD]">
      {/* Article Header & Banner */}
      <div className="bg-linear-to-b from-[#12305A] via-[#0757C9] to-[#06449E] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-blue-200">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/blogs" className="hover:text-white">Blogs</Link>
            <span>/</span>
            <Link to={isPrivate ? '/blogs/private' : '/blogs/government'} className="hover:text-white font-semibold">
              {isPrivate ? 'Private Colleges' : 'Government Colleges'}
            </Link>
          </div>

          {/* Category Tag */}
          <div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
              isPrivate ? 'bg-blue-500/30 border border-blue-300/40 text-blue-100' : 'bg-teal-500/30 border border-teal-300/40 text-teal-100'
            }`}>
              {isPrivate ? 'Private College Counseling' : 'Government College Counseling'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-blue-100 pt-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              <span>{blog.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>{blog.views} Reads</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16 space-y-8">
        {/* Cover Image */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-[#DCE5EF] bg-white h-72 sm:h-96">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-[#DCE5EF] p-6 sm:p-10 shadow-sm space-y-6">
          {/* Excerpt Summary */}
          <div className="p-4 rounded-2xl bg-[#F7FAFD] border-l-4 border-[#0757C9] text-xs sm:text-sm font-medium text-[#12305A] leading-relaxed italic">
            {blog.excerpt}
          </div>

          {/* Formatted Content */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-[#12305A] leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-6 border-t border-[#DCE5EF] flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#5F6F82]">Tags:</span>
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#F7FAFD] border border-[#DCE5EF] text-xs font-medium text-[#12305A]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Counselor Callout Box */}
          <div className="p-6 rounded-2xl bg-linear-to-r from-[#0757C9]/10 via-[#159EAE]/10 to-transparent border border-[#0757C9]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
            <div>
              <h3 className="text-sm font-bold text-[#12305A]">Need Personalized College Counseling?</h3>
              <p className="text-xs text-[#5F6F82] mt-0.5">
                Our expert counselors provide verified guidance on NEET ranks, state merit lists, and quota seats.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openEnquiry(blog.title)}
              className="px-5 py-2.5 rounded-xl bg-[#0757C9] hover:bg-[#06449E] text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
            >
              Consult Admissions Team
            </button>
          </div>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-[#12305A]">
              Related {isPrivate ? 'Private College' : 'Government College'} Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blogs/${rel.slug}`}
                  className="bg-white rounded-2xl border border-[#DCE5EF] hover:border-[#0757C9] p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#12305A] group-hover:text-[#0757C9] line-clamp-2 mb-1.5">
                      {rel.title}
                    </h4>
                    <p className="text-[11px] text-[#5F6F82] line-clamp-2">{rel.excerpt}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#0757C9] mt-3 flex items-center gap-1">
                    Read article <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
