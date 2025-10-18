interface MarkerProps {
  x: number;
  y: number;
  label: string;
}

const markers: MarkerProps[] = [
  { x: 25, y: 30, label: "North Pacific" },
  { x: 70, y: 25, label: "North Atlantic" },
  { x: 35, y: 55, label: "South Pacific" },
  { x: 75, y: 60, label: "Indian Ocean" },
  { x: 50, y: 75, label: "Southern Ocean" },
];

export function OceanMap() {
  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden shadow-lg">
      {/* Simplified world map background */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Simplified continent shapes */}
        <path d="M 15,20 L 30,25 L 35,35 L 25,45 L 15,40 Z" fill="#1e40af" />
        <path d="M 40,15 L 60,18 L 65,30 L 55,40 L 45,35 Z" fill="#1e40af" />
        <path d="M 70,25 L 85,28 L 90,40 L 80,45 L 70,40 Z" fill="#1e40af" />
        <path d="M 20,55 L 40,60 L 45,75 L 30,80 L 20,70 Z" fill="#1e40af" />
        <path d="M 60,50 L 80,55 L 85,70 L 70,75 L 60,65 Z" fill="#1e40af" />
      </svg>
      
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        {[...Array(10)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={`${i * 10}%`}
            x2="100%"
            y2={`${i * 10}%`}
            stroke="#1e40af"
            strokeWidth="1"
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={`${i * 10}%`}
            y1="0"
            x2={`${i * 10}%`}
            y2="100%"
            stroke="#1e40af"
            strokeWidth="1"
          />
        ))}
      </svg>
      
      {/* Markers */}
      {markers.map((marker, index) => (
        <div
          key={index}
          className="absolute group cursor-pointer"
          style={{
            left: `${marker.x}%`,
            top: `${marker.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Marker pin */}
          <div className="relative">
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
            <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75" />
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <div className="bg-gray-900 text-white px-3 py-1.5 rounded shadow-lg">
              {marker.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
