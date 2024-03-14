
type Props = {
    select: Function,
    filterBy: string,
    name: string,
    rank: string | number;
    selected: boolean,
    deleteMeal: Function,
    key: string
}



const MenuLine = (props: Props) => {
    const start = props.name.indexOf(props.filterBy);
    const pre = props.filterBy ? props.name.substring(0, start) : '';
    const highlight = props.filterBy ? props.filterBy : props.name;
    const post = props.filterBy ? props.name.substring(props.filterBy.length + start, props.name.length) : '';
    return (
        <span className="grid grid-cols-[10fr,1fr,1fr]">
            <button key={'meal-name-' + props.key}
                onClick={() => props.select(props.name)}
                className={props.selected ? "text-start bg-sky-200" : "text-start hover:bg-sky-100"}>
                <div className="flex flex-row">
                    <div >{pre}</div>
                    <div className={props.filterBy ? " text-red-500 pl-0.5 pr-0.5" : ""}>{highlight}</div>
                    <div >{post}</div>
                </div>
            </button>
            <label key={'meal-name-rank-' + props.key}>{props.rank}</label>
            <button onClick={() => props.deleteMeal(props.name)} title="delete meal" className="pl-1 w-4 hover:bg-yellow-600
            focus:outline-none focus:ring hover:pr-0
           focus:ring-yellow-300 text-xs rounded-xl
             h-5 pt-0.5  ">X</button>
        </span>
    )
}

export default MenuLine;