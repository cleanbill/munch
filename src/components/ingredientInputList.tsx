"use client"
import { useState, useEffect, ChangeEvent } from "react";
import { Dinner, IngredientQty, MEAL_INGREDIENTS, MUNCH, MealIngredients, MealPlan, SELECTED_MEAL } from "../../types";
import IngredientInput from "./ingredientInput";
import { useLocalStorage } from "usehooks-ts";


const IngredientInputList = () => {

    const [mounted, setMounted] = useState(false);
    const [dinners, setDinners] = useLocalStorage(MUNCH, new Array<Dinner>());
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
    const updateMealName = (mealName: string, newMealName: string) => {
        const newDinners = dinners.map((dinner: Dinner) => {
            const newGuests = dinner.guests.map((mealPlan: MealPlan) => {
                if (mealPlan.meal.name.trim().toLowerCase() == mealName.trim().toLowerCase()) {
                    return {
                        eater: mealPlan.eater,
                        meal: { name: newMealName },
                        rating: mealPlan?.rating
                    }
                }
                return mealPlan;

            });
            dinner.guests = newGuests;
            return dinner;
        })
        setDinners(newDinners);
    };


    return (
        <div className="section-card">
            {mounted && <div>
                <span className="grid grid-cols-[2fr,2fr,7fr]">
                    <h2 className="mt-1 font-bold">Ingredients for ...</h2>
                    <input key={'mealName-' + selectedMeal} id='name'
                        onChange={(e) => updateMealName(selectedMeal, e.target.value)}
                        className='rounded p-1 mb-3'
                        defaultValue={selectedMeal}></input>
                </span>
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