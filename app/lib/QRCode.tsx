import { QRCodeCanvas } from 'qrcode.react'
import { ClientOnly } from 'remix-utils/client-only'

type QRCCProps = React.ComponentProps<typeof QRCodeCanvas>
const ClientQRCode: React.FC<QRCCProps> = props => (
  <ClientOnly fallback={null}>{() => <QRCodeCanvas {...props} />}</ClientOnly>
)
export { ClientQRCode }
