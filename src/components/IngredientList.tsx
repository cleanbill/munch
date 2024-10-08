import { IngredientQty } from "../data/types";
import IngredientItem from "./ingredientItem";

type Props = {
    ingredients: IngredientQty[],
}

const IngredientList = (props: Props) => {

    return (
        <div className=" text-zinc-500 grid gap-1 grid-cols-[10fr,1fr,1fr]">
            {props.ingredients.filter((ing: IngredientQty) => ing.ingredient.name)
                .map((ing: IngredientQty, i: number) =>
                    <IngredientItem key={'ingred-qty-' + i} id={'ingred-list-' + i} ingredient={ing}></IngredientItem>
                )}
        </div>
    )
}
export default IngredientList;