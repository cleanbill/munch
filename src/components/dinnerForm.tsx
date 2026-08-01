"use client"
import { ChangeEvent, useState } from "react";
import { Dinner, MealPlan, SELECTED_DATE_INDEX } from "../data/types";
import { useLocalStorage } from "usehooks-ts";
import { toast } from "react-toastify"; // Assume react-toastify is installed based on package.json

type Props = {
  dinner: Dinner,
  index: number,
  updated: Function
  clicked: Function
  clear: Function
};

const DinnerForm = (props: Props) => {
  const [selectedDateIndex, setSelectedDateIndex] = useLocalStorage(SELECTED_DATE_INDEX, -1);
  const [isSuggesting, setIsSuggesting] = useState<number | null>(null);

  const date = new Date(props.dinner.date);
  const isToday = date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
  const isPast = date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  
  const dateClass = `w-full text-left px-4 py-3 rounded-t-xl transition-colors font-medium
    ${isToday ? 'bg-indigo-100 text-indigo-900 font-bold dark:bg-indigo-900/50 dark:text-indigo-100' : ''}
    ${isPast ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200'}
    ${props.index === selectedDateIndex ? 'bg-indigo-50 dark:bg-indigo-900/30 border-b-2 border-indigo-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
  `;

  // @ts-ignore
  let timer = null;

  const clear = (mpIndex: number) => {
    const el = document.getElementById('menu-name-' + mpIndex + "-" + props.index) as HTMLInputElement;
    el.value = '';
    props.clear(mpIndex);
  }

  const update = (mpIndex: number, e: ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    clearTimeout(timer);
    timer = setTimeout(function () {
      props.updated(mpIndex, e.target.value);
    }, 1000);
  }

  const select = () => {
    if (props.index === selectedDateIndex) {
      setSelectedDateIndex(-1);
    } else {
      setSelectedDateIndex(props.index);
    }
  }

  const dateRender = (date: Date, small = false) => {
    if (!small) return date.toDateString().substring(0, 10);
    const options = { weekday: "short" };
    // @ts-ignore
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  }

  const getDayOfWeek = (d: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[d.getDay()];
  }

  const handleSuggest = async (mpIndex: number, eaterProfile: any) => {
    
    if (!localStorage.getItem('API_KEY') || localStorage.getItem('API_KEY') === '""') {
      alert("Please set your Gemini API Key in the settings (top right ⚙️) first!");
      return;
    }

    setIsSuggesting(mpIndex);
    try {
      const rawKey = localStorage.getItem('API_KEY') || '""';
      const parsedKey = JSON.parse(rawKey);

      const response = await fetch('/api/suggest-meal', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parsedKey}`
        },
        body: JSON.stringify({
          historicalMeals: [], // TODO: pass actual historical meals if accessible
          ingredients: [], // TODO: pass actual ingredients if accessible
          eaterProfile: eaterProfile,
          dayOfWeek: getDayOfWeek(new Date(props.dinner.date))
        })
      });
      
      const data = await response.json();
      if (data.mealName) {
        const mealString = data.emoji ? `${data.emoji} ${data.mealName}` : data.mealName;
        const el = document.getElementById('menu-name-' + mpIndex + "-" + props.index) as HTMLInputElement;
        el.value = mealString;
        props.updated(mpIndex, data.mealName, {
          emoji: data.emoji,
          ingredients: data.ingredients,
          recipe: data.recipe
        });
      } else if (data.error) {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to reach AI service.");
    } finally {
      setIsSuggesting(null);
    }
  }

  const [activeRecipe, setActiveRecipe] = useState<MealPlan | null>(null);

  return (
    <div className="section-card p-0 overflow-hidden mb-4 relative">
      <button onClick={select} className={dateClass}>
        <span className="sm:hidden">{dateRender(date, true)}</span>
        <span className="hidden sm:inline">{dateRender(date)}</span>
      </button>
      
      <div className={`p-4 space-y-3 ${props.index !== selectedDateIndex && 'hidden sm:block'}`}>
        {props.dinner.guests && props.dinner.guests.map((mealPlan: MealPlan, mpIndex: number) => (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 group" key={'mealPlan-' + mpIndex}>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-20 shrink-0">
              {mealPlan.eater.name}
            </div>
            
            <div className="relative flex-grow flex items-center gap-2">
              <input
                id={'menu-name-' + mpIndex + "-" + props.index}
                className="input-field pr-24"
                type="text"
                placeholder="What's for dinner?"
                onClick={() => props.clicked(mpIndex)}
                onChange={(e) => update(mpIndex, e)}
                defaultValue={mealPlan.meal.emoji ? `${mealPlan.meal.emoji} ${mealPlan.meal.name}` : mealPlan.meal.name} 
              />
              
              <div className="absolute right-2 flex items-center gap-1 opacity-50 focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
                {mealPlan.meal.recipe && (
                  <button 
                    title="View Recipe"
                    onClick={() => setActiveRecipe(mealPlan)}
                    className="p-1.5 hover:bg-emerald-100 text-emerald-600 rounded-md transition-colors"
                  >
                    📖
                  </button>
                )}
                <button 
                  title="AI Suggestion"
                  disabled={isSuggesting === mpIndex}
                  onClick={() => handleSuggest(mpIndex, mealPlan.eater)}
                  className="p-1.5 hover:bg-indigo-100 text-indigo-600 rounded-md transition-colors disabled:opacity-50"
                >
                  {isSuggesting === mpIndex ? '⏳' : '✨'}
                </button>
                <button 
                  title="Clear"
                  className="p-1.5 hover:bg-red-100 text-red-500 rounded-md transition-colors" 
                  onClick={() => clear(mpIndex)}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Modal Overlay */}
      {activeRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
            <button 
              onClick={() => setActiveRecipe(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
              {activeRecipe.meal.emoji} {activeRecipe.meal.name}
            </h3>
            
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mt-4 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">Ingredients</h4>
            <ul className="list-disc pl-5 mb-6 text-slate-600 dark:text-slate-400 space-y-1">
              {activeRecipe.meal.ingredients?.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
            
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">Recipe</h4>
            <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {activeRecipe.meal.recipe}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DinnerForm;