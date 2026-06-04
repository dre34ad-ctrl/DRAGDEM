'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface QuizProps {
  moduleId: string;
  questions: Question[];
  onComplete: (passed: boolean, score: number, total: number) => void;
}

export default function QuizComponent({ moduleId, questions, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ id: string; value: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOption(optionId);
  };

  const handleNext = async () => {
    if (!selectedOption) return;

    const newAnswers = [...answers, { id: currentQuestion.id, value: selectedOption }];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Submit Quiz
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/academy/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleId, answers: newAnswers })
        });
        const data = await res.json();
        if (data.success) {
          onComplete(data.passed, data.score, data.total);
        }
      } catch (err) {
        console.error('Failed to submit quiz:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="glass-panel border-secondary/30 rounded-[2.5rem] p-10 md:p-16 shadow-3xl max-w-3xl mx-auto relative overflow-hidden">
       {/* Background Glow */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[100px] -mr-32 -mt-32" />
       
       <div className="relative z-10">
          <div className="flex items-center justify-between mb-12">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary shadow-glow-cyan/20">
                   <Sparkles size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Knowledge Check</p>
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Module {moduleId}</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Progress</p>
                <div className="flex items-center gap-3">
                   <div className="w-32 h-1.5 bg-deep-charcoal rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-secondary shadow-glow-cyan transition-all duration-500"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                      />
                   </div>
                   <span className="text-xs font-black text-white">{currentQuestionIndex + 1}/{questions.length}</span>
                </div>
             </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-playfair font-black text-white mb-10 leading-tight italic">
            {currentQuestion.text}
          </h3>

          <div className="space-y-4 mb-12">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`w-full p-6 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group ${
                  selectedOption === option.id 
                    ? "bg-secondary/10 border-secondary text-white shadow-glow-cyan/20" 
                    : "bg-black/40 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border transition-colors ${
                      selectedOption === option.id ? "bg-secondary border-secondary text-black" : "bg-deep-charcoal border-white/10 text-gray-500 group-hover:border-white/30"
                   }`}>
                      {option.id.toUpperCase()}
                   </div>
                   <span className="font-medium">{option.text}</span>
                </div>
                {selectedOption === option.id && <CheckCircle2 size={20} className="text-secondary" />}
              </button>
            ))}
          </div>

          <button
            disabled={!selectedOption || isSubmitting}
            onClick={handleNext}
            className="w-full py-5 bg-secondary text-black font-black rounded-2xl text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] hover:shadow-glow-cyan transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Final Answers'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
       </div>
    </div>
  );
}
