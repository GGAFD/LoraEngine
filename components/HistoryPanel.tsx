
import React from 'react';
import type { HistoryItem } from '../types';
import HistoryItemCard from './HistoryItemCard';

interface HistoryPanelProps {
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
    onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onDelete, onClear }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-200">History</h2>
                {history.length > 0 && (
                    <button 
                        onClick={onClear} 
                        className="text-sm text-gray-500 hover:text-red-400 transition-colors"
                        aria-label="Clear all history"
                    >
                        Clear All
                    </button>
                )}
            </div>
            <div className="bg-gray-800 p-2 rounded-lg max-h-96 overflow-y-auto">
                {history.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Your generated images will appear here.</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {history.map(item => (
                            <li key={item.id}>
                                <HistoryItemCard 
                                    item={item} 
                                    onSelect={onSelect}
                                    onDelete={onDelete}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HistoryPanel;
