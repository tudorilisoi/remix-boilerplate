import QRCode from 'qrcode'

const generateQRCode = (value: string) => {
  return new Promise((resolve, reject) => {
    QRCode.toString(value, {type:'svg'}, function (err, data) {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}
export { generateQRCode }
