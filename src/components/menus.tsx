"use client"
import { useLocalStorage } from "usehooks-ts";
import { DefaultIngredients, Dinner, INGREDIENTS as INGREDIENTS, IngredientQty, MEAL_INGREDIENTS, MUNCH, MealIngredients, MealPlan, SELECTED_MEAL } from "../../types";
import { useEffect, useState } from "react";
import MenuLine from "./MenuLIne";

const Menus = () => {

  const [mounted, setMounted] = useState(false);
  const [dinners, _setDinners] = useLocalStorage(MUNCH, new Array<Dinner>());
  const [selectedMealName, setSelectedMealName] = useLocalStorage(SELECTED_MEAL, "");
  const [_ingredients, setIngredients] = useLocalStorage(INGREDIENTS, new Array<IngredientQty>);
  const [mealIngredients, _setMealIngredients] = useLocalStorage(MEAL_INGREDIENTS, Array<MealIngredients>());

  useEffect(() => {
    setSelectedMealName("");
    setMounted(true);
  }, []);

  useEffect(() => {

  }, [selectedMealName]);

  const containsMeals = (mealPlans: Array<MealPlan>) => {
    const meals = new Set<string>();
    mealPlans.forEach((mealPlan: MealPlan) => (meals.add(mealPlan.meal.name.toLowerCase().trim())));
    return meals;
  }

  const compileTotals = () => {
    const map = new Map<string, number>()
    dinners.forEach((dinner: Dinner) => {
      const meals = containsMeals(dinner.guests);
      meals.forEach((mealName: string) => {
        const meal = map.get(mealName);
        const amount: number = meal == undefined ? 0 : meal;
        if (mealName.trim().length > 0) {
          map.set(mealName.trim(), amount + 1);
        }
      })
    })
    map.entries
    return map;
  }

  const obtainIngredients = (mealName: string, dinner: Dinner): Array<IngredientQty> | null => {
    const mealPlan = dinner.guests.find((mealPlan: MealPlan) => mealPlan.meal.name.toLowerCase() == mealName.toLowerCase());
    if (mealPlan == null) {
      return new Array<IngredientQty>();
    }
    const mealIngredient = mealIngredients.find((mi: MealIngredients) => mi.meal.name == mealPlan.meal.name);
    return mealIngredient?.ingredients || new Array<IngredientQty>();
  }

  const compileMealsIngredients = (mealNames: Array<string>) => {
    const ingredientQuantities = mealNames.map((mealName: string) => {
      const mealPlans = dinners.map((dinner: Dinner) => {
        const ingredients = obtainIngredients(mealName, dinner);
        return ingredients || DefaultIngredients;
      }).filter((mp: Array<IngredientQty> | null) => mp != null);
      return mealPlans[0];
    });
    return ingredientQuantities;
  }

  const mealNamesMapTotals = compileTotals();
  const names = Array.from(mealNamesMapTotals.keys());
  const ingredientsList = compileMealsIngredients(names);

  const menuList = Array.from(mealNamesMapTotals);
  menuList.sort((a, b) => a[1] - b[1]);

  const select = (no: number, menuName: string) => {
    setIngredients(ingredientsList[no]);
    if (menuName == selectedMealName) {
      setSelectedMealName("");
    } else {
      setSelectedMealName(menuName);
    }
  };

  return (
    <div className="section-card">
      <h2><b>Menu Frequency</b></h2>
      {mounted && <div className='grid grid-cols-[11fr,1fr] bg-slate-50 p-2'>
        {menuList.map((menuRank: Array<string | number>, index: number) => (
          <MenuLine key={'menu-line-' + index} index={index}
            select={select}
            name={menuRank[0]}
            rank={menuRank[1]}
            selected={menuRank[0] == selectedMealName} ></MenuLine>))}
      </div>}
    </div >
  )
}

export default Menus