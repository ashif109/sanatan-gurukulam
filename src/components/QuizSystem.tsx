import React, { useState, useEffect } from 'react';
import { Quiz, QuizAttempt, UserProfile } from '../types';
import { HelpCircle, Clock, CheckCircle, AlertTriangle, ArrowRight, RotateCcw, Award, Check } from 'lucide-react';

interface QuizSystemProps {
  quiz: Quiz;
  currentUser: UserProfile;
  onQuizSubmit: (answers: { [key: string]: number }) => Promise<void>;
  onSubmitCompleted: (attempt: QuizAttempt) => void;
  isLoading: boolean;
}

export default function QuizSystem({
  quiz,
  currentUser,
  onQuizSubmit,
  onSubmitCompleted,
  isLoading
}: QuizSystemProps) {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(quiz.durationMinutes * 60);
  const [quizStarted, setQuizStarted] = useState(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (!quizStarted || quizFinished) return;
    if (secondsRemaining <= 0) {
      handleForceSubmit();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [quizStarted, quizFinished, secondsRemaining]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setSecondsRemaining(quiz.durationMinutes * 60);
    setSelectedAnswers({});
    setQuizFinished(false);
    setActiveQuestion(0);
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleForceSubmit = () => {
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    setQuizFinished(true);
    
    // Evaluate mock result locally to guarantee immediate feedback
    let correct = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correct++;
      }
    });

    const scorePct = Math.round((correct / quiz.questions.length) * 100);
    const mockAttempt: QuizAttempt = {
      id: `attempt-local-${Date.now()}`,
      quizId: quiz.id,
      userId: currentUser.id,
      scorePercentage: scorePct,
      correctCount: correct,
      totalQuestions: quiz.questions.length,
      completedAt: new Date().toISOString(),
      answers: selectedAnswers
    };

    setAttemptResult(mockAttempt);
    onSubmitCompleted(mockAttempt);

    // Call server to persist and broadcast notifications
    await onQuizSubmit(selectedAnswers);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Static mock leaderboard participants to mimic unacademy or coursera metrics
  const LEADERBOARD = [
    { name: "Acharya Krishna Dev Prasanna", score: 100, time: "1:45" },
    { name: "Pandit Ramachandra Shastri", score: 100, time: "2:05" },
    { name: `${currentUser.name} (You)`, score: attemptResult?.scorePercentage ?? null, time: "3:40" },
    { name: "Advait K. Rao (Shastri Scholar)", score: 100, time: "2:15" },
    { name: "Devendra Swamy", score: 80, time: "4:00" }
  ];

  if (!quizStarted) {
    return (
      <div className="bg-[#0c0604] border border-orange-500/20 rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto sacred-glow" id="quiz-preflight">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-orange-600 to-amber-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/10">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold font-serif text-orange-400 mb-2">{quiz.title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed font-sans mb-6">{quiz.description}</p>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8 font-serif">
          <div className="bg-[#0f0805] border border-orange-500/10 rounded-xl p-3">
            <span className="text-[10px] text-[#f97316]/60 uppercase font-bold tracking-widest block">Scripture Questions</span>
            <p className="text-lg font-mono font-bold text-gray-200 mt-1">{quiz.questions.length} MCQs</p>
          </div>
          <div className="bg-[#0f0805] border border-orange-500/10 rounded-xl p-3">
            <span className="text-[10px] text-[#f97316]/60 uppercase font-bold tracking-widest block">Shastra Timing</span>
            <p className="text-lg font-mono font-bold text-gray-200 mt-1">{quiz.durationMinutes} Mins</p>
          </div>
        </div>

        <button
          onClick={handleStartQuiz}
          id="quiz-start-btn"
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-xl shadow-lg shadow-orange-600/25 text-xs tracking-widest font-serif font-bold uppercase transition-all cursor-pointer"
        >
          Begin Sacred Examination
        </button>
      </div>
    );
  }

  const currentQ = quiz.questions[activeQuestion];
  const hasSelected = selectedAnswers[currentQ.id] !== undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto font-sans" id="active-quiz-terminal">
      
      {/* Quiz Question Box */}
      <div className="lg:col-span-2 bg-[#0c0604] border border-orange-500/20 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl">
        
        {/* Progress header */}
        <div className="bg-[#120703]/80 px-5 py-4 border-b border-orange-500/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-orange-400 font-serif font-bold uppercase tracking-widest">Shastra Assessment Matrix</span>
            <h4 className="text-sm font-semibold font-serif text-gray-200 mt-0.5">
              Prashna {activeQuestion + 1} of {quiz.questions.length}
            </h4>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#0f0805] border border-orange-500/10 rounded-xl text-amber-500 font-mono text-xs shadow-md">
            <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>Time remaining: {formatTime(secondsRemaining)}</span>
          </div>
        </div>

        {/* Evaluation finished screen */}
        {quizFinished && attemptResult ? (
          <div className="p-6 sm:p-10 text-center font-sans">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md ${attemptResult.scorePercentage >= 60 ? 'bg-orange-950/20 text-orange-400 border border-orange-500/30' : 'bg-red-950/20 text-red-500 border border-red-500/30'}`}>
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <span className="text-[10px] text-orange-400 uppercase tracking-widest font-serif font-bold">Assessment Completed</span>
            <h3 className="text-2xl font-bold text-gray-100 font-serif mt-1">
              Your Proficiency Score: {attemptResult.scorePercentage}%
            </h3>
            
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
              Answers evaluated. Out of {attemptResult.totalQuestions} questions, you identified {attemptResult.correctCount} parameters correctly.
            </p>

            <div className="mt-8 border-t border-orange-500/10 pt-6 max-w-md mx-auto">
              <h4 className="text-xs font-bold text-orange-400 font-serif tracking-widest uppercase mb-4 text-left">Detailed Review:</h4>
              <div className="space-y-4">
                {quiz.questions.map((q, idx) => {
                  const correct = selectedAnswers[q.id] === q.correctAnswerIndex;
                  return (
                    <div key={q.id} className="text-left p-3.5 bg-orange-950/5 border border-orange-500/5 rounded-xl">
                      <p className="text-xs font-bold text-gray-200">Prashna {idx + 1}: {q.question}</p>
                      <p className="text-[11px] text-gray-400 mt-1 flex items-center space-x-1.5 font-mono">
                        <span className="font-semibold text-gray-500">Your Answer:</span>
                        <span className={correct ? 'text-green-400' : 'text-red-400'}>
                          {q.options[selectedAnswers[q.id]] || "Not Attempted"}
                        </span>
                      </p>
                      {!correct && (
                        <p className="text-[11px] text-green-400 font-mono mt-0.5">
                          <span className="font-semibold text-gray-500">Correct Answer:</span> {q.options[q.correctAnswerIndex]}
                        </p>
                      )}
                      <p className="text-[10px] text-[#f97316]/70 leading-relaxed font-sans mt-2 italic border-l border-orange-500/20 pl-2.5">
                        <span className="font-serif not-italic font-bold text-[9px] uppercase tracking-wider text-orange-400 block mb-0.5">Guru Upadesha:</span>
                        {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              className="mt-8 px-6 py-2.5 rounded-xl border border-orange-500/30 text-xs tracking-widest hover:bg-orange-500/[0.05] text-orange-400 font-serif font-bold uppercase transition-all flex items-center space-x-2 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chant & Re-examine</span>
            </button>
          </div>
        ) : (
          /* Main active question rendering */
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-100 flex items-start space-x-2.5 leading-relaxed">
                  <HelpCircle className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                  <span>{currentQ.question}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 font-sans">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, idx)}
                      className={`p-4 rounded-xl text-left text-xs transition-all flex items-center justify-between border cursor-pointer ${
                        isSelected 
                          ? 'bg-orange-950/20 border-orange-500/60 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                          : 'bg-[#0f0805] hover:bg-orange-950/5 border-orange-500/5 hover:border-orange-500/20 text-gray-300'
                      }`}
                    >
                      <span>{option}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3.5 ${isSelected ? 'border-orange-500 bg-orange-600 text-white' : 'border-gray-700'}`}>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-orange-500/10 mt-8">
              <button
                disabled={activeQuestion === 0}
                onClick={() => setActiveQuestion(prev => prev - 1)}
                className="px-4 py-2 border border-orange-500/10 text-gray-400 hover:text-white rounded-lg hover:bg-orange-950/15 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer text-xs uppercase tracking-wide font-serif"
              >
                Prev
              </button>

              {activeQuestion < quiz.questions.length - 1 ? (
                <button
                  disabled={!hasSelected}
                  onClick={() => setActiveQuestion(prev => prev + 1)}
                  className="px-5 py-2 rounded-lg bg-orange-600 text-white disabled:opacity-45 hover:bg-orange-500 transition-all flex items-center space-x-2 cursor-pointer text-xs uppercase tracking-wide font-serif"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  disabled={!hasSelected || isLoading}
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-lg shadow-lg shadow-orange-600/25 transition-all text-xs uppercase tracking-widest font-serif cursor-pointer"
                >
                  {isLoading ? "Submitting..." : "Submit Answers"}
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Leaderboard panel on side */}
      <div className="bg-[#0c0604] border border-orange-500/20 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-serif font-bold text-orange-400 uppercase tracking-widest border-b border-orange-500/10 pb-2 mb-4">Lineage Rankings</h4>
          <div className="space-y-3">
            {LEADERBOARD.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border flex items-center justify-between ${item.score === 100 ? 'bg-orange-950/5 border-orange-500/10' : 'bg-[#0f0805] border-orange-500/5'}`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <span className="text-xs font-mono font-bold text-[#f97316]/55">#{idx + 1}</span>
                  <div className="truncate">
                    <p className="text-xs font-serif font-bold text-gray-200 truncate">{item.name}</p>
                    <p className="text-[9px] text-[#f97316]/50 font-mono">Time: {item.time}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold font-mono text-orange-400">{item.score !== null ? `${item.score}%` : 'Pending'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-orange-950/5 border border-orange-500/5 rounded-xl">
          <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
            🔥 Completing sacred tests awards you **XP points** and unlocks specialized **Acharya Certificate credentials**. Ensure absolute academic discipline!
          </p>
        </div>
      </div>

    </div>
  );
}
