'use client';

import { useEffect, useState, useRef } from 'react';

interface StatItem {
  value: string;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: '830', suffix: 'K+', label: 'Traders' },
  { value: '1', suffix: 'TN+', label: 'Monthly Trading Volume (AUD)' },
  { value: '100', suffix: 'M+', label: 'Withdrawn Each Month (AUD)' },
  { value: '10', suffix: '', label: 'Global Offices' },
];

function AnimatedNumber({ target, suffix }: { target: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const targetNum = parseInt(target);
          const duration = 2000;
          const steps = 60;
          const increment = targetNum / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= targetNum) {
              setCount(targetNum);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      ${count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Statistics() {
  return (
    <section className="py-20 bg-[#0f1629] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e94560]/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0f3460]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Our numbers speak for themselves
          </h2>
          <p className="text-gray-400">
            Data for the Pepperstone Group, correct as at October 2025
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#e94560]/30 transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#e94560]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-400 text-sm sm:text-base">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
