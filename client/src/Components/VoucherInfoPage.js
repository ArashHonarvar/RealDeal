import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Row, Col, Image, Button, Modal } from "react-bootstrap";
import { Qrcode } from "./QRCode";
import vouchersAPI from '../API/vouchersAPI';
import userAPI from '../API/userAPI';
import dayjs from 'dayjs';
import '../ComponentsStyle/voucherInfoPage.css';
import { MdOutlineMap } from 'react-icons/md';
import invitationsAPI from '../API/invitationsAPI';

function VoucherInfoPage(props) {

    const [voucher, setVoucher] = useState();
    const [friend, setFriend] = useState();

    const params = useParams();
    const navigate = useNavigate();

    const downloadQRCode = () => {
        const qrCodeURL = document.getElementById('qr-code')
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        let aEl = document.createElement("a");
        aEl.href = qrCodeURL;
        aEl.download = "QR_Code.png";
        document.body.appendChild(aEl);
        aEl.click();
        document.body.removeChild(aEl);
    }

    useEffect(() => {
        const getInfos = async () => {
            try {
                const voucherInfo = await vouchersAPI.getVoucherById(params.voucher_id);
                setVoucher(voucherInfo);
                if(parseInt(params.sender_id) === props.user?.id) {
                    const friend = await userAPI.getUserInfo(params.receiver_id);
                    setFriend(friend);
                } else {
                    const friend = await userAPI.getUserInfo(params.sender_id);
                    setFriend(friend);
                }
            } catch (err) {
                console.log(err);
            }
        };
        getInfos();
    }, []);

    useEffect(() => {
        const getInvitation = async () => {
            let invitation = await invitationsAPI.getReceivedInvitation(params.sender_id, params.voucher_id);
            if(!invitation) {
                invitation = await invitationsAPI.getSentInvitation(params.receiver_id, params.voucher_id);
            }
            if(invitation.status === "done") {
                navigate('/congratulations');
            }
        };

        const interval = setInterval(() => {
            getInvitation();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div id="voucher-page">
            <Row id="page-title">
            <h2>{voucher?.name}</h2>
            </Row>
            <Row>
                <Col className='map-button'>
                    <Button variant='success' onClick={() => {window.open("https://www.google.it/maps/place/" + voucher.address + "," + voucher.city)}}><MdOutlineMap/> Go to Maps</Button>
                </Col>
            </Row>
            <Row className="qr-row">
                <Qrcode senderId={params.sender_id} receiverId={params.receiver_id} voucherId={params.voucher_id}/>
            </Row>

            <Row key={voucher?.id} className='voucher-info-row'>
                <Col xs='4'>
                    <Image src={voucher?.image !== 'image' ? voucher?.image : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid />
                </Col>
                <Col xs='8' className='full-column'>
                    {/*<Row className='first-row'>
                        <h6 className='card-text'>{voucher?.name}</h6>
    </Row>*/}
                    <Row /*className='second-row'*/ >
                        <h6 className='card-text'>{voucher?.title}</h6>
                    </Row>
                </Col>
            </Row>

            <Row className='share-info'>
                <h5>You share this voucher with</h5>
                <h5>{friend?.name}</h5>
            </Row>

            {
                voucher?.expiration_date &&
                <Row className="expiration-date">
                    <p>*This voucher will expire on the {dayjs(voucher.expiration_date).format("DD-MM-YYYY")}</p>
                </Row>
            }

            <Row className='buttons-profile'>
                <Col className='button-column'>
                    <Button className='see-my-vouchers' onClick={downloadQRCode}>Download</Button>
                </Col>
            </Row>
        </div>
    )
}

export { VoucherInfoPage }