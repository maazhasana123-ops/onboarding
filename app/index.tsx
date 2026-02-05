
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import confetti from 'canvas-confetti';

// --- Icons ---
const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="text-white/90 drop-shadow-md"><path d="M8 5v14l11-7z"/></svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

// --- Components ---

const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { id: 1, label: 'Welcome' },
    { id: 2, label: 'Book Call' },
    { id: 3, label: 'Testimonials' },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 py-8 flex justify-center items-center pointer-events-none">
      <div className="flex items-center gap-4">
        {/* Progress Pills */}
        <div className="bg-white/80 backdrop-blur-md px-8 py-3 rounded-full border border-slate-100 shadow-sm flex items-center gap-8 transition-all duration-500 pointer-events-auto">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex items-center gap-2">
                <div 
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    isActive ? 'bg-black scale-125' : isCompleted ? 'bg-slate-400' : 'bg-slate-200'
                  }`} 
                />
                <span 
                  className={`text-xs font-medium uppercase tracking-wider transition-colors duration-500 ${
                    isActive ? 'text-black' : isCompleted ? 'text-slate-500' : 'text-slate-300'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Time Badge - FEATURE 3 */}
        <div className="hidden md:flex bg-slate-100/80 backdrop-blur-md px-4 py-3 rounded-full border border-white shadow-sm items-center gap-2 text-xs font-medium text-slate-500 animate-in fade-in slide-in-from-top-4 duration-1000">
           <ClockIcon /> 2 min setup
        </div>
      </div>
    </div>
  );
};

const Button = ({ children, onClick, className = "", variant = "primary" }: any) => {
  const baseClasses = "group flex items-center gap-2 px-8 py-3.5 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "neu-button-black text-white focus:ring-black", 
    success: "neu-button-black text-white focus:ring-black",
    outline: "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </button>
  );
};

