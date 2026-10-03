import React from 'react';
import { useCompare } from '../context/CompareContext';
import { FadeIn } from '../components/ui/motion';

export const Compare: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, openEnquiry } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7FAFD] flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-[#DCE5EF] shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#0757C9]/10 text-[#0757C9] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[40px]">compare_arrows</span>
          </div>
          <h2 className="text-2xl font-bold text-[#12305A] mb-2">No Colleges Selected</h2>
          <p className="text-sm text-[#5F6F82] mb-6">
            Select up to 3 colleges from the Explore page to compare them side-by-side.
          </p>
          <a
            href="/colleges"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0757C9] text-white text-sm font-semibold hover:bg-[#06449E] transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>Explore Colleges</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFD] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#12305A] mb-2">
                Compare Institutions
              </h1>
              <p className="text-sm text-[#5F6F82]">
                Benchmark key academic metrics, quotas, and criteria side-by-side with Admission by Choice.
              </p>
            </div>
            <button
              type="button"
              onClick={clearCompare}
              className="text-sm font-semibold text-[#F04A35] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">clear_all</span>
              Clear All
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-white rounded-2xl border border-[#DCE5EF] shadow-xs overflow-hidden">
            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#DCE5EF]">
                    <th className="text-left p-4 sm:p-6 bg-[#F7FAFD] font-bold text-[#12305A] text-sm min-w-[160px]">
                      Attribute
                    </th>
                    {compareList.map((college) => (
                      <th key={college.id} className="p-4 sm:p-6 bg-[#F7FAFD] min-w-[250px]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-xl bg-[#0757C9] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                            {college.shortName}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-bold text-[#12305A]">{college.name}</div>
                            <div className="text-xs text-[#5F6F82]">{college.city}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCompare(college.id)}
                          className="text-xs font-semibold text-[#F04A35] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                          Remove
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5EF]">
                  {/* NIRF Rank */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#5F6F82] font-semibold">NIRF Ranking</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#12305A]">
                        {college.nirfRank ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#159EAE]/15 text-[#087C8B] font-bold">
                            <span className="material-symbols-outlined text-[14px] text-[#159EAE]">emoji_events</span>
                            #{college.nirfRank}
                          </span>
                        ) : (
                          <span className="text-[#5F6F82]">N/A</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#5F6F82] font-semibold">Student Rating</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#12305A]">
                        <div className="flex items-center gap-1 text-[#087C8B] font-bold">
                          <span className="material-symbols-outlined text-[18px] text-[#FFBE2E]">star</span>
                          {college.rating}
                        </div>
                        <div className="text-xs text-[#5F6F82]">{college.reviewsCount} reviews</div>
                      </td>
                    ))}
                  </tr>

                  {/* Established Year */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#5F6F82] font-semibold">Established</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#12305A] font-bold">
                        {college.estYear}
                      </td>
                    ))}
                  </tr>

                  {/* Accreditation */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#5F6F82] font-semibold">Accreditation</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#12305A]">
                        <span className="px-2.5 py-0.5 rounded bg-[#159EAE]/10 text-[#087C8B] font-bold text-xs border border-[#159EAE]/20">
                          {college.accreditation}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Management Types */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#5F6F82] font-semibold">Management Quota</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {college.managementTypes.map((type) => (
                            <span
                              key={type}
                              className="px-2 py-0.5 rounded text-xs font-semibold bg-[#0757C9]/10 text-[#0757C9] border border-[#0757C9]/20"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Distance */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#5F6F82] font-semibold">Distance</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#12305A] font-bold">
                        {college.distance} km
                      </td>
                    ))}
                  </tr>

                  {/* Average Package */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#5F6F82] font-semibold">Average Package</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#0757C9] font-bold">
                        {college.packageStats.average}
                      </td>
                    ))}
                  </tr>

                  {/* Highest Package */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#5F6F82] font-semibold">Highest Package</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#159EAE] font-bold">
                        {college.packageStats.highest}
                      </td>
                    ))}
                  </tr>

                  {/* Top Recruiters */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#5F6F82] font-semibold">Top Recruiters</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {college.packageStats.topRecruiters.slice(0, 4).map((recruiter) => (
                            <span
                              key={recruiter}
                              className="px-2 py-0.5 rounded text-xs bg-[#F7FAFD] text-[#12305A] border border-[#DCE5EF]"
                            >
                              {recruiter}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Courses */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#5F6F82] font-semibold">Popular Courses</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm">
                        <div className="space-y-2">
                          {college.courses.slice(0, 3).map((course) => (
                            <div key={course.id} className="text-xs">
                              <div className="font-bold text-[#12305A]">{course.name}</div>
                              <div className="text-[#0757C9] font-semibold">{course.annualFee}</div>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Entrance Exams */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#5F6F82] font-semibold">Entrance Exams</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {college.admissionInfo.entranceExams.map((exam) => (
                            <span
                              key={exam}
                              className="px-2 py-0.5 rounded text-xs bg-[#F7FAFD] text-[#12305A] border border-[#DCE5EF]"
                            >
                              {exam}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Cutoff */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#5F6F82] font-semibold">Cutoff Percentile</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#12305A] font-bold">
                        {college.admissionInfo.cutoffPercentile}
                      </td>
                    ))}
                  </tr>

                  {/* Campus Area */}
                  <tr>
                    <td className="p-4 sm:p-6 text-sm text-[#5F6F82] font-semibold">Campus Area</td>
                    {compareList.map((college) => (
                      <td key={college.id} className="p-4 sm:p-6 text-sm text-[#12305A] font-bold">
                        {college.campusArea || 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-[#DCE5EF] bg-[#F7FAFD] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[#5F6F82]">
                Comparing <strong className="text-[#12305A]">{compareList.length}</strong> of 3 maximum colleges
              </p>
              <div className="flex items-center gap-3">
                {compareList.map((college) => (
                  <button
                    key={college.id}
                    type="button"
                    onClick={() => openEnquiry(college.name)}
                    className="px-4 py-2 rounded-lg bg-[#0757C9] text-white text-xs font-semibold hover:bg-[#06449E] transition-all active:scale-[0.98] shadow-xs cursor-pointer"
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
