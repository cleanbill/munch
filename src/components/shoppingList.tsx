"use client"
import { useLocalStorage } from "usehooks-ts";
import { Dinner, MUNCH, MealPlan, SELECTED_DATE_INDEX } from "../../types";
import Meal from "./Meal";

const ShoppingList = () => {

    const [selectedDateIndex, _setSelectedDateIndex] = useLocalStorage(SELECTED_DATE_INDEX, -1);
    const [dinners, _setDinners] = useLocalStorage(MUNCH, new Array<Dinner>());

    const mealSet = new Set<string>();
    let meal = 'start';
    let index = selectedDateIndex;
    while (meal.trim().length > 0) {
        const dinner = dinners[index];
        meal = '';
        dinner?.guests.forEach((mealPlan: MealPlan) => {
            meal = mealPlan.meal.name;
            if (meal) {
                mealSet.add(meal + '');
            }
        });
        index++;
    }

    const meals = Array.from(mealSet);

    return (
        <div className="w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30" >
            <h2><b>Shopping List from {new Date(dinners[selectedDateIndex].date).toDateString()}</b></h2>
            <div className="grid">
                {meals.map((mealName: string, index: number) => (
                    <Meal key={'meal' + index} name={mealName} index={index}></Meal>
                ))}
            </div>
        </div>
    )
}

export default ShoppingList;