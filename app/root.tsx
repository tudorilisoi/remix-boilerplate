// @see https://remix.run/docs/en/main/future/vite#fix-up-css-imports
import { enUS } from '@clerk/localizations'
import { ClerkApp, SignedIn, SignedOut, UserButton } from '@clerk/remix'
import { rootAuthLoader } from '@clerk/remix/ssr.server'
import { json, LinksFunction, LoaderFunction } from '@remix-run/node'
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { Transition } from '@tailwindui/react'
import { useEffect, useState } from 'react'
import { getToast } from 'remix-toast'
import logo from '~/assets/revent-logo.svg'
import '~/css/fonts.css'
import '~/css/init.css'
import stylesheet from '~/css/tailwind.css?url'
import { useStore } from './lib/useStore'
import { ClientOnly } from 'remix-utils/client-only'

export const loader: LoaderFunction = async args => {
  return rootAuthLoader(args, async () => {
    // Add logic to fetch data
    const { toast, headers } = await getToast(args.request)
    return json({ toast, time: new Date().getTime() }, { headers })
  })
}

// export const ErrorBoundary = ClerkErrorBoundary()

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
]

const NavBar = () => {
  // NOTE for the bg highlight the container
  return (
    <header className="fix-scroll bg-base-200 shadow-lg">
      <div className="navbar container mx-auto px-6 py-2">
        <div className="flex-1">
          <Link to={'/'}>
            {/* <span className="btn btn-circle btn-primary normal-case">e3</span> */}
            <img
              src={logo}
              className="h-14 w-14"
              alt="eRădăuţi: ghid rădăuţean din 2005"
            />
          </Link>
        </div>
        <div className="flex-none gap-2 mr-2 text-base-content">
          <Link className="text-secondary font-extrabold" to={'/events/upsert'}>
            {'Create event'}
          </Link>
        </div>
        <div className="flex-none gap-2">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link to="/sign-in">Sign in</Link>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

// see https://www.jacobparis.com/content/remix-form-toast
function Toast({ message, time = 3000 }: { message: string; time?: number }) {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), time)
    return () => clearTimeout(timeout)
  }, [])
  return (
    <Transition
      show={show}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="toast toast-top toast-center">
        <div className="alert alert-info !p-1 !px-2 rounded-md !text-center">
          <span>{message}</span>
        </div>
      </div>
    </Transition>
  )
}

// NOTE exporting this as Layout does not wrap with the ClerkApp

export function XLayout({ children }: { children: React.ReactNode }) {
  // NOTE extensions, Adsense et. al. manipulate the document
  // so using suppressHydrationWarning workaround
  const { toast, time } = useLoaderData<typeof loader>()
  console.log(`🚀 ~ XLayout ~ toast:`, toast, time)
  return (
    <html lang="ro_RO" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <div className="flex flex-col min-h-screen w-full bg-base-100">
          {/* Top Navigation Header */}
          <NavBar />

          {/* 
          Using req time as a key prevents old toasts hanging because 
          if the request is stale the toast will be hidden by its inner state
          */
          }
          <ClientOnly fallback={null}>
            {() =>
              toast ? <Toast key={time} message={toast.message} /> : null
            }
          </ClientOnly>

          {/* Main Content; NOTE: flex-grow flex flex-col inherits height */}
          <div className={' flex-grow flex flex-col fix-scroll'}>
            <main
              className={' py-6 px-6 container mx-auto flex-grow flex flex-col'}
            >
              {/* <div className="container mx-auto py-6 px-2"> */}
              {/* Render child components */}
              {children}
              {/* </div> */}
            </main>
          </div>

          {/* Footer */}
          <footer className="bg-base-200  fix-scroll">
            <div className="container mx-auto py-4 px-6">
              {/* Add your footer content here */}
              <p className="text-base-content font-extrabold flex">
                <span className="mr-2">© {new Date().getFullYear()}</span>
                <Link className="mr-2" to={'/'}>
                  {'Revent'}
                </Link>
                <Link to={'/events/upsert'}>{'Create event'}</Link>
              </p>
            </div>
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

// NOTE manually wrap with the XLayout
function RemixApp() {
  return (
    <XLayout>
      <Outlet />
    </XLayout>
  )
}

const App = ClerkApp(RemixApp, { localization: enUS })
export default App
