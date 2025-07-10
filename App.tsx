
import React, { useState, useCallback } from 'react';
import { AppMode, TestStatus, Question, StudentSubmission } from './types';
import AdminPortal from './components/AdminPortal';
import StudentPortal from './components/StudentPortal';
import { LogoIcon } from './components/common/Icon';

const App: React.FC = () => {
    const [appMode, setAppMode] = useState<AppMode>('landing');
    const [testStatus, setTestStatus] = useState<TestStatus>('setup');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<Record<number, number>>({});
    const [studentSubmissions, setStudentSubmissions] = useState<StudentSubmission[]>([]);
    const [testCode, setTestCode] = useState<string | null>(null);

    const startTest = useCallback(() => {
        if (questions.length > 0 && Object.keys(correctAnswers).length === questions.length) {
            setTestStatus('live');
        } else {
            alert('Please ensure all questions have a correct answer marked before starting the test.');
        }
    }, [questions, correctAnswers]);

    const endTest = useCallback(() => {
        setTestStatus('finished');
    }, []);

    const resetTest = useCallback(() => {
        setAppMode('landing');
        setTestStatus('setup');
        setQuestions([]);
        setCorrectAnswers({});
        setStudentSubmissions([]);
        setTestCode(null);
    }, []);

    const addStudentSubmission = (submission: StudentSubmission) => {
        setStudentSubmissions(prev => [...prev, submission]);
    };

    const LandingPage = () => (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
            <div className="text-center mb-12">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <LogoIcon className="w-16 h-16 text-indigo-400" />
                    <h1 className="text-5xl font-extrabold text-white tracking-tight">Math Live Mock Test</h1>
                </div>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Transform math question papers into interactive mock tests instantly. Upload an image of your questions, and let AI do the rest.
                </p>
            </div>
            <div className="flex gap-6">
                <button
                    onClick={() => setAppMode('admin')}
                    className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105"
                >
                    I'm a Teacher
                </button>
                <button
                    onClick={() => setAppMode('student')}
                    className="px-8 py-4 bg-slate-700 text-white font-bold rounded-lg shadow-lg hover:bg-slate-600 transition-all duration-300 transform hover:scale-105"
                >
                    I'm a Student
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            {appMode === 'landing' && <LandingPage />}
            {appMode === 'admin' && (
                <AdminPortal
                    testStatus={testStatus}
                    questions={questions}
                    setQuestions={setQuestions}
                    correctAnswers={correctAnswers}
                    setCorrectAnswers={setCorrectAnswers}
                    studentSubmissions={studentSubmissions}
                    startTest={startTest}
                    endTest={endTest}
                    resetTest={resetTest}
                    testCode={testCode}
                    setTestCode={setTestCode}
                />
            )}
            {appMode === 'student' && (
                <StudentPortal
                    testStatus={testStatus}
                    questions={questions}
                    correctAnswers={correctAnswers}
                    addStudentSubmission={addStudentSubmission}
                    resetTest={resetTest}
                    testCode={testCode}
                />
            )}
        </div>
    );
};

export default App;