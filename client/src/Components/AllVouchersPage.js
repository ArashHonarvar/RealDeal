import { useEffect, useState } from 'react';
import { Row, Image, Col, Container, Button, Modal, Form, Alert } from 'react-bootstrap';
import vouchersAPI from '../API/vouchersAPI';
import userAPI from '../API/userAPI';
import friendsAPI from '../API/friendsAPI';
import invitationsAPI from '../API/invitationsAPI';
import '../ComponentsStyle/allVouchers.css';
import { FeedbackPopup } from './FeedBackPopup.js';
import { useNavigate } from 'react-router-dom';

function AllVouchersPage(props) {

    const [vouchers, setVouchers] = useState([]);
    const [show, setShow] = useState(false);
    const [friend, setFriend] = useState("0");
    const [friendInfo, setFriendInfo] = useState(null);
    const [friends, setFriends] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState({});
    const [showFeedback, setShowFeedback] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleClose = () => {
        setShowAlert(false);
        setShow(false);
    }

    const handleShow = async (voucher) => {
        let friends = await friendsAPI.getFriendsByInterest(voucher.interest_id);
        setFriends(friends);
        setFriend("0");
        setSelectedVoucher(voucher);
        setShow(true);
    }
    const getUserInfo = async (id) => {
        if (id !== "0") {
            let user = await userAPI.getUserInfo(id);
            setFriendInfo(user);
        } else {
            setFriendInfo(null);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else if (friend === "0") {
            setMessage("Please select a friend!");
            setShowAlert(true);
        } else {
            let invitation = {
                receiver_id: parseInt(friend),
                voucher_id: selectedVoucher.id,
                cost: selectedVoucher.cost
            }

            try {
                await invitationsAPI.sendInvitation(invitation);
                setMessage("The invitation was successfully sent! -" + selectedVoucher.cost + " points!")
                props.setUser(await userAPI.getLoggedUser());
                setShowFeedback(true);
                handleClose();
            } catch (err) {
                console.log(err);
            }
        }
    };
    useEffect(() => {
        const getVouchers = async () => {
            try {
                const allVouchers = await vouchersAPI.getVouchers();
                setVouchers(allVouchers);
            } catch (err) {
                console.log(err);
            }
        };
        getVouchers();
    }, [showFeedback]);

    return (
        <div id="all-vouchers-page">
            <Row id="page-title">
                <h2>All available vouchers</h2>
            </Row>
            <br />
            <br />

            <Container className='scrollable-group'>
                {
                    vouchers.map((v) => (
                        <>
                            <Row key={v.id} className='voucher-row'>
                                <Col xs='4'>
                                    <Image src={v.image !== 'image' ? v.image : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid />
                                </Col>
                                <Col xs='4' className='full-column'>
                                    <Row className='first-row'>
                                        <h6 className='card-text'>{v.name}</h6>
                                    </Row>
                                    <Row className='second-row' >
                                        <h6 className='card-text'>{v.title}</h6>
                                    </Row>
                                </Col>
                                <Col xs='4'>
                                    <Button className='buy-invite-button' onClick={() => { handleShow(v) }} >BUY AND INVITE FRIEND</Button>
                                </Col>
                            </Row>
                        </>
                    ))
                }
            </Container>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Select one of your friends to invite to {selectedVoucher.name} for {selectedVoucher.title}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible> {message} </Alert>
                        Only users matching the activity's interests will be shown!
                        <Form.Group className="select-friend-row">
                            <Form.Select
                                id="select-friend"
                                className='select-friend'
                                onChange={(e) => { setFriend(e.target.value); getUserInfo(e.target.value) }}
                                defaultValue={"0"}
                            >
                                <option key={0} value={"0"}>Select a friend</option>
                                {friends.sort((a, b) => a.name.trim().localeCompare(b.name.trim())).map((p, i) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Text>
                            {(friendInfo !== null && friend !== "0") ?
                                <>
                                    <Row style={{ marginTop: "3%" }} >
                                        <Col xs="3">
                                            <Image src={friendInfo.image !== 'image' ? friendInfo.image : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid />
                                        </Col>
                                        <Col xs="9" style={{ verticalAlign: "middle" }}>
                                            <h6 className='card-text'>Age: {friendInfo.age}</h6>
                                            <h6 className='card-text'>City: {friendInfo.city}</h6>
                                        </Col>
                                    </Row>
                                </>
                                : <></>}
                        </Form.Text>
                        <Form.Text style={{ color: "red" }}>
                            This voucher will cost you {selectedVoucher.cost} points and by attending the event you will receive {selectedVoucher.gain_sender} points.
                        </Form.Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="dark" type="submit">
                            Send
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Row className='buttons'>
                <Col className='button-column'>
                    <Button className='see-my-vouchers' onClick={() => { navigate("/my-vouchers") }}>See My Vouchers</Button>
                </Col>
            </Row>
            <FeedbackPopup message={message} setShowFeedback={setShowFeedback} showFeedback={showFeedback} />
        </div>
    );
}

export { AllVouchersPage };