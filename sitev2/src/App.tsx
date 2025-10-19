"use client";

import { MapPin, BarChart3 } from "lucide-react";
import backgroundVideo from "./assets/background.webm";
import DataSourcesSection from "./sponsors/DataSourcesSection";
import MissionSection from "./components/mission/missionSection";

export default function App() {


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
        {/* Custom video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover min-h-screen z-0"
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        >
          <source src={backgroundVideo} type="video/webm" />
        </video>

        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-transparent to-blue-900/30" />

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <h1
            className="text-[120px] text-white/90 leading-none font-extrabold"

          >
            sEaDNA
          </h1>

          <p className="mt-8 text-xl text-white/90 tracking-wide drop-shadow-lg">
            Understanding the effect of human action on sea life using molecular and open data
          </p>

          {/* Decorative wave line */}
          <div className="mt-12 flex justify-center">
            <div className="w-32 h-1 bg-white/60 rounded-full" />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          <button
            onClick={() => window.location.href = '/map-page.html'}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white transition-all rounded-full border border-white/30"
            style={{
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.color = '#022C4D';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            aria-label="Navigate to map page"
          >
            <MapPin className="w-5 h-5" />
            <span className="font-medium text-xl">View Map</span>
          </button>

          <button
            onClick={() => window.location.href = '/species-dashboard.html'}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white transition-all rounded-full border border-white/30"
            style={{
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.color = '#022C4D';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            aria-label="Navigate to data page"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium text-xl">View Data</span>
          </button>
        </div>
      </div>

      {/* Mission Section */}
      <MissionSection />

      {/* Data Sources Section */}
      <div className="bg-white py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Data Sources
            </h2>
            <p className="text-lg text-gray-600">
              Our research is powered by open data from leading marine research organizations
            </p>
          </div>
          <DataSourcesSection />
        </div>
      </div>
    </div>

  );
}
