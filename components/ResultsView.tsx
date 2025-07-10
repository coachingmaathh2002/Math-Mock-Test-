
import React from 'react';
import { Question, StudentSubmission } from '../types';
import { Button } from './common/Button';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from './common/Icon';

interface ResultsViewProps {
    submission: StudentSubmission;
    questions: Question[];
    correctAnswers: Record<number, number>;
    resetTest: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ submission, questions, correctAnswers, resetTest }) => {
    const percentage = Math.round((submission.score / questions.length) * 100);
    
    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center bg-slate-800 p-8 rounded-xl shadow-2xl mb-8">
                    <h1 className="text-4xl font-extrabold text-indigo-300">Test Complete!</h1>
                    <p className="text-slate-400 mt-2">Well done, {submission.studentName}. Here are your results.</p>
                    <div className="mt-6">
                        <p className="text-lg text-slate-300">Your Score</p>
                        <p className="text-6xl font-bold my-2 text-white">{submission.score} <span className="text-4xl font-medium text-slate-400">/ {questions.length}</span></p>
                        <p className="text-2xl font-semibold text-indigo-400">{percentage}%</p>
                    </div>
                    <Button onClick={resetTest} variant="secondary" className="mt-8">
                        <ArrowPathIcon className="w-5 h-5"/> Go to Home
                    </Button>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl shadow-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-white border-b border-slate-700 pb-4">Answer Review</h2>
                    <ul className="space-y-6">
                        {questions.map((q, qIndex) => {
                            const studentAnswerIndex = submission.answers[qIndex];
                            const correctAnswerIndex = correctAnswers[qIndex];
                            const isCorrect = studentAnswerIndex === correctAnswerIndex;

                            return (
                                <li key={qIndex} className="bg-slate-900/70 p-5 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-lg text-slate-200 mb-4">{qIndex + 1}. {q.question}</p>
                                        {isCorrect ? <CheckCircleIcon className="w-8 h-8 text-green-500 flex-shrink-0 ml-4"/> : <XCircleIcon className="w-8 h-8 text-red-500 flex-shrink-0 ml-4"/>}
                                    </div>
                                    <div className="space-y-2">
                                        {q.options.map((option, oIndex) => {
                                            const isStudentAnswer = studentAnswerIndex === oIndex;
                                            const isCorrectAnswer = correctAnswerIndex === oIndex;
                                            let styles = "border-slate-700 text-slate-300";
                                            if (isCorrectAnswer) {
                                                styles = "bg-green-500/20 border-green-500 text-white";
                                            }
                                            if (isStudentAnswer && !isCorrectAnswer) {
                                                styles = "bg-red-500/20 border-red-500 text-white";
                                            }
                                            return (
                                                <div key={oIndex} className={`flex items-center gap-3 p-3 border-2 rounded-md ${styles}`}>
                                                    {isStudentAnswer && ( <span className="text-xs font-bold bg-slate-600 px-2 py-1 rounded-full">Your Answer</span> )}
                                                    <span>{option}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ResultsView;
