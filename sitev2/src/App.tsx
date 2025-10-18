"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, MapPin, BarChart3 } from "lucide-react";
import { OceanMap } from "./components/OceanMap";
import { SeasonalData } from "./components/SeasonalData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

export default function App() {
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedTarget, setSelectedTarget] = useState("Marine Species");
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const scrollToData = () => {
    document.getElementById('data-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  // Initialize Leaflet map when map is shown
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstanceRef.current) {
      // Dynamically import Leaflet
      import('leaflet').then((L) => {
        // Initialize map centered on Norwegian coast towards Iceland
        const map = L.default.map(mapRef.current!).setView([65.0, 5.0], 4);
        
        // Add tile layers
        L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add ocean basemap
        L.default.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri',
          opacity: 0.7
        }).addTo(map);
        
        // Marine research stations along Norwegian coast towards Iceland and between UK-Norway
        const oceanData = [
          { lat: 58.8, lng: 5.2, name: 'Stavanger Marine Station', temp: 8.5, status: 'excellent', depth: '85m', species: 'Cod, Herring, Mackerel' },
          { lat: 60.1, lng: 5.8, name: 'Bergen Fjord Research', temp: 7.2, status: 'excellent', depth: '120m', species: 'Salmon, Arctic Cod, Krill' },
          { lat: 61.2, lng: 4.9, name: 'Norwegian Shelf Station', temp: 6.8, status: 'excellent', depth: '200m', species: 'Haddock, Plaice, Shrimp' },
          { lat: 62.5, lng: 6.1, name: 'Trondheim Bay Monitoring', temp: 6.1, status: 'excellent', depth: '150m', species: 'Pollock, Herring, Crab' },
          { lat: 64.8, lng: 10.2, name: 'Nordland Coast Station', temp: 5.8, status: 'excellent', depth: '180m', species: 'Cod, Capelin, Jellyfish' },
          { lat: 67.2, lng: 14.5, name: 'Lofoten Research Buoy', temp: 5.2, status: 'excellent', depth: '300m', species: 'Arctic Cod, Herring, Squid' },
          { lat: 69.8, lng: 18.9, name: 'Tromsø Marine Lab', temp: 4.8, status: 'excellent', depth: '250m', species: 'Arctic Char, Capelin, Krill' },
          { lat: 71.2, lng: 25.8, name: 'North Cape Station', temp: 4.1, status: 'excellent', depth: '400m', species: 'Deep-sea Fish, Lanternfish' },
          { lat: 70.5, lng: -2.1, name: 'North Sea Corridor', temp: 7.8, status: 'good', depth: '120m', species: 'Haddock, Plaice, Sand Eel' },
          { lat: 59.2, lng: 2.8, name: 'UK-Norway Bridge', temp: 8.9, status: 'good', depth: '95m', species: 'Cod, Herring, Mackerel' },
          { lat: 66.1, lng: -18.5, name: 'Iceland Approach', temp: 5.5, status: 'excellent', depth: '500m', species: 'Blue Whiting, Mackerel, Squid' },
          { lat: 63.8, lng: -8.2, name: 'Faroe-Shetland Channel', temp: 6.2, status: 'excellent', depth: '600m', species: 'Deep-sea Fish, Lanternfish' }
        ];
        
        // Color mapping
        const statusColors: { [key: string]: string } = {
          'excellent': '#0066cc',
          'good': '#00cc66',
          'moderate': '#ffcc00',
          'poor': '#ff6600',
          'critical': '#cc0000'
        };
        
        // Add markers
        oceanData.forEach(point => {
          L.default.circleMarker([point.lat, point.lng], {
            radius: 8,
            fillColor: statusColors[point.status],
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map).bindPopup(`
            <div style="min-width: 250px;">
              <h4 style="margin: 0 0 10px 0; color: #2c5aa0;">${point.name}</h4>
              <p><strong>Water Temperature:</strong> ${point.temp}°C</p>
              <p><strong>Depth:</strong> ${point.depth}</p>
              <p><strong>Marine Life:</strong> ${point.species}</p>
              <p><strong>Ecosystem Health:</strong> <span style="color: ${statusColors[point.status]}">${point.status.toUpperCase()}</span></p>
            </div>
          `);
        });
        
        mapInstanceRef.current = map;
      });
    }
    
    // Cleanup map when component unmounts or map is hidden
    return () => {
      if (!showMap && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showMap]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Custom video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover min-h-screen"
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-transparent to-blue-900/30" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-[120px] leading-none font-extrabold text-white drop-shadow-2xl">
            WATER GATE
          </h1>
          
          <p className="mt-8 text-xl text-white/90 tracking-wide drop-shadow-lg">
            Exploring the depths of marine biodiversity
          </p>
          
          {/* Decorative wave line */}
          <div className="mt-12 flex justify-center">
            <div className="w-32 h-1 bg-white/60 rounded-full" />
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          <button
            onClick={toggleMap}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all rounded-full border border-white/30"
            aria-label="Toggle map view"
          >
            <MapPin className="w-5 h-5" />
            <span className="font-medium">View Map</span>
          </button>
          
          <button
            onClick={scrollToData}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all rounded-full border border-white/30"
            aria-label="Scroll to data section"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">View Data</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Section */}
      {showMap && (
        <div className="relative bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                Marine Life Research Stations
              </h2>
              <p className="text-lg text-gray-600">
                Ocean monitoring stations studying marine biodiversity and ecosystem health
              </p>
            </div>
            
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={toggleMap}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                  Close Map
                </button>
              </div>
              
              <div 
                ref={mapRef}
                className="w-full h-96"
                style={{ minHeight: '400px' }}
              />
              
              {/* Map Controls Overlay */}
              <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                <h3 className="font-bold text-gray-800 mb-3">Marine Research Controls</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Research Parameter
                    </label>
                    <Select defaultValue="temperature">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temperature">Water Temperature</SelectItem>
                        <SelectItem value="salinity">Salinity</SelectItem>
                        <SelectItem value="ph">pH Level</SelectItem>
                        <SelectItem value="oxygen">Dissolved Oxygen</SelectItem>
                        <SelectItem value="biodiversity">Species Diversity</SelectItem>
                        <SelectItem value="nutrients">Nutrient Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Study Period
                    </label>
                    <Select defaultValue="current">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current</SelectItem>
                        <SelectItem value="24h">Last 24 Hours</SelectItem>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="seasonal">Seasonal Analysis</SelectItem>
                        <SelectItem value="annual">Annual Trends</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Section */}
      <div id="data-section" className="bg-white py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Ocean Data Analytics
            </h2>
            <p className="text-lg text-gray-600">
              Track biodiversity changes across different ocean regions and seasons
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Year
              </label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Target
              </label>
              <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marine Species">Marine Species</SelectItem>
                  <SelectItem value="Coral Reefs">Coral Reefs</SelectItem>
                  <SelectItem value="Fish Population">Fish Population</SelectItem>
                  <SelectItem value="Water Quality">Water Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-6">
              Global Monitoring Locations
            </h3>
            <OceanMap />
          </div>

          {/* Seasonal Data */}
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-6">
              Seasonal Analysis - {selectedYear}
            </h3>
            <SeasonalData year={selectedYear} target={selectedTarget} />
          </div>
        </div>
      </div>
    </div>
  );
}
