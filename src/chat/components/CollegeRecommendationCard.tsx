import React from 'react';
import { Link } from 'react-router-dom';

interface CollegeRecommendationCardProps {
  recommendations: any[];
}

export const CollegeRecommendationCard: React.FC<CollegeRecommendationCardProps> = ({
  recommendations,
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="space-y-3 mt-3">
      {recommendations.map((rec: any, idx: number) => {
        const name = rec.name || rec.collegeName || 'Accredited Medical College';
        const city = rec.city || '';
        const state = rec.state || '';
        const rating = rec.rating || 4.5;
        const nirf = rec.nirfRank;
        const seats = rec.mbbsSeats;
        const pgSeats = rec.pgSeats;
        const fee = rec.tuitionFee || rec.annualFee || '₹50,000 / year';
        const image = rec.image;
        const avgPkg = rec.packageStats?.average || rec.placementAverage || '₹12-16 LPA';

        return (
          <div
            key={rec.id || rec.collegeId || idx}
            className="bg-white rounded-xl border border-[#DCE5EF] overflow-hidden shadow-xs hover:border-[#159EAE] transition-all"
          >
            {image && (
              <div className="h-28 w-full relative overflow-hidden bg-slate-100">
                <img src={image} alt={name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  {nirf && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#159EAE] text-white shadow-xs">
                      NIRF #{nirf}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0757C9] text-white shadow-xs">
                    ⭐ {rating} ★
                  </span>
                </div>
              </div>
            )}

            <div className="p-3.5">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-xs font-bold text-[#12305A] leading-snug line-clamp-1">{name}</h4>
                  <p className="text-[11px] text-[#5F6F82] flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[13px] text-[#0757C9]">location_on</span>
                    {city ? `${city}, ${state}` : state}
                  </p>
                </div>
              </div>

              {/* Key metrics grid */}
              <div className="grid grid-cols-2 gap-2 mb-3 bg-[#F7FAFD] p-2 rounded-lg border border-[#DCE5EF]/60 text-[11px]">
                <div>
                  <span className="text-[10px] text-[#5F6F82] block">MBBS Seats</span>
                  <span className="font-bold text-[#12305A]">{seats || 'NMC Approved'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5F6F82] block">Annual Tuition</span>
                  <span className="font-bold text-[#0757C9] truncate block">{fee}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5F6F82] block">PG Specializations</span>
                  <span className="font-bold text-[#087C8B]">{pgSeats ? `${pgSeats} Seats` : 'MD/MS Available'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5F6F82] block">Avg Placement</span>
                  <span className="font-bold text-[#12305A]">{avgPkg}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#DCE5EF]/60">
                <Link
                  to="/colleges"
                  className="flex-1 text-center py-1.5 px-2 rounded-lg bg-[#0757C9] text-white text-[11px] font-semibold hover:bg-[#06449E] transition-all shadow-2xs"
                >
                  Explore in Colleges
                </Link>
                <Link
                  to="/compare"
                  className="flex-1 text-center py-1.5 px-2 rounded-lg border border-[#DCE5EF] text-[#12305A] text-[11px] font-semibold hover:bg-[#F7FAFD] transition-all"
                >
                  Compare
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

