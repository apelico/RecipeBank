import './Register.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Form, Modal, Button, Alert } from 'react-bootstrap';

interface LoginInputs {
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

        if (inputs.password !== inputs.passwordConfirmation) {
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

    function ShowError() {
        if (error === "") return;

        return (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
                <Alert.Heading>{error}</Alert.Heading>
            </Alert>
        )
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Register</Modal.Title>
                    </Modal.Header>
                    {ShowError()}
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="First Name" name='firstName' required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Last Name" name='lastName' required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Email" name='email' required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" name='username' required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" name='password' required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label> ConfirmPassword</Form.Label>
                            <Form.Control type="password" placeholder="Password Confirmation" name='passwordConfirmation' required onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Register
                        </Button>
                    </Modal.Body>

                </Modal.Dialog>

            </Form>
        </>
    )
}
