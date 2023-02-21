import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userAPI from '../API/userAPI';
import vouchersAPI from '../API/vouchersAPI';
import invitationsAPI from '../API/invitationsAPI';
import { Row, Image, Col, Container, Button, Alert, Modal } from 'react-bootstrap';
import '../ComponentsStyle/sentInvitationInfo.css';
import { BsTrash } from "react-icons/bs";
import { FeedbackPopup } from './FeedBackPopup.js';

function SentInvitationInfo(props) {

    const [invitation, setInvitation] = useState();
    const [receiver, setReceiver] = useState();
    const [voucher, setVoucher] = useState();
    const [deleteModal, setDeleteModal] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getInfo = async () => {
            try {
                const invitationInfo = await invitationsAPI.getSentInvitation(params.receiver_id, params.voucher_id);
                setInvitation(invitationInfo);
                const receiverInfo = await userAPI.getUserInfo(params.receiver_id);
                setReceiver(receiverInfo);
                const voucherInfo = await vouchersAPI.getVoucherById(params.voucher_id);
                setVoucher(voucherInfo);
            } catch (err){
                console.log(err);
            }
        };
        getInfo();
    }, []);

    const deleteInvitation = async()=>{
        try{
            setDeleteModal(false);
            await invitationsAPI.deleteInvitation(invitation);
            setShowFeedback(true);
            setMessage('The invitation has been correctly deleted!');
        }catch(err){
            console.log(err);
            setMessage('An error occurred during the deletion of the invitation!');
        }
    }

    return (
        <Container className="invitation-info-container">
            <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible> {message} </Alert>
            <Row className="invitation-info-row">
                <h2>{invitation?.status == "pending" ? "Waiting for a reply from " + receiver?.name : receiver?.name + " accepted your invite" }</h2>
            </Row>
            <Row className="invitation-info-row">
                <h3>{voucher?.name}</h3>
            </Row>
            <Row key={voucher?.id} className='voucher-invitation-row'>
                <Col xs='4'>
                    <Image src={voucher?.image !== 'image' ? voucher?.image : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid />
                </Col>
                <Col xs='8'>
                    <h2 className='card-title'>{voucher?.title}</h2>
                </Col>
            </Row>
            <Row className="invitation-info-row">
                <h5>By attending this event you will receive {voucher?.gain_sender} points</h5>
            </Row>
            {
                invitation?.status == "pending" && 
                <Button id="delete-invitation" onClick={() => {setDeleteModal(true)}}><BsTrash className="trash-icon"/>Delete invitation</Button>
            }
            {
                invitation?.status == "accepted" && 
                <Button className="find-new-friends" onClick={() => {navigate('/voucher/' + props.user.id + "/" + params.receiver_id + "/" + params.voucher_id)}}>See Voucher</Button>
            }
            <Modal show={deleteModal} onHide={() => {setDeleteModal(false)}} centered>
                <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to delete this invitation?</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body-delete'>
                    <Button variant='secondary' className="cancel-button" onClick={() => {setDeleteModal(false)}}>Cancel</Button>
                    <Button variant='danger' className='delete-voucher-button' onClick={deleteInvitation}>Delete</Button>
                </Modal.Body>
            </Modal>
            <FeedbackPopup message={message} setShowFeedback={setShowFeedback} showFeedback={showFeedback} navigation={'/my-invitations'}/>
        </Container>
    );
}

export { SentInvitationInfo };