import Link from "next/link"

const Home = () => {

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