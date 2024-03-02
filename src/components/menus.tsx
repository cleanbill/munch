"use client"
import { useLocalStorage } from "usehooks-ts";
import { DefaultIngredients, Dinner, INGREDIENTS as INGREDIENTS, IngredientQty, MEAL_INGREDIENTS, MUNCH, MealIngredients, MealPlan, SELECTED_MEAL } from "../../types";
import { ChangeEvent, useEffect, useState } from "react";
import MenuLine from "./MenuLIne";

const Menus = () => {

  const [mounted, setMounted] = useState(false);
  const [dinners, setDinners] = useLocalStorage(MUNCH, new Array<Dinner>());
  const [selectedMealName, setSelectedMealName] = useLocalStorage(SELECTED_MEAL, "");
  const [_ingredients, setIngredients] = useLocalStorage(INGREDIENTS, new Array<IngredientQty>);
  const [mealIngredients, _setMealIngredients] = useLocalStorage(MEAL_INGREDIENTS, Array<MealIngredients>());

  const [filterBy, setFilterBy] = useState('');

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


  const deleteMeal = (mealName: string) => {
    const newDinners = dinners.map((dinner: Dinner) => {
      const newGuests = dinner.guests.map((mealPlan: MealPlan) => {
        if (mealPlan.meal.name == mealName) {
          return {
            eater: mealPlan.eater,
            meal: { name: "" },
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

  const filter = (menuRank: Array<string | number>) =>
    !filterBy || (menuRank[0] + "").toLowerCase().startsWith(filterBy.toLowerCase());

  const onChange = (e: ChangeEvent<HTMLInputElement>) => { setFilterBy(e.target.value) };

  return (
    <div className="section-card">
      <h2><b>Menu Frequency</b></h2>
      <input className="mt-2 mb-2 w-full p-2 rounded-lg" placeholder="Filter" defaultValue={filterBy} onChange={onChange}></input>
      {mounted && <div className='grid grid-cols-[11fr,1fr] bg-slate-50 p-2'>
        {menuList
          .filter(filter)
          .map((menuRank: Array<string | number>, index: number) => (
            <MenuLine key={'menu-line-' + index} index={index}
              select={select}
              name={menuRank[0]}
              rank={menuRank[1]}
              selected={menuRank[0] == selectedMealName}
              deleteMeal={deleteMeal} ></MenuLine>))}
      </div>}
    </div >
  )
}

export default Menus