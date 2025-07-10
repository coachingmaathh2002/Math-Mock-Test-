
import React, { useState } from 'react';
import { Question, TestStatus, StudentSubmission } from '../types';
import { Button } from './common/Button';
import LiveTestView from './LiveTestView';
import ResultsView from './ResultsView';
import { ArrowPathIcon, LogoIcon } from './common/Icon';

interface StudentPortalProps {
    testStatus: TestStatus;
    questions: Question[];
    correctAnswers: Record<number, number>;
    addStudentSubmission: (submission: StudentSubmission) => void;
    resetTest: () => void;
    testCode: string | null;
}

const StudentPortal: React.FC<StudentPortalProps> = ({
    testStatus,
    questions,
    correctAnswers,
    addStudentSubmission,
    resetTest,
    testCode,
}) => {
    const [name, setName] = useState('');
    const [enteredCode, setEnteredCode] = useState('');
    const [error, setError] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [finalSubmission, setFinalSubmission] = useState<StudentSubmission | null>(null);

    const handleJoin = () => {
        if (!name.trim()) {
            setError('Please enter your name.');
            return;
        }
        if (!enteredCode.trim()) {
            setError('Please enter the test code.');
            return;
        }
        if (!testCode || enteredCode.toUpperCase() !== testCode) {
            setError('Invalid test code.');
            return;
        }
        if (testStatus !== 'live') {
            setError('The test is not currently live. Please wait for the teacher to start it.');
            return;
        }
        setError('');
        setIsJoined(true);
    };

    const handleTestSubmit = (answers: Record<number, number>) => {
        let score = 0;
        for (const qIndex in answers) {
            if (answers[qIndex] === correctAnswers[qIndex]) {
                score++;
            }
        }
        const submission: StudentSubmission = {
            studentName: name,
            answers,
            score,
        };
        setFinalSubmission(submission);
        addStudentSubmission(submission);
    };

    if (finalSubmission) {
        return <ResultsView submission={finalSubmission} questions={questions} correctAnswers={correctAnswers} resetTest={resetTest} />;
    }
    
    if (isJoined) {
        return <LiveTestView questions={questions} onSubmit={handleTestSubmit} />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <div className="flex justify-center items-center gap-3 mb-2">
                        <LogoIcon className="w-8 h-8 text-indigo-400"/>
                        <h1 className="text-3xl font-bold text-white">Join Live Test</h1>
                    </div>
                     <p className="text-slate-400">Enter your name and the test code provided by your teacher.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-slate-300">Your Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., Jane Doe"
                        />
                    </div>
                    <div>
                        <label htmlFor="test-code" className="text-sm font-medium text-slate-300">Test Code</label>
                        <input
                            id="test-code"
                            type="text"
                            value={enteredCode}
                            onChange={(e) => setEnteredCode(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                            placeholder="ENTER CODE"
                        />
                    </div>
                     {error && <p className="text-sm text-red-400 bg-red-900/50 p-2 rounded-md">{error}</p>}
                    
                    <div className="flex flex-col gap-4">
                        <Button onClick={handleJoin} disabled={!name || !enteredCode}>
                            Join Test
                        </Button>
                         <Button onClick={resetTest} variant="secondary">
                            <ArrowPathIcon className="w-5 h-5"/> Back to Home
                        </Button>
                    </div>

                    <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-700">
                        {testStatus === 'setup' && <p>Test Status: <span className="font-semibold text-yellow-400">Waiting for teacher</span></p>}
                        {testStatus === 'live' && <p>Test Status: <span className="font-semibold text-green-400">Live</span></p>}
                        {testStatus === 'finished' && <p>Test Status: <span className="font-semibold text-red-400">Finished</span></p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentPortal;
