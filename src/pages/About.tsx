import React from 'react';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ui/motion';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFD] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12305A] mb-4">
              About Admission <span className="text-[#0757C9]">by Choice</span>
            </h1>
            <p className="text-base sm:text-lg text-[#5F6F82] leading-relaxed">
              India's premier institutional discovery and academic benchmarking platform. We provide transparent cutoffs, verified fee schedules, distance calculation, and direct management quota guidance.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <StaggerItem>
              <div className="bg-white p-6 rounded-2xl border border-[#DCE5EF] shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#0757C9]/10 text-[#0757C9] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[26px]">verified</span>
                </div>
                <h3 className="text-lg font-bold text-[#12305A] mb-2">100% Verified Data</h3>
                <p className="text-sm text-[#5F6F82]">
                  All institutional accreditations, NIRF rankings, and fee structures are verified directly from official sources.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white p-6 rounded-2xl border border-[#DCE5EF] shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#159EAE]/10 text-[#159EAE] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[26px]">groups</span>
                </div>
                <h3 className="text-lg font-bold text-[#12305A] mb-2">Expert Counseling</h3>
                <p className="text-sm text-[#5F6F82]">
                  Our team of experienced admission counselors provides personalized guidance for engineering and technology admissions.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white p-6 rounded-2xl border border-[#DCE5EF] shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#0757C9]/10 text-[#0757C9] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[26px]">speed</span>
                </div>
                <h3 className="text-lg font-bold text-[#12305A] mb-2">Real-Time Updates</h3>
                <p className="text-sm text-[#5F6F82]">
                  Stay updated with the latest counseling schedules, cutoff releases, and admission deadlines for 2025-26 batch.
                </p>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>

        <FadeIn delay={0.2}>
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#DCE5EF] shadow-xs">
            <h2 className="text-2xl font-bold text-[#12305A] mb-6">Our Mission</h2>
            <div className="space-y-4 text-sm sm:text-base text-[#5F6F82] leading-relaxed">
              <p>
                <strong className="text-[#12305A]">Admission by Choice</strong> was founded with a singular mission: to empower students and parents with clarity and choice in higher education admissions across India. We believe that every student deserves transparent, accurate, and comprehensive information about institutions to make confident career decisions.
              </p>
              <p>
                Our platform bridges the gap between ambitious students and premier institutions by providing verified data on engineering colleges across India. From NIRF rankings to placement statistics, from fee structures to campus facilities — we cover every aspect that matters in your college selection journey.
              </p>
              <p>
                Whether you're looking for General Management quota seats, NRI admissions, or merit-based counseling information, Admission by Choice serves as your trusted companion throughout the admission process.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#159EAE]/10 text-[#087C8B] font-bold text-sm border border-[#159EAE]/20 mb-4">
              <span className="material-symbols-outlined text-[18px] text-[#159EAE]">workspace_premium</span>
              Trusted by 42,000+ Students & Families
            </div>
            <p className="text-sm text-[#5F6F82]">
              Join thousands of students who made the right academic choice with Admission by Choice
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
