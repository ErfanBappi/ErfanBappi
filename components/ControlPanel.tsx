import React, { useState } from 'react';
import { LIGHTING_OPTIONS, ASPECT_RATIO_OPTIONS, CAMERA_PERSPECTIVE_OPTIONS } from '../constants';
import type { ImageFile } from '../types';
import UploadIcon from './icons/UploadIcon';
import Loader from './Loader';

interface ControlPanelProps {
  settings: {
    lighting: string;
    aspectRatio: string;
    cameraPerspective: string;
  };
  onSettingsChange: (key: string, value: string) => void;
  customPrompt: string;
  onCustomPromptChange: (value: string) => void;
  onGetIdeasFromText: (description: string) => void;
  onGetIdeaFromImage: (file: ImageFile) => void;
  isTextIdeaLoading: boolean;
  isImageIdeaLoading: boolean;
  environmentIdeas: string[];
  onUsePromptIdea: (prompt: string) => void;
}

const Select: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }> = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select value={value} onChange={onChange} className="w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none">
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
);

const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  onSettingsChange,
  customPrompt,
  onCustomPromptChange,
  onGetIdeasFromText,
  onGetIdeaFromImage,
  isTextIdeaLoading,
  isImageIdeaLoading,
  environmentIdeas,
  onUsePromptIdea,
}) => {
    const [ideaDescription, setIdeaDescription] = useState('');
    const [styleImage, setStyleImage] = useState<ImageFile | null>(null);
    const [selectedIdea, setSelectedIdea] = useState('');

    const handleStyleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                setStyleImage({
                    dataUrl: ev.target?.result as string,
                    mimeType: file.type,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGetIdeaFromImageClick = () => {
        if (styleImage) {
            onGetIdeaFromImage({
                ...styleImage,
                dataUrl: styleImage.dataUrl.split(',')[1],
            });
        }
    };

    const handleUsePrompt = () => {
        if (selectedIdea) {
            onUsePromptIdea(selectedIdea);
            setSelectedIdea('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                <Select label="Lighting" value={settings.lighting} onChange={e => onSettingsChange('lighting', e.target.value)} options={LIGHTING_OPTIONS} />
                <Select label="Aspect Ratio" value={settings.aspectRatio} onChange={e => onSettingsChange('aspectRatio', e.target.value)} options={ASPECT_RATIO_OPTIONS} />
                <Select label="Camera Perspective" value={settings.cameraPerspective} onChange={e => onSettingsChange('cameraPerspective', e.target.value)} options={CAMERA_PERSPECTIVE_OPTIONS} />
                <hr className="border-gray-200"/>
                <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-2 tracking-wide text-center">CUSTOM SCENE</label>
                     <p className='text-sm font-medium text-gray-700 mb-1'>Create Your Own Prompt</p>
                     <textarea 
                        value={customPrompt}
                        onChange={e => onCustomPromptChange(e.target.value)}
                        placeholder="e.g., A sunny beach with palm trees" 
                        className="w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        rows={4}
                     />
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                <p className="text-xs font-semibold text-gray-500 tracking-wide text-center">OR GET SCENE IDEAS</p>
                <div>
                    <label className="text-sm font-medium text-gray-700">From a Description</label>
                    <div className="flex gap-2 mt-1">
                        <input 
                            type="text" 
                            value={ideaDescription}
                            onChange={(e) => setIdeaDescription(e.target.value)}
                            placeholder="e.g., a serene zen garden" 
                            className="flex-grow p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                        <button 
                            onClick={() => onGetIdeasFromText(ideaDescription)} 
                            disabled={isTextIdeaLoading || isImageIdeaLoading}
                            className="px-5 w-28 text-center bg-[#2563EB] text-white font-semibold rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isTextIdeaLoading ? 'Getting...' : 'Get Ideas'}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <hr className="flex-grow border-gray-200"/> <span className="text-xs text-gray-400 font-semibold">OR</span> <hr className="flex-grow border-gray-200"/>
                </div>

                <div>
                     <label className="text-sm font-medium text-gray-700">From a Style Image</label>
                     <div className="flex gap-2 mt-1">
                        <label htmlFor="style-upload" className="w-24 h-24 flex flex-col items-center justify-center border border-gray-300 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition text-gray-500 text-xs text-center font-medium relative overflow-hidden">
                           {styleImage ? (
                             <img src={styleImage.dataUrl} alt="style reference" className="w-full h-full object-cover"/>
                           ) : (
                             <>
                                <UploadIcon className="w-6 h-6 mb-1"/>
                                Upload Reference Style
                             </>
                           )}
                        </label>
                        <input id="style-upload" type="file" className="hidden" accept="image/*" onChange={handleStyleImageUpload}/>
                        <button onClick={handleGetIdeaFromImageClick} disabled={!styleImage || isTextIdeaLoading || isImageIdeaLoading} className="flex-grow bg-[#2563EB] text-white font-semibold rounded-lg text-base flex items-center justify-center p-2 text-center hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                           {isImageIdeaLoading ? <Loader message="Getting Idea..."/> : 'Get Ideas from Image'}
                        </button>
                     </div>
                </div>
            </div>

            {environmentIdeas.length > 0 && (
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                    <p className="text-sm font-medium text-gray-700">Choose an Environment</p>
                    <div className="space-y-2">
                        {environmentIdeas.map((idea, index) => (
                            <label key={index} className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors border ${selectedIdea === idea ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                <input
                                    type="radio"
                                    name="environment-idea"
                                    value={idea}
                                    checked={selectedIdea === idea}
                                    onChange={() => setSelectedIdea(idea)}
                                    className="mt-1 mr-3 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{idea}</span>
                            </label>
                        ))}
                    </div>
                    <button
                        onClick={handleUsePrompt}
                        disabled={!selectedIdea}
                        className="w-full py-2 px-4 bg-[#adff00] text-black text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Use this Prompt
                    </button>
                </div>
            )}
        </div>
    );
};

export default ControlPanel;