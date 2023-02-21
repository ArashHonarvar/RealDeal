const APIURL = '/api/';

async function getVouchersByBusinessId() {
    let response = await fetch(APIURL + 'business-vouchers', {
        credentials: 'include',
    });
    if (response.ok) {
        const vouchers = await response.json();
        return vouchers;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function editVoucher(voucher) {
    console.log(voucher);
    let response = await fetch(APIURL + 'edit-voucher', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(voucher)
    });
    if (response.ok) {
        return null;
    }
    else {
        const errDetail = await response.json();
        throw errDetail.error;
    }
}

async function deleteVoucher(voucher_id){
    let response = await fetch(APIURL + 'delete-voucher/' + voucher_id, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (response.ok) {
        return null;
    }
    else {
        const errDetail = await response.json();
        throw errDetail.error;
    }
}

async function getVouchers() {
  let response = await fetch(APIURL + 'vouchers', {
      credentials: 'include',
  });
  if (response.ok) {
      const vouchers = await response.json();
      return vouchers;
  } else {
      const errDetail = await response.json();
      throw errDetail.message;
  }
}

async function getVoucherById(id) {
  let response = await fetch(APIURL + 'voucher/' + id, {
      credentials: 'include',
  });
  if (response.ok) {
      const voucher = await response.json();
      return voucher;
  } else {
      const errDetail = await response.json();
      throw errDetail.message;
  }
}

async function newVoucher(voucher) {
    let response = await fetch(APIURL + 'new-voucher', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(voucher),
    });
    if (response.ok) {
      return null;
    } else {
      const errDetail = await response.json();
      throw errDetail
    }
}

async function getCommonVouchers(friend_id) {
  let response = await fetch(APIURL + 'common-vouchers/' + friend_id, {
      credentials: 'include',
  });
  if (response.ok) {
      const vouchers = await response.json();
      return vouchers;
  } else {
      const errDetail = await response.json();
      throw errDetail.message;
  }
}

const API = {
    getVouchersByBusinessId, editVoucher, deleteVoucher, getVouchers, newVoucher, getVoucherById, getCommonVouchers
};

export default API;