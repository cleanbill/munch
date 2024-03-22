"use client"
import { useLocalStorage } from "usehooks-ts";
import { Dinner, INGREDIENTS as INGREDIENTS, IngredientQty, MEAL_INGREDIENTS, MUNCH, MealIngredients, MealPlan, SELECTED_MEAL } from "../../types";
import { ChangeEvent, useEffect, useState } from "react";
import MenuLine from "./MenuLine";

const MenuFrequency = () => {

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

  type MealName = string;
  type MealCount = Map<MealName, number>;

  type GuestName = string;
  type GuestMeals = Map<GuestName, MealCount>;

  type MealQty = { meal: MealName, qty: number };
  type Meals = MealQty[];
  type GuestMealFrequency = { name: GuestName, meals: Meals };

  const mealsPerGuest = () => {
    const guests: GuestMeals = new Map<GuestName, MealCount>();
    dinners.forEach((dinner: Dinner) => {
      dinner.guests
        .filter((mealPlan: MealPlan) => mealPlan.meal.name.trim().length > 0)
        .forEach((mealPlan: MealPlan) => {
          const mealCountMayBe = guests.get(mealPlan.eater.name.trim().toLowerCase());
          const mealCount = mealCountMayBe ? mealCountMayBe : new Map<MealName, number>();
          const countMaybe = mealCount.get(mealPlan.meal.name.trim().toLowerCase());
          const count = (countMaybe ? countMaybe : 0) + 1;
          mealCount.set(mealPlan.meal.name.trim().toLowerCase(), count);
          guests.set(mealPlan.eater.name.trim().toLowerCase(), mealCount);
        })
    })
    const guestMealFrequencyList: GuestMealFrequency[] = [];
    guests.forEach((mealCount: MealCount, guestName: GuestName) => {
      const meals: Meals = [];
      mealCount.forEach((mealCount: number, mealName: MealName) => {
        const mealQty: MealQty = { meal: mealName, qty: mealCount };
        meals.push(mealQty);
      })
      const sorted = meals.sort((mealQtyA: MealQty, mealQtyB: MealQty) => mealQtyA.qty - mealQtyB.qty);
      const guestMealFrequency: GuestMealFrequency = { name: guestName, meals: sorted };
      guestMealFrequencyList.push(guestMealFrequency);
    });
    return guestMealFrequencyList;
  }

  const select = (menuName: string) => {
    const mealIngredient = mealIngredients.find((mealIngredients: MealIngredients) => mealIngredients.meal.name.trim().toLowerCase() == menuName);
    if (mealIngredient) {
      setIngredients(mealIngredient.ingredients);
    }
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

  const onChange = (e: ChangeEvent<HTMLInputElement>) => { setFilterBy(e.target.value) };

  const quickFilter = (mealQty: MealQty) => !filterBy || mealQty.meal.toLowerCase().indexOf(filterBy.toLowerCase()) > -1;

  const list = mealsPerGuest();

  const clearDownSearch = () => {
    setFilterBy('');
    const field = document.getElementById("filterMenuFreq") as HTMLInputElement;
    field.value = '';
    field.focus();
  }

  return (
    <div className="section-card">
      <h2><b>Menu Frequency</b></h2>
      <span className="grid grid-cols-[12fr,0fr]">
        <input id="filterMenuFreq" className="mt-2 mb-2 w-full p-2 rounded-lg" placeholder="Filter" defaultValue={filterBy} onChange={onChange}></input>
        <button onClick={() => clearDownSearch()} title="clear filter" className=" w-4 hover:bg-yellow-600
            focus:outline-none focus:ring hover:pr-0
           focus:ring-yellow-300 text-xs rounded-xl
             h-5  mt-4 ">X</button>
      </span>
      {mounted && list.map((gmf: GuestMealFrequency, guestIndex: number) => (
        <div key={'gmf-' + guestIndex} className="section-card mt-2">

          <h1 className="font-bold">{gmf.name}</h1>
          {gmf.meals.filter(quickFilter).map((mealQty: MealQty, mealIndex: number) => (
            <MenuLine key={'menu-line-' + (guestIndex * 100) + mealIndex}
              select={select}
              filterBy={filterBy}
              name={mealQty.meal}
              rank={mealQty.qty}
              selected={mealQty.meal == selectedMealName}
              deleteMeal={deleteMeal} ></MenuLine>
          ))}
        </div>
      ))
      }
    </div >
  )
}

export default MenuFrequency