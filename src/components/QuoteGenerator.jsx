import { useState } from 'react';
import { quotes } from '../data/quotes';
import { MessageSquareQuote } from 'lucide-react';

export default function QuoteGenerator() {
    const [currentQuote, setCurrentQuote] = useState(() => quotes[0]);
    const [isAnimating, setIsAnimating] = useState(false);

    const generateQuote = () => {
        setIsAnimating(true);
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            setCurrentQuote(quotes[randomIndex]);
            setIsAnimating(false);
        }, 400); // Wait for fade out
    };

    return (
        <div className="glass p-6 rounded-2xl border-white-10 relative overflow-hidden shadow-lg transition-transform duration-500 hover:scale-105 group">
            <div className="absolute -right-4 -top-4 opacity-5 text-bb-green transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                <MessageSquareQuote size={120} />
            </div>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white drop-shadow-md">
                <MessageSquareQuote className="text-bb-yellow w-6 h-6 animate-pulse" />
                Walter's Wisdom
            </h2>

            <div className={`flex items-center transition-all duration-500 min-h-64 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <blockquote className="text-lg italic text-white-high border-l-4 border-bb-green pl-4 py-2 drop-shadow-sm font-medium">
                    "{currentQuote}"
                </blockquote>
            </div>

            <button
                onClick={generateQuote}
                className="mt-6 px-6 py-3 bg-bb-green hover:bg-bb-light-green text-white rounded-lg font-bold transition-all border-green-700 flex items-center gap-2 shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[1px]"
            >
                Cook Another Quote
            </button>
        </div >
    );
}
