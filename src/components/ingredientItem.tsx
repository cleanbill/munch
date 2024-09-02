import { useState } from "react";
import { IngredientQty } from "../data/types";

type Props = { id: string, ingredient: IngredientQty };

const IngredientItem = (props: Props) => {

    const [crossed, setCrossed] = useState(false);

    const onChange = () => {
        setCrossed(!crossed);
    }

    return (
        <>
            <div className={crossed ? 'line-through' : ''} key={'name-' + props.id}>{props.ingredient.ingredient.name}</div>
            {props.ingredient.qty > 0 && <div className={crossed ? 'line-through' : ''} key={'qty-' + props.id}>{props.ingredient.qty}</div>}
            {props.ingredient.qty < 1 && <div></div>}
            <input onClick={onChange} type='checkbox'></input>
        </>
    )
}

export default IngredientItem;