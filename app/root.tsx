// @see https://remix.run/docs/en/main/future/vite#fix-up-css-imports
import { roRO } from '@clerk/localizations'
import { ClerkApp } from '@clerk/remix'
import { rootAuthLoader } from '@clerk/remix/ssr.server'
import { LinksFunction, LoaderFunction } from '@remix-run/node'
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import '~/css/fonts.css'
import '~/css/init.css'
import stylesheet from '~/css/tailwind.css?url'

export const loader: LoaderFunction = args => rootAuthLoader(args)

// export const ErrorBoundary = ClerkErrorBoundary()

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
]

export function Layout({ children }: { children: React.ReactNode }) {
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

          {/* Main Content; NOTE: flex-grow flex flex-col inherits height */}
          <div className={' flex-grow flex flex-col fix-scroll'}>
            <main className={' py-6 px-6 container mx-auto flex-grow flex flex-col'}>
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
              <p className="text-base-content font-extrabold">
                © {new Date().getFullYear()}{' '}
                <Link to={'/'}>{'REvents'}</Link>
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

function RemixApp() {
  return <Outlet />
}

const App = ClerkApp(RemixApp, { localization: roRO })
export default App
