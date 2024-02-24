"use client"
import { useLocalStorage } from "usehooks-ts";
import { Dinner, IngredientQty, MEAL_INGREDIENTS, MUNCH, MealIngredients, MealPlan, SELECTED_DATE_INDEX } from "../../types";
import Meal from "./Meal";
import { useState, useEffect } from "react";
import IngredientList from "./IngredientList";

const ShoppingList = () => {

    const [selectedDateIndex, _setSelectedDateIndex] = useLocalStorage(SELECTED_DATE_INDEX, -1);
    const [dinners, _setDinners] = useLocalStorage(MUNCH, new Array<Dinner>());
    const [mounted, setMounted] = useState(false);
    const [mealIngredients, _setMealIngredients] = useLocalStorage(MEAL_INGREDIENTS, Array<MealIngredients>());

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

    const allIngredients = meals.map((mealName: string) => {
        const meal = mealIngredients.find((m: MealIngredients) => m.meal.name == mealName);
        return meal?.ingredients;
    }).flat(1);

    const fullIngredients: IngredientQty[] = allIngredients.filter(exists => exists != null) as IngredientQty[];
    const ingredients = fullIngredients.map((current: IngredientQty) => ({
        ingredient: current.ingredient,
        qty: parseInt("" + current.qty),
        unit: current?.unit
    }));
    const unique = Array.from(new Set(
        ingredients.filter(exists => exists && exists != undefined && exists.ingredient.name)
            .map((iQty: IngredientQty) => iQty.ingredient.name)));

    const totals = unique.map((name: string) => {
        const matches = ingredients.filter((iq: IngredientQty) => (iq && iq.ingredient.name == name));
        const sum = matches.reduce((previous: IngredientQty, current: IngredientQty) => {
            const one = parseInt("" + previous.qty);
            const two = parseInt("" + current.qty);
            const qty = one + two;
            return {
                ingredient: current.ingredient,
                qty,
                unit: current?.unit
            }
        });
        return sum;
    }).sort((a: IngredientQty, b: IngredientQty) => a.qty - b.qty);

    return (
        <div className="section-card">
            {mounted && <><h2><b>Shopping List from {shoppingDate}</b></h2>
                <section className="grid grid-cols-2">
                    <span>
                        {meals.map((mealName: string, index: number) => (
                            <Meal key={'meal' + index} name={mealName} index={index}></Meal>
                        ))}
                    </span>
                    <IngredientList ingredients={totals} ></IngredientList>
                </section>
            </>}
        </div>
    )
}

export default ShoppingList;