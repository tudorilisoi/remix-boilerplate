// @see https://remix.run/docs/en/main/future/vite#fix-up-css-imports
import { enUS } from '@clerk/localizations'
import { ClerkApp, SignedIn, SignedOut, UserButton } from '@clerk/remix'
import { rootAuthLoader } from '@clerk/remix/ssr.server'
import { LinksFunction, LoaderFunction } from '@remix-run/node'
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react'
import logo from '~/assets/revent-logo.svg'
import '~/css/fonts.css'
import '~/css/init.css'
import stylesheet from '~/css/tailwind.css?url'

export const loader: LoaderFunction = args => rootAuthLoader(args)

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
          <Link className='text-primary' to={'/events/upsert'}>{'Create event'}</Link>
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

// NOTE exporting this as Layout does not wrap with the ClerkApp

export function XLayout({ children }: { children: React.ReactNode }) {
  // NOTE extensions, Adsense et. al. manipulate the document
  // so using suppressHydrationWarning workaround
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
