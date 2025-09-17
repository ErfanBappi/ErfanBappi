import React from 'react';
import type { ImageData } from '../types';

interface HistoryPanelProps {
  history: ImageData[];
  onSelect: (image: ImageData) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4">History</h2>
      {history.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          Your generated images will appear here.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative bg-gray-100"
              onClick={() => onSelect(item)}
            >
              <img
                src={item.dataUrl}
                alt={item.prompt}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-xs text-center font-semibold p-2">Reuse Settings</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;