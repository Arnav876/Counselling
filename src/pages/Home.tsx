import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ui/motion';
import { POPULAR_STATES } from '../data/colleges';

export const Home: React.FC = () => {
  const { openEnquiry } = useCompare();

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-[#071322]">
        {/* Graded Background Image & Atmosphere */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            alt="Students walking together on university campus"
            className="w-full h-full object-cover object-[center_28%] scale-105 filter brightness-[0.96] contrast-[1.06] saturate-[1.2]"
            src="/hero-students.jpg"
          />
          {/* Multi-tier Cinematic Color Grading Overlays */}
          {/* 1. Base Dark Slate/Navy Tone with balanced opacity for student visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#071424]/85 via-[#0b1c30]/65 to-[#071424]/90"></div>

          {/* 2. Vibrant Color Grading Glows (Sapphire & Amber Warmth) */}
          <div className="absolute -top-20 -left-20 w-[550px] h-[550px] bg-[#0051d5]/30 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-[#f59e0b]/25 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-[#0051d5]/20 rounded-full blur-[90px] mix-blend-screen pointer-events-none"></div>

          {/* 3. Radial Vignette for focused contrast */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#071424]/30 to-[#071424]/80"></div>

          {/* 4. Bottom Smooth Transition Blend into Page */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#eff4ff] via-[#eff4ff]/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 text-white text-xs font-semibold mb-6 shadow-xl shadow-black/10">
                <span className="material-symbols-outlined text-[18px] text-[#34d399]">verified</span>
                <span>Accredited Institutional Search • Admissions Batch 2025-26</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0051d5] text-white text-[10px] font-bold uppercase tracking-wider ml-1 shadow-sm">
                  Live
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                Find the Right College for <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">Your Future</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-200/95 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                Discover and compare accredited engineering & technology campuses across India based on location, cutoffs, and management quota preferences.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-12">
              <Link
                to="/colleges"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0051d5] text-white text-sm font-bold hover:bg-[#2563eb] transition-all active:scale-[0.98] shadow-xl shadow-blue-900/40 hover:shadow-blue-600/30"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
                <span>Explore Colleges</span>
              </Link>
              <button
                type="button"
                onClick={() => openEnquiry('General Admissions Consultation')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl border border-white/30 bg-white/15 text-white text-sm font-semibold hover:bg-white/25 transition-all active:scale-[0.98] backdrop-blur-xl shadow-lg shadow-black/20"
              >
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
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
                <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">Verified Quota Info</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5 text-center text-white">
                <div className="text-xl sm:text-2xl font-black text-amber-300">28+</div>
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
      <section className="py-12 bg-[#eff4ff]/50 border-y border-[#c6c6cd]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-semibold text-[#0051d5] uppercase tracking-wider mb-1">
                Geographic Hubs
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">
                Popular Higher Education States
              </h2>
            </div>
            <p className="text-sm text-[#45464d] max-w-md">
              Select any regional cluster below to view its interactive state map, top tech hubs, and accredited institutional quotas.
            </p>
          </div>

          <StaggerContainer>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {POPULAR_STATES.map((state) => (
                <StaggerItem key={state.code}>
                  <Link
                    to="/colleges"
                    state={{ filterState: state.name }}
                    className="group cursor-pointer text-left bg-white p-3.5 rounded-xl border border-[#0051d5] bg-[#0051d5]/5 transition-all shadow-sm hover:shadow-md active:scale-[0.98] block"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#0051d5] text-white flex items-center justify-center mb-2.5 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">apartment</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0051d5]">{state.name}</h3>
                    <p className="text-xs text-[#45464d]">{state.collegeCount}+ Colleges</p>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-14 bg-gradient-to-b from-[#f8f9ff] to-[#eff4ff] border-t border-[#c6c6cd]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="text-xs font-semibold text-[#0051d5] uppercase tracking-wider mb-2">
              Decision Intelligence
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] mb-4">
              Why Students & Families Rely on EduCompass
            </h2>
            <p className="text-lg text-[#45464d]">
              We eliminate uncertainty from admission counselling with verified metrics, fee transparency, and direct institutional criteria.
            </p>
          </div>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <StaggerItem>
                <div className="bg-white p-6 rounded-2xl border border-[#c6c6cd]/40 shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0051d5]/10 text-[#0051d5] flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[26px]">travel_explore</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0b1c30] mb-2">Find Colleges Easily</h3>
                    <p className="text-sm text-[#45464d]">
                      Search through dozens of recognized universities and autonomous colleges mapped with exact distance calculations.
                    </p>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-6 rounded-2xl border border-[#c6c6cd]/40 shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0051d5]/10 text-[#0051d5] flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[26px]">tune</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0b1c30] mb-2">Smart Filters</h3>
                    <p className="text-sm text-[#45464d]">
                      Refine by state borders, proximity radiuses, general quotas, and specialized NRI admission allocations seamlessly.
                    </p>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-6 rounded-2xl border border-[#c6c6cd]/40 shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0051d5]/10 text-[#0051d5] flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[26px]">compare_arrows</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0b1c30] mb-2">Compare Colleges</h3>
                    <p className="text-sm text-[#45464d]">
                      Pin up to 3 colleges side-by-side to cross-examine tuition fees, entrance exams, accreditation, and hostel facilities.
                    </p>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-6 rounded-2xl border border-[#c6c6cd]/40 shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0051d5]/10 text-[#0051d5] flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[26px]">verified</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0b1c30] mb-2">Verified Info</h3>
                    <p className="text-sm text-[#45464d]">
                      Institutional accreditation, NAAC certifications, and verified NIRF statistics with direct admission contact records.
                    </p>
                  </div>
                </div>
              </StaggerItem>
            </div>
          </StaggerContainer>

          {/* How It Works */}
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#c6c6cd]/40 shadow-sm">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h3 className="text-2xl font-bold text-[#0b1c30] mb-2">How It Works in 3 Simple Steps</h3>
              <p className="text-sm text-[#45464d]">Your streamlined admission pathway from benchmark to enrollment.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="flex flex-col items-center text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-[#0051d5] text-white text-xl font-bold flex items-center justify-center shadow-md mb-4">
                  1
                </div>
                <h4 className="text-sm font-semibold text-[#0b1c30] mb-2">Select Preferences</h4>
                <p className="text-sm text-[#45464d]">
                  Choose your target state, location radius, desired engineering streams, and management quota type.
                </p>
              </div>

              <div className="flex flex-col items-center text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-[#0051d5] text-white text-xl font-bold flex items-center justify-center shadow-md mb-4">
                  2
                </div>
                <h4 className="text-sm font-semibold text-[#0b1c30] mb-2">Explore Matching Colleges</h4>
                <p className="text-sm text-[#45464d]">
                  Browse verified cards, filter entrance exam scores (KCET, COMEDK, JEE), and inspect campus amenities.
                </p>
              </div>

              <div className="flex flex-col items-center text-center relative">
                <div className="w-14 h-14 rounded-2xl bg-[#0051d5] text-white text-xl font-bold flex items-center justify-center shadow-md mb-4">
                  3
                </div>
                <h4 className="text-sm font-semibold text-[#0b1c30] mb-2">Compare & Choose</h4>
                <p className="text-sm text-[#45464d]">
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
