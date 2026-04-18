import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, RotateCcw, ChevronRight, CheckCircle2, 
  XCircle, Info, Star, Timer, Sparkles, 
  Target, Dumbbell, PlayCircle, BookOpen, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

// --- Types ---

interface Challenge {
  text: string;
  options: string[];
  answer: string;
  translation: string;
  reason: string;
}

// --- Data ---

const CHALLENGES: Challenge[] = [
  { text: "Yo ___ tocar la guitarra.", options: ["sé", "conozco"], answer: "sé", translation: "Ես գիտեմ (կարող եմ) կիթառ նվագել:", reason: "Ability/Skill uses 'Saber'." },
  { text: "Yo ___ a María muy bien.", options: ["sé", "conozco"], answer: "conozco", translation: "Ես Մարիային շատ լավ եմ ճանաչում:", reason: "Recognizing a person uses 'Conocer'." },
  { text: "¿___ tú dónde está el cine?", options: ["Sabes", "Conoces"], answer: "Sabes", translation: "Գիտե՞ս, թե որտեղ է կինոթատրոնը:", reason: "Information/Facts use 'Saber'." },
  { text: "Nosotros ___ Madrid.", options: ["sabemos", "conocemos"], answer: "conocemos", translation: "Մենք ճանաչում ենք (եղել ենք) Մադրիդում:", reason: "Familiarity with places uses 'Conocer'." },
  { text: "Ellos ___ hablar español.", options: ["saben", "conocen"], answer: "saben", translation: "Նրանք գիտեն (կարողանում են) իսպաներեն խոսել:", reason: "Languages/Skills use 'Saber'." },
  { text: "Tú ___ este libro de historia.", options: ["sabes", "conoces"], answer: "conoces", translation: "Դու ճանաչում ես (ծանոթ ես) այս պատմության գրքին:", reason: "Being familiar with things/objects uses 'Conocer'." },
  { text: "Mi madre ___ cocinar paella.", options: ["sabe", "conoce"], answer: "sabe", translation: "Մայրս գիտի (կարողանում է) պաելյա պատրաստել:", reason: "Knowing 'how to' uses 'Saber'." },
  { text: "Yo ___ a tus padres.", options: ["sé", "conozco"], answer: "conozco", translation: "Ես ճանաչում եմ քո ծնողներին:", reason: "Recognizing people uses 'Conocer'." },
  { text: "Ustedes ___ que mañana hay clase.", options: ["saben", "conocen"], answer: "saben", translation: "Դուք գիտեք, որ վաղը դաս կա:", reason: "Knowledge of facts uses 'Saber'." },
  { text: "¿___ tú Armenia?", options: ["Sabes", "Conoces"], answer: "Conoces", translation: "Դու ճանաչու՞մ ես (եղե՞լ ես) Հայաստանում:", reason: "Places/Experience uses 'Conocer'." }
];

const FINISH_LINE = 5; // Goals to win

// --- Components ---

