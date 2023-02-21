const APIURL = '/api/';

async function logIn(credentials) {
    let response = await fetch(APIURL + 'sessions', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
};

async function logOut() {
    await fetch(APIURL + 'sessions/current', { 
        method: 'DELETE', 
        credentials: 'include' 
    });
};

async function getLoggedUser() {
    const response = await fetch(APIURL + 'sessions/current', { 
        credentials: 'include' 
    });
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
};

async function getUserType(user_id) {
  const response = await fetch(APIURL + 'user-type/' + user_id, {
    credentials: 'include'
  });
  const userType = await response.json();
  if(response.ok) {
    return userType;
  } else {
    throw userType;
  }
}

async function addUser(newUser) {
  // call: POST /api/register
  let response = await fetch(APIURL + 'register', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });
  if (response.ok) {
    return null;
  }
  else {
    const errDetail = await response.json();
    throw errDetail.error;
  }
}

async function addUserInfo(userInfo, userId) {
  // call: POST /api/register
  let response = await fetch(APIURL + 'user-info', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({userInfo: userInfo, userId: userId}),
  });
  if (response.ok) {
    return null;
  }
  else {
    const errDetail = await response.json();
    throw errDetail.error;
  }
}

async function addBusinessInfo(businessInfo, userId) {
  // call: POST /api/register
  let response = await fetch(APIURL + 'business-info', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({businessInfo: businessInfo, userId: userId}),
  });
  if (response.ok) {
    return null;
  }
  else {
    const errDetail = await response.json();
    throw errDetail.error;
  }
}

async function getUserInfo(id) {
  const response = await fetch(APIURL + 'user-profile/' + id, { 
      credentials: 'include' 
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
};

async function getBusinessInfo(id) {
  const response = await fetch(APIURL + 'business-profile/' + id, { 
      credentials: 'include' 
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
};

async function getCreatorImage(id) {
  const response = await fetch(APIURL + 'creator-image/' + id);
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
};

const API = {
  getLoggedUser, logIn, logOut, getUserInfo, getBusinessInfo, addUser, addUserInfo, addBusinessInfo, getUserType, getCreatorImage
};

export default API;