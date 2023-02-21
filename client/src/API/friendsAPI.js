const APIURL = '/api/';

async function getFriendsByUserId() {
    let response = await fetch(APIURL + 'my-friends', {
        credentials: 'include',
    });
    if (response.ok) {
        const friends = await response.json();
        return friends;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function getFriendsByInterest(interestId) {
    let response = await fetch(APIURL + 'interested-friends/' + interestId, {
        credentials: 'include',
    });
    if (response.ok) {
        const friends = await response.json();
        return friends;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function getPossibleFriends() {
    let response = await fetch(APIURL + 'possible-friends', {
        credentials: 'include',
    });
    if (response.ok) {
        const possibleFriends = await response.json();
        console.log(possibleFriends);
        return possibleFriends;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function thumbsUp(friendId) {
    let response = await fetch(APIURL + 'thumbs-up/' + friendId, {
        credentials: 'include',
        method: 'POST',
    });
    if (response.ok) {
        const message = await response.json();
        return message;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function thumbsDown(friendId) {
    let response = await fetch(APIURL + 'thumbs-down/' + friendId, {
        credentials: 'include',
        method: 'POST',
    });
    if (response.ok) {
        const message = await response.json();
        return message;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const API = {
    getFriendsByUserId, getFriendsByInterest, getPossibleFriends, thumbsDown, thumbsUp
};

export default API;