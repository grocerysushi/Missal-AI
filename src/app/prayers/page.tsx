'use client';

import React, { useState } from 'react';
import { Prayer, BASIC_PRAYERS, getPrayerById } from '@/lib/prayers-data';
import PrayerDisplay from '@/components/prayers/PrayerDisplay';
import PrayersMenu from '@/components/prayers/PrayersMenu';

export default function PrayersPage() {
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(BASIC_PRAYERS[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handlePrayerSelect = (prayer: Prayer) => {
    setSelectedPrayer(prayer);
  };

  const goToPreviousPrayer = () => {
    if (!selectedPrayer) return;
    const currentIndex = BASIC_PRAYERS.findIndex(p => p.id === selectedPrayer.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : BASIC_PRAYERS.length - 1;
    setSelectedPrayer(BASIC_PRAYERS[previousIndex]);
  };

  const goToNextPrayer = () => {
    if (!selectedPrayer) return;
    const currentIndex = BASIC_PRAYERS.findIndex(p => p.id === selectedPrayer.id);
    const nextIndex = currentIndex < BASIC_PRAYERS.length - 1 ? currentIndex + 1 : 0;
    setSelectedPrayer(BASIC_PRAYERS[nextIndex]);
  };

  const printPrayer = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-liturgical-gold text-2xl font-bold">
                  ✠
                </div>
                <div>
                  <h1 className="font-display text-xl font-semibold text-text-primary">
                    Catholic Prayers
                  </h1>
                  <div className="text-xs text-text-secondary hidden sm:block">
                    Traditional Prayers of the Faith
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={goToPreviousPrayer}
                className="flex items-center gap-2 px-4 py-2 text-text-primary hover:text-liturgical-gold transition-colors"
                aria-label="Previous prayer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Previous</span>
              </button>

              <button
                onClick={goToNextPrayer}
                className="flex items-center gap-2 px-4 py-2 text-text-primary hover:text-liturgical-gold transition-colors"
                aria-label="Next prayer"
              >
                <span className="font-medium">Next</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Print Button */}
              <button
                onClick={printPrayer}
                className="p-2 text-text-secondary hover:text-liturgical-gold transition-colors no-print"
                aria-label="Print prayer"
                title="Print prayer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>

              {/* Menu Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-liturgical-gold text-white rounded-lg hover:bg-liturgical-gold/90 transition-colors"
                aria-label="Open prayers menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="font-medium hidden sm:inline">Prayers</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-200 py-3 flex justify-center space-x-4">
            <button
              onClick={goToPreviousPrayer}
              className="flex items-center gap-2 px-3 py-2 text-text-primary hover:text-liturgical-gold transition-colors"
              aria-label="Previous prayer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Previous</span>
            </button>

            <button
              onClick={goToNextPrayer}
              className="flex items-center gap-2 px-3 py-2 text-text-primary hover:text-liturgical-gold transition-colors"
              aria-label="Next prayer"
            >
              <span className="text-sm">Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {selectedPrayer ? (
          <PrayerDisplay prayer={selectedPrayer} />
        ) : (
          <div className="text-center py-16">
            <div className="text-liturgical-gold text-4xl mb-4">✠</div>
            <h2 className="font-display text-2xl text-text-primary mb-4">
              Select a Prayer
            </h2>
            <p className="text-text-secondary mb-6">
              Choose from our collection of traditional Catholic prayers.
            </p>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="px-6 py-3 bg-liturgical-gold text-white rounded-lg hover:bg-liturgical-gold/90 transition-colors font-medium"
            >
              Browse Prayers
            </button>
          </div>
        )}
      </main>

      {/* Prayers Menu */}
      <PrayersMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onPrayerSelect={handlePrayerSelect}
      />

      {/* Keyboard shortcuts help (hidden, for screen readers) */}
      <div className="sr-only">
        <p>Keyboard shortcuts available:</p>
        <ul>
          <li>Left arrow: Previous prayer</li>
          <li>Right arrow: Next prayer</li>
          <li>P: Print prayer</li>
          <li>M: Open prayers menu</li>
        </ul>
      </div>
    </div>
  );
}