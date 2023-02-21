import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Form, Button, Col, InputGroup } from 'react-bootstrap';
import '../ComponentsStyle/newVoucher.css';
import interestsAPI from '../API/interestsAPI';
import dayjs from 'dayjs';
import vouchersAPI from '../API/vouchersAPI';
import { FeedbackPopup } from './FeedBackPopup.js';

function NewVoucherPage(props) {

    const [title, setTitle] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [interest, setInterest] = useState('Art');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [allInterests, setAllInterests] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [message, setMessage] = useState("");
    const [validated, setValidated] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const getAllInterests = async () => {
            try {
                const res = await interestsAPI.getAllInterests();
                setAllInterests(res);
            } catch (err) {
                console.log(err);
            }
        };
        getAllInterests();
    }, []);

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
        const voucher = {
            title: title,
            creation_date: dayjs().format('YYYY-MM-DD'),
            expiration_date: dayjs(expirationDate).format('YYYY-MM-DD'),
            interest_id: allInterests.filter(i => i.name === interest)[0].id,
            quantity: Number(quantity),
            image: image,
            image_path: imagePath
        };

        try {
            await vouchersAPI.newVoucher(voucher);
            setMessage("The voucher has been correctly created");
            setShowFeedback(true);
        } catch (err) {
            //toast.error("Username and/or password wrong. Try again.", { position: "top-center" }, { toastId: 2 });
        }
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
        <div id="new-voucher-form">
            <Row id="new-voucher-form-title">
                <h2>Add new voucher</h2>
            </Row>
            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group controlId='title' className="new-voucher-form-row">
                    <Form.Label className='new-voucher-label'>Title</Form.Label>
                    <Form.Control className='new-voucher-input' required type='text' placeholder='Enter a title' value={title} onChange={ev => setTitle(ev.target.value)} />
                    <Form.Control.Feedback className='label-feedback' type="invalid">Please insert a title</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId='expiration-date' className="new-voucher-form-row">
                    <Form.Label className='new-voucher-label'>Expiration date</Form.Label>
                    <Form.Control className='new-voucher-input' required type='date' min={new Date().toISOString().slice(0, 10)} placeholder='Enter the expiration date' value={expirationDate} onChange={ev => setExpirationDate(ev.target.value)} />
                    <Form.Control.Feedback className='label-feedback' type="invalid">Please insert an expiration date</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="new-voucher-form-row">
                    <Form.Label className='new-voucher-label'>Interest</Form.Label>
                    <Form.Select
                        id="select-interest"
                        className='new-voucher-input'
                        onChange={(e) => { setInterest(e.target.value) }}
                        defaultValue="Art"
                    >
                        {allInterests.sort((a, b) => a.name.trim().localeCompare(b.name.trim())).map((p, i) => (
                            <option key={p.id} value={p.name}>
                                {p.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId='quantity' className="new-voucher-form-row">
                    <Form.Label className='new-voucher-label'>Quantity</Form.Label>
                    <Form.Control className='new-voucher-input' required type='number' placeholder={1} value={quantity} onChange={ev => setQuantity(ev.target.value)} />
                    <Form.Control.Feedback className='label-feedback' type="invalid">Please insert a quantity</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="image" className="new-voucher-form-row">
                    <Form.Label className='new-voucher-label'>Image</Form.Label>
                    <InputGroup className="new-image-input">
                        <Form.Control
                            className='new-image-input'
                            required
                            placeholder="Upload a file"
                            aria-label="image"
                            aria-describedby="basic-addon1"
                            onClick={handleClick}
                            value={imagePath.replaceAll("\\", "/").split("/").pop()}
                            onChange={(ev) => { setImage(ev.target.value) }}
                        />
                        <InputGroup.Text id="basic-addon1" className="upload-button" onClick={handleClick}>Upload</InputGroup.Text>
                        <Form.Control.Feedback className='label-feedback' type="invalid">Please insert an image</Form.Control.Feedback>
                    </InputGroup>
                    <Form.Control
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
                <Form.Group size="lg" className='new-voucher-form-row' id='button-container'>
                    <Row>
                        <Col>
                            <Button className="new-voucher-button" type='submit'>
                                Add
                            </Button>
                        </Col>
                        <Col>
                            <Button className="new-voucher-button" onClick={() => { navigate("/my-vouchers") }}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
            <FeedbackPopup navigation={"/my-vouchers"} message={message} setShowFeedback={setShowFeedback} showFeedback={showFeedback} />
        </div>
    )
}

export { NewVoucherPage };