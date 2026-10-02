import React, { createContext, useContext, useState, useEffect } from 'react';
import type { College } from '../types/college';

interface CompareContextType {
  compareList: College[];
  toggleCompare: (college: College) => void;
  removeFromCompare: (collegeId: string) => void;
  clearCompare: () => void;
  isInCompare: (collegeId: string) => boolean;

  savedColleges: string[];
  toggleBookmark: (collegeId: string) => void;
  isBookmarked: (collegeId: string) => boolean;

  toastMessage: string | null;
  showToast: (message: string) => void;

  isEnquiryOpen: boolean;
  enquiryCollege: string;
  openEnquiry: (collegeName?: string) => void;
  closeEnquiry: () => void;

  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<College[]>(() => {
    try {
      const saved = localStorage.getItem('educompass_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedColleges, setSavedColleges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('educompass_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryCollege, setEnquiryCollege] = useState('');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('educompass_compare', JSON.stringify(compareList));
    } catch (e) {
      console.error(e);
    }
  }, [compareList]);

  useEffect(() => {
    try {
      localStorage.setItem('educompass_bookmarks', JSON.stringify(savedColleges));
    } catch (e) {
      console.error(e);
    }
  }, [savedColleges]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  const toggleCompare = (college: College) => {
    const exists = compareList.some((c) => c.id === college.id);
    if (exists) {
      setCompareList((prev) => prev.filter((c) => c.id !== college.id));
      showToast(`Removed ${college.name} from comparison.`);
    } else {
      if (compareList.length >= 3) {
        showToast('Maximum 3 colleges can be compared at once.');
        return;
      }
      setCompareList((prev) => [...prev, college]);
      showToast(`Added ${college.name} to comparison.`);
    }
  };

  const removeFromCompare = (collegeId: string) => {
    const col = compareList.find((c) => c.id === collegeId);
    setCompareList((prev) => prev.filter((c) => c.id !== collegeId));
    if (col) {
      showToast(`Removed ${col.name} from comparison.`);
    }
  };

  const clearCompare = () => {
    setCompareList([]);
    showToast('Cleared comparison list.');
  };

  const isInCompare = (collegeId: string) => {
    return compareList.some((c) => c.id === collegeId);
  };

  const toggleBookmark = (collegeId: string) => {
    const exists = savedColleges.includes(collegeId);
    if (exists) {
      setSavedColleges((prev) => prev.filter((id) => id !== collegeId));
      showToast('Removed from saved colleges.');
    } else {
      setSavedColleges((prev) => [...prev, collegeId]);
      showToast('Saved to your shortlisted colleges.');
    }
  };

  const isBookmarked = (collegeId: string) => {
    return savedColleges.includes(collegeId);
  };

  const openEnquiry = (collegeName?: string) => {
    setEnquiryCollege(collegeName || 'General Admissions Consultation');
    setIsEnquiryOpen(true);
  };

  const closeEnquiry = () => {
    setIsEnquiryOpen(false);
  };

  const openCompareModal = () => {
    if (compareList.length === 0) {
      showToast('Please select at least 1 college to compare.');
      return;
    }
    setIsCompareModalOpen(true);
  };

  const closeCompareModal = () => {
    setIsCompareModalOpen(false);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        savedColleges,
        toggleBookmark,
        isBookmarked,
        toastMessage,
        showToast,
        isEnquiryOpen,
        enquiryCollege,
        openEnquiry,
        closeEnquiry,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
