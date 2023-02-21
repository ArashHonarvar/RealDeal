import { useEffect, useState } from 'react';
import { Row, Image, Col, Container, Accordion } from 'react-bootstrap';
import '../ComponentsStyle/aboutUs.css';
import API from '../API/userAPI';

function AboutUsPage() {

    const [mattia, setMattia] = useState();
    const [marta, setMarta] = useState();
    const [michele, setMichele] = useState();
    const [arash, setArash] = useState();

    useEffect(() => {
        const getImages = async () => {
            try {
                const Mattia = await API.getCreatorImage(1);
                setMattia(Mattia);
                const Marta = await API.getCreatorImage(4);
                setMarta(Marta);
                const Michele = await API.getCreatorImage(2);
                setMichele(Michele);
                const Arash = await API.getCreatorImage(3);
                setArash(Arash);
            } catch (err) {
                console.log(err);
            }
        };
        getImages();
    }, []);

    return (
        <div id="about-us-page">
            <Row id="page-title">
                <h2>About Us</h2>
            </Row>
            <br/>
            <br/>

            <Container className='scrollable-group-about-us'>
                <Row key="mattia" className='about-us-row'>
                    <Col xs='4'>
                        <Image src={mattia?.image} alt='...' fluid />
                    </Col>
                    <Col xs='8'>
                        <h2 className='card-title'>Mattia Scamuzzi</h2>
                    </Col>
                </Row>

                <Row key="arash" className='about-us-row'>
                    <Col xs='4'>
                        <Image src={arash?.image} alt='...' fluid />
                    </Col>
                    <Col xs='8'>
                        <h2 className='card-title'>Arash Honarvar</h2>
                    </Col>
                </Row>

                <Row key="michele" className='about-us-row'>
                    <Col xs='4'>
                        <Image src={michele?.image} alt='...' fluid />
                    </Col>
                    <Col xs='8'>
                        <h2 className='card-title'>Michele Del Guercio</h2>
                    </Col>
                </Row>

                <Row key="marta" className='about-us-row'>
                    <Col xs='4'>
                        <Image src={marta?.image} alt='...' fluid />
                    </Col>
                    <Col xs='8'>
                        <h2 className='card-title'>Marta Corcione</h2>
                    </Col>
                </Row> 
                
                <Row className='faq'>
                    <Col>
                        <h2 className='faqs'>FAQs</h2>
                        <Accordion>
                            <Accordion.Item eventKey="0">  
                                <Accordion.Header>How does the point system work?</Accordion.Header>  
                                <Accordion.Body>  
                                    The point system works as follows: 
                                    When a new account is registered, 400 points are automatically put into it.
                                    You use your points in order to buy vouchers inside of the app, so you can invite
                                    your friends in your favourite activities.
                                    By attending the activity and using the voucher that you bought, you gain points.
                                    Furthermore, even if one of your friends bought the voucher and invited you to the activity,
                                    if you attended the activity too, you're taking home some points. 
                                </Accordion.Body>  
                            </Accordion.Item>  
                            <Accordion.Item eventKey="1">  
                                <Accordion.Header>Do I get a refund if I cancel an invitation?</Accordion.Header>  
                                <Accordion.Body>  
                                    No, you don't.
                                    This is done on purpose, so that the face-to-face interaction between you and your friends
                                    is maximized. So keep in mind, in order to be sure you're not wasting points, to organize well with 
                                    your friends before buying a voucher. 
                                </Accordion.Body>  
                            </Accordion.Item>  
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export { AboutUsPage }