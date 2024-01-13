"use client"
import { Dinner, MealPlan } from "../../types";

type Props = {
  dinner: Dinner,
  updated: Function
  clicked: Function
};

const DinnerForm = (props: Props) => {

  const date = new Date(props.dinner.date);
  const bold = date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
  const fade = date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  const className = bold ? 'font-extrabold pl-2' : fade ? 'font-thin pl-2 pt-1' : 'pl-2';

  return (
    <>
      <span className={className} key={"" + props.dinner.date}>{date.toDateString()}</span>
      {props.dinner.guests && props.dinner.guests.map((mealPlan: MealPlan, mpIndex: number) => (
        <input key={'menu-name-' + mpIndex}
          className={className}
          type="text"
          onClick={(e) => props.clicked(mpIndex)}
          onChange={(e) => props.updated(mpIndex, e.target.value)}
          defaultValue={mealPlan.meal.name} />
      ))}
    </>
  )
}

export default DinnerForm