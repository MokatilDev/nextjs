"use client"

import { UseFormRegisterReturn } from "react-hook-form"

interface InputProps {
    type: string,
    placeholder: string,
    label: string,
    id: string
    register: UseFormRegisterReturn<string>,
    error?: string
}

const Input = ({ type, id, placeholder, register, label, error }: InputProps) => {
    const baseClasses = "bg-dark rounded placeholder:text-[#242424] py-2 px-3 text-lg";
    const errorClasses = error ? " border border-red-500 focus:ring-4 focus:ring-red-500/30" : "border border-main focus:ring-4 focus:border-white focus:ring-white/10"

    return (
        <>
            <label htmlFor={id} className="text-base mt-3 mb-2">{label}</label>
            <input
                {...register}
                formNoValidate
                required
                type={type} id={id} placeholder={placeholder}
                className={`${baseClasses} ${errorClasses}`}
            />
        </>
    )
}

export default Input