import React, { useCallback, useState } from 'react';
import type { ImageFile } from '../types';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: ImageFile) => void;
  aspectRatio: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, aspectRatio }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onImageUpload({
            dataUrl: e.target?.result as string,
            mimeType: file.type,
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [onImageUpload]);

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

  return (
    <label
        htmlFor="image-upload"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-xl cursor-pointer transition-colors ${getAspectRatioClass(aspectRatio)} ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'
        }`}
    >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
        <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
        <p className="mb-2 text-sm font-semibold text-gray-700">
            Upload your product image
        </p>
        <p className="text-xs text-gray-500">Drag & drop or click to browse</p>
        </div>
        <input
        id="image-upload"
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={(e) => handleFileChange(e.target.files)}
        />
    </label>
  );
};

export default ImageUploader;
