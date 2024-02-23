"use client"
import { useLocalStorage } from "usehooks-ts";
import { Dinner, MUNCH, MealPlan, SELECTED_DATE_INDEX } from "../../types";
import Meal from "./Meal";
import { useState, useEffect } from "react";

const ShoppingList = () => {

    const [selectedDateIndex, _setSelectedDateIndex] = useLocalStorage(SELECTED_DATE_INDEX, -1);
    const [dinners, _setDinners] = useLocalStorage(MUNCH, new Array<Dinner>());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const mealSet = new Set<string>();
    let meal = 'start';
    let index = selectedDateIndex + 0;
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

    const determineShoppingDate = () => {

        if (!dinners[selectedDateIndex]) {
            return new Date().toDateString();
        }

        if (!dinners[selectedDateIndex].date) {
            return new Date().toDateString();
        }
        const date = dinners[selectedDateIndex].date;
        const shoppingDate = new Date(date).toDateString();
        return shoppingDate;
    }

    const shoppingDate = determineShoppingDate();

    return (
        <div className="section-card">
            {mounted && <><h2><b>Shopping List from {shoppingDate}</b></h2>
                {meals.map((mealName: string, index: number) => (
                    <Meal key={'meal' + index} name={mealName} index={index}></Meal>
                ))}
            </>}
        </div>
    )
}

export default ShoppingList;