import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { getUserId } from '~/services/auth.server'
import { getEvents } from '~/services/events/events.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'Revent app' },
    { name: 'description', content: 'Revent' },
  ]
}

export async function loader(args: LoaderFunctionArgs) {
  const userId = await getUserId(args)
  console.log(`🚀 ~ loader ~ userId:`, userId)
  const events = await getEvents({ userId })
  console.log(`🚀 ~ loader ~ events:`, events)

  if (!events) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ events, userId })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <div>
      <h1 className="not-prose font-extrabold text-2xl text-base-content">
        Revent home page
      </h1>
      {data.events.map(event => (
        <li key={event.id}>
          <Link className="text-secondary font-extrabold" to={`/event/${event.id}`}>{event.title}</Link>
        </li>
      ))}
    </div>
  )
}
