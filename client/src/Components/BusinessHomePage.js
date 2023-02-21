import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Row, Image, Col, Container, Button, Modal } from 'react-bootstrap';
import vouchersAPI from '../API/vouchersAPI';
import '../ComponentsStyle/voucherCard.css';
import { MdQrCodeScanner, MdControlPoint, MdEdit, MdOutlineDeleteOutline } from 'react-icons/md';
import { FeedbackPopup } from './FeedBackPopup';

function BusinessHomePage(props) {

    const [myVouchers, setMyVouchers] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState();
    const [showFeedback, setShowFeedback] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getMyVouchers = async () => {
            try {
                const vouchers = await vouchersAPI.getVouchersByBusinessId();
                setMyVouchers(vouchers);
            } catch (err){
                console.log(err);
            }
        };
        getMyVouchers();
    }, [deleteModal]);

    const deletePressed = (voucher) => {
        setSelectedVoucher(voucher);
        setDeleteModal(true);
    }

    const deleteClick = async() => {
        try{
            setDeleteModal(false);
            await vouchersAPI.deleteVoucher(selectedVoucher.id);
            setMessage("The voucher has been correctly deleted");
            setShowFeedback(true);
        } catch(err){
            console.log(err);
        }
    }

    return (
        <div id="business-home-page">
            <Row id="page-title">
                <h2>My Vouchers</h2>
            </Row>
            <br/>
            <br/>

            <Container className='scrollable-group'>
                {
                    myVouchers.map((v) => (
                    <>
                        <Row key={v.id} className='voucher-row'>
                            <Col xs='4'>
                                <Image src={v.image !== 'image' ? v.image : 'https://squaredwp.blob.core.windows.net/webmedia/2020/04/SquaredSquare.png'} alt='...' fluid />
                            </Col>
                            <Col xs='6'>
                                <h3 className='card-title'>{v.title}</h3>
                            </Col>
                            <Col xs='2'>
                                <Row className='icon-row'><MdEdit variant='warning' className='edit-icon' title='edit' onClick={() => {navigate('/edit-voucher/' + v.id)}}/></Row>
                                <Row className='icon-row'><MdOutlineDeleteOutline variant='danger' className='delete-icon' title='delete' onClick={() => {deletePressed(v)}}/></Row>
                            </Col>
                        </Row>
                    </>  
                    ))              
                }
            </Container>      
               
            <Row className='buttons-profile'>
                <Col className='button-column'>
                    <MdQrCodeScanner className='scan-button' size='80%' title='scan a voucher' onClick={() => {navigate("/scan-voucher")}}/>
                </Col>

                <Col className='button-column'>
                    <MdControlPoint className='add-button' size='80%' title='add a new voucher' onClick={() => {navigate("/add-voucher")}}/>
                </Col>
            </Row>
            <Modal show={deleteModal} onHide={() => {setDeleteModal(false)}} centered>
                <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to delete voucher {selectedVoucher?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body-delete'>
                    <Button variant='secondary' className="cancel-button" onClick={() => {setDeleteModal(false)}}>Cancel</Button>
                    <Button variant='danger' className='delete-voucher-button' onClick={() => {deleteClick(selectedVoucher)}}>Delete</Button>
                </Modal.Body>
            </Modal>
            <FeedbackPopup message={message} setShowFeedback={setShowFeedback} showFeedback={showFeedback} />
        </div>
    );
};

export { BusinessHomePage };


