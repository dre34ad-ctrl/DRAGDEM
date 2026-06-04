'use client';

import { useState } from 'react';

interface TechnicalRiderEditorProps {
  initialData?: {
    stage: { minWidth: number; minDepth: number; surface: string };
    audio: { micType: string; monitoring: string };
    hospitality: string[];
  };
  onSave: (data: any) => void;
}

export const TechnicalRiderEditor = ({ initialData, onSave }: TechnicalRiderEditorProps) => {
  const [stage, setStage] = useState(initialData?.stage || { minWidth: 3, minDepth: 3, surface: 'Wood' });
  const [audio, setAudio] = useState(initialData?.audio || { micType: 'Wireless Handheld (XLR)', monitoring: 'Floor Monitors' });
  const [hospitality, setHospitality] = useState<string[]>(initialData?.hospitality || ['Bottled Water', 'Private Changing Room']);
  const [newItem, setNewItem] = useState('');

  const addHospitality = () => {
    if (newItem.trim()) {
      setHospitality([...hospitality, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeHospitality = (index: number) => {
    setHospitality(hospitality.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-900 text-white p-8 rounded-2xl border border-pink-500/30">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-6">
        Technical Rider Editor
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400 border-b border-pink-500/20 pb-2">Stage Requirements</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Min Width (meters)</label>
            <input 
              type="number" 
              value={stage.minWidth} 
              onChange={(e) => setStage({...stage, minWidth: Number(e.target.value)})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:border-pink-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Min Depth (meters)</label>
            <input 
              type="number" 
              value={stage.minDepth} 
              onChange={(e) => setStage({...stage, minDepth: Number(e.target.value)})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:border-pink-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Surface Type</label>
            <input 
              type="text" 
              value={stage.surface} 
              onChange={(e) => setStage({...stage, surface: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:border-pink-500 outline-none"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400 border-b border-pink-500/20 pb-2">Audio Requirements</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Microphone Preferred</label>
            <input 
              type="text" 
              value={audio.micType} 
              onChange={(e) => setAudio({...audio, micType: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:border-pink-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Monitoring Setup</label>
            <input 
              type="text" 
              value={audio.monitoring} 
              onChange={(e) => setAudio({...audio, monitoring: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:border-pink-500 outline-none"
            />
          </div>
        </section>
      </div>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-pink-400 border-b border-pink-500/20 pb-2 mb-4">Hospitality & Backstage</h3>
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add hospitality item (e.g. Mirror, Snacks)"
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:border-pink-500 outline-none"
          />
          <button 
            onClick={addHospitality}
            className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded font-bold transition"
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {hospitality.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded border border-gray-700">
              <span>{item}</span>
              <button 
                onClick={() => removeHospitality(idx)}
                className="text-red-500 hover:text-red-400 text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <button 
        onClick={() => onSave({ stage, audio, hospitality })}
        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 py-3 rounded-xl font-bold text-xl transition shadow-lg"
      >
        Save Technical Rider
      </button>
    </div>
  );
};
