'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Role } from '@/types'

interface Props {
  children: React.ReactNode
  role: Role
  email: string
}

const sellerLinks = [
  { href: '/dashboard', label: 'My Listings', icon: '📋' },
  { href: '/listings/new', label: 'New Listing', icon: '➕' },
]

const buyerLinks = [
  { href: '/opportunities', label: 'Opportunities', icon: '🔍' },
  { href: '/opportunities#requests', label: 'My Requests', icon: '📩' },
]

export default function DashboardShell({ children, role, email }: Props) {
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const links = role === 'seller' ? sellerLinks : buyerLinks

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/acquiro-logo.png" alt="Acquiro" style={{ height: 32, width: 'auto', filter: 'brightness(0) invert(1)' }} />
        </div>
        <nav className="sidebar-nav">
          {links.map(l => (
            <a key={l.href} href={l.href} className="sidebar-link">
              <span>{l.icon}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: '24px 24px 0', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 10, wordBreak: 'break-all' }}>{email}</p>
          <span style={{ fontSize: 11, background: 'rgba(244,163,0,.15)', color: 'var(--gold)', padding: '3px 8px', borderRadius: 12, textTransform: 'capitalize', display: 'inline-block', marginBottom: 16 }}>{role}</span>
          <button onClick={signOut} className="btn btn-ghost btn-sm btn-full" style={{ borderColor: 'rgba(255,255,255,.2)', color: 'rgba(255,255,255,.6)' }}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  )
}
