import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { getUserId } from '~/services/auth.server'
import { getEvent } from '~/services/events/events.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export async function loader(args: LoaderFunctionArgs) {
  const userId = await getUserId(args)
  const { eventId } = args.params
  if (!eventId) {
    throw new Response('Bad request', { status: 400 })
  }
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
      <h1 className="not-prose font-extrabold text-2xl text-base-content">{event.title}</h1>
      <div>{event.body}</div>
      <img
        alt={event.title}
        className="h-[128px]"
        src={`/event-qr/${event.id}.svg`}
      />
      <Link to={`/events/upsert/${event.id}`}>{'Update event'}</Link>
    </div>
  )
}
