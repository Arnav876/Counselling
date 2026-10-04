import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ui/motion';
import { collegeService } from '../services/collegeService';
import type { StateData } from '../types/college';

export const Home: React.FC = () => {
  const { openEnquiry } = useCompare();
  const [popularStates, setPopularStates] = useState<StateData[]>([]);

  useEffect(() => {
    collegeService.getPopularStates().then(states => {
      if (states && states.length > 0) {
        setPopularStates(states.slice(0, 12));
      }
    }).catch(console.error);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-[#061B37]">
        {/* Graded Background Image & Atmosphere */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            alt="Students walking together on university campus"
            className="w-full h-full object-cover object-[center_28%] scale-105 filter brightness-[0.92] contrast-[1.08] saturate-[1.15]"
            src="/hero-students.jpg"
          />
          {/* Multi-tier Cinematic Color Grading Overlays matching Admission by Choice Palette */}
          {/* 1. Base Dark Blue/Navy Tone */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#061B37]/90 via-[#12305A]/75 to-[#061B37]/95"></div>

          {/* 2. Brand Vibrant Color Grading Glows (Primary Blue #0757C9, Teal #159EAE, Golden Yellow #FFBE2E) */}
          <div className="absolute -top-20 -left-20 w-[550px] h-[550px] bg-[#0757C9]/35 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-[#FFBE2E]/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-[#159EAE]/25 rounded-full blur-[90px] mix-blend-screen pointer-events-none"></div>

          {/* 3. Radial Vignette for focused contrast */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#061B37]/30 to-[#061B37]/85"></div>

          {/* 4. Bottom Smooth Transition Blend into Page Background */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#F7FAFD] via-[#F7FAFD]/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 text-white text-xs font-semibold mb-6 shadow-xl shadow-black/10">
                <span className="material-symbols-outlined text-[18px] text-[#159EAE]">verified</span>
                <span>Accredited Institutional Search • Admissions Batch 2025-26</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F04A35] text-white text-[10px] font-bold uppercase tracking-wider ml-1 shadow-xs">
                  Live
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                Find the Right College by <span className="bg-gradient-to-r from-sky-300 via-[#159EAE] to-[#FFBE2E] bg-clip-text text-transparent">Informed Choice</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-200/95 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                Discover and compare accredited engineering & technology campuses across India based on location, cutoffs, fee structures, and management quota allocations.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-12">
              <Link
                to="/colleges"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0757C9] text-white text-sm font-bold hover:bg-[#06449E] transition-all active:scale-[0.98] shadow-xl shadow-[#0757C9]/40 hover:shadow-[#06449E]/30"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
                <span>Explore Colleges</span>
              </Link>
              <button
                type="button"
                onClick={() => openEnquiry('General Admissions Consultation')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl border border-white/30 bg-white/15 text-white text-sm font-semibold hover:bg-white/25 transition-all active:scale-[0.98] backdrop-blur-xl shadow-lg shadow-black/20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#159EAE]">support_agent</span>
                <span>Talk to Counselor</span>
              </button>
            </div>

            {/* Quick Hero Highlights / Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5 text-center text-white">
                <div className="text-xl sm:text-2xl font-black text-white">500+</div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">Top Tech Campuses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5 text-center text-white">
                <div className="text-xl sm:text-2xl font-black text-[#159EAE]">100%</div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">Verified Quota Info</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5 text-center text-white">
                <div className="text-xl sm:text-2xl font-black text-[#FFBE2E]">28+</div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">States Covered</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5 text-center text-white">
                <div className="text-xl sm:text-2xl font-black text-sky-300">4.9/5</div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">Student Rating</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Popular States Section */}
      <section className="py-12 bg-[#F7FAFD] border-y border-[#DCE5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold text-[#0757C9] uppercase tracking-wider mb-1">
                Geographic Hubs
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#12305A]">
                Popular Higher Education States
              </h2>
            </div>
            <p className="text-sm text-[#5F6F82] max-w-md">
              Select any regional cluster below to view its state map, top tech hubs, and accredited institutional quotas.
            </p>
          </div>

          <StaggerContainer>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {popularStates.map((state) => (
                <StaggerItem key={state.code}>
                  <Link
                    to="/colleges"
                    state={{ filterState: state.name }}
                    className="group cursor-pointer text-left bg-white p-3.5 rounded-xl border border-[#DCE5EF] hover:border-[#0757C9] hover:bg-[#0757C9]/5 transition-all shadow-xs hover:shadow-md active:scale-[0.98] block"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#0757C9] text-white flex items-center justify-center mb-2.5 transition-colors group-hover:bg-[#06449E]">
                      <span className="material-symbols-outlined text-[20px]">apartment</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#12305A] group-hover:text-[#0757C9] transition-colors">{state.name}</h3>
                    <p className="text-xs text-[#5F6F82]">{state.collegeCount}+ Colleges</p>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-14 bg-gradient-to-b from-white to-[#F7FAFD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="text-xs font-bold text-[#0757C9] uppercase tracking-wider mb-2">
              Decision Intelligence
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12305A] mb-4">
              Why Students & Families Rely on Admission by Choice
            </h2>
            <p className="text-base sm:text-lg text-[#5F6F82]">
              We eliminate uncertainty from admission counselling with verified metrics, fee transparency, and direct institutional criteria.
            </p>
          </div>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <StaggerItem>
                <div className="bg-white p-6 rounded-2xl border border-[#DCE5EF] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0757C9]/10 text-[#0757C9] flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[26px]">travel_explore</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#12305A] mb-2">Find Colleges Easily</h3>
                    <p className="text-sm text-[#5F6F82]">
                      Search through dozens of recognized universities and autonomous colleges mapped with exact distance calculations.
                    </p>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-6 rounded-2xl border border-[#DCE5EF] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#159EAE]/10 text-[#159EAE] flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[26px]">tune</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#12305A] mb-2">Smart Filters</h3>
                    <p className="text-sm text-[#5F6F82]">
                      Refine by state borders, proximity radiuses, general quotas, and specialized NRI admission allocations seamlessly.
                    </p>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-6 rounded-2xl border border-[#DCE5EF] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0757C9]/10 text-[#0757C9] flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[26px]">compare_arrows</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#12305A] mb-2">Compare Colleges</h3>
                    <p className="text-sm text-[#5F6F82]">
                      Pin up to 3 colleges side-by-side to cross-examine tuition fees, entrance exams, accreditation, and hostel facilities.
                    </p>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-6 rounded-2xl border border-[#DCE5EF] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#159EAE]/10 text-[#159EAE] flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[26px]">verified</span>
                    </div>
                    <h3 className="text-base font-semibold text-[#12305A] mb-2">Verified Info</h3>
                    <p className="text-sm text-[#5F6F82]">
                      Institutional accreditation, NAAC certifications, and verified NIRF statistics with direct admission contact records.
                    </p>
                  </div>
                </div>
              </StaggerItem>
            </div>
          </StaggerContainer>

          {/* How It Works */}
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#DCE5EF] shadow-xs">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h3 className="text-2xl font-bold text-[#12305A] mb-2">How It Works in 3 Simple Steps</h3>
              <p className="text-sm text-[#5F6F82]">Your streamlined admission pathway from benchmark to enrollment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="flex flex-col items-center text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-[#0757C9] text-white text-xl font-bold flex items-center justify-center shadow-md mb-4">
                  1
                </div>
                <h4 className="text-base font-semibold text-[#12305A] mb-2">Select Preferences</h4>
                <p className="text-sm text-[#5F6F82]">
                  Choose your target state, location radius, desired engineering streams, and management quota type.
                </p>
              </div>

              <div className="flex flex-col items-center text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-[#159EAE] text-white text-xl font-bold flex items-center justify-center shadow-md mb-4">
                  2
                </div>
                <h4 className="text-base font-semibold text-[#12305A] mb-2">Explore Matching Colleges</h4>
                <p className="text-sm text-[#5F6F82]">
                  Browse verified cards, filter entrance exam scores (KCET, COMEDK, JEE), and inspect campus amenities.
                </p>
              </div>

              <div className="flex flex-col items-center text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-[#0757C9] text-white text-xl font-bold flex items-center justify-center shadow-md mb-4">
                  3
                </div>
                <h4 className="text-base font-semibold text-[#12305A] mb-2">Compare & Choose</h4>
                <p className="text-sm text-[#5F6F82]">
                  Run a side-by-side benchmark matrix and connect directly with authorized college admission desks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
