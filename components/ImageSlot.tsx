
import React from 'react';
import ImageCard from './ImageCard';
import type { GenerationSlot } from '../types';

interface ImageSlotProps {
  slot: GenerationSlot;
  onRegenerate: () => void;
  onRemove: () => void;
  isBaseImage?: boolean;
}

const ImageSlot: React.FC<ImageSlotProps> = ({ slot, onRegenerate, onRemove, isBaseImage = false }) => {
  const handleDownload = () => {
    if (slot.status !== 'success' || !slot.image) return;
    const link = document.createElement('a');
    link.href = slot.image.url;
    link.download = `${isBaseImage ? 'base_image' : 'generated_image'}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  switch (slot.status) {
    case 'success':
      return <ImageCard src={slot.image!.url} prompt={slot.image!.prompt} isLoading={false} onRegenerate={onRegenerate} onDownload={handleDownload} onRemove={!isBaseImage ? onRemove : undefined} />;
    
    case 'generating':
      return <ImageCard isLoading={true} />;

    case 'error':
      return (
        <div className="aspect-square w-full bg-red-900/20 border-2 border-dashed border-red-700 rounded-xl shadow-lg flex flex-col items-center justify-center text-center p-4 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-300 font-semibold text-sm mb-2">Generation Failed</p>
          <p className="text-red-400 text-xs mb-4 line-clamp-3" title={slot.error}>{slot.error}</p>
          <button
            onClick={onRegenerate}
            className="px-4 py-2 text-sm font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors"
          >
            Regenerate
          </button>
        </div>
      );

    case 'pending':
    default:
      return (
        <div className="aspect-square w-full bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl shadow-inner"></div>
      );
  }
};

export default ImageSlot;
