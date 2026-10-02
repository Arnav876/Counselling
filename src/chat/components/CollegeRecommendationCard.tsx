import React from 'react';
import { Link } from 'react-router-dom';
import type { CollegeRecommendation } from '../types/recommendation';

interface CollegeRecommendationCardProps {
  recommendations: CollegeRecommendation[];
}

export const CollegeRecommendationCard: React.FC<CollegeRecommendationCardProps> = ({
  recommendations,
}) => {
  return (
    <div className="space-y-3 mt-4">
      {recommendations.map((rec) => (
        <div
          key={rec.collegeId}
          className="bg-white rounded-xl border border-[#c6c6cd]/40 p-4 shadow-sm"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-bold text-[#0b1c30]">{rec.collegeName}</h4>
                <span className="px-2 py-0.5 rounded-full bg-[#069669] text-white text-xs font-semibold">
                  {rec.matchScore}% Match
                </span>
              </div>
              <p className="text-xs text-[#45464d]">
                {rec.city}, {rec.state} • {rec.isGovernment ? 'Government' : 'Private'}
              </p>
            </div>
            {rec.nirfRank && (
              <div className="text-right">
                <div className="text-xs text-[#76777d]">NIRF Rank</div>
                <div className="text-sm font-bold text-[#069669]">#{rec.nirfRank}</div>
              </div>
            )}
          </div>

          {/* Why it matches */}
          <div className="mb-3 p-3 bg-[#eff4ff] rounded-lg">
            <p className="text-xs text-[#0b1c30] font-semibold mb-1">Why this matches you:</p>
            <p className="text-xs text-[#45464d]">{rec.whyMatches}</p>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2 bg-[#eff4ff] rounded-lg">
              <span className="text-xs text-[#76777d] block">Course</span>
              <span className="text-xs font-semibold text-[#0b1c30]">{rec.courseName}</span>
            </div>
            <div className="p-2 bg-[#eff4ff] rounded-lg">
              <span className="text-xs text-[#76777d] block">Annual Fee</span>
              <span className="text-xs font-semibold text-[#0b1c30]">{rec.annualFee}</span>
            </div>
            <div className="p-2 bg-[#eff4ff] rounded-lg">
              <span className="text-xs text-[#76777d] block">Avg Package</span>
              <span className="text-xs font-semibold text-[#0b1c30]">{rec.placementAverage}</span>
            </div>
            <div className="p-2 bg-[#eff4ff] rounded-lg">
              <span className="text-xs text-[#76777d] block">Highest Package</span>
              <span className="text-xs font-semibold text-[#0b1c30]">{rec.placementHighest}</span>
            </div>
          </div>

          {/* Trade-offs */}
          {rec.tradeOffs.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-[#45464d] font-semibold mb-1">Consider:</p>
              <div className="space-y-1">
                {rec.tradeOffs.map((tradeOff, tIdx) => (
                  <div key={tIdx} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[14px] text-[#ba1a1a]">
                      warning
                    </span>
                    <p className="text-xs text-[#45464d]">
                      <span className="font-semibold">{tradeOff.aspect}:</span> {tradeOff.concern}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admission feasibility */}
          <div className="mb-3 p-2 bg-[#0051d5]/5 rounded-lg border border-[#0051d5]/20">
            <p className="text-xs text-[#0051d5] font-semibold mb-1">Admission Feasibility:</p>
            <p className="text-xs text-[#45464d]">{rec.admissionFeasibility.explanation}</p>
            {rec.admissionFeasibility.requiredPercentile && (
              <p className="text-xs text-[#76777d] mt-1">
                Required Percentile: {rec.admissionFeasibility.requiredPercentile}+
              </p>
            )}
            {rec.admissionFeasibility.requiredRank && (
              <p className="text-xs text-[#76777d] mt-1">
                Required Rank: Top {rec.admissionFeasibility.requiredRank}
              </p>
            )}
            {rec.admissionFeasibility.missingData.length > 0 && (
              <p className="text-xs text-[#76777d] mt-1">
                Missing data: {rec.admissionFeasibility.missingData.join(', ')}
              </p>
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-[#76777d] italic mb-3">{rec.dataDisclaimer}</p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/colleges"
              className="flex-1 text-center px-3 py-2 rounded-lg bg-[#0051d5] text-white text-xs font-semibold hover:bg-[#316bf3] transition-all"
            >
              View Details
            </Link>
            <Link
              to="/compare"
              className="flex-1 text-center px-3 py-2 rounded-lg border border-[#c6c6cd] text-[#0b1c30] text-xs font-semibold hover:bg-[#eff4ff] transition-all"
            >
              Compare
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
