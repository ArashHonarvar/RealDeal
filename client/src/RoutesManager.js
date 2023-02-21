import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row } from "react-bootstrap";
import { NavigationBar as Navbar } from "./Components/Navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import { ToastContainer } from "react-toastify";
import { Login } from './Components/Login';
import { Register } from './Components/Register';
import { UserHomePage } from './Components/UserHomePage';
import { BusinessHomePage } from './Components/BusinessHomePage';
import { NewVoucherPage } from './Components/NewVoucherPage';
import { ProfilePage } from "./Components/ProfilePage";
import { AboutUsPage } from "./Components/AboutUsPage";
import { AllVouchersPage } from "./Components/AllVouchersPage";
import { Scanner } from "./Components/ScanQRCode";
import { InvitationsPage } from "./Components/InvitationsPage";
import { SentInvitationInfo } from "./Components/SentInvitationInfo";
import { ReceivedInvitationInfo } from "./Components/ReceivedInvitationInfo";
import { VoucherInfoPage } from "./Components/VoucherInfoPage";
import { FriendVouchers } from "./Components/FriendVouchers";
import { UserInterestsPage } from "./Components/UserInterestsPage";
import { MatchingPage } from "./Components/MatchingPage";
import { MyVouchersPage } from "./Components/MyVouchersPage";
import { CongratulationsPage } from "./Components/CongratulationsPage";
import { EditVoucherPage } from './Components/EditVoucherPage';
import { PointHistoryPage } from "./Components/PointHistoryPage";

const RoutesManager = (props) => {

    return (
        <>
        {/*<div className={props.isLoading ? "loading-overlay" : ""}/>*/}
        <div className="container-fluid">
            <ToastContainer />
            <Row>
                <Navbar firstLevel={props.firstLevel} setFirstLevel={props.setFirstLevel} active={props.active} user={props.user} userType={props.userType} logout={props.logout} />
            </Row>

            <Row>
                <Routes>

                    <Route
                        path="/register"
                        element={<Register addUser={props.addUser} loggedIn={props.loggedIn} log={props.log} setLog={props.setLog} addUserInfo={props.addUserInfo} addBusinessInfo={props.addBusinessInfo} />}
                    />

                    <Route
                        path="/home"
                        element={props.userType === "User" ? <Navigate to="/my-friends" /> : <Navigate to="/my-vouchers" />}
                    />

                    <Route
                        path="/login"
                        element={<Login login={props.login} show={props.show} setShow={props.setShow} errMessage={props.errMessage} />}
                    />

                    <Route
                        path="/my-friends"
                        element={<UserHomePage />}
                    />

                    <Route
                        path="/friend-vouchers/:friend_id"
                        element={<FriendVouchers setUser={props.setUser} />}
                    />

                    <Route
                        path="/all-vouchers"
                        element={<AllVouchersPage setUser={props.setUser} />}
                    />

                    <Route
                        path="/my-vouchers"
                        element={props.userType === 'User' ? <MyVouchersPage user={props.user} /> : <BusinessHomePage userType={props.userType} />}
                    />

                    <Route
                        path="/voucher/:sender_id/:receiver_id/:voucher_id"
                        element={<VoucherInfoPage user={props.user}/>}
                    />

                    <Route
                        path="/my-invitations"
                        element={<InvitationsPage />}
                    />

                    <Route
                        path="/matching-page"
                        element={<MatchingPage user={props.user} />}
                    />

                    <Route
                        path="/sent-invitation/:receiver_id/:voucher_id"
                        element={<SentInvitationInfo user={props.user} />}
                    />

                    <Route
                        path="/received-invitation/:sender_id/:voucher_id"
                        element={<ReceivedInvitationInfo user={props.user} />}
                    />

                    <Route
                        path="/add-voucher"
                        element={<NewVoucherPage user={props.user} />}
                    />

                    <Route
                        path="/edit-voucher/:id"
                        element={<EditVoucherPage user={props.user} />}
                    />

                    <Route
                        path="/scan-voucher"
                        element={<Scanner user={props.user} />}
                    />

                    <Route
                        path="/profile/:id"
                        element={<ProfilePage user={props.user} />}
                    />

                    <Route
                        path="/about-us"
                        element={<AboutUsPage />}
                    />

                    <Route
                        path="/my-interests"
                        element={<UserInterestsPage user={props.user} />}
                    />


                    <Route
                        path="/my-points"
                        element={<PointHistoryPage user={props.user} />}
                    />

                    <Route
                        path="/congratulations"
                        element={<CongratulationsPage user={props.user} />}
                    />

                    <Route
                        path="/*"
                        element={props.loggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />}
                    />

                </Routes>
            </Row>
        </div>
        </>
    );
};

export default RoutesManager;