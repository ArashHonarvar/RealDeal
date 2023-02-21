import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form'
import { Row, Image, Col, Container, Button, Card, InputGroup } from 'react-bootstrap';
import "bootstrap-icons/font/bootstrap-icons.css";
import userInterestsAPI from '../API/userInterestsAPI';
import interestsAPI from '../API/interestsAPI';
import '../ComponentsStyle/friendCard.css';
import '../ComponentsStyle/voucherCard.css';
import '../ComponentsStyle/interestPage.css';
import { InterestIcon } from './InterestIcon';
import { FeedbackPopup } from './FeedBackPopup.js';

function UserInterestsPage(props) {

    const [myInterests, setMyInterests] = useState([]);
    const [allInterests, setAllInterests] = useState([]);
    const [filteredAllInterests, setFilteredAllInterests] = useState([]);
    const [title, setTitle] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const getMyInterests = async () => {
        try {
            const interests = await userInterestsAPI.getAllUserInterests();
            console.log('list', interests);
            setMyInterests(interests);
        } catch (err) {
            console.log(err);
        }
    };
    const getAllInterests = async () => {
        try {
            const interests = await interestsAPI.getAllInterests();
            setAllInterests(interests);
            setFilteredAllInterests(interests);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getMyInterests();
        getAllInterests();
    }, []);

    const addUserInterests = async () => {
        try {
            await userInterestsAPI.addUserInterests({ userInterests: myInterests });
        } catch (err) {
            console.log(err);
        }
    };

    const handleSaveChange = async () => {
        await addUserInterests();
    }

    const handleClearTitle = async () => {
        setTitle("");
        setFilteredAllInterests(allInterests);
    }

    const handleSearchTitle = async () => {
        console.log(title);
        if (title === "null" || title === "") {
            setFilteredAllInterests(allInterests);
        } else {
            let filtered = allInterests.filter((i) => {
                let name = i.name;
                let lowerCaseName = name.toLowerCase();
                return lowerCaseName.includes(title) || name.includes(title);
            });
            setFilteredAllInterests(filtered);
        }
    }


    const addInterest = (interestId) => {
        let interest = { user_id: props.user.id, interest_id: interestId }
        let myNewInterests = [...myInterests];
        let existed = myNewInterests.filter((i) => (i.interest_id === interestId));
        if (existed.length === 0) {
            myNewInterests.push(interest);
            setMyInterests(myNewInterests);
        }
    }

    const removeInterest = (interestId) => {
        let myNewInterests = [...myInterests];
        myNewInterests = myNewInterests.filter((i) => (i.interest_id !== interestId));
        setMyInterests(myNewInterests);
    }

    return (
        <>
            <div id="user-interests-page">
                <Row id="page-title" className='margin-bottom-20px'>
                    <h2>My Interests</h2>
                </Row>
                <Row className='margin-bottom-20px'>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="search for the interest"
                            aria-label="search for the interest"
                            aria-describedby="clear-btn"
                            onChange={(event) => { setTitle(event.target.value) }}
                            value={title}
                        />
                        <Button variant="outline-secondary" id="clear-btn" onClick={handleClearTitle}>
                            <i className='bi bi-x'></i>
                        </Button>
                        <Button variant="outline-primary" id="search-btn" onClick={handleSearchTitle}>
                            Search
                        </Button>
                    </InputGroup>
                </Row>
                <Row className='scrollable-group scroll-box'>
                    {filteredAllInterests.sort((a, b) => a.name.localeCompare(b.name)).map((interest, counter) => (
                        <Col xs={6} sm={6} md={2} lg={2} className="margin-bottom-10px">
                            <UserInterestsItem
                                key={counter}
                                myInterests={myInterests}
                                removeInterest={removeInterest}
                                addInterest={addInterest}
                                interestID={interest.id}
                                interestName={interest.name}
                                isActive={myInterests.filter((i) => (i.interest_id === interest.id)).length > 0}
                            />
                        </Col>
                    ))}
                </Row>
                <Row className='buttons'>
                    <Col className='button-column'>
                        <Button className='find-new-friends margin-5percent' onClick={() => {handleSaveChange(); setMessage("The interests have been correctly saved"); setShowFeedback(true);}}>Save Changes</Button>
                    </Col>
                </Row>
                <FeedbackPopup navigation={"/my-friends"} message={message} setShowFeedback={setShowFeedback} showFeedback={showFeedback} />
            </div>
        </>
    );
}

function UserInterestsItem(props) {
    const src = '/' + props.interestName + '.svg';
    return (
        <>
            {props.isActive ?
                <div className='text-center item-box-with-border pointer' onClick={() => props.removeInterest(props.interestID)}> <InterestIcon className="interest-icon" interestName={props.interestName.toLowerCase()} /> <p>{props.interestName}</p>  </div> :
                <div className='text-center item-box-without-border pointer' onClick={() => props.addInterest(props.interestID)}><InterestIcon className="interest-icon" interestName={props.interestName.toLowerCase()} /> <p className='text-center'>{props.interestName}</p></div>
            }

        </>
    );
}

export { UserInterestsPage };