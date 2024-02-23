"use client"
import { useState, useEffect, ChangeEvent } from "react";
import { Dinner, IngredientQty, MEAL_INGREDIENTS, MUNCH, MealIngredients, MealPlan, SELECTED_MEAL } from "../../types";
import IngredientInput from "./ingredientInput";
import { useLocalStorage } from "usehooks-ts";


const IngredientInputList = () => {

    const [mounted, setMounted] = useState(false);
    const [dinners, _setDinners] = useLocalStorage(MUNCH, new Array<Dinner>());
    const [selectedMeal, _setSelectedMeal] = useLocalStorage(SELECTED_MEAL, "");
    const [mealIngredients, setMealIngredients] = useLocalStorage(MEAL_INGREDIENTS, Array<MealIngredients>());
    // @ts-ignore
    let timer = null;

    const emptyForExtra = () => {
        const addBlank = ingredients.length == 0
            || -1 == ingredients.findIndex((iq: IngredientQty) => iq.ingredient?.name?.trim().length == 0);
        if (addBlank) {
            ingredients.push({
                ingredient: {
                    name: ""
                },
                qty: 0
            });
        }

    }

    const currentMeal: Array<MealPlan | undefined> = dinners.map((dinner: Dinner) => {
        const mealPlan = dinner.guests.find((mealPlan: MealPlan) => mealPlan.meal.name == selectedMeal);
        return mealPlan;
    }).filter((mp: MealPlan | undefined) => mp != undefined);
    const mi = mealIngredients.findIndex((mi: MealIngredients) => mi.meal.name == currentMeal[0]?.meal.name);
    const ingredients = mealIngredients[mi] ? mealIngredients[mi].ingredients : [];
    emptyForExtra();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!selectedMeal) {
        return;
    }

    const update = () => {
        if (mi == -1) {
            const newMealIngredients: MealIngredients = {
                meal: {
                    name: selectedMeal
                },
                ingredients
            }
            mealIngredients.push(newMealIngredients);
        } else {
            mealIngredients[mi].ingredients = ingredients;
        }
        setMealIngredients([...mealIngredients]);
        emptyForExtra();
    }
    const changeName = (ingIndex: number, value: string) => {
        ingredients[ingIndex].ingredient = { name: value };
        update();
    }

    const changeQty = (ingIndex: number, qty: number) => {
        ingredients[ingIndex].qty = qty;
        update();
    }

    const updateIngredientName = (ingredientIndex: number, e: ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        clearTimeout(timer);
        timer = setTimeout(function () {
            changeName(ingredientIndex, e.target.value);
        }, 3000);
    }

    const updateIngredientQty = (ingredientIndex: number, e: ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        clearTimeout(timer);
        timer = setTimeout(function () {
            changeQty(ingredientIndex, parseInt(e.target.value));
        }, 3000);
    }


    return (
        <div className="section-card">
            {mounted && <div>
                <h2><b>Ingredients for {selectedMeal}</b></h2>
                <div className="grid grid-cols-2 gap-2">
                    {ingredients?.map((ingredientQty: IngredientQty, i: number) => (
                        <IngredientInput
                            id={selectedMeal + i}
                            key={'ingredientItem-' + i}
                            name={ingredientQty.ingredient.name}
                            qty={ingredientQty.qty}
                            updateName={(name: string) => changeName(i, name)}
                            updateQty={(qty: number) => changeQty(i, qty)} >
                        </IngredientInput>
                    ))}
                </div>
            </div>}
        </div >
    )
}

export default IngredientInputList