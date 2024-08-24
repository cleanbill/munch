"use client"
import Diary from "@/components/diary"
import IngredientInputList from "@/components/ingredientInputList"
import MenuFrequency from "@/components/menuFrequency"
import ShoppingList from "@/components/shoppingList"
import { useLocalStorage } from "usehooks-ts"
import { MUNCH, Dinner, MUNCH_BAK, MEAL_INGREDIENTS, INGREDIENTS, IngredientQty, MealIngredients, SELECTED_DATE_INDEX, SELECTED_MEAL, MunchData } from "../../types"
import { useEffect } from "react"
import Sync from "@/components/sync"
//import {} from '@jsr/cill__lsc'

const eaters = [{ name: 'The Olds' }, { name: 'Cory' }, { name: 'Finn' }]

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
    setDinners(munchData.dinners);
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

    const data = response.value.data;

    setDinners([...data.dinners]);
    setMealIngredients([...data.mealIngredients]);
    setSelectedMeal(data.selectedMeal);
    setSelectedDateIndex(data.selectedDateIndex);
    setIngredients([...data.ingredients]);
  }

  setTimeout(function () {
    console.log('Woke up after ', wait);
    document.location.reload();
  }, wait);

  // const getData = (): string => JSON.stringify({ dinners, mealIngredients, selectedMeal, selectedDateIndex, ingredients })

  return (
    <main className="items-center justify-between p-4 text-indigo-700">
      <Sync overwriteData={overwriteData} data={{ dinners, mealIngredients, selectedMeal, selectedDateIndex, ingredients }}></Sync>
      {/* <data-sync data={getData()}></data-sync> */}
      <h1 className='m-5 p-5 text-4xl font-thin shadow-md shadow-black/25'>MUNCH....</h1>
      <div className="grid lg:grid-cols-[7fr,3fr] sm:grid-cols-1 gap-2">
        <div className="grid gap-2 h-fit">
          <Diary eaters={eaters}></Diary>
          <IngredientInputList></IngredientInputList>
          <ShoppingList></ShoppingList>
        </div>
        <MenuFrequency></MenuFrequency>
      </div>
    </main >
  )
}
