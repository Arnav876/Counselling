import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { collegeService } from '../services/collegeService';
import type { College, FilterState, SortOption, StateData } from '../types/college';
import { StaggerContainer, StaggerItem } from '../components/ui/motion';

export const Colleges: React.FC = () => {
  const location = useLocation();
  const { toggleCompare, isInCompare, toggleBookmark, isBookmarked, openEnquiry } = useCompare();

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableStates, setAvailableStates] = useState<StateData[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalColleges, setTotalColleges] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    state: 'ALL',
    distance: 'all',
    managementType: ['General Management', 'NRI'],
    stream: 'all',
  });

  const [sort, setSort] = useState<SortOption>('relevance');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Apply initial state filter from navigation
  useEffect(() => {
    if (location.state?.filterState) {
      setFilters((prev) => ({ ...prev, state: location.state.filterState }));
      setPage(1);
    }
  }, [location.state]);

  // Load states for filter
  useEffect(() => {
    collegeService.getPopularStates().then(setAvailableStates).catch(console.error);
  }, []);

  // Load colleges
  useEffect(() => {
    loadColleges();
  }, [filters, sort, page]);

  const loadColleges = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await collegeService.getCollegesPaginated(filters, sort, page, limit);
      setColleges(result.colleges);
      setTotalColleges(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (err: any) {
      console.error('Failed to load colleges:', err);
      setError('Unable to load colleges from live backend. Please check connection and retry.');
      setColleges([]);
      setTotalColleges(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleManagementToggle = (type: 'General Management' | 'NRI') => {
    setFilters((prev) => {
      const current = prev.managementType || [];
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      return { ...prev, managementType: updated };
    });
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      state: 'ALL',
      distance: 'all',
      managementType: ['General Management', 'NRI'],
      stream: 'all',
    });
    setSort('relevance');
    setPage(1);
  };

  const openCollegeDetail = (college: College) => {
    setSelectedCollege(college);
  };

  const closeCollegeDetail = () => {
    setSelectedCollege(null);
  };

  const getPaginationRange = (current: number, total: number) => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const startIndex = totalColleges > 0 ? (page - 1) * limit + 1 : 0;
  const endIndex = Math.min(page * limit, totalColleges);

  return (
    <div className="min-h-screen bg-[#F7FAFD]">
      {/* Header / Control bar */}
      <div className="bg-white border-b border-[#DCE5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#DCE5EF]">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#12305A]">Explore Institutions</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-[#0757C9]">
                  {loading ? 'Searching live database...' : `Showing ${startIndex}-${endIndex} of ${totalColleges} Colleges Found`}
                </span>
                <span className="text-[#5F6F82] text-xs">• Verified Admissions 2025-26</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile Filter Modal Toggle */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#DCE5EF] bg-white text-[#12305A] text-xs font-semibold hover:bg-[#F7FAFD] transition-colors cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0757C9]">tune</span>
                <span>Filter Options</span>
              </button>
              {/* Sort By Selector */}
              <div className="relative flex items-center">
                <span className="text-xs text-[#5F6F82] mr-2 hidden sm:inline">Sort by:</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as SortOption);
                      setPage(1);
                    }}
                    className="h-10 pl-3 pr-8 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] bg-white appearance-none focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9] cursor-pointer"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="distance-asc">Distance: Low to High</option>
                    <option value="distance-desc">Distance: High to Low</option>
                    <option value="rating-desc">Rating: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5F6F82] text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Layout Grid: Desktop Sidebar (3 cols) + College Card Feed (9 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-6 bg-white p-5 rounded-2xl border border-[#DCE5EF] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE5EF]">
                <h3 className="text-sm font-bold text-[#12305A] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0757C9] text-[20px]">filter_alt</span>
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-[#0757C9] hover:text-[#06449E] transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-semibold text-[#12305A] mb-2">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="College name, city, or course..."
                  className="w-full h-10 px-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] bg-white placeholder:text-[#5F6F82]/60 focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
                />
              </div>

              {/* State Filter */}
              <div>
                <label className="block text-xs font-semibold text-[#12305A] mb-2">State / Region</label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] bg-white focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
                >
                  <option value="ALL">All States ({availableStates.reduce((acc, s) => acc + s.collegeCount, 0) || '800+'})</option>
                  {availableStates.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} ({s.collegeCount})
                    </option>
                  ))}
                </select>
              </div>

              {/* Distance Filter */}
              <div>
                <label className="block text-xs font-semibold text-[#12305A] mb-2">Maximum Distance</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Any Proximity' },
                    { value: '10', label: 'Within 10 km' },
                    { value: '25', label: 'Within 25 km' },
                    { value: '50', label: 'Within 50 km' },
                    { value: '100', label: 'Within 100 km' },
                    { value: '100+', label: '100+ km' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2.5 text-sm text-[#5F6F82] hover:text-[#12305A] cursor-pointer">
                      <input
                        type="radio"
                        name="distance_rad"
                        checked={filters.distance === option.value}
                        onChange={() => handleFilterChange('distance', option.value)}
                        className="text-[#0757C9] focus:ring-[#0757C9] w-4 h-4 border-[#DCE5EF]"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Management Type Checkboxes */}
              <div className="pt-2 border-t border-[#DCE5EF]">
                <label className="block text-xs font-semibold text-[#12305A] mb-2">Management Quota</label>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 text-sm text-[#5F6F82] hover:text-[#12305A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.managementType?.includes('General Management')}
                      onChange={() => handleManagementToggle('General Management')}
                      className="rounded text-[#0757C9] focus:ring-[#0757C9] w-4 h-4 border-[#DCE5EF]"
                    />
                    <span>General Management</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-sm text-[#5F6F82] hover:text-[#12305A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.managementType?.includes('NRI')}
                      onChange={() => handleManagementToggle('NRI')}
                      className="rounded text-[#0757C9] focus:ring-[#0757C9] w-4 h-4 border-[#DCE5EF]"
                    />
                    <span>NRI Seat Quota</span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={loadColleges}
                className="w-full py-2.5 rounded-lg bg-[#0757C9] text-white text-xs font-semibold hover:bg-[#06449E] transition-all active:scale-[0.98] shadow-sm cursor-pointer"
              >
                Apply Filters
              </button>
            </aside>

            {/* College Card Feed (9 cols) */}
            <div className="col-span-1 lg:col-span-9 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500">error</span>
                    <span>{error}</span>
                  </div>
                  <button
                    onClick={loadColleges}
                    className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {loading ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[#159EAE]/10 text-[#159EAE] flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-[32px] animate-spin">refresh</span>
                  </div>
                  <p className="text-sm text-[#5F6F82]">Loading colleges...</p>
                </div>
              ) : colleges.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-[#DCE5EF] p-8 shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-[#0757C9]/10 text-[#0757C9] flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-[32px]">manage_search</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#12305A] mb-2">No Matching Institutions Found</h3>
                  <p className="text-sm text-[#5F6F82] max-w-md mx-auto mb-6">
                    Try expanding your proximity radius, switching state selections, or resetting quota checkboxes.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0757C9] text-white text-xs font-semibold hover:bg-[#06449E] transition-all shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    <span>Reset All Filters</span>
                  </button>
                </div>
              ) : (
                <>
                  <StaggerContainer>
                    <div className="space-y-4">
                    {colleges.map((college) => (
                      <StaggerItem key={college.id}>
                        <div className="bg-white rounded-2xl border border-[#DCE5EF] shadow-xs overflow-hidden hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row">
                            {/* Image */}
                            <div className="sm:w-52 h-48 sm:h-auto flex-shrink-0 relative">
                              <img
                                src={college.image}
                                alt={college.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 left-3 flex gap-2">
                                {college.nirfRank && (
                                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#159EAE] text-white shadow-xs">
                                    NIRF #{college.nirfRank}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-5 flex flex-col">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                  <h3 className="text-lg font-bold text-[#12305A] mb-1 leading-snug">{college.name}</h3>
                                  <p className="text-sm text-[#5F6F82] flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px] text-[#0757C9]">location_on</span>
                                    {college.city}, {college.state}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 text-[#087C8B] font-bold text-sm bg-[#159EAE]/10 px-2 py-0.5 rounded-md">
                                  <span className="material-symbols-outlined text-[18px] text-[#FFBE2E]">star</span>
                                  <span>{college.rating}</span>
                                </div>
                              </div>

                              <p className="text-sm text-[#5F6F82] mb-4 line-clamp-2 leading-relaxed">{college.shortDescription}</p>

                              {/* Metrics */}
                              <div className="flex flex-wrap gap-4 mb-4 text-sm bg-[#F7FAFD] p-2.5 rounded-xl border border-[#DCE5EF]/60">
                                <div>
                                  <span className="text-[#5F6F82] text-xs block">Distance</span>
                                  <span className="font-bold text-[#12305A]">{college.distance} km</span>
                                </div>
                                <div className="w-px bg-[#DCE5EF]"></div>
                                <div>
                                  <span className="text-[#5F6F82] text-xs block">Est. Year</span>
                                  <span className="font-bold text-[#12305A]">{college.estYear}</span>
                                </div>
                                <div className="w-px bg-[#DCE5EF]"></div>
                                <div>
                                  <span className="text-[#5F6F82] text-xs block">Avg Package</span>
                                  <span className="font-bold text-[#0757C9]">{college.packageStats.average}</span>
                                </div>
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {college.managementTypes.map((type) => (
                                  <span
                                    key={type}
                                    className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#0757C9]/10 text-[#0757C9] border border-[#0757C9]/20"
                                  >
                                    {type}
                                  </span>
                                ))}
                                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#159EAE]/10 text-[#087C8B] border border-[#159EAE]/20">
                                  {college.accreditation}
                                </span>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#DCE5EF]">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={isInCompare(college.id)}
                                    onChange={() => toggleCompare(college)}
                                    className="rounded text-[#0757C9] focus:ring-[#0757C9] w-4 h-4 border-[#DCE5EF]"
                                  />
                                  <span className="text-sm font-medium text-[#5F6F82] hover:text-[#12305A]">Compare</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleBookmark(college.id)}
                                    className="p-2 rounded-lg text-[#5F6F82] hover:text-[#0757C9] hover:bg-[#F7FAFD] transition-colors cursor-pointer"
                                    title={isBookmarked(college.id) ? 'Remove from saved' : 'Save college'}
                                  >
                                    <span className="material-symbols-outlined text-[20px] text-[#0757C9]">
                                      {isBookmarked(college.id) ? 'bookmark' : 'bookmark_border'}
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => openCollegeDetail(college)}
                                    className="px-4 py-2 rounded-lg bg-[#0757C9] text-white text-xs font-semibold hover:bg-[#06449E] transition-all active:scale-[0.98] shadow-xs cursor-pointer"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>

                {/* Pagination Navigation Bar */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-2xl border border-[#DCE5EF] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs mt-6">
                    <div className="text-xs text-[#5F6F82]">
                      Showing Page <span className="font-bold text-[#12305A]">{page}</span> of{' '}
                      <span className="font-bold text-[#12305A]">{totalPages}</span> ({totalColleges} total colleges)
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => {
                          setPage((p) => Math.max(1, p - 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#DCE5EF] bg-white text-[#12305A] text-xs font-semibold hover:bg-[#F7FAFD] disabled:opacity-35 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                        <span>Previous</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {getPaginationRange(page, totalPages).map((p, idx) =>
                          typeof p === 'number' ? (
                            <button
                              key={`page-${p}`}
                              type="button"
                              onClick={() => {
                                setPage(p);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                page === p
                                  ? 'bg-[#0757C9] text-white shadow-xs'
                                  : 'bg-white border border-[#DCE5EF] text-[#12305A] hover:bg-[#F7FAFD]'
                              }`}
                            >
                              {p}
                            </button>
                          ) : (
                            <span key={`dots-${idx}`} className="px-1 text-xs text-[#5F6F82]">
                              ...
                            </span>
                          )
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => {
                          setPage((p) => Math.min(totalPages, p + 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#DCE5EF] bg-white text-[#12305A] text-xs font-semibold hover:bg-[#F7FAFD] disabled:opacity-35 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer"
                      >
                        <span>Next</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-[#12305A]/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-sm h-full overflow-y-auto p-5 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE5EF]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0757C9] text-[22px]">tune</span>
                <h3 className="text-lg font-bold text-[#12305A]">Filter Institutions</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-[#5F6F82] hover:bg-[#F7FAFD]"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Mobile filters - same as desktop */}
            <div>
              <label className="block text-xs font-semibold text-[#12305A] mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="College name, city, or course..."
                className="w-full h-10 px-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] bg-white placeholder:text-[#5F6F82]/60 focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12305A] mb-2">State / Region</label>
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[#DCE5EF] text-sm text-[#12305A] bg-white focus:border-[#0757C9] focus:ring-1 focus:ring-[#0757C9]"
              >
                <option value="ALL">All States ({availableStates.reduce((acc, s) => acc + s.collegeCount, 0) || '800+'})</option>
                {availableStates.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.collegeCount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12305A] mb-2">Proximity Radius</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'all', label: 'Any Distance' },
                  { value: '10', label: '< 10 km' },
                  { value: '25', label: '< 25 km' },
                  { value: '50', label: '< 50 km' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-[#DCE5EF] bg-[#F7FAFD] text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="mobile_distance_rad"
                      checked={filters.distance === option.value}
                      onChange={() => handleFilterChange('distance', option.value)}
                      className="text-[#0757C9]"
                    />
                    <span className="text-[#12305A] text-xs font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12305A] mb-2">Management Allocation</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.managementType?.includes('General Management')}
                    onChange={() => handleManagementToggle('General Management')}
                    className="rounded text-[#0757C9]"
                  />
                  <span className="text-sm text-[#5F6F82]">General Management Quota</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.managementType?.includes('NRI')}
                    onChange={() => handleManagementToggle('NRI')}
                    className="rounded text-[#0757C9]"
                  />
                  <span className="text-sm text-[#5F6F82]">NRI Seat Quota</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DCE5EF] flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-3 rounded-lg border border-[#DCE5EF] text-xs font-semibold text-[#12305A] hover:bg-[#F7FAFD]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  loadColleges();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-3 rounded-lg bg-[#0757C9] text-white text-xs font-semibold hover:bg-[#06449E]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* College Detail Modal */}
      {selectedCollege && (
        <div className="fixed inset-0 z-50 bg-[#12305A]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#DCE5EF]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#DCE5EF] flex items-start justify-between bg-[#F7FAFD]">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0757C9] text-white text-xl font-bold flex items-center justify-center shrink-0 shadow-xs">
                  {selectedCollege.shortName}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {selectedCollege.managementTypes.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-0.5 rounded text-xs font-semibold bg-[#0757C9]/10 text-[#0757C9] border border-[#0757C9]/20"
                      >
                        {type}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#159EAE]/10 text-[#087C8B] border border-[#159EAE]/20">
                      {selectedCollege.accreditation}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#5F6F82]">
                      <span className="material-symbols-outlined text-[16px] text-[#0757C9]">distance</span>
                      {selectedCollege.distance} km away
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#12305A] leading-tight">{selectedCollege.name}</h2>
                  <p className="text-sm text-[#5F6F82] flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-[#0757C9]">location_on</span>
                    {selectedCollege.city}, {selectedCollege.state}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCollegeDetail}
                className="p-1.5 rounded-lg text-[#5F6F82] hover:bg-[#F7FAFD] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-5">
              <div>
                <h4 className="text-sm font-bold text-[#12305A] mb-2">Institutional Profile</h4>
                <p className="text-sm text-[#5F6F82] leading-relaxed">{selectedCollege.fullDescription}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-[#F7FAFD] rounded-xl border border-[#DCE5EF]">
                  <span className="text-xs text-[#5F6F82] block">Established</span>
                  <span className="text-sm font-bold text-[#12305A]">{selectedCollege.estYear}</span>
                </div>
                <div className="p-3 bg-[#F7FAFD] rounded-xl border border-[#DCE5EF]">
                  <span className="text-xs text-[#5F6F82] block">Student Rating</span>
                  <span className="text-sm font-bold text-[#087C8B] flex items-center gap-1">
                    {selectedCollege.rating} ★
                  </span>
                </div>
                <div className="p-3 bg-[#F7FAFD] rounded-xl border border-[#DCE5EF]">
                  <span className="text-xs text-[#5F6F82] block">Annual Tuition</span>
                  <span className="text-sm font-bold text-[#0757C9]">
                    {selectedCollege.courses[0]?.annualFee || 'N/A'}
                  </span>
                </div>
                <div className="p-3 bg-[#F7FAFD] rounded-xl border border-[#DCE5EF]">
                  <span className="text-xs text-[#5F6F82] block">Campus Reviews</span>
                  <span className="text-sm font-bold text-[#12305A]">{selectedCollege.reviewsCount}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#159EAE]/5 border border-[#159EAE]/20">
                <h5 className="text-sm font-bold text-[#087C8B] mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#159EAE]">verified_user</span>
                  Key Highlights
                </h5>
                <ul className="text-sm text-[#12305A] space-y-1.5">
                  {selectedCollege.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#159EAE] mt-0.5">check_circle</span>
                      <span className="text-[#5F6F82]">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#12305A] mb-2">Available Courses & Fees</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCollege.courses.map((course) => (
                    <div key={course.id} className="p-3.5 bg-[#F7FAFD] rounded-xl border border-[#DCE5EF]">
                      <div className="text-sm font-bold text-[#12305A]">{course.name}</div>
                      <div className="text-xs text-[#5F6F82] mt-1">{course.degree} • {course.duration}</div>
                      <div className="text-xs text-[#0757C9] font-bold mt-1.5">{course.annualFee}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#12305A] mb-2">Placement Statistics</h4>
                <div className="p-4 bg-[#F7FAFD] rounded-xl border border-[#DCE5EF]">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-[#5F6F82] block">Average Package</span>
                      <span className="text-sm font-bold text-[#0757C9]">{selectedCollege.packageStats.average}</span>
                    </div>
                    <div>
                      <span className="text-xs text-[#5F6F82] block">Highest Package</span>
                      <span className="text-sm font-bold text-[#159EAE]">{selectedCollege.packageStats.highest}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#DCE5EF]">
                    <span className="text-xs text-[#5F6F82] block mb-1.5">Top Recruiters</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedCollege.packageStats.topRecruiters.map((recruiter) => (
                        <span key={recruiter} className="px-2.5 py-0.5 rounded text-xs font-medium bg-white text-[#12305A] border border-[#DCE5EF]">
                          {recruiter}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[#DCE5EF] bg-[#F7FAFD] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleBookmark(selectedCollege.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DCE5EF] text-[#12305A] text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0757C9]">
                  {isBookmarked(selectedCollege.id) ? 'bookmark' : 'bookmark_border'}
                </span>
                <span>{isBookmarked(selectedCollege.id) ? 'Saved' : 'Save College'}</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleCompare(selectedCollege);
                  }}
                  className="px-3.5 py-2 rounded-lg border border-[#DCE5EF] text-[#12305A] text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
                >
                  {isInCompare(selectedCollege.id) ? 'Remove from Compare' : '+ Compare'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeCollegeDetail();
                    openEnquiry(selectedCollege.name);
                  }}
                  className="px-5 py-2 rounded-lg bg-[#0757C9] text-white text-xs font-semibold hover:bg-[#06449E] transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                >
                  Enquire / Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
