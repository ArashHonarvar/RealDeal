const APIURL = '/api/';

async function sendInvitation(invitation) {
    let response = await fetch(APIURL + 'send-invitation', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invitation),
    });
    if (response.ok) {
      return null;
    } else {
      const errDetail = await response.json();
      throw errDetail
    }
}

async function getReceivedInvitations() {
  let response = await fetch(APIURL + 'received-invitations', {
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

async function getUserAcceptedInvitationsSent() {
  let response = await fetch(APIURL + 'user-accepted-invitations-sent', {
      credentials: 'include',
  });
  if (response.ok) {
      const invitations = await response.json();
      return invitations;
  } else {
      const errDetail = await response.json();
      throw errDetail.message;
  }
}

async function getUserAcceptedInvitationsReceived() {
  let response = await fetch(APIURL + 'user-accepted-invitations-received', {
      credentials: 'include',
  });
  if (response.ok) {
      const invitations = await response.json();
      return invitations;
  } else {
      const errDetail = await response.json();
      throw errDetail.message;
  }
}

async function getUserLastInvitationsSent() {
  let response = await fetch(APIURL + 'user-last-invitations-sent', {
      credentials: 'include',
  });
  if (response.ok) {
      const invitations = await response.json();
      return invitations;
  } else {
      const errDetail = await response.json();
      throw errDetail.message;
  }
}

async function getUserLastInvitationsReceived() {
  let response = await fetch(APIURL + 'user-last-invitations-received', {
      credentials: 'include',
  });
  if (response.ok) {
      const invitations = await response.json();
      return invitations;
  } else {
      const errDetail = await response.json();
      throw errDetail.message;
  }
}

async function getSentInvitations() {
  let response = await fetch(APIURL + 'sent-invitations', {
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

async function getSentInvitation(receiver_id, voucher_id) {
  let response = await fetch(APIURL + 'sent-invitation/' + receiver_id + "/" + voucher_id, {
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

async function getReceivedInvitation(sender_id, voucher_id) {
  let response = await fetch(APIURL + 'received-invitation/' + sender_id + "/" + voucher_id, {
      credentials: 'include',
  });
  if (response.ok) {
      const invitation = await response.json();
      return invitation;
  } else {
      if(response.status === 404) {
        return null;
      }
      const errDetail = await response.json();
      throw errDetail.message;
  }
}

async function acceptInvitation(invitation) {
  const response = await fetch(APIURL + 'accept-invitation', {
    method: 'PUT', 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invitation),
  });
  if (response.ok) {
    return null;
  } else {
    const errDetail = await response.json();
    throw errDetail
  }
}

async function declineInvitation(invitation) {
  const response = await fetch(APIURL + 'decline-invitation/', {
    method: 'PUT', 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invitation),
  });
  if (response.ok) {
    return null;
  } else {
    const errDetail = await response.json();
    throw errDetail
  }
}

async function doneInvitation(invitation) {
  const response = await fetch(APIURL + 'done-invitation', {
    method: 'PUT', 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invitation),
  });
  if (response.ok) {
    return response.status;
  } else {
    const errDetail = await response.json();
    throw errDetail
  }
}

async function deleteInvitation(invitation) {
  const response = await fetch(APIURL + 'delete-invitation/', {
    method: 'DELETE', 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invitation),
  });
  if (response.ok) {
    return null;
  } else {
    const errDetail = await response.json();
    throw errDetail
  }
}

const API = {
    sendInvitation, getReceivedInvitations, getSentInvitations, getSentInvitation, getReceivedInvitation,
    acceptInvitation, declineInvitation, deleteInvitation, doneInvitation, getUserAcceptedInvitationsSent,
    getUserAcceptedInvitationsReceived, getUserLastInvitationsSent, getUserLastInvitationsReceived
};

export default API;