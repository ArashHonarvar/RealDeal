import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Row, Image, Col, Container, Button } from 'react-bootstrap';
import invitationsAPI from '../API/invitationsAPI';
import '../ComponentsStyle/invitations.css';

function InvitationsPage() {

    const [receivedInvitations, setReceivedInvitations] = useState([]);
    const [sentInvitations, setSentInvitations] = useState([]);
    const [pageState, setPageState] = useState("received");
    const navigate = useNavigate();

    useEffect(() => {
        const getInvitations = async () => {
            try {
                const r_i = await invitationsAPI.getReceivedInvitations();
                setReceivedInvitations(r_i);
                const s_i = await invitationsAPI.getSentInvitations();
                setSentInvitations(s_i);
            } catch (err){
                console.log(err);
            }
        };
        getInvitations();
    }, []);

    return (
        <div id="invitations-page">
            <Row id="page-title">
                <h2>My Invitations</h2>
            </Row>
            <br/>
            
            <Row className='state-button-row'>
                <Col xs={6} className='state-button-col'>
                    <Button className='state-button' active={pageState === "received" ? true : false} onClick={() => {setPageState("received")}}>Received</Button>
                </Col>
                <Col xs={6} className='state-button-col'>
                    <Button className='state-button' active={pageState === "sent" ? true : false} onClick={() => {setPageState("sent")}}>Sent</Button>
                </Col>
            </Row>

            <Container className='scrollable-group'>
                {
                    pageState === "received" ?
                    receivedInvitations.map((v) => (
                    <>
                        <Row key={v.id} className='invitation-row'>
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
                                <Button className='see-invitation-button' onClick={() => {navigate("/received-invitation/" + v.sender_id +"/" + v.voucher_id)}} >SEE INVITATION</Button>
                            </Col>
                        </Row>
                    </>  
                    ))
                    :
                    sentInvitations.map((v) => (
                        <>
                            <Row key={v.id} className='invitation-row'>
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
                                    <Button className='see-invitation-button' onClick={() => {navigate("/sent-invitation/" + v.receiver_id +"/" + v.voucher_id)}} >SEE INVITATION</Button>
                                </Col>
                            </Row>
                        </>  
                        ))           
                }
            </Container> 
            
            <Row className='buttons'>
                <Col className='button-column'>
                    <Button className='see-my-vouchers' onClick={() => {navigate("/my-vouchers")}}>See My Vouchers</Button>
                </Col>
            </Row>
        </div>
    );
}

export { InvitationsPage };