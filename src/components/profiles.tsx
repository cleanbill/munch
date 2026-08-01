"use client"
import { useLocalStorage } from "usehooks-ts";
import { EATERS, Eater, MUNCH, Dinner } from "../data/types";
import { useState } from "react";

const Profiles = () => {
  const [eaters, setEaters] = useLocalStorage<Eater[]>(EATERS, []);
  const [dinners, setDinners] = useLocalStorage<Dinner[]>(MUNCH, []);
  const [isOpen, setIsOpen] = useState(false);
  const [editingEater, setEditingEater] = useState<Eater | null>(null);
  const [originalName, setOriginalName] = useState<string>("");

  // Local string state to prevent trailing commas from being stripped while typing
  const [dislikesInput, setDislikesInput] = useState("");
  const [focusInput, setFocusInput] = useState("");
  const [trainingInput, setTrainingInput] = useState("");

  const saveEater = () => {
    if (editingEater) {
      const updatedEater = {
        ...editingEater,
        dislikes: dislikesInput.split(',').map(s => s.trim()).filter(s => s),
        focusAreas: focusInput.split(',').map(s => s.trim()).filter(s => s),
        trainingDays: trainingInput.split(',').map(s => s.trim()).filter(s => s),
      };

      setEaters(prev => prev.map(e => e.name === originalName ? updatedEater : e));
      setEditingEater(null);
      setOriginalName("");
    }
  }

  const wipeFutureDinners = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDinners(prev => prev.filter(dinner => new Date(dinner.date).getTime() < today.getTime()));
  }

  const addEater = () => {
    const newName = `New Person ${eaters.length + 1}`;
    const newEater: Eater = { name: newName, age: 30, isVegetarian: false, dislikes: [], focusAreas: [], trainingDays: [] };
    setEaters(prev => [...prev, newEater]);
    setEditingEater(newEater);
    setOriginalName(newName);
    setDislikesInput("");
    setFocusInput("");
    setTrainingInput("");
    wipeFutureDinners();
  }

  const removeEater = (nameToRemove: string) => {
    if (confirm(`Are you sure you want to remove ${nameToRemove}? Existing meal history will be unaffected, but they will not appear on future days.`)) {
      setEaters(prev => prev.filter(e => e.name !== nameToRemove));
      wipeFutureDinners();
    }
  }

  const moveEaterUp = (index: number) => {
    if (index === 0) return;
    setEaters(prev => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
    wipeFutureDinners();
  }

  const moveEaterDown = (index: number) => {
    if (index === eaters.length - 1) return;
    setEaters(prev => {
      const arr = [...prev];
      [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
      return arr;
    });
    wipeFutureDinners();
  }

  if (!isOpen) {
    return (
      <div className="absolute top-4 right-16">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
          title="Profiles"
        >
          👤
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-16 z-50 section-card p-4 shadow-2xl min-w-[350px] max-w-[400px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
        <h3 className="font-bold text-slate-800 dark:text-slate-200">Eater Profiles</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
      </div>

      {!editingEater ? (
        <div className="space-y-3">
          <div className="space-y-2">
            {eaters.map((eater, index) => (
              <div key={eater.name} className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg group">
                <span className="font-medium text-slate-700 dark:text-slate-300">{eater.name}</span>
                <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => moveEaterUp(index)}
                    disabled={index === 0}
                    className="text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-400 px-1"
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={() => moveEaterDown(index)}
                    disabled={index === eaters.length - 1}
                    className="text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-400 px-1"
                    title="Move Down"
                  >
                    ↓
                  </button>
                  <button 
                    onClick={() => { 
                      setEditingEater(eater); 
                      setOriginalName(eater.name); 
                      setDislikesInput((eater.dislikes || []).join(', '));
                      setFocusInput((eater.focusAreas || []).join(', '));
                      setTrainingInput((eater.trainingDays || []).join(', '));
                    }}
                    className="text-indigo-600 text-sm hover:underline ml-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => removeEater(eater.name)}
                    className="text-red-500 text-sm hover:underline"
                    title="Remove Eater"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addEater} className="btn-secondary w-full text-sm py-2 mt-2">
            + Add New Eater
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-700 border-b pb-1">Editing {editingEater.name}</h4>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Name</label>
            <input 
              type="text"
              value={editingEater.name}
              onChange={(e) => setEditingEater({ ...editingEater, name: e.target.value })}
              className="input-field text-sm font-bold"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Age</label>
            <input 
              type="number"
              value={editingEater.age || ''}
              onChange={(e) => setEditingEater({ ...editingEater, age: parseInt(e.target.value) })}
              className="input-field text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="isVeg"
              checked={editingEater.isVegetarian || false}
              onChange={(e) => setEditingEater({ ...editingEater, isVegetarian: e.target.checked })}
            />
            <label htmlFor="isVeg" className="text-sm font-semibold text-slate-700">Vegetarian</label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Dislikes (comma separated)</label>
            <input 
              type="text"
              value={dislikesInput}
              onChange={(e) => setDislikesInput(e.target.value)}
              placeholder="e.g. mushrooms, onions"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Focus Areas (comma separated)</label>
            <input 
              type="text"
              value={focusInput}
              onChange={(e) => setFocusInput(e.target.value)}
              placeholder="e.g. Neuroscience, Sports Nutrition"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Training Days (comma separated)</label>
            <input 
              type="text"
              value={trainingInput}
              onChange={(e) => setTrainingInput(e.target.value)}
              placeholder="e.g. Monday, Wednesday"
              className="input-field text-sm"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={() => setEditingEater(null)} className="btn-secondary flex-1 text-sm py-2">
              Cancel
            </button>
            <button onClick={saveEater} className="btn-primary flex-1 text-sm py-2">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profiles;
