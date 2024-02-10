import { ChangeEvent } from "react";

type Props = { id: string, name: string, qty: number, updateName: Function, updateQty: Function };

const IngredientInput = (props: Props) => {


    return (
        <div key={"ingredients-" + props.id} className='grid grid-cols-2 gap-2'>
            <input className="rounded p-1"
                onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateName(e.target.value)}
                defaultValue={props.name}
                key={"ingredient-input" + props.id}
                id={"ingredient-input" + props.id}
                placeholder="Ingredient"></input>
            <input className="rounded p-1"
                onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateQty(e.target.value)}
                defaultValue={props.qty}
                type="number"
                key={"qty-input" + props.id}
                id={"qty-input" + props.id}
                placeholder="Qty"></input>
        </div>
    )
}

export default IngredientInput;