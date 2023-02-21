import { useState, useEffect, useRef } from 'react';
import { Row, Form, Button, Container, InputGroup } from 'react-bootstrap';
import '../ComponentsStyle/login.css';
import { useNavigate } from "react-router-dom";

function Register(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('User');
    const [age, setAge] = useState('');
    const [city, setCity] = useState('');
    const [piva, setPiva] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [validated, setValidated] = useState(false);

    const types = ['User', 'Business'];

    let navigate = useNavigate();

    useEffect(() => {
        if (props.loggedIn) {
            navigate("/");
        }
    }, [props.loggedIn]);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            sendForm();
        }
        setValidated(true);
    };

    const sendForm = async () => {
        const newUser = {
            email: email,
            password: password,
            type: type,
        };

        if (type === 'User') {
            newUser.userInfo = {
                name: name,
                age: age,
                city: city,
                image: image
            }
            props.addUser(newUser)
        } else {
            newUser.businessInfo = {
                name: name,
                piva: piva,
                address: address,
                city: city,
                phone_number: phoneNumber,
                image: image
            }
            props.addUser(newUser);
        }

        setEmail('');
        setPassword('');
        setName('');
        setType('User');
        setAge('');
        setCity('');
        setPiva('');
        setAddress('');
        setPhoneNumber('');
        props.setLog(true);
    };

    let loadImageContent = (file, setImage) => {
        if (file !== undefined) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result)
            }
            reader.readAsDataURL(file);
        }
    };

    const hiddenFileInput = useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    return (
        <div id="login-form">
            <Row id="login-form-title">
                <h2>Register</h2>
            </Row>
            <Container className='scrollable-group-register'>
                <Form onSubmit={handleSubmit} noValidate validated={validated}>
                    <Form.Group controlId='username' className="login-form-row">
                        <Form.Label className='login-label'>Email</Form.Label>
                        <Form.Control className='login-input' required type='email' placeholder='Enter your email' value={email} onChange={ev => setEmail(ev.target.value)} />
                        <Form.Control.Feedback className='label-feedback' type="invalid">Please insert a email</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId='password' className="login-form-row">
                        <Form.Label className='login-label'>Password</Form.Label>
                        <Form.Control className='login-input' required type='password' placeholder='Enter your password' value={password} onChange={ev => setPassword(ev.target.value)} />
                        <Form.Control.Feedback className='label-feedback' type="invalid">Please insert a password</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId='type' className="login-form-radio">
                        <Form.Label className='login-label' >User Type:</Form.Label>
                        {types.map((p, i) => (
                            <Form.Check
                                inline="true"
                                key={i}
                                id={p}
                                type="radio"
                                name="user_type"
                                label={p}
                                value={p}
                                onClick={ev => setType(ev.target.value)}
                                defaultChecked={type === p}
                            />
                        ))}
                    </Form.Group>
                    {
                        type === 'User' &&
                        <>
                            <Form.Group controlId='name' className="login-form-row">
                                <Form.Label className='login-label'>Full Name</Form.Label>
                                <Form.Control className='login-input' required type='text' placeholder='Enter your full name' value={name} onChange={ev => {
                                    setName(ev.target.value)
                                }} />
                                <Form.Control.Feedback className='label-feedback' type="invalid">Please insert your full name</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId='age' className="login-form-row">
                                <Form.Label className='login-label'>Age</Form.Label>
                                <Form.Control className='login-input' required type='number' placeholder={23} value={age} onChange={ev => setAge(ev.target.value)} />
                                <Form.Control.Feedback className='label-feedback' type="invalid">Please insert your age</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId='city' className="login-form-row">
                                <Form.Label className='login-label'>City</Form.Label>
                                <Form.Control className='login-input' required type='text' placeholder='Enter your city' value={city} onChange={ev => setCity(ev.target.value)} />
                                <Form.Control.Feedback className='label-feedback' type="invalid">Please insert your city</Form.Control.Feedback>
                            </Form.Group>
                        </>
                    }
                    {
                        type === 'Business' &&
                        <>
                            <Form.Group controlId='name' className="login-form-row">
                                <Form.Label className='login-label'>Name</Form.Label>
                                <Form.Control className='login-input' required type='text' placeholder='Enter your name' value={name} onChange={ev => setName(ev.target.value)} />
                                <Form.Control.Feedback className='label-feedback' type="invalid">Please insert your company's name</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId='piva' className="login-form-row">
                                <Form.Label className='login-label'>P.IVA</Form.Label>
                                <Form.Control className='login-input' required type='text' placeholder='Enter your p.iva' value={piva} onChange={ev => setPiva(ev.target.value)} />
                                <Form.Control.Feedback className='label-feedback' type="invalid">Please insert your P.IVA</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId='address' className="login-form-row">
                                <Form.Label className='login-label'>Address</Form.Label>
                                <Form.Control className='login-input' required type='text' placeholder='Enter your address' value={address} onChange={ev => setAddress(ev.target.value)} />
                                <Form.Control.Feedback className='label-feedback' type="invalid">Please insert your address</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId='city' className="login-form-row">
                                <Form.Label className='login-label'>City</Form.Label>
                                <Form.Control className='login-input' required type='text' placeholder='Enter your city' value={city} onChange={ev => setCity(ev.target.value)} />
                                <Form.Control.Feedback className='label-feedback' type="invalid">Please insert your city</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId='phone-number' className="login-form-row">
                                <Form.Label className='login-label'>Phone Number</Form.Label>
                                <Form.Control className='login-input' required type='text' placeholder='Enter your phone number' value={phoneNumber} onChange={ev => setPhoneNumber(ev.target.value)} />
                                <Form.Control.Feedback className='label-feedback' type="invalid">Please insert your phone number</Form.Control.Feedback>
                            </Form.Group>
                        </>
                    }
                    <Form.Group controlId="image" className="login-form-row">
                        <Form.Label className='login-label'>Image</Form.Label>
                        <InputGroup className="new-image-input">
                            <Form.Control
                                className='new-image-input'
                                required
                                placeholder="Upload a file"
                                aria-label="image"
                                aria-describedby="basic-addon1"
                                onClick={handleClick}
                                value={imagePath.replaceAll("\\", "/").split("/").pop()}
                                onChange={() => { }}
                            />
                            <InputGroup.Text id="basic-addon1" className="upload-button" onClick={handleClick}>Upload</InputGroup.Text>
                            <Form.Control.Feedback className='label-feedback' type="invalid">Please insert an image</Form.Control.Feedback>
                        </InputGroup>
                        <Form.Control
                            required
                            type="file"
                            ref={hiddenFileInput}
                            onChange={(e) => {
                                setImagePath(e.target.value)
                                loadImageContent(e.target.files[0], setImage)
                            }
                            }
                        />
                        <Form.Control.Feedback className='label-feedback' type="invalid">Please insert an image</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group size="lg" className='login-form-row' id='button-container'>
                        <Button className="login-button" type='submit'>
                            Register
                        </Button>
                    </Form.Group>
                </Form>
            </Container>
        </div>
    )
};

export { Register };