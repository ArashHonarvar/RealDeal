import { useState } from 'react';
import { Row, Form, Button, Alert, } from 'react-bootstrap';
import '../ComponentsStyle/login.css';
import { useNavigate, Link } from "react-router-dom";

function Login(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);

    let navigate = useNavigate();

    const handleSubmit = (event) => {
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			event.preventDefault();
			const credentials = { username, password };
            props.login(credentials);
		}
		setValidated(true);
	};

    return (
        <>
            <Alert className="login-alert" variant="danger" show={props.show} onClose={() => props.setShow(false)} dismissible>{props.errMessage}</Alert>
            <div id="login-form">
                <Row id="login-form-title">
                    <h2>Login</h2>
                </Row>
                <Form onSubmit={handleSubmit} noValidate validated={validated}>
                    <Form.Group controlId='username' className="login-form-row">
                        <Form.Label className='login-label'>Username</Form.Label>
                        <Form.Control className='login-input' required type='email' placeholder='Enter your username' value={username} onChange={ev => setUsername(ev.target.value)} />
                        <Form.Control.Feedback className='label-feedback' type="invalid">Please insert a valid username</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId='password' className="login-form-row">
                        <Form.Label className='login-label'>Password</Form.Label>
                        <Form.Control className='login-input' required type='password' placeholder='Enter your password' value={password} onChange={ev => setPassword(ev.target.value)} />
                        <Form.Control.Feedback className='label-feedback' type="invalid">Please insert a password</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group size="lg" className='login-form-row' id='button-container'>
                        <Button className="login-button" type='submit'>
                            Login
                        </Button>
                    </Form.Group>
                    <Row id="or">
                        <h2>OR</h2>
                    </Row>
                    <Form.Group size="lg" className='login-form-row' id='button-container'>
                        <Button className="login-button" onClick={() => { navigate("/register") }}>
                            Register
                        </Button>
                    </Form.Group>
                    <Form.Group size="lg" className='login-form-row' style={{ marginBottom: '10%' }}>
                        <Link to="/about-us">About us</Link>
                    </Form.Group>
                </Form>
            </div>
        </>
    )
};

export { Login };


