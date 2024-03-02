
type Props = {
    index: number,
    select: Function,
    name: string | number,
    rank: string | number;
    selected: boolean,
    deleteMeal: Function,
}

const MenuLine = (props: Props) => (
    <>
        <button key={'meal-name-' + props.index}
            onClick={() => props.select(props.index, props.name)}
            className={props.selected ? "text-start bg-sky-200" : "text-start hover:bg-sky-100"}>{props.name}</button>
        <span className="grid grid-cols-2">
            <label key={'meal-name-rank-' + props.index}>{props.rank}</label>
            <button onClick={() => props.deleteMeal(props.name)} title="delete meal" className="pl-1 w-4 hover:bg-yellow-600
            focus:outline-none focus:ring hover:pr-0
           focus:ring-yellow-300 text-xs rounded-xl
             h-5 pt-0.5  ">X</button>
        </span>
    </>
)

export default MenuLine;