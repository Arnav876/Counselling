import React from 'react';
import { useCompare } from '../context/CompareContext';
import { FadeIn } from '../components/ui/motion';

export const Compare: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, openEnquiry } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#eff4ff] text-[#76777d] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[40px]">compare_arrows</span>
          </div>
          <h2 className="text-2xl font-bold text-[#0b1c30] mb-2">No Colleges Selected</h2>
          <p className="text-sm text-[#45464d] mb-6">
            Select up to 3 colleges from the Explore page to compare them side-by-side.
          </p>
          <a
            href="/colleges"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0051d5] text-white text-sm font-semibold hover:bg-[#316bf3] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>Explore Colleges</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] mb-2">
                Compare Institutions
              </h1>
              <p className="text-sm text-[#45464d]">
                Benchmark key academic metrics, quotas, and criteria side-by-side.
              </p>
            </div>
            <button
              type="button"
              onClick={clearCompare}
              className="text-sm text-[#ba1a1a] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">clear_all</span>
              Clear All
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-white rounded-2xl border border-[#c6c6cd]/40 shadow-sm overflow-hidden">
            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#c6c6cd]/30">
                    <th className="text-left p-4 sm:p-6 bg-[#eff4ff]/50 font-semibold text-[#0b1c30] text-sm min-w-[150px]">
                      Attribute
                    </th>
                    {compareList.map((college) => (
                      <th key={college.id} className="p-4 sm:p-6 bg-[#eff4ff]/50 min-w-[250px]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-xl bg-[#0051d5] text-white font-bold flex items-center justify-center text-sm">
                            {college.shortName}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-semibold text-[#0b1c30]">{college.name}</div>
                            <div className="text-xs text-[#45464d]">{college.city}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCompare(college.id)}
                          className="text-xs text-[#ba1a1a] hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                          Remove
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* NIRF Rank */}
                  <tr className="border-b border-[#c6c6cd]/20">
                    <td className="p-4 sm:p-6 text-sm text-[#45464d] font-medium">NIRF Ranking</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#0b1c30]">
                        {college.nirfRank ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#069669]/10 text-[#069669] font-semibold">
                            <span className="material-symbols-outlined text-[14px]">emoji_events</span>
                            #{college.nirfRank}
                          </span>
                        ) : (
                          <span className="text-[#76777d]">N/A</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr className="border-b border-[#c6c6cd]/20">
                    <td className="p-4 sm:p-6 text-sm text-[#45464d] font-medium">Student Rating</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#0b1c30]">
                        <div className="flex items-center gap-1 text-[#069669] font-semibold">
                          <span className="material-symbols-outlined text-[18px]">star</span>
                          {college.rating}
                        </div>
                        <div className="text-xs text-[#76777d]">{college.reviewsCount} reviews</div>
                      </td>
                    ))}
                  </tr>

                  {/* Established Year */}
                  <tr className="border-b border-[#c6c6cd]/20">
                    <td className="p-4 sm:p-6 text-sm text-[#45464d] font-medium">Established</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#0b1c30] font-semibold">
                        {college.estYear}
                      </td>
                    ))}
                  </tr>

                  {/* Accreditation */}
                  <tr className="border-b border-[#c6c6cd]/20">
                    <td className="p-4 sm:p-6 text-sm text-[#45464d] font-medium">Accreditation</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#0b1c30]">
                        <span className="px-2 py-0.5 rounded bg-[#002114] text-[#069669] font-semibold text-xs">
                          {college.accreditation}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Management Types */}
                  <tr className="border-b border-[#c6c6cd]/20">
                    <td className="p-4 sm:p-6 text-sm text-[#45464d] font-medium">Management Quota</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {college.managementTypes.map((type) => (
                            <span
                              key={type}
                              className="px-2 py-0.5 rounded text-xs font-semibold bg-[#0051d5]/10 text-[#0051d5] border border-[#0051d5]/20"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Distance */}
                  <tr className="border-b border-[#c6c6cd]/20">
                    <td className="p-4 sm:p-6 text-sm text-[#45464d] font-medium">Distance</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#0b1c30] font-semibold">
                        {college.distance} km
                      </td>
                    ))}
                  </tr>

                  {/* Average Package */}
                  <tr className="border-b border-[#c6c6cd]/20">
                    <td className="p-4 sm:p-6 text-sm text-[#45464d] font-medium">Average Package</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#0b1c30] font-semibold">
                        {college.packageStats.average}
                      </td>
                    ))}
                  </tr>

                  {/* Highest Package */}
                  <tr className="border-b border-[#c6c6cd]/20">
                    <td className="p-4 sm:p-6 text-sm text-[#45464d] font-medium">Highest Package</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#0b1c30] font-semibold">
                        {college.packageStats.highest}
                      </td>
                    ))}
                  </tr>

                  {/* Top Recruiters */}
                  <tr className="border-b border-[#c6c6cd]/20">
                    <td className="p-4 sm:p-6 text-sm text-[#45464d] font-medium">Top Recruiters</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {college.packageStats.topRecruiters.slice(0, 4).map((recruiter) => (
                            <span
                              key={recruiter}
                              className="px-2 py-0.5 rounded text-xs bg-[#eff4ff] border border-[#c6c6cd]/60"
                            >
                              {recruiter}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Courses */}
                  <tr className="border-b border-[#c6c6cd]/20">
                    <td className="p-4 sm:p-6 text-sm text-[#45464d] font-medium">Popular Courses</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm">
                        <div className="space-y-2">
                          {college.courses.slice(0, 3).map((course) => (
                            <div key={course.id} className="text-xs">
                              <div className="font-semibold text-[#0b1c30]">{course.name}</div>
                              <div className="text-[#45464d]">{course.annualFee}</div>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Entrance Exams */}
                  <tr className="border-b border-[#c6c6cd]/20">
                    <td className="p-4 sm:p-6 text-sm text-[#45464d] font-medium">Entrance Exams</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {college.admissionInfo.entranceExams.map((exam) => (
                            <span
                              key={exam}
                              className="px-2 py-0.5 rounded text-xs bg-[#eff4ff] border border-[#c6c6cd]/60"
                            >
                              {exam}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Cutoff */}
                  <tr className="border-b border-[#c6c6cd]/20">
                    <td className="p-4 sm:p-6 text-sm text-[#45464d] font-medium">Cutoff Percentile</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#0b1c30] font-semibold">
                        {college.admissionInfo.cutoffPercentile}
                      </td>
                    ))}
                  </tr>

                  {/* Campus Area */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#45464d] font-medium">Campus Area</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#0b1c30] font-semibold">
                        {college.campusArea || 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-[#c6c6cd]/30 bg-[#eff4ff]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[#45464d]">
                Comparing {compareList.length} of 3 maximum colleges
              </p>
              <div className="flex items-center gap-3">
                {compareList.map((college) => (
                  <button
                    key={college.id}
                    type="button"
                    onClick={() => openEnquiry(college.name)}
                    className="px-4 py-2 rounded-lg bg-[#0051d5] text-white text-xs font-semibold hover:bg-[#316bf3] transition-all active:scale-[0.98] shadow-sm"
                  >
                    Enquire {college.shortName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
