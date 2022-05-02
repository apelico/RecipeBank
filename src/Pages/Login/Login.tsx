import './Login.css'
import { useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

import { userContext } from '../../Context'
import { Alert, Button, Form, Modal } from 'react-bootstrap';

interface ILogin {
  username: string;
  password: string;
}

export default function Login() {
  const { setUsername } = useContext(userContext)

  const navigate = useNavigate()
  const [inputs, setInputs] = useState<ILogin>({ username: '', password: '' })
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
      body: JSON.stringify({ username: inputs.username, password: inputs.password })
    }).then(response => response.json()).then(data => {
      if (data === "Incorrect Password") {
        setError(data);
        return;
      }

      if (data === "Invalid User") {
        setError("User does not exist");
        return;
      }

      setUsername(data)
      navigate('/')
    })
  }

  function ShowError() {
    if (error === "") return;

    return (
      <Alert variant="danger" onClose={() => setError("")} dismissible>
        <Alert.Heading>{error}</Alert.Heading>
      </Alert>
    )
  }

  return (
    <form className='login' onSubmit={login}>

      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        {ShowError()}
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control name="username" onChange={onChange} type="text" placeholder="Username" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control name="password" type="password" placeholder="Password" required onChange={onChange} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>{' '}
          <Button href="/register" variant="primary" type="submit">
            Register
          </Button>
        </Modal.Body>

      </Modal.Dialog>
    </form>
  )
}
