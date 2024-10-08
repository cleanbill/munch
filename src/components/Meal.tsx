import { useLocalStorage } from "usehooks-ts";
import { INGREDIENTS, IngredientQty, MEAL_INGREDIENTS, MealIngredients, SELECTED_MEAL } from "../data/types";

type Props = {
    name: string
    index: number
}

const Meal = (props: Props) => {
    const [mealIngredients, _setMealIngredients] = useLocalStorage(MEAL_INGREDIENTS, Array<MealIngredients>());
    const [selectedMeal, setSelectedMeal] = useLocalStorage(SELECTED_MEAL, "");
    const [_ingredients, setIngredients] = useLocalStorage(INGREDIENTS, new Array<IngredientQty>);

    const meal = mealIngredients.find((m: MealIngredients) => m.meal.name == props.name);

    const select = () => {
        if (meal) {
            setIngredients(meal.ingredients);
        }
        if (selectedMeal == props.name) {
            setSelectedMeal("");
        } else {
            setSelectedMeal(props.name);
        }
    };

    const className = 'pl-2 pr-10';
    const mealClass = props.name == selectedMeal
        ? className + "text-start bg-sky-200 text-left"
        : className + " text-start hover:bg-sky-100";


    return (
        <div><button onClick={() => select()} className={mealClass} key={'meal-' + props.index}>{props.name}</button></div>
    )
}
export default Meal;