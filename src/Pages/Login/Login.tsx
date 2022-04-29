import './Login.css'
import { useState, useContext } from 'react'
import { NavLink,useNavigate } from 'react-router-dom';

import { userContext } from '../../Context'

interface Login{
    username: string;
    password: string;
}

export default function Login() {
    const {setUsername} = useContext(userContext)

    const navigate = useNavigate()
    const [inputs, setInputs] = useState<Login>({username: '', password: ''})
    const [error, setError] = useState<string>("")

    //Is used to set the values based from form.
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError("")
        setInputs({ ...inputs, [event.target.name]: event.target.value });
    };

    //Post '/api/login' with email and password input and server returns cookie with token.
    const login = (e: React.FormEvent) => {
        e.preventDefault();

        fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', "Access-Control-Allow-Credentials": 'true' },
          body: JSON.stringify({username: inputs.username, password: inputs.password})
        }).then(response => response.json()).then(data => {
          if(data === "Incorrect Password"){
            setError(data);
            return;
          }

          if(data === "Invalid User"){
            setError("User does not exist");
            return;
          }

          setUsername(data)
          //navigate('/')
        })
    }

    return (
        <form className='login' onSubmit={login}>
            <p>Login</p>
            <input type="text" name="username" required onChange={onChange} placeholder='Username' />
            <input type="password" name="password" required onChange={onChange} placeholder='Password' />
            <span>{error}</span>
            <input type='submit' value="Login" />
            <NavLink to='/register'>Register</NavLink>
        </form>
    )
}
