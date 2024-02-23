import { Readable } from 'stream'
import { adminStorage } from '../config/firebaseAdmin'

export const firebaseUpload = async (
  buffer: Buffer,
  uid: string,
  ticketId: number,
): Promise<string> => {
  const bucket = adminStorage.bucket()
  const fileName = `tickets/${uid}/${ticketId}.png`
  const file = bucket.file(fileName)
  const contentType = 'image/png'

  await new Promise((resolve, reject) => {
    const writeStream = file.createWriteStream({
      metadata: {
        contentType,
      },
    })

    writeStream.on('error', (error: any) => {
      reject(error)
    })

    writeStream.on('finish', () => {
      resolve(null)
    })

    const bufferStream = new Readable({
      read() {
        this.push(buffer)
        this.push(null)
      },
    })
    bufferStream.pipe(writeStream)
  })

  return fileName
}
