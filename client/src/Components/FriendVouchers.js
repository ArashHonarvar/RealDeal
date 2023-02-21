import { useEffect, useState } from 'react';
import { Row, Image, Col, Container, Button, Modal, Form, Alert } from 'react-bootstrap';
import vouchersAPI from '../API/vouchersAPI';
import userAPI from '../API/userAPI';
import friendsAPI from '../API/friendsAPI';
import invitationsAPI from '../API/invitationsAPI';
import '../ComponentsStyle/allVouchers.css';
import { FeedbackPopup } from './FeedBackPopup.js';
import { useNavigate, useParams } from 'react-router-dom';

function FriendVouchers(props) {

    const [vouchers, setVouchers] = useState([]);
    const [show, setShow] = useState(false);
    const [friend, setFriend] = useState("0");
    const [selectedVoucher, setSelectedVoucher] = useState({});
    const [showFeedback, setShowFeedback] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");

    const params = useParams();
    const navigate = useNavigate();

    const handleClose = () => {
        setShowAlert(false);
        setShow(false);
    }

    const handleShow = async (voucher) => {
        setSelectedVoucher(voucher);
        setShow(true);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            let invitation = {
                receiver_id: parseInt(friend.id),
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
        const getInfos = async () => {
            try {
                const friendInfo = await userAPI.getUserInfo(params.friend_id);
                setFriend(friendInfo);
                const commonVouchers = await vouchersAPI.getCommonVouchers(friendInfo.id);
                setVouchers(commonVouchers);
            } catch (err) {
                console.log(err);
            }
        };
        getInfos();
    }, [showFeedback]);

    return (
        <div id="friend-vouchers-page">
            <Row id="page-title">
                <h2>Vouchers</h2>
                <h5>based on common interests with</h5>
                <h5>{friend.name}</h5>
            </Row>
            <br />

            <Container className='scrollable-group'>
                {
                    vouchers.map( (v) => (
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
                                    <Button className='buy-invite-button' onClick={() => { handleShow(v) }} >BUY AND INVITE {friend.name}</Button>
                                </Col>
                            </Row>
                        </> 
                    ))
                }
            </Container>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Send Invitation to {friend.name}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Text>
                        Are you sure you want to send an invitation for {selectedVoucher.name} to {friend.name}?
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
                    <Button className='see-my-vouchers' onClick={() => {navigate("/my-vouchers")}}>See My Vouchers</Button>
                </Col>
            </Row>
            <FeedbackPopup message={message} setShowFeedback={setShowFeedback} showFeedback={showFeedback} />
        </div>
    );
}

export { FriendVouchers };