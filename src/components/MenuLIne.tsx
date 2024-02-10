
type Props = {
    index: number,
    select: Function,
    name: string | number,
    rank: string | number;
    selected: boolean
}

const MenuLine = (props: Props) => (
    <>
        <button key={'meal-name-' + props.index}
            onClick={() => props.select(props.index, props.name)}
            className={props.selected ? "text-start bg-sky-200" : "text-start hover:bg-sky-100"}>{props.name}</button>
        <label key={'meal-name-rank-' + props.index}>{props.rank}</label>
    </>
)

export default MenuLine;