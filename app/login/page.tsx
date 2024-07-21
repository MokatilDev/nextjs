import { Metadata } from 'next';
import React from 'react'
import LoginPage from './LoginForm';

export const metadata: Metadata = {
    title: "Login",
    description: "Login page",
};

const Register = () => {
    return (
        <>
            <LoginPage />
        </>
    )
}

export default Register