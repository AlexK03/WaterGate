import '../index.css'

export default function Title() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Video Background */}
      <video
        key="background-video"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={`/background.mp4?v=${Date.now()}`} type="video/mp4" />
      </video>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="relative z-10 text-center">
        {/* Main title */}
        <h1 className="text-[120px] leading-none font-extrabold text-white drop-shadow-2xl">
          WATER GATE
        </h1>
        
        {/* Subtle subtitle */}
        <p className="text-center mt-6 text-white/90 tracking-wide drop-shadow-lg">
          Exploring the depths of marine biodiversity
        </p>
      </div>
    </div>
  );
}