import { useEffect, useState } from 'react';
import { Row, Image, Col, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import invitationsAPI from '../API/invitationsAPI';
import '../ComponentsStyle/allVouchers.css';

function MyVouchersPage(props) {

    const [userInvitations, setUserInvitations] = useState([]);
    const navigate = useNavigate();



    useEffect(() => {
        const getUserInvitations = async () => {
            try {
                const invitationsSent = await invitationsAPI.getUserAcceptedInvitationsSent();
                const invitationsReceived = await invitationsAPI.getUserAcceptedInvitationsReceived();
                const invitations = invitationsSent.concat(invitationsReceived);
                console.log(invitations);
                setUserInvitations(invitations);
            } catch (err) {
                console.log(err);
            }
        };
        getUserInvitations();
    }, []);




    return (
        <div id="all-vouchers-page">
            <Row id="page-title">
                <h2>My vouchers</h2>
            </Row>
            <br />
            <br />
            {userInvitations.length > 0 ?
                <Container className='scrollable-group'>
                    {
                        userInvitations.map((v) => (
                            <>
                                <Row key={v.id} className='voucher-row'>
                                    <Col xs='4' onClick={() => navigate("/voucher/" + v.sender_id + "/" + v.receiver_id + "/" + v.id)}>
                                        <Image src={v.image !== 'image' ? v.image : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid />
                                    </Col>
                                    <Col xs='4' className='full-column' onClick={() => navigate("/voucher/" + v.sender_id + "/" + v.receiver_id + "/" + v.id)}>
                                        <Row className='first-row'>
                                            <h6 className='card-text'>{v.businessName}</h6>
                                        </Row>
                                        <Row className='second-row' >
                                            <h6 className='card-text'>{v.title}</h6>
                                        </Row>
                                    </Col>
                                    {v.sender_id === props.user.id ?
                                        <Col xs='4' className='text-center' onClick={() => navigate("/profile/" + v.receiver_id)}>
                                            <Image src={v.receiverImage !== 'image' ? v.receiverImage : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid style={{ width: '50px', height: '50px' }} />
                                            <div>{v.receiverName}</div>
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
                </Container> :
                <Container >
                    <Row style={{ justifyContent: 'center', display: 'flex', textAlign: 'center' }}>
                        <h3>You have no vouchers.</h3>
                        <h3>Use your points to buy vouchers by clicking on the button below!</h3>
                    </Row>
                </Container>}

            <Row className='buttons'>
                <Col className='button-column'>
                    <Button className='find-new-friends' onClick={() => { navigate('/all-vouchers') }}>All vouchers</Button>
                </Col>
            </Row>
        </div>
    );
}

export { MyVouchersPage };