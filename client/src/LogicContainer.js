import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "react-bootstrap";
import RoutesManager from "./RoutesManager";
import userAPI from "./API/userAPI";
import userInterestsAPI from './API/userInterestsAPI';

const LogicContainer = () => {

    const [loggedIn, setLoggedIn] = useState();
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [log, setLog] = useState(true);
    const navigate = useNavigate();
    const [errMessage, setErrMessage] = useState('');
    const [show, setShow] = useState(false);

    const [firstLevel, setFirstLevel] = useState();
    const firstLevelPages = ["home", "my-friends", "all-vouchers", "my-vouchers", "my-invitations", "about-us"];
    const [active, setActive] = useState();
    const pageName = '' + window.location.pathname.split("/").pop();

    useEffect(() => {
        
        if (firstLevelPages.includes(pageName)) {
            setFirstLevel(true);
        } else {
            setFirstLevel(false);
        }

        setActive(pageName);
            
    }, [pageName]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true);
                const user = await userAPI.getLoggedUser();
                setLoggedIn(true);
                setUser(user);
                setUserType(user.type);
                setIsLoading(false);
            } catch (err) {
                console.log(err);
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);


    const login = async (credentials) => {
        try {
            setIsLoading(true);
            const user = await userAPI.logIn(credentials);
            //Toast.success(`Welcome!`, { position: "center" }, { toastId: 1 });
            setLoggedIn(true);
            setUser(user);
            setUserType(user.type);
            let interests = await userInterestsAPI.getAllUserInterests();
            if(user.type === "Business" || interests.length > 0) {
                navigate("/");
            } else {
                navigate("/my-interests");
            }
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            setErrMessage('Wrong email or password!');
            setShow(true);
            //toast.error("Username and/or password wrong. Try again.", { position: "top-center" }, { toastId: 2 });
        }
    };


    const logout = async () => {
        try {
            await userAPI.logOut();
            //toast.success("Logout done successfully.", { position: "top-center" }, { toastId: 3 });
        } catch {
            //toast.error("Error during logout. Try Again.", { position: "top-center" }, { toastId: 4 });
        }
        setLoggedIn(false);
        setUser(null);
        setUserType();
        navigate("/");
    };

    const addUser = (newUser) => {
        const add = async () => {
            await userAPI.addUser(newUser).then(async () => {
                let credentials = { username: newUser.email, password: newUser.password };
                const user = await userAPI.logIn(credentials);
                //toast.success(`Welcome ${user.name}!`, { position: "top-center" }, { toastId: 1 });
                setLoggedIn(true);
                setUser(user)
                setUserType(newUser.type);
                if (newUser.type === "User") {
                    await userAPI.addUserInfo(newUser.userInfo, user.id);
                } else {
                    await userAPI.addBusinessInfo(newUser.businessInfo, user.id);
                }
            });
        };
        setIsLoading(true);
        add()
            .then(() => {
                if(newUser.type === "Business") {
                    navigate("/");
                } else {
                    navigate("/my-interests");
                }
                setIsLoading(false);
            })
            .catch((err) => {
                setIsLoading(false);
                //toast.error("Error during Register. Try Again.", { position: "top-center" }, { toastId: 6 });
            });
    };

    return (
        !isLoading && 
        <RoutesManager
            login={login}
            loggedIn={loggedIn}
            logout={logout}
            user={user}
            userType={userType}
            addUser={addUser}
            log={log}
            setLog={setLog}
            setUser={setUser}
            show={show}
            setShow={setShow}
            errMessage={errMessage}
            firstLevel={firstLevel}
            setFirstLevel={setFirstLevel}
            active={active}
        />
    );
};

export default LogicContainer;