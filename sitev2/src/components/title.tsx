import './index.css'
import './styles/globals.css'

export default function App() {
  return (
    <div className="size-full flex items-center justify-center bg-white">
      <div className="relative">
        {/* Main title with ocean background clipped to text */}
        <h1 
          className="text-[120px] leading-none font-extrabold text-transparent bg-clip-text animate-ocean-wave"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1640809007069-7bd03ade65aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwdW5kZXJ3YXRlcnxlbnwxfHx8fDE3NjA3NzQ5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          OCEAN LIFE
        </h1>
        
        {/* Subtle subtitle */}
        <p className="text-center mt-6 text-slate-600 tracking-wide">
          Exploring the depths of marine biodiversity
        </p>
      </div>
      
      <style>{`
        @keyframes ocean-wave {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-ocean-wave {
          animation: ocean-wave 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
