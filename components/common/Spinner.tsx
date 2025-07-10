
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', text }) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-24 w-24',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 my-8">
            <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-4 border-t-4 border-indigo-500`}></div>
            {text && <p className="text-lg text-slate-400 font-medium">{text}</p>}
        </div>
    );
};