const SoccerField = ({ progress }: { progress: number }) => (
  <div className="relative w-full h-[300px] mb-12 overflow-hidden rounded-[2rem] bg-emerald-900/20 border-4 border-emerald-500/30" style={{ perspective: '1200px' }}>
    {/* 3D Pitch */}
    <div 
      className="absolute inset-0 bg-emerald-700/40"
      style={{ 
        transform: 'rotateX(65deg) translateY(-20%)',
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px)`,
        boxShadow: '0 50px 100px rgba(0,0,0,0.5)'
      }}
    >
      {/* Goal Posts */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 border-x-4 border-t-4 border-white opacity-40" />
      
      {/* Center Line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-white/20" />
      
      {/* Player Ball */}
      <motion.div 
        animate={{ 
          y: `${100 - (progress / FINISH_LINE) * 100}%`,
          x: feedback === 'correct' ? [0, -10, 10, 0] : 0
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.4)] animate-bounce">
           <Target size={24} className="text-emerald-900" />
        </div>
        <div className="w-16 h-4 bg-black/40 blur-md rounded-full mt-2" />
      </motion.div>
    </div>
  </div>
);

let feedback: 'correct' | 'wrong' | null = null;

export default function SaberConocerArena() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [goals, setGoals] = useState(0);
  const [localFeedback, setLocalFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shuffledChallenges, setShuffledChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    setShuffledChallenges([...CHALLENGES].sort(() => Math.random() - 0.5));
  }, [gameState]);

  const handleAnswer = (option: string) => {
    const isCorrect = option === shuffledChallenges[currentIdx].answer;
    feedback = isCorrect ? 'correct' : 'wrong'; // Global for animation trigger
    setLocalFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setGoals(g => {
        const next = g + 1;
        if (next >= FINISH_LINE) {
          setTimeout(() => {
            setGameState('end');
            confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
          }, 1500);
        }
        return next;
      });
    }

    setTimeout(() => {
      setLocalFeedback(null);
      feedback = null;
      setCurrentIdx(i => (i + 1) % CHALLENGES.length);
    }, 2000);
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          <div className="relative">
             <Trophy size={160} className="text-yellow-500 animate-pulse mx-auto" />
             <Target className="absolute -top-4 -right-4 text-emerald-500 animate-spin" size={48} />
          </div>
          <div className="space-y-4">
             <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                Saber vs <span className="text-emerald-500">Conocer</span>
             </h1>
             <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">Սպորտային Արենա: Գոլ խփիր գիտելիքով</p>
          </div>
          
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 text-sm max-w-sm mx-auto text-left space-y-4">
             <div className="flex gap-3">
                <Info size={18} className="text-emerald-500 shrink-0" />
                <p><span className="font-bold text-white">Saber:</span> Փաստեր, տեղեկություն, հմտություններ (how to):</p>
             </div>
             <div className="flex gap-3">
                <Info size={18} className="text-emerald-500 shrink-0" />
                <p><span className="font-bold text-white">Conocer:</span> Մարդկանց ճանաչել, վայրեր, լինել ծանոթ:</p>
             </div>
          </div>

          <button 
            onClick={() => setGameState('playing')}
            className="group relative px-16 py-8 bg-emerald-600 rounded-[2.5rem] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-600/30 font-black text-3xl uppercase tracking-widest"
          >
            ՄՏՆԵԼ ԴԱՇՏ
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'end') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center space-y-12">
        <div className="bg-emerald-500/20 p-12 rounded-full border-4 border-emerald-500 animate-bounce">
           <Trophy size={160} className="text-yellow-400" />
        </div>
        <div className="space-y-4">
           <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter">ՉԵՄՊԻՈՆ!</h1>
           <p className="text-2xl font-bold text-emerald-400 italic">Դուք հասաք վերջնագծին:</p>
        </div>
        <button 
          onClick={() => { setGoals(0); setGameState('start'); }}
          className="px-12 py-6 bg-slate-900 border-2 border-slate-800 rounded-full font-black text-xl uppercase tracking-widest hover:border-emerald-500 transition-all"
        >
          <RotateCcw className="inline mr-2" /> ՆՈՐԻՑ ԽԱՂԱԼ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header Stats */}
        <div className="flex justify-between items-end bg-slate-900/80 p-6 rounded-3xl border border-slate-800 backdrop-blur-xl">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                 <User size={24} />
              </div>
              <div className="text-left">
                 <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">ԽԱՂԱՑՈՂ</div>
                 <div className="font-black italic uppercase italic">Քո Ավատարը</div>
              </div>
           </div>

           <div className="text-right">
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">ՀԱՂԹԱՆԱԿԻՆ ՄՆԱՑ</div>
              <div className="flex gap-2">
                 {Array.from({ length: FINISH_LINE }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-6 h-6 rounded-full border-2 transition-all ${i < goals ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-950 border-slate-800'}`} 
                    />
                 ))}
              </div>
           </div>
        </div>

        {/* 3D Field View */}
        <SoccerField progress={goals} />

        {/* Question Area */}
        <AnimatePresence mode="wait">
          {!localFeedback && shuffledChallenges[currentIdx] && (
            <motion.div 
              key={currentIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="bg-slate-900/90 border border-emerald-500/20 rounded-[3rem] p-8 md:p-16 text-center space-y-12 shadow-2xl relative"
            >
               <div className="space-y-4">
                  <div className="bg-emerald-500/10 inline-block px-4 py-1 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">
                     Մարտահրավեր {currentIdx + 1}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight">
                     {shuffledChallenges[currentIdx].text.split('___').map((part, i) => (
                       <React.Fragment key={i}>
                         {part}{i === 0 && <span className="text-emerald-500 underline decoration-emerald-500/30 decoration-4 underline-offset-8"> ___ </span>}
                       </React.Fragment>
                     ))}
                  </h2>
                  <p className="text-slate-500 font-bold italic tracking-tight">({shuffledChallenges[currentIdx].translation})</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shuffledChallenges[currentIdx].options.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="px-10 py-6 bg-slate-950 border-4 border-slate-900 rounded-3xl font-black text-3xl uppercase tracking-tighter hover:border-emerald-500 transition-all hover:scale-105 active:scale-95 shadow-xl"
                    >
                      {opt}
                    </button>
                  ))}
               </div>
            </motion.div>
          )}

          {localFeedback && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`bg-slate-900/95 border-4 rounded-[3rem] p-12 text-center space-y-6 ${localFeedback === 'correct' ? 'border-emerald-500' : 'border-rose-500'}`}
            >
               {localFeedback === 'correct' ? (
                 <motion.div animate={{ scale: [1, 1.2, 1] }}>
                   <CheckCircle2 size={100} className="mx-auto text-emerald-500" />
                 </motion.div>
               ) : (
                 <XCircle size={100} className="mx-auto text-rose-500" />
               )}
               <h3 className={`text-6xl font-black uppercase italic tracking-tighter ${localFeedback === 'correct' ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {localFeedback === 'correct' ? 'ԳՈՈՈԼ!' : 'ՄԻՍՍ!'}
               </h3>
               <p className="text-slate-400 font-bold italic max-w-sm mx-auto tracking-tight">
                 {shuffledChallenges[currentIdx].reason}
               </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <div className="flex items-center gap-3 text-slate-500 italic max-w-sm mx-auto text-center">
           <Sparkles size={16} className="text-emerald-500 shrink-0" />
           <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Ճիշտ պատասխանիր հարցերին՝ գնդակը դեպի գոլ մղելու և հաղթելու համար:
           </p>
        </div>

      </div>
    </div>
  );
}
