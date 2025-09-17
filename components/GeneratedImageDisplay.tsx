import React, { useState } from 'react';
import type { ImageData } from '../types';
import Loader from './Loader';

interface GeneratedImageDisplayProps {
  image: ImageData | null;
  isLoading: boolean;
  onEditImage: (editPrompt: string) => void;
  onGenerateNew: () => void;
}

const Lightbox: React.FC<{ src: string; onClose: () => void }> = ({ src, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
      <img src={src} alt="Generated result" className="object-contain w-full h-full rounded-lg shadow-2xl" />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors"
        aria-label="Close lightbox"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
);

const EditToolbar: React.FC<{ onApply: (prompt: string) => void; onCancel: () => void }> = ({ onApply, onCancel }) => {
    const [prompt, setPrompt] = useState('');

    const handleApply = () => {
        if (prompt.trim()) {
            onApply(prompt);
        }
    };
    
    return (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-end z-20 p-4">
            <div className="w-full bg-white/90 p-4 rounded-xl shadow-lg space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., add a shadow, make the background darker..."
                    className="w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows={2}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={handleApply} disabled={!prompt.trim()} className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300">Apply Edit</button>
                </div>
            </div>
        </div>
    );
};


const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({ image, isLoading, onEditImage, onGenerateNew }) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const getAspectRatioClass = (ratio: string) => {
        const ratioValue = ratio.split(' ')[0];
        switch (ratioValue) {
            case '16:9': return 'aspect-[16/9]';
            case '4:3': return 'aspect-[4/3]';
            case '3:2': return 'aspect-[3/2]';
            case '9:16': return 'aspect-[9/16]';
            case '3:4': return 'aspect-[3/4]';
            case '4:5': return 'aspect-[4/5]';
            case '2:3': return 'aspect-[2/3]';
            case '1:1':
            default:
                return 'aspect-square';
        }
    }

    const handleApplyEdit = (prompt: string) => {
        onEditImage(prompt);
        setIsEditing(false);
    }

    if (!image) return null;

    return (
        <div className="w-full space-y-4">
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-2 ${getAspectRatioClass(image.settings.aspectRatio)}`}>
                {isLightboxOpen && <Lightbox src={image.dataUrl} onClose={() => setIsLightboxOpen(false)} />}
                <div className={`relative w-full h-full rounded-xl overflow-hidden bg-gray-100`}>
                    {isLoading && image.id === 'loading-placeholder' ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                            <Loader message="Generating..." />
                        </div>
                    ) : (
                       <>
                        <button
                            type="button"
                            onClick={() => setIsLightboxOpen(true)}
                            className="w-full h-full appearance-none bg-transparent p-0 border-none cursor-pointer block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-xl"
                            aria-label="Enlarge generated image"
                        >
                            <img
                                src={image.dataUrl}
                                alt={image.prompt}
                                className="w-full h-full object-contain"
                            />
                        </button>
                         {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                                <Loader message="Applying Edit..." />
                            </div>
                        )}
                        {isEditing && <EditToolbar onApply={handleApplyEdit} onCancel={() => setIsEditing(false)} />}
                       </>
                    )}
                </div>
            </div>
            {!isLoading && image.id !== 'loading-placeholder' && !isEditing && (
                <div className="flex items-center justify-center gap-2">
                    <a href={image.dataUrl} download={`otto-studio-${Date.now()}.png`} className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100">Save</a>
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100">Edit Image</button>
                    <button onClick={onGenerateNew} className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600">Generate New</button>
                </div>
            )}
        </div>
    );
};

export default GeneratedImageDisplay;