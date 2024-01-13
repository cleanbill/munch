import Diary from "@/components/diary"
import Menu from "@/components/menu"

const eaters = [{ name: 'The Olds' }, { name: 'Cory' }, { name: 'Finn' }]

export default function Home() {
  return (
    <main className="items-center justify-between p-4">
      <h1 className='p-10 text-6xl font-thin'>MUNCH</h1>
      <div className="grid grid-cols-[7fr,3fr]">
        <Diary eaters={eaters}></Diary>
        <Menu></Menu>
      </div>
    </main >
  )
}