const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    // Calculate tilt
    const tiltX = y * -15; // Vertical tilt
    const tiltY = x * 15;  // Horizontal tilt

    setTransform(`perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ 
        transform, 
        transition: 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d',
        willChange: 'transform' 
      }}
    >
      {children}
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="w-full h-full bg-slate-50 rounded-3xl relative overflow-hidden flex flex-col items-center p-8 border border-slate-100">
    {/* Shimmer Effect */}
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent z-20" />
    
    {/* Mock UI */}
    <div className="w-full max-w-4xl flex flex-col gap-6 opacity-60">
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
        <div className="flex gap-2">
            <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
            <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4">
         <div className="col-span-7 h-10 bg-slate-200 rounded-md mb-2 w-full"></div>
         {[...Array(35)].map((_, i) => (
             <div key={i} className="aspect-square bg-slate-200 rounded-lg"></div>
         ))}
      </div>
      <div className="h-12 w-full bg-slate-200 rounded-xl mt-4"></div>
    </div>
  </div>
);


// --- Step 1: Welcome ---
const StepWelcome = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl w-full animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
      
      <h1 className="font-rustic text-6xl md:text-8xl text-slate-900 mb-6 py-2">
        Welcome to Nouxel AI
      </h1>
      <p className="text-slate-500 text-lg md:text-xl mb-12 font-light max-w-lg leading-relaxed">
        We’re thrilled to have you here. Watch this short video to understand the next steps.
      </p>

      {/* Video Player Placeholder with Pulse Effect - FEATURE 4 */}
      <div className="w-full aspect-video bg-gradient-to-tr from-slate-50 to-white rounded-2xl shadow-2xl shadow-slate-200/60 mb-12 flex items-center justify-center relative overflow-hidden group cursor-pointer border border-white">
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
        {/* Added animate-breathe class here */}
        <div className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-transform duration-500 shadow-lg border border-white/50 animate-breathe">
           <PlayIcon />
        </div>
        <div className="absolute bottom-6 left-6 text-white text-sm font-medium drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Onboarding Walkthrough • 2:14
        </div>
      </div>

      <Button onClick={onNext}>
        Get Started <ChevronRight />
      </Button>
    </div>
  );
};

// --- Step 2: Book Call ---
const StepBook = ({ onNext }: { onNext: () => void }) => {
  const [hasBooked, setHasBooked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Artificial delay to show off the polished skeleton state - FEATURE 1
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Cal.com embed initialization
    (function (C: any, A, L) { let p = function (a: any, ar: any) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");

    const cal = (window as any).Cal;
    if (cal) {
        cal("init", "onboarding-cal", {origin:"https://app.cal.com"});

        cal.ns["onboarding-cal"]("inline", {
            elementOrSelector:"#my-cal-inline-onboarding-cal",
            config: {"layout":"month_view","useSlotsViewOnSmallScreen":"true"},
            calLink: "maaz-hasan/onboarding-cal",
        });

        cal.ns["onboarding-cal"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
    }
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards h-full">
      <div className="text-center mb-8 mt-10 md:mt-12">
        <h2 className="font-rustic text-5xl md:text-7xl text-slate-900 mb-3 py-2">Book Your Onboarding Call</h2>
        <p className="text-slate-500 font-light text-lg">This short call helps us align and get things moving.</p>
      </div>

      {/* Real Cal.com Embed Container with Skeleton Logic */}
      <div className="w-full h-[650px] bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-100/50 border border-white/60 overflow-hidden relative p-4 flex flex-col items-center transition-all duration-500">
         {isLoading && (
            <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-sm p-4 rounded-3xl">
              <SkeletonLoader />
            </div>
         )}
         <div style={{width:"100%", height:"100%", overflow:"scroll", opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in'}} id="my-cal-inline-onboarding-cal"></div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        {!hasBooked ? (
           <button 
             onClick={() => setHasBooked(true)}
             className="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-4 transition-colors"
           >
             I have completed my booking
           </button>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
             <Button onClick={onNext} variant="primary">
              Continue <ChevronRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Step 3: Testimonials ---
const StepTestimonials = ({ onNext }: { onNext: () => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      company: "Midas Roofing",
      quote: "Our missed calls dropped by 90% in the first week. Nouxel's AI sounds exactly like our best rep.",
      stat: "90% Drop in Missed Calls"
    },
    {
      company: "Summit Energy",
      quote: "The voice latency is non-existent. Customers have no idea they are talking to an AI agent.",
      stat: "Zero Latency"
    },
    {
      company: "Vibe Insurance",
      quote: "It handled 500+ inbound claims during the storm. Our team could finally focus on complex cases.",
      stat: "500+ Calls Handled"
    },
    {
      company: "Super Roofer",
      quote: "Setup was instant. We plugged it into our CRM and it started booking appointments immediately.",
      stat: "Instant Integration"
    }
  ];

  const displayTestimonials = [...testimonials, ...testimonials, ...testimonials];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += 1; 
        if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth / 3)) {
          scrollContainer.scrollLeft = 1;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <div className="flex flex-col items-center text-center w-full animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards pb-12">
      <h2 className="font-rustic text-5xl md:text-7xl text-slate-900 mb-6 py-2">Trusted by Businesses Like</h2>
      <p className="text-slate-500 font-light mb-16 text-lg">See how Nouxel AI transforms phone operations.</p>
      
      <div 
        ref={scrollRef}
        className="w-full max-w-full flex gap-8 pb-12 px-4 no-scrollbar mask-image-gradient overflow-x-hidden py-10" // added py-10 for tilt clearance
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {displayTestimonials.map((t, index) => (
          // Wrapped in TiltCard - FEATURE 5
          <TiltCard 
            key={`${t.company}-${index}`}
            className="shrink-0 w-[350px] md:w-[420px] glass-gradient rounded-3xl p-10 flex flex-col items-start text-left cursor-default group relative overflow-hidden"
          >
            {/* Subtle Gradient Blob in card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl group-hover:bg-cyan-200/30 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex items-center gap-1 mb-6 relative z-10 pointer-events-none">
              {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
            </div>
            
            <p className="text-slate-800 text-xl leading-relaxed mb-8 font-medium relative z-10 pointer-events-none">
              "{t.quote}"
            </p>
            <div className="mt-auto w-full pt-8 border-t border-slate-200/50 flex justify-between items-end relative z-10 pointer-events-none">
              <div>
                <div className="text-slate-900 font-bold text-lg">{t.company}</div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mt-1 font-semibold">Verified Partner</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm text-slate-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border border-slate-100">
                {t.stat}
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-6">
        <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">We'll take it from here.</p>
        <Button onClick={onNext} variant="success">
          Finish <CheckIcon />
        </Button>
      </div>
    </div>
  );
};

// --- Step 4: Finish ---
const StepFinish = () => {
  // Trigger Confetti - FEATURE 2
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in-95 duration-1000">
      <div className="w-28 h-28 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-300/50 mb-8 animate-bounce">
          <svg className="text-white w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h1 className="font-rustic text-6xl font-semibold text-slate-900 mb-4">You're All Set.</h1>
      <p className="text-slate-500 text-lg">Redirecting to your dashboard...</p>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [step, setStep] = useState(1);
  const [finished, setFinished] = useState(false);

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center relative overflow-hidden font-inter selection:bg-cyan-200/30">
      
      {/* Background Decor: Logo Color Style Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-br from-cyan-100/40 via-blue-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-gradient-to-tr from-purple-100/40 via-pink-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Progress */}
      {!finished && <ProgressBar currentStep={step} />}

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center w-full px-6 pt-32 pb-12 z-10">
        {!finished ? (
          <>
            {step === 1 && <StepWelcome onNext={nextStep} />}
            {step === 2 && <StepBook onNext={nextStep} />}
            {step === 3 && <StepTestimonials onNext={nextStep} />}
          </>
        ) : (
          <StepFinish />
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
