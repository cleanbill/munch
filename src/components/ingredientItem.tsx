import { IngredientQty } from "../../types";

type Props = { id: string, ingredient: IngredientQty };

const IngredientItem = (props: Props) => {

    return (
        <>
            <div key={'name-' + props.id}>{props.ingredient.ingredient.name}</div>
            <div key={'qty-' + props.id}>{props.ingredient.qty}</div>
        </>
    )
}

export default IngredientItem;