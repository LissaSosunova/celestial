'use client';

import { Sun, Scale, Baby, Heart, Calendar, Sparkles } from 'lucide-react';
import { type UserProfile } from '@/lib/types/types';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-12 py-12 max-w-7xl mx-auto w-full">
        <header className="mb-16">
          <h2 className="text-sm uppercase tracking-ultra text-gold mb-3 font-bold">Inner Landscape</h2>
          <h1 className="text-4xl md:text-5xl font-serif font-light italic text-dark">
            Welcome back, 
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            {/* Daily Transit */}
            <div className="bg-secondary p-10 rounded-[40px] relative overflow-hidden group border border-transparent">
              <Sun className="absolute top-[-20px] right-[-20px] w-32 h-32 text-gold/50 animate-pulse" />
              <span className="text-[10px] uppercase tracking-ultra text-gold font-bold">Daily Alignment</span>
              <h3 className="text-3xl font-serif mt-2 mb-4 text-dark">Luminous clarity in the 4th House</h3>
              <p className="text-lg text-text-muted leading-relaxed italic max-w-2xl font-serif">
                "Today the heavens incline toward emotional depth. Your psychological roots are being nourished by the Sun's transit — a perfect time for quiet sanctuary."
              </p>
            </div>

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FeatureCard 
                icon={<Scale className="w-6 h-6" />}
                title="Personal Natal"
                description="YOUR SOUL'S BLUEPRINT"
                onClick={() => onNavigate('packages')}
              />
              <FeatureCard 
                icon={<Baby className="w-6 h-6" />}
                title="Child's Chart"
                description="THE NURTURE PATH"
                onClick={() => onNavigate('packages')}
              />
              <FeatureCard 
                icon={<Heart className="w-6 h-6" />}
                title="6-Month Forecast"
                description="MID-YEAR TRANSITS"
                onClick={() => onNavigate('packages')}
              />
              <FeatureCard 
                icon={<Calendar className="w-6 h-6" />}
                title="Yearly Roadmap"
                description="ANNUAL CYCLE"
                onClick={() => onNavigate('packages')}
              />
            </div> */}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white border border-border-light p-10 rounded-[40px] shadow-sm sticky top-32">
              <h4 className="font-serif text-2xl mb-8 text-dark">Psychological Archive</h4>
              <div className="space-y-6">
                {[
                  { title: 'The Archetype of Mother', desc: 'Jungian reflections', date: 'Archive' },
                  { title: 'Pluto in Aquarius', desc: 'Collective shift', date: 'Active' },
                  { title: 'Shadow Work', desc: 'Lunar patterns', date: 'Process' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-center group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text">{item.title}</div>
                      <div className="text-[10px] uppercase tracking-ultra text-text-muted font-bold mt-1">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-12 text-[11px] italic text-text-muted leading-relaxed border-t border-border-light pt-8">
                "The stars do not compel, they incline. Understanding is the first step to liberation."
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// FeatureCard компонент
function FeatureCard({ icon, title, description, onClick }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group bg-white border border-border-light p-8 rounded-2xl text-left hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors mb-4">
        {icon}
      </div>
      <h3 className="font-serif text-xl mb-2 text-dark group-hover:text-gold transition-colors">{title}</h3>
      <p className="text-[10px] uppercase tracking-ultra text-text-muted font-bold">{description}</p>
    </button>
  );
}