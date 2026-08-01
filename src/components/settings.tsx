"use client"
import { useLocalStorage } from "usehooks-ts";
import { API_KEY, MUNCH, Dinner } from "../data/types";
import { useState } from "react";

const Settings = () => {
  const [apiKey, setApiKey] = useLocalStorage(API_KEY, "");
  const [dinners, setDinners] = useLocalStorage<Dinner[]>(MUNCH, []);
  const [isOpen, setIsOpen] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const saveKey = () => {
    setApiKey(tempKey);
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    );
  }

  const wipeFutureDinners = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDinners(prev => prev.filter(dinner => new Date(dinner.date).getTime() < today.getTime()));
    setIsOpen(false);
  }

  return (
    <div className="absolute top-4 right-4 z-50 section-card p-4 shadow-2xl min-w-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-200">Settings</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Gemini API Key</label>
          <input 
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="Paste your API key here..."
            className="input-field text-sm"
          />
          <p className="text-xs text-slate-400 mt-1">Stored locally in your browser.</p>
        </div>
        
        <button onClick={saveKey} className="btn-primary w-full text-sm py-2">
          Save Settings
        </button>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Data Management</label>
          <button onClick={wipeFutureDinners} className="w-full text-sm py-2 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors font-medium">
            🗑️ Clear Future Meals
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
