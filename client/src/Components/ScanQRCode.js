import { useState } from "react";
import QrReader from 'react-qr-scanner'
import { Row, Button } from 'react-bootstrap';
import '../ComponentsStyle/scanQRCode.css';
import { useNavigate } from 'react-router-dom';
import invitationsAPI from '../API/invitationsAPI';

function Scanner() {
    
    const [delay, setDelay] = useState(100);
    const [result, setResult] = useState();
    const [finalMessage, setFinalMessage] = useState();

    const navigate = useNavigate();

    const handleScan = async (data) => {

      let invitation = {};

      if(data) {
        if (data.text.match(/user \d+ invited user \d+ for voucher \d+/)) {
          invitation = {
            sender_id: data.text.match(/\d+/g)[0],
            receiver_id: data.text.match(/\d+/g)[1],
            voucher_id: data.text.match(/\d+/g)[2]
          }
  
          try {
            await invitationsAPI.doneInvitation(invitation);
            setFinalMessage("The QRCode is valid");
          } catch(err) {
            setFinalMessage("The QRCode is not valid");
          }
        } else {
          setFinalMessage("The QRCode is not valid");
        }
      }
      
      setResult(data);
    }

    const handleError = (err) => {
      console.error(err)
    }

    return(
      <div id="scan-page">
        <Row id="page-title">
            <h2>Scan Voucher</h2>
        </Row>
        <Row className='qr-code-reader'>
          {
            !result

            ?

            <QrReader
              delay={delay}
              onError={handleError}
              onScan={handleScan}
            />

            :

            <>
              { 
                finalMessage &&
                <h3>{finalMessage}</h3>
              }
            </>
          }
        </Row>
        {
          result &&
          <Row className='button-row'>
            <Button className='ok-button' onClick={() => {navigate("/my-vouchers")}}>Ok</Button>
          </Row>
        }
      </div>
    )
}

export { Scanner }