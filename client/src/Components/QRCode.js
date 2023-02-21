import {QRCodeCanvas} from 'qrcode.react';

function Qrcode(props) {

    return ( 
        <QRCodeCanvas id="qr-code" value={"user " + props.senderId + " invited user " + props.receiverId + " for voucher " + props.voucherId}/>
    );
}

export { Qrcode };