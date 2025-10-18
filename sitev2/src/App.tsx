"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, MapPin, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { SeasonalData } from "./components/SeasonalData";
import fishingDataUK2021 from "./data/vertebrates/uk/fishingeffort_UK2021MONTHLY.json";
import fishingDataUK2022 from "./data/vertebrates/uk/fishingeffort_UK2022MONTHLY.json";
import fishingDataUK2023 from "./data/vertebrates/uk/fishingeffort_UK2023MONTHLY.json";
import fishingDataTromso2021 from "./data/vertebrates/tromso/fishingeffort_Tromso2021MONTHLY.json";
import fishingDataTromso2022 from "./data/vertebrates/tromso/fishingeffort_Tromso2022MONTHLY.json";
import fishingDataTromso2023 from "./data/vertebrates/tromso/fishingeffort_Tromso2023MONTHLY.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import backgroundVideo from "./assets/background.webm";
import DataSourcesSection from "./sponsors/DataSourcesSection";

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState("UK");
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [selectedVesselId, setSelectedVesselId] = useState("All Vessels");
  const [selectedTarget, setSelectedTarget] = useState("Fishing Hours");
  const [showMap, setShowMap] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const stationMapRef = useRef<HTMLDivElement>(null);
  const stationMapInstanceRef = useRef<any>(null);

  const scrollToData = () => {
    document.getElementById('data-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  // Get fishing data based on selected region, year, month, and vessel ID
  const getFishingData = (region: string, year: string, month: string = "All Months", vesselId: string = "All Vessels") => {
    let data;

    // Select data based on region and year
    if (region === "UK") {
      switch (year) {
        case '2021': data = fishingDataUK2021; break;
        case '2022': data = fishingDataUK2022; break;
        case '2023': data = fishingDataUK2023; break;
        default: data = fishingDataUK2023;
      }
    } else if (region === "Tromso") {
      switch (year) {
        case '2021': data = fishingDataTromso2021; break;
        case '2022': data = fishingDataTromso2022; break;
        case '2023': data = fishingDataTromso2023; break;
        default: data = fishingDataTromso2023;
      }
    } else {
      data = fishingDataUK2023; // Default to UK
    }

    // Filter by month if not "All Months"
    if (month !== "All Months") {
      const monthNumber = month.padStart(2, '0'); // Convert "1" to "01", etc.
      data = data.filter(point => {
        const timeRange = point['Time Range'];
        const pointMonth = timeRange.split('-')[1];
        return pointMonth === monthNumber;
      });
    }

    // Filter by vessel ID if not "All Vessels"
    if (vesselId !== "All Vessels") {
      data = data.filter(point => {
        return point['Vessel IDs'].toString() === vesselId;
      });
    }

    return data;
  };

  // Create unique sampling locations from the data
  const getUniqueSamplingLocations = (data: any[]) => {
    const locations = new Map();
    data.forEach((point, index) => {
      const key = `${point.Lat.toFixed(2)},${point.Lon.toFixed(2)}`;
      if (!locations.has(key)) {
        locations.set(key, {
          id: `location_${index}`,
          name: `Fishing Zone ${point.Lat.toFixed(1)}°N, ${point.Lon.toFixed(1)}°`,
          lat: point.Lat,
          lng: point.Lon,
          coordinates: [point.Lat, point.Lon]
        });
      }
    });
    return Array.from(locations.values());
  };

  // Get unique vessel IDs from the data
  const getUniqueVesselIds = (data: any[]): string[] => {
    const vesselIds = new Set<string>();
    data.forEach(point => {
      vesselIds.add(point['Vessel IDs'].toString());
    });
    return Array.from(vesselIds).sort((a, b) => parseInt(a) - parseInt(b));
  };

  const samplingLocations = getUniqueSamplingLocations(getFishingData(selectedRegion, selectedYear, selectedMonth, selectedVesselId));
  const vesselIds = getUniqueVesselIds(getFishingData(selectedRegion, selectedYear, selectedMonth));

  const selectStation = (stationName: string) => {
    setSelectedStation(stationName);
    document.getElementById('data-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateStation = (direction: 'prev' | 'next') => {
    if (!selectedStation) return;

    const currentIndex = samplingLocations.findIndex(loc => loc.name === selectedStation);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? samplingLocations.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === samplingLocations.length - 1 ? 0 : currentIndex + 1;
    }

    setSelectedStation(samplingLocations[newIndex].name);
  };

  // Make selectStation globally available
  useEffect(() => {
    (window as any).selectStation = selectStation;
    return () => {
      delete (window as any).selectStation;
    };
  }, []);

  // Clear selected station when region changes
  useEffect(() => {
    setSelectedStation(null);
  }, [selectedRegion]);

  // Create station-specific map when station is selected
  useEffect(() => {
    if (selectedStation && stationMapRef.current && !stationMapInstanceRef.current) {
      // Get coordinates from the actual data
      const currentData = getFishingData(selectedRegion, selectedYear, selectedMonth, selectedVesselId);
      const locationData = currentData.find(point =>
        `Fishing Zone ${point.Lat.toFixed(1)}°N, ${point.Lon.toFixed(1)}°` === selectedStation
      );

      if (locationData) {
        const coords: [number, number] = [locationData.Lat, locationData.Lon];
        import('leaflet').then((L) => {
          // Create small map centered on station
          const stationMap = L.default.map(stationMapRef.current!).setView(coords, 8);

          // Add tile layer
          L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(stationMap);

          // Add ocean basemap
          L.default.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            opacity: 0.7
          }).addTo(stationMap);

          // Add station marker
          L.default.circleMarker(coords, {
            radius: 10,
            fillColor: '#0066cc',
            color: '#fff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(stationMap).bindPopup(`
            <div style="min-width: 150px;">
              <h4 style="margin: 0 0 8px 0; color: #2c5aa0;">${selectedStation}</h4>
              <p style="margin: 0; font-size: 12px;">Fishing Zone</p>
              <p style="margin: 0; font-size: 12px;">Fishing Hours: ${locationData['Apparent Fishing Hours'].toFixed(1)} hrs</p>
              <p style="margin: 0; font-size: 12px;">Vessel ID: ${locationData['Vessel IDs']}</p>
            </div>
          `);

          stationMapInstanceRef.current = stationMap;
        });
      }
    }

    // Cleanup station map when station changes
    return () => {
      if (stationMapInstanceRef.current) {
        stationMapInstanceRef.current.remove();
        stationMapInstanceRef.current = null;
      }
    };
  }, [selectedStation, selectedRegion, selectedYear, selectedMonth, selectedVesselId]);

  // Initialize Leaflet map when map is shown
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstanceRef.current) {
      // Dynamically import Leaflet
      import('leaflet').then((L) => {
        // Initialize map centered based on selected region
        const mapCenter: [number, number] = selectedRegion === "Tromso" ? [69.6, 18.9] : [50.5, -4.0]; // Tromso or UK
        const mapZoom = selectedRegion === "Tromso" ? 5 : 6; // Different zoom levels for each region
        const map = L.default.map(mapRef.current!).setView(mapCenter, mapZoom);

        // Add tile layers
        L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add ocean basemap
        L.default.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri',
          opacity: 0.7
        }).addTo(map);

        // Get fishing effort data for the selected year and month
        const currentFishingData = getFishingData(selectedRegion, selectedYear, selectedMonth, selectedVesselId);

        // Process fishing data for map markers
        const fishingMarkers = currentFishingData.map((point) => {
          const fishingHours = point['Apparent Fishing Hours'];
          const vesselCount = point['Vessel IDs'];
          const timeRange = point['Time Range'];

          // Determine marker color based on fishing intensity
          let status = 'low';
          let color = '#00cc66'; // green for low
          if (fishingHours > 200) {
            status = 'high';
            color = '#cc0000'; // red for high
          } else if (fishingHours > 100) {
            status = 'medium';
            color = '#ffcc00'; // yellow for medium
          }

          return {
            lat: point.Lat,
            lng: point.Lon,
            name: `Fishing Zone ${point.Lat.toFixed(1)}°N, ${point.Lon.toFixed(1)}°`,
            fishingHours: fishingHours,
            vesselCount: vesselCount,
            timeRange: timeRange,
            status: status,
            color: color
          };
        });

        // Add markers for fishing effort data
        fishingMarkers.forEach(point => {
          const marker = L.default.circleMarker([point.lat, point.lng], {
            radius: Math.min(Math.max(point.fishingHours / 20, 4), 12), // Scale radius based on fishing hours
            fillColor: point.color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map).bindPopup(`
            <div style="min-width: 250px;">
              <h4 style="margin: 0 0 10px 0; color: #2c5aa0;">${point.name}</h4>
              <p><strong>Fishing Hours:</strong> ${point.fishingHours.toFixed(1)} hours</p>
              <p><strong>Vessel Count:</strong> ${point.vesselCount} vessels</p>
              <p><strong>Time Period:</strong> ${point.timeRange}</p>
              <p><strong>Fishing Intensity:</strong> <span style="color: ${point.color}">${point.status.toUpperCase()}</span></p>
              <button onclick="window.selectStation('${point.name}')" style="margin-top: 10px; padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
                View Data Analysis
              </button>
            </div>
          `);

          // Add click handler to marker
          marker.on('click', () => {
            setSelectedStation(point.name);
            // Scroll to data section after a short delay to allow popup to show
            setTimeout(() => {
              document.getElementById('data-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
          });
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
  }, [showMap, selectedRegion]);

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

      {/* Interactive Map Section */}
      {showMap && (
        <div className="relative bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                {selectedRegion === "Tromso" ? "Tromsø" : "UK"} Fishing Effort Monitoring - {selectedYear}
                {selectedMonth !== "All Months" && ` - ${selectedMonth}`}
                {selectedVesselId !== "All Vessels" && ` - Vessel ${selectedVesselId}`}
              </h2>
              <p className="text-lg text-gray-600">
                Real-time fishing activity data showing vessel locations, fishing hours, and effort intensity
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
                <h3 className="font-bold text-gray-800 mb-3">Fishing Effort Controls</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Parameter
                    </label>
                    <Select defaultValue="fishing-hours">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fishing-hours">Fishing Hours</SelectItem>
                        <SelectItem value="vessel-count">Vessel Count</SelectItem>
                        <SelectItem value="effort-intensity">Effort Intensity</SelectItem>
                        <SelectItem value="time-period">Time Period</SelectItem>
                        <SelectItem value="location-density">Location Density</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Analysis Period
                    </label>
                    <Select defaultValue="monthly">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly Data</SelectItem>
                        <SelectItem value="quarterly">Quarterly Analysis</SelectItem>
                        <SelectItem value="annual">Annual Trends</SelectItem>
                        <SelectItem value="comparison">Year Comparison</SelectItem>
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
              {selectedRegion === "Tromso" ? "Tromsø" : "UK"} Fishing Effort Analytics - {selectedYear}
            </h2>
            <p className="text-lg text-gray-600">
              Analyze fishing activity patterns, vessel distribution, and effort intensity across {selectedRegion === "Tromso" ? "Tromsø waters" : "UK waters"}
            </p>
          </div>








          <DataSourcesSection />
        </div>
      </div>
    </div>

  );
}
