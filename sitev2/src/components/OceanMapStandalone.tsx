import React, { useEffect, useRef, useState } from 'react';

interface OceanMapStandaloneProps {
  className?: string;
  height?: string;
}

export const OceanMapStandalone: React.FC<OceanMapStandaloneProps> = ({ 
  className = "w-full h-96", 
  height = "400px" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
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
        setIsLoaded(true);
      });
    }
    
    // Cleanup map when component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative">
      <div 
        ref={mapRef}
        className={className}
        style={{ minHeight: height }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading marine research map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OceanMapStandalone;
