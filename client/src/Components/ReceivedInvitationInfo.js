import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userAPI from '../API/userAPI';
import vouchersAPI from '../API/vouchersAPI';
import invitationsAPI from '../API/invitationsAPI';
import { Row, Image, Col, Container, Button, Modal } from 'react-bootstrap';
import { MdOutlineCheckCircle } from 'react-icons/md';
import { IoMdCloseCircleOutline } from 'react-icons/io'
import '../ComponentsStyle/sentInvitationInfo.css';
import { FeedbackPopup } from "./FeedBackPopup";

function ReceivedInvitationInfo(props) {

    const [invitation, setInvitation] = useState();
    const [sender, setSender] = useState();
    const [voucher, setVoucher] = useState();
    const [showFeedback, setShowFeedback] = useState(false);
    const [message, setMessage] = useState("");
    const [responseModal, setResponseModal] = useState(false);
    const [response, setResponse] = useState("");
    const params = useParams();
    const navigate = useNavigate();

    const handleAccept = async () => {
        try {
            setResponseModal(false);
            await invitationsAPI.acceptInvitation(invitation);
            setMessage("The invitation has been correctly accepted");
            setShowFeedback(true);
            // feedback ACCEPTED 
            setInvitation({...invitation, "status": "accepted"});
        } catch (err) {
            console.log(err);
        }
        
    }

    const handleDecline = async () => {
        try {
            setResponseModal(false);
            await invitationsAPI.declineInvitation(invitation);
            setMessage("The invitation has been correctly rejected");
            setShowFeedback(true);
            // feedback REJECTED
            setInvitation({...invitation, "status": "rejected"});
        } catch (err) {
            console.log(err);
        }
        
    }

    useEffect(() => {
        const getInfo = async () => {
            try {
                const invitationInfo = await invitationsAPI.getReceivedInvitation(params.sender_id, params.voucher_id);
                setInvitation(invitationInfo);
                const senderInfo = await userAPI.getUserInfo(params.sender_id);
                setSender(senderInfo);
                const voucherInfo = await vouchersAPI.getVoucherById(params.voucher_id);
                setVoucher(voucherInfo);
            } catch (err){
                console.log(err);
            }
        };
        getInfo();
    }, []);


    return (
        <Container className="invitation-info-container">
            <Row className="invitation-info-row">
                <h2>{invitation?.status === "pending" ? sender?.name + " invited you" : `You ${response} this invite by ` + sender?.name}</h2>
            </Row>
            <Row className="invitation-info-row">
                <h3>{voucher?.name}</h3>
            </Row>
            {
                invitation?.status === "pending" && 
                <Row className="invitation-info-row">
                    <Col xs={6}>
                        <MdOutlineCheckCircle  className='invitation-answer' size='80%' title='accept-invitation'onClick={()=>{setResponse("accepted");setResponseModal(true)}} />
                    </Col>
                    <Col xs={6}>
                        <IoMdCloseCircleOutline  className='invitation-answer' size='80%' title='decline-invitation' onClick={()=>{setResponse("rejected");setResponseModal(true)}} />
                    </Col>
                </Row>
            }
            <h6>
                By attending this event you will receive {voucher?.gain_receiver} points
            </h6>
            <Row key={voucher?.id} className='voucher-row'>
                <Col xs='4'>
                    <Image src={voucher?.image !== 'image' ? voucher?.image : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid />
                </Col>
                <Col xs='8'>
                    <h2 className='card-title'>{voucher?.title}</h2>
                </Col>
            </Row>
            {
                invitation?.status == "accepted" && 
                <Button className="find-new-friends" onClick={() => {navigate('/voucher/' + params.sender_id + "/" + props.user.id + "/" + params.voucher_id)}}>See Voucher</Button>
            }
            <Modal show={responseModal} onHide={() => {setResponseModal(false)}} centered>
                <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to {response === "accepted" ? "accept" : "reject"} this invitation?</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body-delete'>
                    <Button variant='secondary' className="cancel-button" onClick={() => {setResponseModal(false)}}>Cancel</Button>
                    <Button variant={response === "accepted" ? 'success' : 'danger'} className='delete-voucher-button' onClick={response === "accepted" ? handleAccept : handleDecline}>{response === "accepted" ? "Accept" : "Reject"}</Button>
                </Modal.Body>
            </Modal>

            <FeedbackPopup message={message} setShowFeedback={setShowFeedback} showFeedback={showFeedback} navigation={invitation?.status === "rejected" && '/my-invitations'}/>
        </Container>
    );
}

export { ReceivedInvitationInfo };