import './Register.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface LoginInputs{
    firstName: string;
    lastName: string;
    email: string;
    username: string
    password: string;
    passwordConfirmation: string;
}

export default function RegisterPage() {
    const [inputs, setInputs] = useState<Partial<LoginInputs>>({})
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value });
    };

    //Posts to '/api/registerUser' with form information and tests if user exists and returns either 201 for OK or 409 if user exists.
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if(inputs.password !== inputs.passwordConfirmation){
            setError("Password does not match")
            return;
        }

        fetch('/api/registerUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputs),
        }).then(response => response.json()).then(data => {
            const storedData = data;

            if (storedData == "Already Exists") {
                setError("User already exists.")
                return;
            }

            navigate("/login")
        })
    }

    return (
        <form className='register' autoComplete='off' onSubmit={handleSubmit}>
            <p>Register</p>
            <input type="text" name='firstName' required onChange={handleChange} placeholder='First name' />
            <input type="text" name='lastName' required onChange={handleChange} placeholder='Last name' />
            <input type="email" name='email' required onChange={handleChange} placeholder='Email' />
            <input type="text" name='username' required onChange={handleChange} placeholder='Username' />
            <input type="password" name='password' required onChange={handleChange} placeholder='Password' />
            <input type="password" name='passwordConfirmation' required onChange={handleChange} placeholder='Confirm Password' />
            <span>{error}</span>
            <input type='submit' />
        </form>
    )
}
