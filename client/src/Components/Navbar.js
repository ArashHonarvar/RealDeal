import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import "bootstrap-icons/font/bootstrap-icons.css";
import { ReactComponent as Logo } from "../Assets/icons/logo.svg"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import userAPI from '../API/userAPI';
import { MdArrowBack } from 'react-icons/md';
import { FriendVouchers } from './FriendVouchers';

function NavigationBar(props) {

    const [userInfo, setUserInfo] = useState();
    const navigate = useNavigate();
    const pageName = '' + window.location.pathname;

    useEffect(() => {
        const getUserInformation = async () => {
            try {
                let info = {};

                if(props.user) {
                    if (props.user.type === "User") {
                        info = await userAPI.getUserInfo(props.user.id);
                    } else
                        info = await userAPI.getBusinessInfo(props.user.id);
    
                    setUserInfo(info);
                }              
            } catch (err) {
                console.log(err);
            }
        };
        getUserInformation();
    }, [props.user]);

    const handleBack = () => {
        if(!pageName.includes('voucher/')) {
            props.setFirstLevel(!(props.firstLevel));
        }
        navigate(-1);
    }


    return (
        <>
            {[false].map((expand) => (
                <Navbar key={expand} style={{ backgroundColor: "#CBF1F5" }} expand={expand} className="mb-3" id="nav-wrapper">
                    <Container fluid id="main-navbar">
                        {props.user ?

                            <>
                                {props.firstLevel === true ?
                                    <Navbar.Toggle id="nav-toggle" aria-controls={`offcanvasNavbar-expand-${expand}`} />
                                    :
                                    <MdArrowBack size={25} className='back-button' onClick={handleBack} />
                                }
                                <Navbar.Offcanvas
                                    id={`offcanvasNavbar-expand-${expand}`}
                                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                                    placement="start"
                                    className="hamburger-menu"
                                >
                                    <Offcanvas.Header closeButton>
                                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                            <Logo />
                                        </Offcanvas.Title>
                                    </Offcanvas.Header>

                                    <Offcanvas.Body>
                                        <Nav className="justify-content-start">
                                            {!(props.userType === "Business") && <Nav.Link className={'side-item' + (props.active === "my-friends" || props.active === "home" ? "-active" : "")} href="/my-friends">My Friends</Nav.Link>}
                                            {!(props.userType === "Business") && <Nav.Link className={'side-item' + (props.active === "all-vouchers" ? "-active" : "")} href="/all-vouchers">All Vouchers</Nav.Link>}
                                            {
                                                props.userType === 'User' ?
                                                    <Nav.Link className={'side-item' + (props.active === "my-vouchers" ? "-active" : "")} href="/my-vouchers">My Vouchers</Nav.Link>
                                                    :
                                                    <Nav.Link className={'side-item' + (props.active === "home" ? "-active" : "")} href='/home'>My Vouchers</Nav.Link>
                                            }
                                            {!(props.userType === "Business") && <Nav.Link className={'side-item' + (props.active === "my-invitations" ? "-active" : "")} href="/my-invitations">My Invitations</Nav.Link>}
                                            <Nav.Link className={'side-item' + (props.active === "about-us" ? "-active" : "")} href="/about-us">About us</Nav.Link>
                                        </Nav>
                                    </Offcanvas.Body>
                                </Navbar.Offcanvas>
                            </>
                            :
                            props.firstLevel === true ?
                            <MdArrowBack size={25} className='back-button' onClick={handleBack} />
                            :
                            false
                        }
                        <Navbar.Brand id="app-name" onClick={() => { navigate("/") }}>{props.userType === "Business" ? "RealDeal Business" : "RealDeal"}<Logo className={props.userType === "Business" ? "logoBusiness" : "logo"} /></Navbar.Brand>
                        {props.user && (!(props.userType === "Business") && <Navbar.Brand id="points-component"> <div className={userInfo?.points ? 'points' : 'nope'} onClick={() => { userInfo?.points ? navigate("/my-points") : navigate("/") }}>{userInfo?.points + " p"}</div></Navbar.Brand>)}
                        {props.user && <NavDropdown align="end" title={<i id='profile-icon' className="bi bi-person-circle"></i>} id="main-navbar-dropdown">
                            <NavDropdown.Item className="dropdown-item" onClick={() => { navigate("/profile/" + props.user.id) }}>My Profile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item className="dropdown-item" onClick={props.logout}>Logout</NavDropdown.Item>
                        </NavDropdown>}
                    </Container>
                </Navbar>
            ))}
        </>
    );
}

export { NavigationBar };