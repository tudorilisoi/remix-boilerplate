import { SignedIn, SignedOut, UserButton } from '@clerk/remix'
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { ClientQRCode } from '~/lib/QRCode'
import { getUserId } from '~/services/auth.server'
import { getEvent, getEvents } from '~/services/events/events.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export async function loader(args: LoaderFunctionArgs) {
  const userId = await getUserId(args)
  const { eventId } = args.params
  console.log(`🚀 ~ loader ~ userId:`, userId)
  const event = await getEvent({ id: eventId, userId })
  console.log(`🚀 ~ loader ~ event:`, event)

  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ event, userId })
}

export default function EventPage() {
  const { event } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1 className="bg-primary">{event.title}</h1>
      <div>{event.body}</div>
      <Link to={`/events/upsert/${event.id}`}>{'Update event'}</Link>
    </div>
  )
}
