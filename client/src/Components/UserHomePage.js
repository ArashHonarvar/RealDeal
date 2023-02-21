import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Row, Image, Col, Container, Button, Modal } from 'react-bootstrap';
import friendsAPI from '../API/friendsAPI';
import '../ComponentsStyle/friendCard.css';
import { MdFiberNew } from 'react-icons/md';
import dayjs from 'dayjs';

function UserHomePage(props) {

    const [myFriends, setMyFriends] = useState([]);
    const [newFriendModal, setNewFriendModal] = useState(false);
    const [newFriend, setNewFriend] = useState();
    const navigate = useNavigate();

    const handleNew = (friend) => {
        setNewFriend(friend);
        setNewFriendModal(true);
    }

    useEffect(() => {
        const getMyFriends = async () => {
            try {
                const friends = await friendsAPI.getFriendsByUserId();
                setMyFriends(friends);
            } catch (err) {
                console.log(err);
            }
        };
        getMyFriends();
    }, []);

    return (
        <div id="user-home-page">
            <Row id="page-title">
                <h2>My Friends</h2>
            </Row>
            <br />
            <br />
            {myFriends.length > 0 ?
                <Container className='scrollable-group'>
                    {
                        myFriends.map((f) => (
                            <>
                                <Row key={f.id} className='friend-row'>
                                    <Col xs='4' className='friend-col' onClick={() => { navigate("/profile/" + f.id) }}>
                                        <Image src={f.image !== 'image' ? f.image : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid />
                                    </Col>
                                    <Col xs='5' className='friend-col' onClick={() => { navigate("/profile/" + f.id) }}>
                                        <h2 className='card-title'>{f.name}</h2>
                                    </Col>
                                    <Col xs='3' className='common-vouchers-column'>
                                        {dayjs(f.friendship_date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD') ? <MdFiberNew className='new-icon' onClick={() => {handleNew(f)}}/> : false}
                                        <Button className='common-vouchers-button' onClick={() => { navigate('/friend-vouchers/' + f.id) }}>Common Interests Vouchers</Button>
                                    </Col>
                                </Row>
                            </>
                        ))
                    }
                </Container> :
                <Container >
                    <Row style={{ justifyContent: 'center', display: 'flex', textAlign: 'center' }}>
                        <h3>You don't have any friends.</h3>
                        <h3>Click the button below to search for new friends!</h3>
                    </Row>
                </Container>
            }
            <Row className='buttons'>
                <Col className='button-column'>
                    <Button className='find-new-friends' onClick={() => { navigate('/matching-page') }}>Find new friends</Button>
                </Col>
            </Row>
            <Modal className='new-friend-modal' show={newFriendModal} onHide={() => {setNewFriendModal(false)}} top right small>
                <Modal.Header closeButton>
                    <Modal.Title>New match</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {newFriend?.name} is your new friend
                </Modal.Body>
            </Modal>
        </div>
    );
}

export { UserHomePage };