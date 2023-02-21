const APIURL = '/api/';

async function getAllUserInterests() {
    let response = await fetch(APIURL + 'my-interests', {
        credentials: 'include',
    });
    if (response.ok) {
        const interests = await response.json();
        return interests;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function addUserInterests(userInterests) {
    let response = await fetch(APIURL + 'my-interests', {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userInterests),
    });
    if (response.ok) {
        return null;
    }
    else {
        const errDetail = await response.json();
        throw errDetail.error;
    }
}

const API = {
    getAllUserInterests, addUserInterests
};

export default API;