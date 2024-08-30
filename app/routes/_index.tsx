import { SignedIn, SignedOut, UserButton } from '@clerk/remix'
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import { Link } from '@remix-run/react'
import { getUserId } from '~/services/auth.server'
import { getEvents } from '~/services/events/events.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export async function loader(args: LoaderFunctionArgs) {
  const userId = await getUserId(args)
  console.log(`🚀 ~ loader ~ userId:`, userId)
  const event = await getEvents({ userId })
  console.log(`🚀 ~ loader ~ event:`, event)

  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ event, userId })
}

export default function Index() {
  // const data = useLoaderData<typeof loader>()

  return (
    <div>
      <h1 className="bg-primary">Welcome to Remix</h1>
      
      <div>
        <SignedIn>
          <h1>Index route</h1>
          <p>You are signed in!</p>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link to="/sign-in">Sign in</Link>
        </SignedOut>
      </div>
    </div>
  )
}
