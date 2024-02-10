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

    const date = dinners[selectedDateIndex].date ? dinners[selectedDateIndex].date : new Date();
    const shoppingDate = new Date(date).toDateString();

    return (
        <div className="section-card">
            <h2><b>Shopping List from {shoppingDate}</b></h2>
            <div className="grid">
                {meals.map((mealName: string, index: number) => (
                    <Meal key={'meal' + index} name={mealName} index={index}></Meal>
                ))}
            </div>
        </div>
    )
}

export default ShoppingList;