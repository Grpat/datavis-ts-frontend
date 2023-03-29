import './styles/globals.css'



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html>
      <head />

        <body className="map-background min-h-screen">

          <main className="">
            {children}
          </main>

        </body>
      </html>
  )
}

