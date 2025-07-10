
export type AppMode = 'landing' | 'admin' | 'student';
export type TestStatus = 'setup' | 'live' | 'finished';

export interface Question {
    question: string;
    options: string[];
}

export interface StudentSubmission {
    studentName: string;
    answers: Record<number, number>;
    score: number;
}
