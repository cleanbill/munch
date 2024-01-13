"use client"
import { useLocalStorage } from "usehooks-ts";
import { Dinner, MUNCH, MealPlan, SELECTED } from "../../types";
import { useEffect, useState } from "react";

const Menu = () => {

  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [dinners, _setDinners] = useLocalStorage(MUNCH, new Array<Dinner>());
  const [_selectedMenu, setSelectedMenu] = useLocalStorage(SELECTED, "");

  useEffect(() => {
    setMounted(true);
  }, []);

  const containsMeals = (mealPlans: Array<MealPlan>) => {
    const meals = new Set<string>();
    mealPlans.forEach((mealPlan: MealPlan) => (meals.add(mealPlan.meal.name)));
    return meals;
  }

  const compileList = () => {
    const map = new Map<string, number>()
    dinners.forEach((dinner: Dinner) => {
      const meals = containsMeals(dinner.guests);
      meals.forEach((mealName: string) => {
        const meal = map.get(mealName);
        const amount: number = meal == undefined ? 0 : meal;
        if (mealName.trim().length > 0) {
          map.set(mealName, amount + 1);
        }
      })
    })
    map.entries
    return map;
  }

  const select = (no: number, menu: string) => {
    setSelected(no)
    setSelectedMenu(menu);
  };

  const menuList = Array.from(compileList());
  menuList.sort((a, b) => a[1] - b[1]);

  return (
    <div className="w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      <h2><b>Menu Frequency</b></h2>
      {mounted && <div className='grid grid-cols-[11fr,1fr] bg-slate-50 p-2'>
        {menuList.map((menuRank: Array<string | number>, index: number) => (
          <><button onClick={() => select(index, menuRank[0] + "")} className={selected == index ? "text-start bg-sky-200" : "text-start hover:bg-sky-200"}>{menuRank[0]}</button><button>{menuRank[1]}</button></>
        ))}
      </div>}
    </div >
  )
}

export default Menu