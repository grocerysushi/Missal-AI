'use client';

import React, { useState } from 'react';
import { Prayer, PRAYER_CATEGORIES, getPrayersByCategory } from '@/lib/prayers-data';

interface PrayersMenuProps {
  onPrayerSelect: (prayer: Prayer) => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function PrayersMenu({
  onPrayerSelect,
  isOpen,
  onClose,
  className = ''
}: PrayersMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('foundational');
  const [searchTerm, setSearchTerm] = useState('');

  const handlePrayerClick = (prayer: Prayer) => {
    onPrayerSelect(prayer);
    onClose();
  };

  const filteredPrayers = getPrayersByCategory(selectedCategory as Prayer['category'])
    .filter(prayer =>
      prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prayer.latin && prayer.latin.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 no-print"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        className={`
          fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto no-print
          transform transition-transform duration-300 ease-in-out
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="prayers-menu-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 id="prayers-menu-title" className="font-display text-xl font-semibold text-text-primary flex items-center gap-2">
              <span className="text-liturgical-gold">✠</span>
              Catholic Prayers
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-liturgical-gold transition-colors rounded"
              aria-label="Close prayers menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search prayers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liturgical-gold focus:border-liturgical-gold"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto space-x-1 pb-2">
            {PRAYER_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-3 py-2 text-xs font-medium rounded-full whitespace-nowrap transition-colors
                  ${selectedCategory === category.id
                    ? 'bg-liturgical-gold text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Description */}
        <div className="px-4 py-3 bg-cream/50">
          <p className="text-sm text-text-secondary italic">
            {PRAYER_CATEGORIES.find(c => c.id === selectedCategory)?.description}
          </p>
        </div>

        {/* Prayers List */}
        <div className="p-4">
          {filteredPrayers.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              {searchTerm ? (
                <>
                  <p className="mb-2">No prayers found matching "{searchTerm}"</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-liturgical-gold hover:underline text-sm"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <p>No prayers in this category</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPrayers.map((prayer) => (
                <button
                  key={prayer.id}
                  onClick={() => handlePrayerClick(prayer)}
                  className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-liturgical-gold hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-text-primary group-hover:text-liturgical-gold transition-colors">
                        {prayer.title}
                      </h3>
                      {prayer.latin && (
                        <p className="text-sm text-text-secondary italic mt-1">
                          {prayer.latin}
                        </p>
                      )}
                      {prayer.description && (
                        <p className="text-xs text-text-muted mt-2 line-clamp-2">
                          {prayer.description}
                        </p>
                      )}
                    </div>
                    <svg
                      className="w-5 h-5 text-text-muted group-hover:text-liturgical-gold transition-colors ml-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-cream/80 backdrop-blur-sm border-t border-gray-200 p-4 text-center">
          <p className="text-xs text-text-muted">
            Based on USCCB Basic Prayers Collection
          </p>
        </div>
      </div>
    </>
  );
}