import { useEffect, useState } from "react";
import friendsAPI from '../API/friendsAPI';
import { Row, Image, Col, Container, Button, Modal } from 'react-bootstrap';
import { TbHeartHandshake } from 'react-icons/tb';
import interestsAPI from '../API/interestsAPI';
import { InterestIcon } from './InterestIcon';
import { useNavigate } from "react-router-dom";
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import '../ComponentsStyle/matchingPage.css';

function MatchingPage(props) {

    const [possibleFriends, setPossibleFriends] = useState([]);
    const [person, setPerson] = useState(null);
    const [personInterests, setPersonInterests] = useState([]);
    const [userInterests, setUserInterests] = useState([]);
    const [matchModal, setMatchModal] = useState(false);
    const navigate = useNavigate();

    const handleThumbsUp = async () => {
        let friends;
        await friendsAPI.thumbsUp(person.id).then(async () => { friends = await friendsAPI.getFriendsByUserId() });
        setPossibleFriends(possibleFriends.filter((friend) => friend.id !== person.id));
        if (friends.map((f) => f.id).includes(person.id)) {
            setMatchModal(true);
        } else {
            goToNext();
        }
    }
    const goToNext = async () => {
        const nextPerson = possibleFriends[0];
        if (nextPerson) {
            setPersonInterests(await interestsAPI.getInterestsByUserId(nextPerson.id));
        }
        setPerson(nextPerson);
        setMatchModal(false);
    }

    const handleThumbsDown = async () => {
        const nextPerson = possibleFriends[1];
        await friendsAPI.thumbsDown(person.id);
        setPossibleFriends(possibleFriends.filter((friend) => friend.id !== person.id));
        if (nextPerson) {
            setPersonInterests(await interestsAPI.getInterestsByUserId(nextPerson.id));
        }
        setPerson(nextPerson);
    }

    useEffect(() => {
        const getPossibleFriends = async () => {
            try {
                const possibleFriends = await friendsAPI.getPossibleFriends();
                if (possibleFriends.length > 0) {
                    console.log(possibleFriends);
                    setPossibleFriends(possibleFriends);
                    setPerson(possibleFriends[0]);
                    setUserInterests(await interestsAPI.getInterestsByUserId(props.user.id));
                    setPersonInterests(await interestsAPI.getInterestsByUserId(possibleFriends[0].id));
                }
            } catch (err) {
                console.log(err);
            }
        };
        getPossibleFriends();
    }, []);
    /*this function is used twice so create utility.js file */
    const calculateCommonPercentage = (array1, array2) => {

        let commonCount = 0;

        for (let interest of array1) {
            if (array2.map(i => i.id).includes(interest.id))
                commonCount++;
        }

        let percentage = (commonCount / array1.length * 100).toFixed(2);
        return parseFloat(percentage) + '%';
    }

    return (
        <>
            {person ?
                <Container className="friends-container">
                    <div className="friends">
                        <Row className="friends-row">
                            <h1>{person.name}</h1>
                            <h3>{person.age} years old</h3>
                            <h3>{person.city}</h3>
                        </Row>
                        <Row className="friends-row">
                            <Col xs="8" className="friends-col-left">
                                <h5>This user shares {calculateCommonPercentage(userInterests, personInterests)} of your interests</h5>
                            </Col>
                            <Col xs="4" className="friends-col-right">
                                <TbHeartHandshake size={40} />
                            </Col>
                        </Row>
                        <Row className="friends-row">
                            <Col xs="7"><Image src={person.image !== 'image' ? person.image : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid /></Col>
                            <Col xs="5">
                                <h5 className="friends-interests"><b>Interests</b></h5>
                                {personInterests.map((interest, i) => (
                                    <>
                                        <div className="friends-interests" key={i}><InterestIcon className=" profile-interest-icon" interestName={interest.name.toLowerCase()} /> {interest.name}</div>
                                    </>
                                ))}
                            </Col>
                        </Row>
                        <Row className='friends-row'>
                            <Col className='button-column'>
                                <FaRegThumbsUp className='thumbs-up' size='80%' onClick={() => { handleThumbsUp() }} />
                            </Col>

                            <Col className='button-column' >
                                <FaRegThumbsDown className='thumbs-down' size='80%' onClick={() => { handleThumbsDown() }} />
                            </Col>
                        </Row>
                    </div>
                </Container>
                :
                <Container className='friends-container'>
                    <div className="no-friends">
                        <Row className="friends-row">
                            <h2>No more possible friends</h2>
                        </Row>
                        <Row className="friends-row">
                            <h5>Try adding more interests</h5>
                        </Row>
                        <Button className='no-possible-friends-button' onClick={() => { navigate("/my-interests") }}>Modify Interests</Button>
                        <Row className="friends-row">
                            <h5>OR</h5>
                        </Row>
                        <Row className="friends-row">
                            <h5>Go to friends</h5>
                        </Row>
                        <Button className='no-possible-friends-button' onClick={() => { navigate("/my-friends") }}>My friends</Button>
                    </div>
                </Container>
            }
            {person &&
                <Modal show={matchModal} onHide={() => { setMatchModal(false) }} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Congratulations!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='modal-body-delete'>
                        <h5>You are now friends with {person.name}</h5>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='dark' className='delete-voucher-button' onClick={() => { goToNext() }}>Ok</Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    );
}

export { MatchingPage };