"use client"
import Diary from "@/components/diary"
import IngredientInputList from "@/components/ingredientInputList"
import MenuFrequency from "@/components/menuFrequency"
import ShoppingList from "@/components/shoppingList"
import { useLocalStorage } from "usehooks-ts"
import { MUNCH, Dinner, MUNCH_BAK, MEAL_INGREDIENTS, INGREDIENTS, IngredientQty, MealIngredients, SELECTED_DATE_INDEX, SELECTED_MEAL, MunchData, EATERS } from "../data/types"
import { useEffect } from "react"
import Sync from "@/components/sync"
import Settings from "@/components/settings"
import Profiles from "@/components/profiles"
//import {} from '@jsr/cill__lsc'

const defaultEaters = [
  { name: 'Mick', age: 40, isVegetarian: true, dislikes: [], focusAreas: ['Health'], trainingDays: [] },
  { name: 'Claire', age: 40, isVegetarian: false, dislikes: [], focusAreas: ['Health'], trainingDays: [] },
  { name: 'Cory', age: 12, isVegetarian: false, dislikes: [], focusAreas: ['Sports Nutrition', 'Neuroscience'], trainingDays: ['Tuesday', 'Thursday'] },
  { name: 'Finn', age: 15, isVegetarian: false, dislikes: [], focusAreas: ['Sports Nutrition', 'Neuroscience'], trainingDays: ['Monday', 'Wednesday'] }
];

const getNextMidnightTime = () => {
  var midnight = new Date()
  midnight.setHours(24);
  midnight.setMinutes(0);
  midnight.setSeconds(0);
  midnight.setMilliseconds(0);

  return midnight.getTime()
}

const secondsToRefresh = () => {
  const now = new Date();
  const difference = getNextMidnightTime() - now.getTime();
  return difference;
}
const wait = secondsToRefresh();

export default function Home() {

  const [_back, setBack] = useLocalStorage(MUNCH_BAK, new Array<Dinner>());

  // all stored should be restored.
  const [eaters, setEaters] = useLocalStorage(EATERS, defaultEaters);
  const [dinners, setDinners] = useLocalStorage(MUNCH, new Array<Dinner>());
  const [mealIngredients, setMealIngredients] = useLocalStorage(MEAL_INGREDIENTS, Array<MealIngredients>());
  const [selectedMeal, setSelectedMeal] = useLocalStorage(SELECTED_MEAL, "");
  const [selectedDateIndex, setSelectedDateIndex] = useLocalStorage(SELECTED_DATE_INDEX, -1);
  const [ingredients, setIngredients] = useLocalStorage(INGREDIENTS, new Array<IngredientQty>);


  interface OverwriteDataCustomEvent {
    data: { data: MunchData };
  }

  const handleNewData = (e: Event) => {
    const ce = e as CustomEvent<OverwriteDataCustomEvent>; // Type madness
    const munchData = ce.detail.data.data;
    const customEventDinnerOverwrite = munchData.dinners;
    setDinners(customEventDinnerOverwrite);
    setMealIngredients(munchData.mealIngredients);
    setSelectedMeal(munchData.selectedMeal);
    setSelectedDateIndex(munchData.selectedDateIndex);
    setIngredients(munchData.ingredients);
  }
  useEffect(() => {
    document.addEventListener('overwriteData', handleNewData);
    return () => document.removeEventListener('overwriteData', handleNewData);
  }, []);

  const overwriteData = (response: any) => {
    // Back it up...
    setBack([...dinners]);

    try {
      const data = response.value.data;

      const syncDinnersToOverwrite = data.dinners;
      setDinners([...syncDinnersToOverwrite]);
      setMealIngredients([...data.mealIngredients]);
      setSelectedMeal(data.selectedMeal);
      setSelectedDateIndex(data.selectedDateIndex);
      setIngredients([...data.ingredients]);
    } catch (error) {
      console.error('cannot overwrite date', error);
      console.error('response is', response);
      return false;
    }
    return true;
  }

  setTimeout(function () {
    console.log('Woke up after ', wait);
    document.location.reload();
  }, wait);

  // const getData = (): string => JSON.stringify({ dinners, mealIngredients, selectedMeal, selectedDateIndex, ingredients })

  return (
    <main className="min-h-screen bg-transparent relative">
      <Settings />
      <Profiles />
      <Sync name={MUNCH} overwriteData={overwriteData} data={{ dinners, mealIngredients, selectedMeal, selectedDateIndex, ingredients }}></Sync>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl mb-2">
            Munch<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Intelligent meal planning for the whole household.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Diary eaters={eaters}></Diary>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <IngredientInputList></IngredientInputList>
            <ShoppingList></ShoppingList>
            <MenuFrequency></MenuFrequency>
          </div>
        </div>
      </div>
    </main>
  )
}
