import { auth } from "@/auth"
import Link from "next/link"

const Home = async() => {

  const session = await auth();

  console.log(session)

  if(session){
    return <h1 className="text-xl font-bold">Welcome {session.user?.name}</h1>
  }

  

  return (
    <main className="flex min-h-screen justify-center items-center flex-col">
      <h1 className="text-3xl font-semibold">Welcome to ByteBlogger</h1>

      <div className="flex justify-center items-center gap-3 w-full">
        <Link href={"/login"}>
          <button className="bg-white text-black rounded py-2 px-5 mt-5 text-lg font-semibold w-full">
            Login
          </button>
        </Link>
        <Link href={"/login"}>
          <button className="bg-white text-black rounded py-2 px-5 mt-5 text-lg font-semibold w-full">
            Register
          </button>
        </Link>
      </div>
    </main>
  )
}

export default Home