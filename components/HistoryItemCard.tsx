
import React from 'react';
import type { HistoryItem } from '../types';

const timeAgo = (timestamp: number): string => {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)}y ago`;
  
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)}mo ago`;
  
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}d ago`;
  
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}h ago`;
  
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}m ago`;
  
  return `${Math.max(0, Math.floor(seconds))}s ago`;
};

const typeColors: Record<HistoryItem['type'], string> = {
    base: 'bg-blue-500/20 text-blue-300',
    variation: 'bg-green-500/20 text-green-300',
    edit: 'bg-yellow-500/20 text-yellow-300',
};

const HistoryItemCard: React.FC<{
    item: HistoryItem;
    onSelect: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
}> = ({ item, onSelect, onDelete }) => {
    
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(item.id);
    }
    
    const prompt = item.type === 'edit' ? item.editPrompt : item.resultImage.prompt;
    const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);

    return (
        <div 
            onClick={() => onSelect(item)} 
            className="group flex items-center p-2 space-x-3 rounded-md bg-gray-700/50 hover:bg-gray-700/80 cursor-pointer transition-all duration-200"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(item)}
            aria-label={`Select history item: ${typeLabel} from ${timeAgo(item.timestamp)}`}
        >
            <img src={item.resultImage.url} alt="History thumbnail" className="w-14 h-14 rounded-md object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${typeColors[item.type]}`}>{typeLabel}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{timeAgo(item.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-300 truncate mt-1" title={prompt}>{prompt}</p>
            </div>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-full text-gray-500 hover:bg-gray-600 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Delete history item"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default HistoryItemCard;
