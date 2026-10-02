import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { collegeService } from '../services/collegeService';
import type { College, FilterState, SortOption } from '../types/college';
import { StaggerContainer, StaggerItem } from '../components/ui/motion';

export const Colleges: React.FC = () => {
  const location = useLocation();
  const { toggleCompare, isInCompare, toggleBookmark, isBookmarked, openEnquiry } = useCompare();

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

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
    }
  }, [location.state]);

  // Load colleges
  useEffect(() => {
    loadColleges();
  }, [filters, sort]);

  const loadColleges = async () => {
    setLoading(true);
    const result = await collegeService.getColleges(filters, sort);
    setColleges(result);
    setLoading(false);
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleManagementToggle = (type: 'General Management' | 'NRI') => {
    setFilters((prev) => {
      const current = prev.managementType || [];
      if (current.includes(type)) {
        return { ...prev, managementType: current.filter((t) => t !== type) };
      }
      return { ...prev, managementType: [...current, type] };
    });
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
  };

  const openCollegeDetail = (college: College) => {
    setSelectedCollege(college);
  };

  const closeCollegeDetail = () => {
    setSelectedCollege(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header / Control bar */}
      <div className="bg-white border-b border-[#c6c6cd]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#c6c6cd]/30">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">Explore Institutions</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-[#0051d5]">
                  Showing {colleges.length} Colleges Found
                </span>
                <span className="text-[#45464d] text-xs">• Verified Admissions 2025</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile Filter Modal Toggle */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#c6c6cd] bg-white text-[#0b1c30] text-xs font-semibold hover:bg-[#eff4ff] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>Filter Options</span>
              </button>
              {/* Sort By Selector */}
              <div className="relative flex items-center">
                <span className="text-xs text-[#45464d] mr-2 hidden sm:inline">Sort by:</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="h-10 pl-3 pr-8 rounded-lg border border-[#c6c6cd] text-sm text-[#0b1c30] bg-white appearance-none focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5]"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="distance-asc">Distance: Low to High</option>
                    <option value="distance-desc">Distance: High to Low</option>
                    <option value="rating-desc">Rating: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#76777d] text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Layout Grid: Desktop Sidebar (3 cols) + College Card Feed (9 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-6 bg-white p-5 rounded-2xl border border-[#c6c6cd]/40 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
                <h3 className="text-sm font-semibold text-[#0b1c30] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0051d5] text-[20px]">filter_alt</span>
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-[#0051d5] hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-2">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="College name, city, or course..."
                  className="w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm text-[#0b1c30] bg-white focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5]"
                />
              </div>

              {/* State Filter */}
              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-2">State / Region</label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm text-[#0b1c30] bg-white"
                >
                  <option value="ALL">All States</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>

              {/* Distance Filter */}
              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-2">Maximum Distance</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Any Proximity' },
                    { value: '10', label: 'Within 10 km' },
                    { value: '25', label: 'Within 25 km' },
                    { value: '50', label: 'Within 50 km' },
                    { value: '100', label: 'Within 100 km' },
                    { value: '100+', label: '100+ km' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2.5 text-sm text-[#45464d] cursor-pointer">
                      <input
                        type="radio"
                        name="distance_rad"
                        checked={filters.distance === option.value}
                        onChange={() => handleFilterChange('distance', option.value)}
                        className="text-[#0051d5] focus:ring-[#0051d5] w-4 h-4 border-[#c6c6cd]"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Management Type Checkboxes */}
              <div className="pt-2 border-t border-[#c6c6cd]/30">
                <label className="block text-xs font-semibold text-[#0b1c30] mb-2">Management Quota</label>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 text-sm text-[#45464d] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.managementType?.includes('General Management')}
                      onChange={() => handleManagementToggle('General Management')}
                      className="rounded text-[#0051d5] focus:ring-[#0051d5] w-4 h-4 border-[#c6c6cd]"
                    />
                    <span>General Management</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-sm text-[#45464d] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.managementType?.includes('NRI')}
                      onChange={() => handleManagementToggle('NRI')}
                      className="rounded text-[#0051d5] focus:ring-[#0051d5] w-4 h-4 border-[#c6c6cd]"
                    />
                    <span>NRI Seat Quota</span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={loadColleges}
                className="w-full py-2.5 rounded-lg bg-[#0b1c30] text-white text-xs font-semibold hover:bg-[#213145] transition-all active:scale-[0.98]"
              >
                Apply Filters
              </button>
            </aside>

            {/* College Card Feed (9 cols) */}
            <div className="col-span-1 lg:col-span-9 space-y-5">
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[#eff4ff] text-[#76777d] flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-[32px] animate-spin">refresh</span>
                  </div>
                  <p className="text-sm text-[#45464d]">Loading colleges...</p>
                </div>
              ) : colleges.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-[#c6c6cd]/40 p-8">
                  <div className="w-16 h-16 rounded-full bg-[#eff4ff] text-[#76777d] flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-[32px]">manage_search</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#0b1c30] mb-2">No Matching Institutions Found</h3>
                  <p className="text-sm text-[#45464d] max-w-md mx-auto mb-6">
                    Try expanding your proximity radius, switching state selections, or resetting quota checkboxes.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0051d5] text-white text-xs font-semibold hover:bg-[#316bf3] transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    <span>Reset All Filters</span>
                  </button>
                </div>
              ) : (
                <StaggerContainer>
                  <div className="space-y-4">
                    {colleges.map((college) => (
                      <StaggerItem key={college.id}>
                        <div className="bg-white rounded-2xl border border-[#c6c6cd]/40 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row">
                            {/* Image */}
                            <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 relative">
                              <img
                                src={college.image}
                                alt={college.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 left-3 flex gap-2">
                                {college.nirfRank && (
                                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#069669] text-white">
                                    NIRF #{college.nirfRank}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-5 flex flex-col">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                  <h3 className="text-lg font-semibold text-[#0b1c30] mb-1">{college.name}</h3>
                                  <p className="text-sm text-[#45464d] flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                    {college.city}, {college.state}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 text-[#069669] font-semibold">
                                  <span className="material-symbols-outlined text-[18px]">star</span>
                                  <span>{college.rating}</span>
                                </div>
                              </div>

                              <p className="text-sm text-[#45464d] mb-4 line-clamp-2">{college.shortDescription}</p>

                              {/* Metrics */}
                              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                                <div>
                                  <span className="text-[#76777d] text-xs block">Distance</span>
                                  <span className="font-semibold text-[#0b1c30]">{college.distance} km</span>
                                </div>
                                <div className="w-px bg-[#c6c6cd]"></div>
                                <div>
                                  <span className="text-[#76777d] text-xs block">Est. Year</span>
                                  <span className="font-semibold text-[#0b1c30]">{college.estYear}</span>
                                </div>
                                <div className="w-px bg-[#c6c6cd]"></div>
                                <div>
                                  <span className="text-[#76777d] text-xs block">Avg Package</span>
                                  <span className="font-semibold text-[#0b1c30]">{college.packageStats.average}</span>
                                </div>
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {college.managementTypes.map((type) => (
                                  <span
                                    key={type}
                                    className="px-2 py-0.5 rounded text-xs font-semibold bg-[#0051d5]/10 text-[#0051d5] border border-[#0051d5]/20"
                                  >
                                    {type}
                                  </span>
                                ))}
                                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#eff4ff] text-[#45464d] border border-[#c6c6cd]/50">
                                  {college.accreditation}
                                </span>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#c6c6cd]/30">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={isInCompare(college.id)}
                                    onChange={() => toggleCompare(college)}
                                    className="rounded text-[#0051d5] focus:ring-[#0051d5] w-4 h-4 border-[#c6c6cd]"
                                  />
                                  <span className="text-sm text-[#45464d]">Compare</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleBookmark(college.id)}
                                    className="p-2 rounded-lg text-[#45464d] hover:bg-[#eff4ff] transition-colors"
                                    title={isBookmarked(college.id) ? 'Remove from saved' : 'Save college'}
                                  >
                                    <span className="material-symbols-outlined text-[20px]">
                                      {isBookmarked(college.id) ? 'bookmark' : 'bookmark_border'}
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => openCollegeDetail(college)}
                                    className="px-4 py-2 rounded-lg bg-[#0051d5] text-white text-xs font-semibold hover:bg-[#316bf3] transition-all active:scale-[0.98]"
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b1c30]/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-sm h-full overflow-y-auto p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#c6c6cd]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0051d5] text-[22px]">tune</span>
                <h3 className="text-lg font-semibold text-[#0b1c30]">Filter Institutions</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-[#45464d] hover:bg-[#eff4ff]"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Mobile filters - same as desktop */}
            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="College name, city, or course..."
                className="w-full h-10 px-3 rounded-lg border border-[#c6c6cd] text-sm text-[#0b1c30] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-2">State / Region</label>
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[#c6c6cd] text-sm text-[#0b1c30] bg-white"
              >
                <option value="ALL">All States</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Delhi">Delhi</option>
                <option value="Kerala">Kerala</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-2">Proximity Radius</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'all', label: 'Any Distance' },
                  { value: '10', label: '< 10 km' },
                  { value: '25', label: '< 25 km' },
                  { value: '50', label: '< 50 km' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-[#c6c6cd]/60 bg-[#eff4ff] text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="mobile_distance_rad"
                      checked={filters.distance === option.value}
                      onChange={() => handleFilterChange('distance', option.value)}
                      className="text-[#0051d5]"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-2">Management Allocation</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.managementType?.includes('General Management')}
                    onChange={() => handleManagementToggle('General Management')}
                    className="rounded text-[#0051d5]"
                  />
                  <span>General Management Quota</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.managementType?.includes('NRI')}
                    onChange={() => handleManagementToggle('NRI')}
                    className="rounded text-[#0051d5]"
                  />
                  <span>NRI Seat Quota</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-[#c6c6cd]/30 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-3 rounded-lg border border-[#c6c6cd] text-xs text-[#0b1c30]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  loadColleges();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-3 rounded-lg bg-[#0051d5] text-white text-xs font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* College Detail Modal */}
      {selectedCollege && (
        <div className="fixed inset-0 z-50 bg-[#0b1c30]/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#c6c6cd]/40">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#c6c6cd]/30 flex items-start justify-between bg-[#eff4ff]/40">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0051d5] text-white text-xl font-bold flex items-center justify-center shrink-0 shadow-sm">
                  {selectedCollege.shortName}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {selectedCollege.managementTypes.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-0.5 rounded text-xs font-semibold bg-[#0051d5]/10 text-[#0051d5] border border-[#0051d5]/20"
                      >
                        {type}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#002114] text-[#069669]">
                      {selectedCollege.accreditation}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#76777d]">
                      <span className="material-symbols-outlined text-[16px]">distance</span>
                      {selectedCollege.distance} km away
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#0b1c30] leading-tight">{selectedCollege.name}</h2>
                  <p className="text-sm text-[#45464d] flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {selectedCollege.city}, {selectedCollege.state}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCollegeDetail}
                className="p-1.5 rounded-lg text-[#45464d] hover:bg-[#eff4ff] transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-[#0b1c30] mb-2">Institutional Profile</h4>
                  <p className="text-sm text-[#0b1c30] leading-relaxed">{selectedCollege.fullDescription}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/40">
                    <span className="text-xs text-[#76777d] block">Established</span>
                    <span className="text-sm font-semibold text-[#0b1c30]">{selectedCollege.estYear}</span>
                  </div>
                  <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/40">
                    <span className="text-xs text-[#76777d] block">Student Rating</span>
                    <span className="text-sm font-semibold text-[#069669] flex items-center gap-1">
                      {selectedCollege.rating} ★
                    </span>
                  </div>
                  <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/40">
                    <span className="text-xs text-[#76777d] block">Annual Tuition</span>
                    <span className="text-sm font-semibold text-[#0b1c30]">
                      {selectedCollege.courses[0]?.annualFee || 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/40">
                    <span className="text-xs text-[#76777d] block">Campus Reviews</span>
                    <span className="text-sm font-semibold text-[#0b1c30]">{selectedCollege.reviewsCount}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0051d5]/5 border border-[#0051d5]/20">
                  <h5 className="text-sm font-semibold text-[#0051d5] mb-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    Highlights
                  </h5>
                  <ul className="text-sm text-[#0b1c30] space-y-1">
                    {selectedCollege.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[16px] text-[#069669]">check_circle</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#0b1c30] mb-2">Available Courses</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCollege.courses.map((course) => (
                      <div key={course.id} className="p-3 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/40">
                        <div className="text-sm font-semibold text-[#0b1c30]">{course.name}</div>
                        <div className="text-xs text-[#45464d] mt-1">{course.degree} • {course.duration}</div>
                        <div className="text-xs text-[#0051d5] font-semibold mt-1">{course.annualFee}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#0b1c30] mb-2">Placement Statistics</h4>
                  <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#c6c6cd]/40">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-[#76777d] block">Average Package</span>
                        <span className="text-sm font-semibold text-[#0b1c30]">{selectedCollege.packageStats.average}</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#76777d] block">Highest Package</span>
                        <span className="text-sm font-semibold text-[#0b1c30]">{selectedCollege.packageStats.highest}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-xs text-[#76777d] block">Top Recruiters</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedCollege.packageStats.topRecruiters.map((recruiter) => (
                          <span key={recruiter} className="px-2 py-0.5 rounded text-xs bg-white border border-[#c6c6cd]/60">
                            {recruiter}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[#c6c6cd]/30 bg-[#eff4ff]/40 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleBookmark(selectedCollege.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#c6c6cd] text-[#0b1c30] text-xs hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
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
                  className="px-3.5 py-2 rounded-lg border border-[#c6c6cd] text-[#0b1c30] text-xs hover:bg-white transition-colors"
                >
                  {isInCompare(selectedCollege.id) ? 'Remove from Compare' : '+ Compare'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeCollegeDetail();
                    openEnquiry(selectedCollege.name);
                  }}
                  className="px-5 py-2 rounded-lg bg-[#0051d5] text-white text-xs font-semibold hover:bg-[#316bf3] transition-all active:scale-[0.98] shadow-sm"
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
