import React, { useState } from 'react';
import { Question } from '../types';
import { Button } from './common/Button';

interface LiveTestViewProps {
    questions: Question[];
    onSubmit: (answers: Record<number, number>) => void;
}

const LiveTestView: React.FC<LiveTestViewProps> = ({ questions, onSubmit }) => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };
    
    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        if (window.confirm('Are you sure you want to submit your test?')) {
            onSubmit(answers);
        }
    };
    
    const answeredCount = Object.keys(answers).length;
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
            <div className="w-full max-w-3xl bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6 bg-slate-800/50 border-b border-slate-700">
                    <h1 className="text-2xl font-bold text-indigo-300">Live Test</h1>
                    <p className="text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                    </div>
                </div>

                <div className="p-8">
                    {currentQuestion && (
                        <div>
                            <p className="text-xl font-semibold text-slate-100 mb-6">{currentQuestion.question}</p>
                            <div className="space-y-4">
                                {currentQuestion.options.map((option, optionIndex) => (
                                    <label
                                        key={optionIndex}
                                        className={`block p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                                            answers[currentQuestionIndex] === optionIndex
                                                ? 'bg-indigo-600/50 border-indigo-500'
                                                : 'bg-slate-700 border-transparent hover:bg-slate-600'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestionIndex}`}
                                            value={optionIndex}
                                            checked={answers[currentQuestionIndex] === optionIndex}
                                            onChange={() => handleAnswerSelect(currentQuestionIndex, optionIndex)}
                                            className="sr-only"
                                        />
                                        <span className="text-lg text-slate-200">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-800/50 border-t border-slate-700 flex justify-between items-center">
                    <div>
                         <Button onClick={handlePrev} disabled={currentQuestionIndex === 0} variant="secondary">Previous</Button>
                         <Button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1} variant="secondary" className="ml-2">Next</Button>
                    </div>
                    <Button onClick={handleSubmit} disabled={answeredCount !== questions.length}>
                        Submit Test ({answeredCount}/{questions.length} Answered)
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LiveTestView;