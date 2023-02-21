const APIURL = '/api/';

async function getAllInterests() {
    let response = await fetch(APIURL + 'all-interests', {
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

async function getInterestsByUserId(userId) {
    let response = await fetch(APIURL + 'user-interests/' + userId, {
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

const API = {
    getAllInterests, getInterestsByUserId
};

export default API;