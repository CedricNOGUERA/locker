import React from 'react'
import QRCode from "react-qr-code";


const QrCode = ({orderNum}: any) => {

  return (
    <QRCode
      size={256}
      style={{
        height: "auto",
        maxWidth: "100%",
        width: "100%",
      }}
      fgColor="#3262a8"
      value={orderNum}
      viewBox={`0 0 256 256`}
    />
  );
}

export default QrCode