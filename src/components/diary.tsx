"use client"
import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import { Eater, MUNCH, Dinner, SELECTED_MEAL, MealPlan } from "../data/types";
import DinnerForm from "./dinnerForm";

// @ts-ignore
let timer = null;

const DAY_IN_SECONDS = 86400000;
const DAYS_QTY = 9;

type Props = { eaters: Array<Eater> };

const Diary = (props: Props) => {

  const [mounted, setMounted] = useState(false);
  const [dinners, setDinners] = useLocalStorage(MUNCH, new Array<Dinner>());
  const [selectedMeal, setSelectedMeal] = useLocalStorage(SELECTED_MEAL, "");

  const createMealPlans = () => props.eaters.map((eater: Eater) => ({ eater, meal: { name: '' } }));

  const compileList = (startDate: Date, dinnerListWithDataInCorrectFormat: Array<Dinner>) => {
    const now = new Date();
    const aWeekFromNow = now.getTime() + (DAY_IN_SECONDS * DAYS_QTY)
    let x = 1;
    let nextDate = startDate;
    while (aWeekFromNow > nextDate.getTime()) {
      const extra = DAY_IN_SECONDS * x;
      nextDate = new Date(startDate.getTime() + extra);
      dinnerListWithDataInCorrectFormat.push({ date: nextDate, guests: createMealPlans() });
      x = x + 1;
    }
    setDinners([...dinnerListWithDataInCorrectFormat]);
  };

  const clicked = (dinnerIndex: number, guestIndex: number) => {
    const blank = dinners[dinnerIndex].guests[guestIndex].meal.name.trim().length == 0;
    if (!blank || selectedMeal.trim().length == 0) {
      return;
    }
    updated(dinnerIndex, guestIndex, selectedMeal);
    // @ts-ignore
    clearTimeout(timer);
    timer = setTimeout(function () {
      setSelectedMeal("");
    }, 3000);
  }

  const clear = (dinnerIndex: number, guestIndex: number) => {
    updated(dinnerIndex, guestIndex, "");
  }

  const A_DAY = (1000 * 60 * 60 * 24);
  const truncateData = (fullList: Dinner[]): Dinner[] => {
    const today = new Date().getTime();
    const ageLimit = today - (A_DAY * 254);
    const smaller = fullList.filter((dinner: Dinner) => {
      const date = new Date(dinner.date);
      return date.getTime() > ageLimit;
    });
    return smaller;
  }

  const updated = (dinnerIndex: number, guestIndex: number, mealName: string) => {
    const dinnerListWithExtraNewMenuDate = dinners.map((dinner: Dinner, di: number) => {
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
    const smaller = truncateData(dinners);
    setDinners([...smaller]);
  }

  useEffect(() => {
    const startDate = (dinners.length == 0)
      ? new Date(new Date().getTime() - DAY_IN_SECONDS)
      : new Date(dinners[dinners.length - 1].date);
    compileList(startDate, dinners);
    setMounted(true);
  }, []);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayTime = yesterday.getTime();
  const relevantDinners = dinners?.filter((dinner: Dinner) => new Date(dinner.date).getTime() > yesterdayTime);
  const offSet = dinners.length - relevantDinners.length;

  return (
    <div className="section-card">
      {mounted && <div className='grid lg:grid-cols-[2fr,4fr,4fr,4fr] sm:grid-cols-2'>
        <h2 className="max-sm:hidden"><b>Date</b></h2>
        {props.eaters.map((eater: Eater, i: number) => (
          <h2 className="max-sm:hidden mb-2 font-bold dark:text-white" key={eater.name + '-' + i}>
            {eater.name}
          </h2>
        ))}
        {relevantDinners?.map((dinner: Dinner, i: number) => (
          <DinnerForm key={'dinnerDate-' + (i + offSet)} dinner={dinner}
            index={i + offSet}
            clicked={(gi: number) => clicked(i + offSet, gi)}
            clear={(gi: number) => clear(i + offSet, gi)}
            updated={(gi: number, text: string) => updated(i + offSet, gi, text)}></DinnerForm>
        ))}
      </div>}
    </div>
  )
}

export default Diary