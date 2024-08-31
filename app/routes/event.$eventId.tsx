import { getAuth } from '@clerk/remix/ssr.server'
import {
  ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { getUserId } from '~/services/auth.server'
import { deleteEvent, getEvent } from '~/services/events/events.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export async function action(args: ActionFunctionArgs) {
  const userId = await getUserId(args)
  console.log(`🚀 ~ action ~ userId:`, userId)
  const body = await args.request.formData()
  const eventId = body.get('eventId') as string
  console.log(`🚀 ~ action ~ eventId:`, eventId)
  if (eventId && userId) {
    try {
      await deleteEvent({ id: eventId, userId })
      return redirect(`/`)
    } catch (error) {
      throw new Response('Server error', { status: 500 })
    }
  }
  throw new Response('Bad request', { status: 400 })
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
      <h1 className="not-prose font-extrabold text-2xl text-base-content">
        {event.title}
      </h1>
      <div className="prose whitespace-pre-line">
        <div className="float-right not-prose p-1 pr-0 text-center">
          <div className="flex flex-col gap-2">
            <img
              alt={event.title}
              className="h-[128px]"
              src={`/event-qr/${event.id}.svg`}
            />
            <Link
              className="btn btn-sm btn-secondary"
              to={`/events/upsert/${event.id}`}
            >
              {'Update event'}
            </Link>
            <Form
              method="post"
              onSubmit={event => {
                const response = confirm(
                  'Please confirm you want to delete this record.',
                )
                if (!response) {
                  event.preventDefault()
                }
              }}
            >
              <input type="hidden" name="eventId" value={event.id} />
              <button className="btn btn-sm btn-error w-full" type="submit">
                Delete event
              </button>
            </Form>
          </div>
        </div>
        {event.body}
      </div>
    </div>
  )
}
