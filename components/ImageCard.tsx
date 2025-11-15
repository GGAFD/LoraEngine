
import React from 'react';

interface ImageCardProps {
  src?: string;
  prompt?: string;
  isLoading: boolean;
  onRegenerate?: () => void;
  onDownload?: () => void;
  onRemove?: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, prompt, isLoading, onRegenerate, onDownload, onRemove }) => {
  if (isLoading) {
    return (
      <div className="aspect-square w-full bg-gray-800 rounded-xl shadow-lg animate-pulse"></div>
    );
  }

  return (
    <div className="group relative aspect-square w-full overflow-hidden rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20">
      <img src={src} alt={prompt} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/70 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between">
        <div className="flex justify-end space-x-2">
          {onDownload && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDownload(); }}
              className="text-white rounded-full p-2 hover:bg-white/20 transition-colors"
              aria-label="Download image"
              title="Download"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          )}
          {onRegenerate && (
            <button 
              onClick={(e) => { e.stopPropagation(); onRegenerate(); }}
              className="text-white rounded-full p-2 hover:bg-white/20 transition-colors"
              aria-label="Regenerate image"
              title="Regenerate"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001a.75.75 0 01.75.75v3.182a.75.75 0 01-.75.75H16.023m-1.885-4.817A7.5 7.5 0 009.75 21L9 21a7.5 7.5 0 00-6.834-4.318m11.99-5.464A7.5 7.5 0 009.75 2.25L9 2.25a7.5 7.5 0 00-6.834 4.318m11.99 5.464l-3.334-3.334" />
              </svg>
            </button>
          )}
          {onRemove && (
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="text-white rounded-full p-2 hover:bg-white/20 transition-colors"
              aria-label="Remove image"
              title="Remove"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-gray-200 text-sm leading-relaxed line-clamp-4">
          {prompt}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
