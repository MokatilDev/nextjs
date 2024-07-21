"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/auth/Input";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginUser, loginWithGithub, loginWithGoogle } from "../actions";
import toast from "react-hot-toast"
import { useRouter } from "next/navigation";
import { auth } from "@/auth";

const RegisterPage = () => {
  const router = useRouter()

  const signinSchema = z.object({
    email: z.string().trim().min(1, { message: "Email is required" }).email({ message: "Invalid emaill" }),
    password: z.string().min(1, { message: "Password is required" })
  })

  type ISignup = z.infer<typeof signinSchema>;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ISignup>({
    mode: "onChange",
    resolver: zodResolver(signinSchema)
  });

  const onSubmit: SubmitHandler<ISignup> = async ({ email, password }: ISignup) => {
    const formData = new FormData();

    formData.append("email", email)
    formData.append("password", password)

    const loading = toast.loading("Logging...")
    const error = await loginUser(formData)
    toast.dismiss(loading)

    if (error?.error) {
      toast.error(error.error);
    } else {
      toast.success("User has been logging")
      reset()
      router.push("/")
    }
  }

  return (
    <main className="flex flex-col  items-center justify-center">
      <div className="min-w-[370px] w-full">
        <h1 className="text-3xl font-semibold">Welcome Back Again</h1>
        <p className="text-gray-200 mt-1">Please provide all the necessary information</p>
      </div>

      <form className="flex flex-col justify-center max-w-[400px] w-full" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input id="email" type="email" placeholder="Enter your email address" label="Email" register={register("email")} error={errors.email?.message} />
        {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}

        <Input id="password" type="password" placeholder="Enter your password" label="Password" register={register("password")} error={errors.password?.message} />
        {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>}

        <button disabled={isSubmitting} type="submit" className={"bg-white text-black rounded py-2 mt-5 text-lg font-semibold flex justify-center items-center"}>
          Login
        </button>
      </form>

      <div className="flex w-full gap-3 mt-3 justify-center items-center">
        <div className="border-t border-main flex-grow"></div>
        <p className="font-medium">Or Sign In With</p>
        <div className="border-t border-main flex-grow"></div>
      </div>

      <div className="flex gap-4 w-full px-5 mt-3 text-black flex-col">

        <form action={async () => {
          await loginWithGithub()
        }} className="w-full">
          <button className="bg-[#181818] text-white rounded-full flex justify-center items-center gap-2 py-2 w-full">
            <FaGithub size={35} height={35} />
            <span className="text-base font-medium">Sign In with Github</span>
          </button>
        </form>


        <form action={async () => {
          await loginWithGoogle()
        }} className="w-full">
          <button className="bg-white rounded-full flex justify-center items-center gap-2 py-2 w-full">
            <FcGoogle height={35} size={35} />
            <span className="text-base font-semibold">Sign In with Google</span>
          </button>
        </form>

      </div>

      <p className="mt-2 text-base text-gray-200">
        Don&apos;t have account?
        <Link href={"/register"} className="text-white font-semibold ml-1 underline">Register</Link>
      </p>
    </main>
  )
}

export default RegisterPage