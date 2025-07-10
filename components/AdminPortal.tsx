
import React, { useState, useCallback, ChangeEvent } from 'react';
import { Question, StudentSubmission, TestStatus } from '../types';
import { parseQuestionsFromImage } from '../geminiService';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';
import { UploadIcon, CheckCircleIcon, ArrowPathIcon, LogoIcon } from './common/Icon';

interface AdminPortalProps {
    testStatus: TestStatus;
    questions: Question[];
    setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
    correctAnswers: Record<number, number>;
    setCorrectAnswers: React.Dispatch<React.SetStateAction<Record<number, number>>>;
    studentSubmissions: StudentSubmission[];
    startTest: () => void;
    endTest: () => void;
    resetTest: () => void;
    testCode: string | null;
    setTestCode: React.Dispatch<React.SetStateAction<string | null>>;
}

const AdminPortal: React.FC<AdminPortalProps> = ({
    testStatus,
    questions,
    setQuestions,
    correctAnswers,
    setCorrectAnswers,
    studentSubmissions,
    startTest,
    endTest,
    resetTest,
    testCode,
    setTestCode,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setQuestions([]);
        setCorrectAnswers({});
        setTestCode(null);
        setImagePreview(URL.createObjectURL(file));

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            try {
                const base64String = (reader.result as string).split(',')[1];
                const parsedQuestions = await parseQuestionsFromImage(base64String);
                setQuestions(parsedQuestions);
                // Generate a unique test code
                const newTestCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                setTestCode(newTestCode);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
                setImagePreview(null);
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
            setError('Failed to read the file.');
            setIsLoading(false);
            setImagePreview(null);
        };
    }, [setQuestions, setCorrectAnswers, setTestCode]);

    const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
        setCorrectAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    };

    const isSetupComplete = questions.length > 0 && Object.keys(correctAnswers).length === questions.length;
    
    if (testStatus === 'live' || testStatus === 'finished') {
        return (
            <div className="container mx-auto p-4 sm:p-8">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                     <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-white">
                            Test Dashboard ({testStatus === 'live' ? 'Live' : 'Finished'})
                        </h1>
                        {testCode && <span className="text-lg font-mono bg-slate-700 px-3 py-1 rounded-md text-indigo-300 select-all">Code: {testCode}</span>}
                    </div>
                    <div>
                        {testStatus === 'live' && <Button onClick={endTest} variant="danger">End Test</Button>}
                        {testStatus === 'finished' && <Button onClick={resetTest} variant="secondary">Create New Test</Button>}
                    </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-300">Student Submissions</h2>
                    {studentSubmissions.length > 0 ? (
                        <ul className="space-y-4">
                            {studentSubmissions.map((sub, index) => (
                                <li key={index} className="bg-slate-700 p-4 rounded-lg flex justify-between items-center">
                                    <span className="font-medium text-slate-200">{sub.studentName}</span>
                                    <span className={`font-bold text-lg ${sub.score > questions.length / 2 ? 'text-green-400' : 'text-yellow-400'}`}>
                                        Score: {sub.score} / {questions.length}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-400">No students have submitted the test yet.</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <LogoIcon className="w-8 h-8 text-indigo-400"/>
                    <h1 className="text-3xl font-bold text-white">Teacher Portal</h1>
                </div>
                <Button onClick={resetTest} variant="secondary"><ArrowPathIcon className="w-5 h-5"/> Back to Home</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Panel: Upload and Preview */}
                <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-300 border-b border-slate-700 pb-3">1. Upload Question Paper</h2>
                    <div className="mt-4">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-lg p-4 flex flex-col items-center justify-center border-2 border-dashed border-slate-600 transition-all">
                            <UploadIcon className="w-12 h-12 mb-2" />
                            <span>{imagePreview ? 'Change Image' : 'Click to Upload Image'}</span>
                            <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG</p>
                        </label>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg" />
                    </div>

                    {isLoading && <Spinner text="AI is parsing questions..." />}
                    {error && <p className="text-red-400 mt-4 bg-red-900/50 p-3 rounded-md">{error}</p>}
                    
                    {imagePreview && !isLoading && !error && (
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg text-slate-300">Image Preview:</h3>
                            <img src={imagePreview} alt="Question paper preview" className="mt-2 rounded-lg max-h-96 w-full object-contain" />
                        </div>
                    )}
                </div>

                {/* Right Panel: Configure and Start */}
                <div className={`bg-slate-800 p-6 rounded-lg shadow-xl transition-opacity duration-500 ${questions.length > 0 ? 'opacity-100' : 'opacity-50'}`}>
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-300 border-b border-slate-700 pb-3">2. Set Answer Key</h2>
                    
                    <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 mt-4">
                        {questions.length > 0 ? (
                            questions.map((q, qIndex) => (
                                <div key={qIndex} className="bg-slate-900/50 p-4 rounded-lg">
                                    <p className="font-semibold text-slate-200 mb-3">{qIndex + 1}. {q.question}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {q.options.map((opt, oIndex) => (
                                            <label key={oIndex} className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${correctAnswers[qIndex] === oIndex ? 'bg-indigo-600' : 'bg-slate-700 hover:bg-slate-600'}`}>
                                                <input type="radio" name={`q_${qIndex}`} value={oIndex} checked={correctAnswers[qIndex] === oIndex} onChange={() => handleAnswerChange(qIndex, oIndex)} className="form-radio h-4 w-4 text-indigo-500 bg-slate-800 border-slate-600 focus:ring-indigo-500"/>
                                                <span className="text-slate-300">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-center py-10">Questions will appear here after uploading an image.</p>
                        )}
                    </div>

                    {questions.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-700">
                             {testCode && (
                                <div className="mb-6 bg-slate-900 p-4 rounded-lg text-center">
                                    <p className="text-slate-300 font-medium">Share this Test Code with your students:</p>
                                    <p className="text-4xl font-bold text-indigo-400 tracking-widest my-2 select-all" title="Test Code">{testCode}</p>
                                </div>
                             )}
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    {isSetupComplete ? <CheckCircleIcon className="w-6 h-6 text-green-400" /> : <div className="w-6 h-6 rounded-full border-2 border-dashed border-yellow-400 animate-pulse"></div>}
                                    <span className={isSetupComplete ? "text-green-400" : "text-yellow-400"}>
                                        {Object.keys(correctAnswers).length} / {questions.length} answers set
                                    </span>
                                </div>
                                <Button onClick={startTest} disabled={!isSetupComplete || isLoading}>Start Live Test</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPortal;
