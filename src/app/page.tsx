'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import DailyReadings from '@/components/readings/DailyReadings';
import { DailyReadings as DailyReadingsType, formatLiturgicalDate } from '@/lib/types';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [readings, setReadings] = useState<DailyReadingsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch readings for a specific date
  const fetchReadings = async (date: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      const dateString = formatLiturgicalDate(date);
      const response = await fetch(`/api/readings/${dateString}`);
      const data = await response.json();

      if (!response.ok) {
        if (data.fallback) {
          // Show fallback data with error message
          setReadings(data.fallback as DailyReadingsType);
          setError(data.error || 'Unable to load readings');
        } else {
          throw new Error(data.error || 'Failed to fetch readings');
        }
      } else {
        setReadings(data.readings);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching readings:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setReadings(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle date changes
  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  // Fetch readings when date changes
  useEffect(() => {
    fetchReadings(currentDate);
  }, [currentDate]);

  // Initialize service worker and PWA features
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/lib/sw-registration').then(({ registerServiceWorker, setupPWAInstallPrompt }) => {
        registerServiceWorker().then((updateInfo) => {
          if (updateInfo?.isUpdateAvailable) {
            console.log('Service worker update available');
          }
        });

        setupPWAInstallPrompt();
      });
    }
  }, []);

  // Set up keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't interfere if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'h':
          event.preventDefault();
          const prevDay = new Date(currentDate);
          prevDay.setDate(currentDate.getDate() - 1);
          setCurrentDate(prevDay);
          break;

        case 'ArrowRight':
        case 'l':
          event.preventDefault();
          const nextDay = new Date(currentDate);
          nextDay.setDate(currentDate.getDate() + 1);
          setCurrentDate(nextDay);
          break;

        case 't':
          event.preventDefault();
          setCurrentDate(new Date());
          break;

        case 'p':
          event.preventDefault();
          window.print();
          break;

        case 'r':
          event.preventDefault();
          fetchReadings(currentDate);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDate]);

  return (
    <>
      {/* Header with navigation */}
      <Header
        currentDate={currentDate}
        onDateChange={handleDateChange}
        isLoading={isLoading}
      />

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {readings ? (
          <DailyReadings
            readings={readings}
            isLoading={isLoading}
            error={error || undefined}
          />
        ) : isLoading ? (
          // Loading skeleton
          <DailyReadings
            readings={{} as DailyReadingsType}
            isLoading={true}
          />
        ) : error ? (
          // Error state
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-600 font-semibold mb-4 text-lg">
                Unable to Load Readings
              </div>
              <p className="text-red-700 mb-6">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={() => fetchReadings(currentDate)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Try Again'}
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors font-medium"
                >
                  Go to Today
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Keyboard shortcuts help (hidden, for screen readers) */}
      <div className="sr-only">
        <p>Keyboard shortcuts available:</p>
        <ul>
          <li>Left arrow or H: Previous day</li>
          <li>Right arrow or L: Next day</li>
          <li>T: Go to today</li>
          <li>P: Print readings</li>
          <li>R: Refresh readings</li>
        </ul>
      </div>
    </>
  );
}
