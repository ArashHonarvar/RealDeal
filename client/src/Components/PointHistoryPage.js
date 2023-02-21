import { useEffect, useState } from 'react';
import { Row, Image, Col, Container, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import invitationsAPI from '../API/invitationsAPI';
import '../ComponentsStyle/allVouchers.css';
const dayjs = require('dayjs')

function PointHistoryPage(props) {

    const [userInvitations, setUserInvitations] = useState([]);
    const navigate = useNavigate();



    useEffect(() => {
        const getUserInvitations = async () => {
            try {
                let slicedInvitations;
                const invitationsSent = await invitationsAPI.getUserLastInvitationsSent();
                console.log(invitationsSent);
                const invitationsReceived = await invitationsAPI.getUserLastInvitationsReceived();
                console.log(invitationsReceived);
                const invitations = invitationsSent.concat(invitationsReceived);
                invitations.sort((a, b) => (dayjs(a.last_update_date).isBefore(dayjs(b.last_update_date))) ? 1 : ((dayjs(b.last_update_date).isBefore(dayjs(a.last_update_date))) ? -1 : 0));
                slicedInvitations = invitations.slice(0, 5);
                setUserInvitations(slicedInvitations);
            } catch (err) {
                console.log(err);
            }
        };
        getUserInvitations();
    }, []);


    return (
        <div id="all-vouchers-page">
            <Row id="page-title">
                <h2>My Points History</h2>
            </Row>
            <br />
            <br />

            {userInvitations.length > 0 ?
                <Container className='scrollable-group'>
                    {
                        userInvitations.map((v) => (
                            <>
                                <Row key={v.id} className='voucher-row' style={{ height: "25vh", paddingTop: "5px" }}>
                                    <Col xs='4'>
                                        <Image src={v.image !== 'image' ? v.image : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid />
                                    </Col>
                                    <Col xs='4' className='full-column'>
                                        <div>{v.sender_id === props.user.id ? <Badge bg="primary" >Sender</Badge> : <Badge bg="success">Receiver</Badge>}</div>
                                        <Row className='first-row' style={{ height: "33%" }}>
                                            <h6 className='card-text'>{v.businessName}</h6>
                                        </Row>
                                        <Row className='first-row' style={{ height: "33%" }}>
                                            <h6 className='card-text'>{v.title}</h6>
                                        </Row>
                                        <Row className='second-row' style={{ height: "33%", margin: "0%" }}>
                                            <h6 className='card-text' style={{ padding: "0%" }}>
                                                {v.sender_id === props.user.id ?
                                                    <PointSectionForSender status={v.status} gain={v.gain_sender} use={v.cost} />
                                                    :
                                                    <PointSectionForReceiver status={v.status} gain={v.gain_receiver} />
                                                }
                                            </h6>
                                        </Row>
                                    </Col>
                                    {v.sender_id === props.user.id ?
                                        <Col xs='4' className='text-center' onClick={() => navigate("/profile/" + v.receiver_id)}>
                                            <Image src={v.receiverImage !== 'image' ? v.receiverImage : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid style={{ width: '50px', height: '50px' }} />
                                            <div>{v.receiverName}</div>
                                           { v.status === 'pending' && <Badge bg="warning">Pending</Badge> } 
                                        </Col>
                                        :
                                        <Col xs='4' className='text-center' onClick={() => navigate("/profile/" + v.sender_id)}>
                                            <Image src={v.senderImage !== 'image' ? v.senderImage : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid style={{ width: '50px', height: '50px' }} />
                                            <div>{v.senderName}</div>
                                        </Col>
                                    }

                                </Row>

                            </>
                        ))
                    }
                </Container> : <Container >
                    <Row style={{ justifyContent: 'center', display: 'flex', textAlign: 'center' }}>
                        <h3>You have no transactions.</h3>
                        <h3>Use your points to buy vouchers by clicking on the button below!</h3>
                    </Row>
                    <Row className='buttons'>
                        <Col className='button-column'>
                            <Button className='find-new-friends' onClick={() => { navigate('/all-vouchers') }}>All vouchers</Button>
                        </Col>
                    </Row>
                </Container>
            }
        </div>
    );
}

function PointSectionForSender(props) {
    return (
        <>
            <p>Spent: {props.use} p</p>
            {props.status === "done" ? <p>Gained: {props.gain} p</p> : ""}
        </>
    );
}

function PointSectionForReceiver(props) {
    return (
        <>
            {props.status === "done" ? <p>Gained: {props.gain} p</p> : ""}
        </>
    );
}

export { PointHistoryPage };