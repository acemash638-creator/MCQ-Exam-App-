/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Trophy, ChevronRight, RotateCcw, Brain, FlaskConical, Atom, Dna, Calculator, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Types
interface Question {
  id: number;
  q: string;
  options: string[];
  ans: number;
  cat: string;
  class: string;
  icon: React.ReactNode;
}

const QUESTIONS: Question[] = [
  { 
    id: 1,
    q: "x + y = 5 এবং x - y = 3 হলে, x এর মান কত?", 
    options: ["4", "3", "2", "8"], 
    ans: 0, 
    cat: "সাধারণ গণিত", 
    class: "bg-math",
    icon: <Calculator className="w-4 h-4" />
  },
  { 
    id: 2,
    q: "log2(8) এর মান কত?", 
    options: ["2", "3", "4", "1"], 
    ans: 1, 
    cat: "উচ্চতর গণিত", 
    class: "bg-hmath",
    icon: <Calculator className="w-4 h-4" />
  },
  { 
    id: 3,
    q: "সোডিয়ামের পারমাণবিক সংখ্যা কত?", 
    options: ["10", "11", "12", "13"], 
    ans: 1, 
    cat: "রসায়ন", 
    class: "bg-chem",
    icon: <FlaskConical className="w-4 h-4" />
  },
  { 
    id: 4,
    q: "গতির দ্বিতীয় সমীকরণ কোনটি?", 
    options: ["v = u + at", "s = ut + ½at²", "v² = u² + 2as", "s = vt"], 
    ans: 1, 
    cat: "পদার্থবিজ্ঞান", 
    class: "bg-phys",
    icon: <Atom className="w-4 h-4" />
  },
  { 
    id: 5,
    q: "নিচের কোনটি কোষের শক্তিঘর (Powerhouse)?", 
    options: ["নিউক্লিয়াস", "রাইবোসোম", "মাইটোকন্ড্রিয়া", "লাইসোজোম"], 
    ans: 2, 
    cat: "জীববিজ্ঞান", 
    class: "bg-bio",
    icon: <Dna className="w-4 h-4" />
  },
  {
    id: 6,
    q: "পানির সংকেত কোনটি?",
    options: ["CO2", "H2O", "NaCl", "O2"],
    ans: 1,
    cat: "রসায়ন",
    class: "bg-chem",
    icon: <FlaskConical className="w-4 h-4" />
  },
  {
    id: 7,
    q: "নিউটনের গতির প্রথম সূত্রটি কী নামে পরিচিত?",
    options: ["বলের সূত্র", "ত্বরণের সূত্র", "জড়তার সূত্র", "ক্রিয়া-প্রতিক্রিয়া সূত্র"],
    ans: 2,
    cat: "পদার্থবিজ্ঞান",
    class: "bg-phys",
    icon: <Atom className="w-4 h-4" />
  }
];

const INITIAL_TIME = 900; // 15 minutes

export default function App() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUESTIONS.length).fill(null));

  const handleFinish = useCallback(() => {
    setIsFinished(true);
    if (score >= QUESTIONS.length * 0.7) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b']
      });
    }
  }, [score]);

  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, handleFinish]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (selected === null) return;

    const isCorrect = selected === QUESTIONS[currentIdx].ans;
    if (isCorrect) setScore(prev => prev + 1);

    const newAnswers = [...answers];
    newAnswers[currentIdx] = selected;
    setAnswers(newAnswers);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
    } else {
      handleFinish();
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelected(null);
    setTimeLeft(INITIAL_TIME);
    setIsFinished(false);
    setAnswers(new Array(QUESTIONS.length).fill(null));
  };

  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
            <div className="h-2 bg-emerald-500" />
            <CardHeader className="text-center pt-8">
              <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 text-emerald-500" />
              </div>
              <CardTitle className="text-3xl font-display font-bold text-white">অভিনন্দন!</CardTitle>
              <CardDescription className="text-slate-400 text-lg">আপনার পরীক্ষার ফলাফল</CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <div className="text-7xl font-display font-black text-emerald-500 mb-2">
                {score}<span className="text-3xl text-slate-600">/{QUESTIONS.length}</span>
              </div>
              <p className="text-slate-400 mb-8">
                {score === QUESTIONS.length ? "অসাধারণ! আপনি সব প্রশ্নের সঠিক উত্তর দিয়েছেন।" : 
                 score >= QUESTIONS.length * 0.7 ? "খুব ভালো হয়েছে! আপনার প্রস্তুতি বেশ ভালো।" : 
                 "আরও অনুশীলনের প্রয়োজন। আবার চেষ্টা করুন!"}
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={restartQuiz} 
                  className="w-full h-12 text-lg font-semibold bg-emerald-600 hover:bg-emerald-500 transition-all"
                >
                  <RotateCcw className="mr-2 w-5 h-5" /> আবার পরীক্ষা দিন
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentIdx];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 font-sans">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header Info */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Brain className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-white leading-tight">QuizMaster Pro</h1>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Science Hub Edition</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold transition-colors",
            timeLeft < 60 ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-slate-900 text-slate-300 border border-slate-800"
          )}>
            <Timer className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Quiz Card */}
        <Card className="border-slate-800 bg-slate-900 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <CardHeader className="pt-8">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className={cn("px-3 py-1 text-white border-none flex items-center gap-2", currentQuestion.class)}>
                {currentQuestion.icon}
                {currentQuestion.cat}
              </Badge>
              <span className="text-sm font-mono text-slate-500">
                প্রশ্ন {currentIdx + 1} / {QUESTIONS.length}
              </span>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-medium text-slate-100 leading-relaxed">
              {currentQuestion.q}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={cn(
                      "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 group relative overflow-hidden",
                      selected === i 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                        : "bg-slate-800/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                    )}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-lg">{option}</span>
                      {selected === i && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </motion.div>
                      )}
                    </div>
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </CardContent>

          <CardFooter className="pt-4 pb-8">
            <Button 
              disabled={selected === null}
              onClick={handleNext}
              className={cn(
                "w-full h-14 text-lg font-bold transition-all group",
                selected !== null ? "bg-emerald-600 hover:bg-emerald-500" : "bg-slate-800 text-slate-500"
              )}
            >
              {currentIdx === QUESTIONS.length - 1 ? "সাবমিট করুন" : "পরবর্তী প্রশ্ন"}
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>

        {/* Footer Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-center">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">সঠিক উত্তর</p>
            <p className="text-xl font-display font-bold text-emerald-500">{score}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-center">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">বাকি আছে</p>
            <p className="text-xl font-display font-bold text-blue-500">{QUESTIONS.length - currentIdx - 1}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-center">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">অগ্রগতি</p>
            <p className="text-xl font-display font-bold text-amber-500">{Math.round(progress)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
