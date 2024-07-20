"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/auth/Input";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginWithGithub, loginWithGoogle, registerUser } from "@/app/actions";
import toast from "react-hot-toast"
import { ERROR_TYPES } from "@/types/errors";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
    const router = useRouter();

    const signinSchema = z.object({
        email: z.string().trim().min(1, { message: "Email is required" }).email({ message: "Enter valid email" }),
        username: z.string().min(1, { message: "Username is required" })
            .regex(/^(?!.*\s)[a-zA-Z0-9_-]{4,20}$/, { message: "Username must be between 4 and 20 characters, and not contain any special characters" }),
        password: z.string().min(1, { message: "Password is required" })
            .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,25}$/,
                { message: "Password must be between 8-25 characters , include at least one uppercase letter, one number, and one special character ( @ # $ % . ^ & * )" }
            ),
        confirmPassword: z.string().min(1, { message: "Confirm Password is required" })
    }).refine((data) => data.password === data.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] })

    type ISignup = z.infer<typeof signinSchema>;

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setError } = useForm<ISignup>({
        mode: "onChange",
        resolver: zodResolver(signinSchema)
    });

    const onSubmit: SubmitHandler<ISignup> = async ({ email, password, username }: ISignup) => {
        const formData = new FormData();

        formData.append("email", email);
        formData.append("password", password);
        formData.append("username", username);

        const loadingState = toast.loading("Registering...")
        const res = await registerUser(formData);
        toast.dismiss(loadingState)
        if (res.error) {
            toast.error(res.error)
            switch (res.errorType) {
                case ERROR_TYPES.DUBLICATE_EMAIL:
                    return setError("email", { message: res.error });
                case ERROR_TYPES.DUBLICATE_USERNAME:
                    return setError("username", { message: res.error });
            }
        }
        router.push("/login")
        toast.success("User has been successfully registered")
        reset()
    }

    return (
        <main className="flex flex-col  items-center justify-center ">
            <div className="min-w-[370px] w-full">
                <h1 className="text-3xl font-semibold">Welcome to ByteBlogger</h1>
                <p className="text-gray-200 mt-1">Please provide all the necessary information</p>
            </div>

            <form className="flex flex-col justify-center max-w-[400px] w-full" onSubmit={handleSubmit(onSubmit)}>
                <Input id="email" type="email" placeholder="Enter your email address" label="Email" register={register("email")} error={errors.email?.message} />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}

                <Input id="username" type="text" placeholder="Enter your username" label="Username" register={register("username")} error={errors.username?.message} />
                {errors.username && <p className="text-red-500 text-sm mt-2">{errors.username.message}</p>}

                <Input id="password" type="password" placeholder="Create a strong password" label="Password" register={register("password")} error={errors.password?.message} />
                {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>}

                <Input id="confirmPassword" type="password" placeholder="Confirme password" label="Confirme Password" register={register("confirmPassword")} error={errors.confirmPassword?.message} />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword.message}</p>}

                <button disabled={isSubmitting} type="submit" className={"bg-white text-black rounded py-2 mt-5 text-lg font-semibold flex justify-center items-center"}>
                    Sign Up
                </button>
            </form>

            <div className="flex w-full gap-3 mt-3 justify-center items-center">
                <div className="border-t border-main flex-grow"></div>
                <p className="font-medium">Or Sign Up With</p>
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
                Already have an account?
                <Link href={"/login"} className="text-white font-semibold ml-1 underline">Login</Link>
            </p>
        </main>
    )
}

export default RegisterPage