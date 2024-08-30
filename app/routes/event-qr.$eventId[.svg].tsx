import { LoaderFunctionArgs } from "@remix-run/node";
import { generateQRCode } from "../lib/QRCode.server";

export async function loader(args: LoaderFunctionArgs) {
    const { eventId } = args.params
    const url = new URL(args.request.url)
    const eventURL = `${url.origin}/event/${eventId}`
    try {
        const qr = await generateQRCode(eventURL)
        return new Response(qr as string, {
          status: 200,
          headers: {
            "Content-Type": "image/svg+xml",
          },
        });
        
    } catch (error) {
        throw new Response('Not Found', { status: 404 })
    }
  }
