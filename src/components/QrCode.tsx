import { QRCode } from 'antd';
import React from 'react'
// import QRCode from "react-qr-code";
import image from "../../src/styles/farerata.png";


const QrCode = ({data}: any) => {

  return (
    <QRCode
    errorLevel="H"
    value={data}
    icon={image}
    size={230}
    style={{
          margin: "auto"
        }}
        color="#3262a8"
  />
    // <QRCode
    //   size={512}
    //   style={{
    //     height: "auto",
    //     maxWidth: "100%",
    //     width: "100%",
    //   }}
    //   fgColor="#3262a8"
    //   value={data}
    //   viewBox={`0 0 512 512`}
    // />
  );
}

export default QrCode