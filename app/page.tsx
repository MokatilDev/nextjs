"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import { Roboto } from "next/font/google";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

const roboto = Roboto({ subsets: ["latin"], weight: "500" })

const Home = () => {

  const signinSchema = z.object({
    email: z.string().email().min(1, { message: "Email is required" }),
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 charaters" }),
    bio: z.string().min(1, { message: "Bio is required" })
  })
  type ISignup = z.infer<typeof signinSchema>;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ISignup>({
    mode: "onChange",
    resolver: zodResolver(signinSchema)
  });


  const onSubmit: SubmitHandler<ISignup> = (data: ISignup) => {
    const userInfo = {
      email: data.email
    }
  }

  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <form className="flex flex-col justify-center max-w-[350px] w-full" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email" className="text-lg">Email</label>
        <input
          {...register("email")}
          type="text" id="email" placeholder="Email address..."
          className=" bg-dark rounded border border-main placeholder:text-[#242424] py-2 px-3 text-lg"
        />

        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <label htmlFor="username" className="text-lg mt-3">Username</label>
        <input
          {...register("username")}
          type="text" id="username" placeholder="Enter your username..."
          className=" bg-dark rounded border border-main placeholder:text-[#242424] py-2 px-3 text-lg"
        />

        {errors.username && <p className="text-red-500">{errors.username.message}</p>}

        <label htmlFor="password" className="text-lg mt-3">Password</label>
        <input
          {...register("password")}
          type="text" id="password" placeholder="Create strong password..."
          className=" bg-dark rounded border border-main placeholder:text-[#242424] py-2 px-3 text-lg"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <label htmlFor="bio" className="text-lg mt-3">Bio</label>
        <textarea
          {...register("bio")}
          id="bio" placeholder="Write your bio..."
          className=" bg-dark rounded border border-main placeholder:text-[#242424] py-2 px-3 text-lg h-[140px]"
        />

        {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}

        <button disabled={isSubmitting} type="submit" className={roboto.className + " bg-white text-black rounded py-2 mt-7 text-lg"}>
          Sign Up
        </button>
      </form>
    </main>
  )
}

export default Home