"use client"
import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import { Eater, MUNCH, Dinner, SELECTED, MealPlan } from "../../types";
import DinnerForm from "./dinnerForm";

const DAY_IN_SECONDS = 86400000;

type Props = { eaters: Array<Eater> };

const Diary = (props: Props) => {

  const [mounted, setMounted] = useState(false);
  const [dinners, setDinners] = useLocalStorage(MUNCH, new Array<Dinner>());
  const [selectedMenu, setSelectedMenu] = useLocalStorage(SELECTED, "");

  const createMealPlans = () => props.eaters.map((eater: Eater) => ({ eater, meal: { name: '' } }));

  const compileList = (startDate: Date, newDiary: Array<Dinner>) => {
    const now = new Date();
    const aWeekFromNow = now.getTime() + (DAY_IN_SECONDS * 7)
    let x = 1;
    let nextDate = startDate;
    while (aWeekFromNow > nextDate.getTime()) {
      const extra = DAY_IN_SECONDS * x;
      nextDate = new Date(startDate.getTime() + extra);
      newDiary.push({ date: nextDate, guests: createMealPlans() });
      x = x + 1;
    }
    setDinners([...newDiary]);
  };

  const clicked = (dinnerIndex: number, guestIndex: number) => {
    const blank = dinners[dinnerIndex].guests[guestIndex].meal.name.trim().length == 0;
    if (!blank || selectedMenu.trim().length == 0) {
      return;
    }
    updated(dinnerIndex, guestIndex, selectedMenu);
  }

  const updated = (dinnerIndex: number, guestIndex: number, mealName: string) => {
    const newMenu = dinners.map((dinner: Dinner, di: number) => {
      if (dinnerIndex != di) {
        return dinner;
      }
      const meals = dinner.guests.map((mealPlan: MealPlan, gi: number) => {
        if (guestIndex != gi) {
          return mealPlan;
        }
        mealPlan.meal.name = mealName;
        return mealPlan;
      });
      dinner.guests = [...meals];
      return dinner;
    });
    setDinners([...newMenu]);
  }

  useEffect(() => {
    const startDate = (dinners.length == 0)
      ? new Date(new Date().getTime() - DAY_IN_SECONDS)
      : new Date(dinners[dinners.length - 1].date);
    compileList(startDate, dinners);
    setMounted(true);
  }, []);

  return (
    <div className="w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      {mounted && <div className='grid grid-cols-4'>
        <h2><b>Date</b></h2>
        {props.eaters.map((eater: Eater) => (
          <h2 key={eater.name}>
            <b>{eater.name}</b>
          </h2>
        ))}
        {dinners && dinners.map((dinner: Dinner, i: number) => (
          <DinnerForm key={i} dinner={dinner}
            clicked={(gi: number) => clicked(i, gi)}
            updated={(gi: number, text: string) => updated(i, gi, text)}></DinnerForm>
        ))}
      </div>}
    </div>
  )
}

export default Diary