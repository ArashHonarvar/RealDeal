import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Row, Image, Col, Button } from 'react-bootstrap';
import userAPI from '../API/userAPI';
import interestsAPI from '../API/interestsAPI';
import { InterestIcon } from './InterestIcon';
import '../ComponentsStyle/profile.css';

function ProfilePage(props) {

    const [userInformation, setUserInformation] = useState();
    const [userInterests, setUserInterests] = useState([]);
    const [friendInterests, setFriendInterests] = useState([]);
    const navigate = useNavigate();

    const params = useParams();

    useEffect(() => {
        const getUserInformation = async () => {
            try {
                let requested_profile_type = await userAPI.getUserType(params.id);
                let info = {};

                if (requested_profile_type.type === "User") {
                    info = await userAPI.getUserInfo(params.id);
                    if (params.id === props.user.id) {
                        const interests = await interestsAPI.getInterestsByUserId(params.id);
                        setUserInterests(interests);
                    } else {
                        const friendInterests = await interestsAPI.getInterestsByUserId(params.id);
                        setFriendInterests(friendInterests);
                        const interests = await interestsAPI.getInterestsByUserId(props.user.id);
                        setUserInterests(interests);
                    }

                } else
                    info = await userAPI.getBusinessInfo(params.id);

                info.type = requested_profile_type.type;
                setUserInformation(info);
            } catch (err) {
                console.log(err);
            }
        };
        getUserInformation();
    }, [params.id, props.user.type]);

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
        userInformation && <div id="profile-page">
            <Row id="page-title">
                <h2>{parseInt(params.id) === props.user.id ? "My Profile" : userInformation.name}</h2>
            </Row>

            {
                (parseInt(params.id) !== props.user.id && userInformation.type === "User") &&
                <Row className='common-interests'>
                    <p>Shares {calculateCommonPercentage(userInterests, friendInterests)} with interests with you</p>
                </Row>
            }
            <br />
            <>
                <Row className='profile-image'>
                    <Col className='profile-pic'>
                        <Image className='profile-pic-image' src={userInformation.image !== 'image' ? userInformation.image : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid />
                    </Col>
                </Row>
                <Row className='row-info'>
                    {userInformation.type === "User" ?
                        <>
                            <Col xs='8'>
                                <p className='name'>Name: {userInformation?.name}</p>
                                <p className='age'>Age: {userInformation?.age}</p>
                                <p className='email'>Email: {userInformation?.email}</p>
                                <p className='city'>City: {userInformation?.city}</p>
                            </Col>
                        </>
                        :
                        <>
                            <Col xs='8'>
                                <p className='name'>Name: {userInformation?.name}</p>
                                <p className='piva'>P.IVA: {userInformation?.piva}</p>
                                <p className='address'>Address: {userInformation?.address}</p>
                                <p className='email'>Email: {props.user.email}</p>
                                <p className='city'>City: {userInformation?.city}</p>
                                <p className='phone'>Phone Number: {userInformation?.phone_number}</p>
                            </Col>
                        </>
                    }
                </Row>

                {userInformation.type === "User" &&
                    <>
                        <Row className='row-interests'>
                            <h5><b>Interests</b></h5>
                            {parseInt(params.id) === props.user.id ?
                                userInterests.map((interest, i) => (
                                    <>
                                        <div key={i}><InterestIcon className="profile-interest-icon" interestName={interest.name.toLowerCase()} /> {interest.name}</div>
                                    </>
                                ))
                                :
                                friendInterests.map((interest, i) => (
                                    <>
                                        <div key={i}><InterestIcon className="profile-interest-icon" interestName={interest.name.toLowerCase()} /> {interest.name}</div>
                                    </>
                                ))
                            }
                        </Row>
                        {parseInt(params.id) === props.user.id &&
                            <>
                                <Row className='buttons-profile'>
                                    <Col className='button-column'>
                                        <Button className='find-new-friends' onClick={() => { navigate("/my-interests") }}>Modify Interests</Button>
                                    </Col>
                                </Row>
                            </>
                        }
                    </>
                }
            </>
        </div>
    );
}

export { ProfilePage };