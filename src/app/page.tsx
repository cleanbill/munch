import Diary from "@/components/diary"
import IngredientInputList from "@/components/ingredientInputList"
import Menus from "@/components/menus"
import ShoppingList from "@/components/shoppingList"

const eaters = [{ name: 'The Olds' }, { name: 'Cory' }, { name: 'Finn' }]

const getNextMidnightTime = () => {
  var midnight = new Date()
  midnight.setHours(24);
  midnight.setMinutes(0);
  midnight.setSeconds(0);
  midnight.setMilliseconds(0);

  return midnight.getTime()
}

const secondsToRefresh = () => {
  const now = new Date();
  const difference = getNextMidnightTime() - now.getTime();
  return difference;
}

export default function Home() {
  const wait = secondsToRefresh();
  setTimeout(function () {
    console.log('Woke up after ', wait);
    if (location) {
      location.reload();
    }
  }, wait);
  return (
    <main className="items-center justify-between p-4 text-indigo-700">
      <h1 title={'Refreshing in ' + wait + ' seconds'} className='p-10 text-6xl font-thin'>MUNCH....</h1>
      <div className="grid lg:grid-cols-[7fr,3fr] sm:grid-cols-1 gap-2">
        <div className="grid gap-2">
          <Diary eaters={eaters}></Diary>
          <IngredientInputList></IngredientInputList>
          <ShoppingList></ShoppingList>
        </div>
        <Menus></Menus>
      </div>
    </main >
  )
}
