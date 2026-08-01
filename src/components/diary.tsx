"use client"
import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import { Eater, MUNCH, Dinner, SELECTED_MEAL, MealPlan } from "../data/types";
import DinnerForm from "./dinnerForm";

// @ts-ignore
let timer = null;

const DAY_IN_SECONDS = 86400000;
const DAYS_QTY = 10;

type Props = { eaters: Array<Eater> };

const Diary = (props: Props) => {

  const [mounted, setMounted] = useState(false);
  const [dinners, setDinners] = useLocalStorage(MUNCH, new Array<Dinner>());
  const [selectedMeal, setSelectedMeal] = useLocalStorage(SELECTED_MEAL, "");
  
  // New State for Tabs & Analysis
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [analysisCache, setAnalysisCache] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const createMealPlans = () => props.eaters.map((eater: Eater) => ({ eater, meal: { name: '' } }));

  const compileList = (startDate: Date, dinnerListWithDataInCorrectFormat: Array<Dinner>) => {
    const now = new Date();
    const aWeekFromNow = now.getTime() + (DAY_IN_SECONDS * DAYS_QTY)
    let x = 1;
    let nextDate = startDate;
    while (aWeekFromNow > nextDate.getTime()) {
      const extra = DAY_IN_SECONDS * x;
      nextDate = new Date(startDate.getTime() + extra);
      dinnerListWithDataInCorrectFormat.push({ date: nextDate, guests: createMealPlans() });
      x = x + 1;
    }
    setDinners([...dinnerListWithDataInCorrectFormat]);
  };

  const clicked = (dinnerIndex: number, guestIndex: number) => {
    const blank = dinners[dinnerIndex].guests[guestIndex].meal.name.trim().length == 0;
    if (!blank || selectedMeal.trim().length == 0) {
      return;
    }
    updated(dinnerIndex, guestIndex, selectedMeal);
    // @ts-ignore
    clearTimeout(timer);
    timer = setTimeout(function () {
      setSelectedMeal("");
    }, 3000);
  }

  const clear = (dinnerIndex: number, guestIndex: number) => {
    updated(dinnerIndex, guestIndex, "");
  }

  const A_DAY = (1000 * 60 * 60 * 24);
  const truncateData = (fullList: Dinner[]): Dinner[] => {
    const today = new Date().getTime();
    const ageLimit = today - (A_DAY * 254);
    const smaller = fullList.filter((dinner: Dinner) => {
      const date = new Date(dinner.date);
      return date.getTime() > ageLimit;
    });
    return smaller;
  }

  const updated = (dinnerIndex: number, guestIndex: number, mealName: string, extras?: { emoji?: string, ingredients?: string[], recipe?: string }) => {
    const dinnerListWithExtraNewMenuDate = dinners.map((dinner: Dinner, di: number) => {
      if (dinnerIndex != di) {
        return dinner;
      }
      const meals = dinner.guests.map((mealPlan: MealPlan, gi: number) => {
        if (guestIndex != gi) {
          return mealPlan;
        }
        mealPlan.meal.name = mealName;
        if (extras) {
          mealPlan.meal.emoji = extras.emoji;
          mealPlan.meal.ingredients = extras.ingredients;
          mealPlan.meal.recipe = extras.recipe;
        } else if (mealPlan.meal.name !== mealName) {
          // If manually typed and changed, clear the old recipe
          delete mealPlan.meal.ingredients;
          delete mealPlan.meal.recipe;
        }
        return mealPlan;
      });
      dinner.guests = [...meals];
      return dinner;
    });
    const smaller = truncateData(dinners);
    setDinners([...smaller]);
    
    // Clear analysis cache for this eater when their meal is updated
    if (activeTab === props.eaters[guestIndex].name) {
      setAnalysisCache(prev => {
        const newCache = { ...prev };
        delete newCache[activeTab];
        return newCache;
      });
    }
  }

  useEffect(() => {
    const now = new Date();
    // Use start of today to prevent millisecond drift
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const targetEndDate = startOfToday + (DAY_IN_SECONDS * (DAYS_QTY - 1));
    const lastDinnerDate = dinners.length > 0 ? new Date(dinners[dinners.length - 1].date).getTime() : 0;
    
    if (dinners.length === 0 || lastDinnerDate < targetEndDate) {
      const startDate = (dinners.length === 0)
        ? new Date(now.getTime() - DAY_IN_SECONDS)
        : new Date(dinners[dinners.length - 1].date);
      compileList(startDate, [...dinners]);
    }

    if (!mounted) {
      setMounted(true);
      if (props.eaters.length > 0) setActiveTab(props.eaters[0].name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dinners.length]);

  const analyzeDiet = async (eaterProfile: any) => {
    const eaterName = eaterProfile.name;
    if (analysisCache[eaterName]) return; // Already analyzed
    
    if (!localStorage.getItem('API_KEY')) {
      setAnalysisCache(prev => ({ ...prev, [eaterName]: "⚠️ Please set your Gemini API Key in the settings (top right ⚙️) to enable AI Dietary Analysis." }));
      return;
    }

    setIsAnalyzing(true);
    try {
      // Extract planned meals for this eater
      const mealsForEater = relevantDinners?.map(dinner => {
        const mealPlan = dinner.guests.find(g => g.eater.name === eaterName);
        return {
          date: dinner.date,
          meal: mealPlan?.meal.name || "None planned"
        };
      }) || [];

      // API_KEY is stored in localStorage as a JSON string by usehooks-ts
      const rawKey = localStorage.getItem('API_KEY') || '""';
      const parsedKey = JSON.parse(rawKey);

      const response = await fetch('/api/analyze-diet', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parsedKey}`
        },
        body: JSON.stringify({ eaterProfile, meals: mealsForEater })
      });
      
      const data = await response.json();
      if (data.analysis) {
        setAnalysisCache(prev => ({ ...prev, [eaterName]: data.analysis }));
      } else if (data.error) {
        setAnalysisCache(prev => ({ ...prev, [eaterName]: `⚠️ Error: ${data.error}` }));
      }
    } catch (error) {
      console.error(error);
      setAnalysisCache(prev => ({ ...prev, [eaterName]: `⚠️ Failed to reach AI service.` }));
    } finally {
      setIsAnalyzing(false);
    }
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayTime = yesterday.getTime();
  const relevantDinners = dinners?.filter((dinner: Dinner) => new Date(dinner.date).getTime() > yesterdayTime);
  const offSet = dinners.length - (relevantDinners?.length || 0);

  useEffect(() => {
    if (activeTab) {
      const activeEater = props.eaters.find(e => e.name === activeTab);
      if (activeEater) {
        analyzeDiet(activeEater);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, relevantDinners, props.eaters]);

  return (
    <div className="space-y-6">
      {mounted && (
        <>
          {/* Dietary Tabs */}
          <div className="section-card p-4">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <span>🩺</span> Dietary Analysis
            </h2>
            <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-700 pb-px overflow-x-auto">
              {props.eaters.map((eater: Eater, i: number) => (
                <button
                  key={eater.name + '-' + i}
                  onClick={() => setActiveTab(eater.name)}
                  className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === eater.name 
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-300'
                  }`}
                >
                  {eater.name}
                </button>
              ))}
            </div>
            
            {/* Analysis Panel */}
            <div className="mt-4 min-h-[100px] rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              {isAnalyzing && !analysisCache[activeTab || ""] ? (
                <div className="flex items-center justify-center h-full text-indigo-500 animate-pulse">
                  Analyzing dietary plan for {activeTab}... ✨
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {analysisCache[activeTab || ""] || "No analysis available. Please plan some meals!"}
                </div>
              )}
            </div>
          </div>

          {/* Dinner Forms */}
          <div className="grid gap-4">
            {relevantDinners?.map((dinner: Dinner, i: number) => (
              <DinnerForm key={'dinnerDate-' + (i + offSet)} dinner={dinner}
                index={i + offSet}
                clicked={(gi: number) => clicked(i + offSet, gi)}
                clear={(gi: number) => clear(i + offSet, gi)}
                updated={(gi: number, text: string) => updated(i + offSet, gi, text)}></DinnerForm>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Diary;