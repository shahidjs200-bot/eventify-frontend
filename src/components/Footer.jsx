import React from 'react'

const Footer = () => {
  return (
    <>
     <footer className="bg-purple-600 text-white mt-20 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="font-semibold mb-4">Use Eventify</h3>
            <ul className="space-y-1">
              <li>Create Events</li>
              <li>Pricing</li>
              <li>Mobile App</li>
              <li>Help Center</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Plan Events</h3>
            <ul className="space-y-1">
              <li>Sell Tickets</li>
              <li>Marketing Tools</li>
              <li>QR Check-in</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Find Events</h3>
            <ul className="space-y-1">
              <li>Mumbai</li>
              <li>Delhi</li>
              <li>Pune</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-1">
              <li>Instagram</li>
              <li>LinkedIn</li>
              <li>Twitter</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-purple-100 mt-8 text-sm">
          © 2025 Eventify — Your Event Platform
        </p>
      </footer>
    </>
  )
}

export default Footer