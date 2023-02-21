import '../ComponentsStyle/congratulationsPage.css';
import { Row, Image, Button } from 'react-bootstrap';
import fireworks from "../Assets/fireworks.gif";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function CongratulationsPage(props) {

    const navigate = useNavigate();

    return (
        <div>
            <Row className='congratulations-title'>
                <h1>CONGRATULATIONS</h1>
            </Row>
            <br/>
            <Row className='fireworks-row'>
                <Image size='90%' src={fireworks} alt="loading..."/>
            </Row>
            <br/>
            <Row className='congratulations-message'>
                <h5>Your voucher has been correctly scanned</h5>
            </Row>
            <Row className='congratulations-message'>
                <h5>Take a look at your points</h5>
                <h5>You might like what you see!</h5>
            </Row>
            <Row className='button-row'>
            <Button className='ok-button' onClick={() => {navigate("/home")}}>Ok</Button>
          </Row>
        </div>
    );
}

export { CongratulationsPage }