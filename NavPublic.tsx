'use client'

import { User } from '@supabase/supabase-js'

interface Props {
  user: User | null
}

export default function NavPublic({ user }: Props) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="/" className="brand">
          <img src="/acquiro-logo.png" alt="Acquiro" style={{ height: 36, width: 'auto', display: 'block' }} />
        </a>
        <div className="nav-links">
          <a href="/#sellers">For sellers</a>
          <a href="/#buyers">For buyers</a>
          <a href="/opportunities">Opportunities</a>
          <a href="/#trust">How it works</a>
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <a href="/opportunities" className="btn btn-ghost btn-sm">Opportunities</a>
              <a href="/dashboard" className="btn btn-teal btn-sm">Dashboard</a>
            </>
          ) : (
            <>
              <a href="/auth?role=buyer" className="btn btn-ghost btn-sm">Buyer access</a>
              <a href="/auth?role=seller" className="btn btn-gold btn-sm">List a business</a>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
