import { QRCode } from 'antd'
import image from '../../src/styles/carrefour-logo.png'

const QrCode = ({ data }: any) => {
  return (
    <QRCode
      errorLevel='H'
      value={data}
      icon={image}
      size={230}
      color='#3262a8'
      style={{
        margin: 'auto',
      }}
    />
  )
}

export default QrCode
