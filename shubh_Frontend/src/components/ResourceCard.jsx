import React, { useState } from 'react';
import { FiMapPin, FiTag, FiCalendar } from 'react-icons/fi';

export default function ResourceCard({ resource, onBook }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      className="group glass rounded-3xl p-8 animate-scale-in border border-white/30 dark:border-slate-700/50 hover:border-violet-300 dark:hover:border-violet-600 perspective-1000 relative overflow-hidden hover:shadow-3xl hover:shadow-violet-500/30 transition-all duration-700 hover-lift cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: `perspective(1200px) rotateY(${mousePosition.x}deg) rotateX(${mousePosition.y}deg) translateZ(${isHovered ? 30 : 10}px)`,
        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      {/* Enhanced multi-layer background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-violet-500/8 group-hover:via-purple-500/6 group-hover:to-indigo-500/8 transition-all duration-700 rounded-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-white/5 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

      {/* Animated border gradient with shimmer effect */}
      <div className="absolute inset-0 rounded-3xl p-[3px] bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-gradient-x">
        <div className="w-full h-full bg-white/95 dark:bg-slate-900/95 rounded-3xl backdrop-blur-sm"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-violet-400 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header with enhanced title and animated icon */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-purple-600 transition-all duration-500 line-clamp-2 leading-tight">
              {resource.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
              {resource.description}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-violet-500/60 animate-pulse-glow hover:scale-110 transition-all duration-500 ml-6 flex-shrink-0 group-hover:rotate-12">
            <FiCalendar className="w-7 h-7 icon-hover" />
          </div>
        </div>

        {/* Enhanced Type and Location badges */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl px-5 py-3 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/30 dark:hover:to-purple-900/30 transition-all duration-300 border border-violet-100 dark:border-violet-800/30">
            <FiTag className="w-5 h-5 mr-4 text-violet-500 dark:text-violet-400 flex-shrink-0 icon-hover group-hover:scale-110 transition-transform duration-300" />
            <span className="font-bold capitalize text-slate-700 dark:text-slate-300">{resource.type}</span>
          </div>
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl px-5 py-3 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-all duration-300 border border-purple-100 dark:border-purple-800/30">
            <FiMapPin className="w-5 h-5 mr-4 text-purple-500 dark:text-purple-400 flex-shrink-0 icon-hover group-hover:scale-110 transition-transform duration-300" />
            <span className="line-clamp-2 font-medium text-slate-700 dark:text-slate-300">{resource.location}</span>
          </div>
        </div>

        {/* Premium Book Now Button with enhanced effects */}
        <button
          onClick={() => onBook(resource)}
          className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-5 px-8 rounded-2xl shadow-2xl hover:shadow-3xl hover:shadow-violet-500/50 transition-all duration-500 flex items-center justify-center space-x-3 group/btn hover-glow focus-ring relative overflow-hidden hover:scale-105"
        >
          <span className="relative z-10 text-lg tracking-wide">Book Now</span>
          <FiCalendar className="w-6 h-6 group-hover/btn:rotate-12 transition-all duration-500 relative z-10" />

          {/* Button shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

          {/* Button glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-400/0 via-purple-400/30 to-indigo-400/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
        </button>
      </div>
    </div>
  );
}
