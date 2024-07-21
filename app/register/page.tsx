import { Metadata } from 'next';
import React from 'react'
import RegisterPage from './RegisterForm'

export const metadata: Metadata = {
    title: "Login",
    description: "Login page",
};

const Register = () => {
    return (
        <>
            <RegisterPage />
        </>
    )
}

export default Register