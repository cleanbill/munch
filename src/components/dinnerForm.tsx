"use client"
import { ChangeEvent } from "react";
import { Dinner, MealPlan, SELECTED_DATE_INDEX } from "../../types";
import { useLocalStorage } from "usehooks-ts";

type Props = {
  dinner: Dinner,
  index: number,
  updated: Function
  clicked: Function
  clear: Function
};

const DinnerForm = (props: Props) => {

  const [selectedDateIndex, setSelectedDateIndex] = useLocalStorage(SELECTED_DATE_INDEX, -1);

  const date = new Date(props.dinner.date);
  const bold = date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
  const fade = date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  const standardClass = 'pl-2 w-11/12';
  const className = bold ? 'font-extrabold ' + standardClass : fade ? 'font-thin ' + standardClass : standardClass;
  // @ts-ignore
  let timer = null;
  const dateClassSmall = props.index == selectedDateIndex
    ? className + "text-start bg-sky-200 text-left lg:hidden sm:block"
    : className + " text-start hover:bg-sky-100 lg:hidden sm:block";
  const dateClassLarge = props.index == selectedDateIndex
    ? className + "text-start bg-sky-200 text-left sm:hidden lg:block"
    : className + " text-start hover:bg-sky-100 sm:hidden lg:block";

  const clear = (mpIndex: number) => {
    const el = document.getElementById('menu-name-' + mpIndex + "-" + props.index) as HTMLInputElement;
    el.value = '';
    props.clear(mpIndex);
  }

  const update = (mpIndex: number, e: ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    clearTimeout(timer);
    timer = setTimeout(function () {
      props.updated(mpIndex, e.target.value);
    }, 3000);
  }

  const select = () => {
    if (props.index == selectedDateIndex) {
      setSelectedDateIndex(-1);
    } else {
      setSelectedDateIndex(props.index);
    }
  }

  const dateRender = (date: Date, small = false) => {
    if (!small) {
      return date.toDateString().substring(0, 10);
    }

    const options = {
      weekday: "short",
      day: "numeric",
    };
    // @ts-ignore
    const output = new Intl.DateTimeFormat('en-GB', options).format(date);// Should use react-intl
    return output;
  }

  return (
    <>
      {/* <button onClick={() => select()} className={dateClassSmall} key={"" + props.dinner.date}>{dateRender(date, true)}</button> */}
      <button onClick={() => select()} className={dateClassLarge} key={"" + props.dinner.date}>{dateRender(date)}</button>
      {props.dinner.guests && props.dinner.guests.map((mealPlan: MealPlan, mpIndex: number) => (
        <span key={'mealPlan-' + mealPlan.meal.name + '-' + mpIndex}>
          <input key={'menu-name-' + mpIndex + "-" + props.index}
            id={'menu-name-' + mpIndex + "-" + props.index}
            className={className}
            type="text"
            onClick={(e) => props.clicked(mpIndex)}
            onChange={(e) => update(mpIndex, e)}
            defaultValue={mealPlan.meal.name} />
          <button className='float-right pr-1 w-4 hover:bg-yellow-600
            focus:outline-none focus:ring hover:pr-0
           focus:ring-yellow-300 text-xs rounded-xl
             h-5 pt-0.5  ' onClick={(e) => clear(mpIndex)}>X</button>
        </span>
      ))}
    </>
  )
}

export default DinnerForm