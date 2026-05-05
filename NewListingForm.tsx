'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SECTORS, STATES, REVENUE_BANDS, DEAL_TYPES } from '@/types'

interface Props { sellerId: string }

export default function NewListingForm({ sellerId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    sector: SECTORS[0],
    state: STATES[0],
    lga: '',
    asking_price: '',
    revenue_band: REVENUE_BANDS[0],
    years_operating: '',
    staff_range: '',
    deal_type: DEAL_TYPES[0],
    description: '',
  })

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: insertErr } = await supabase.from('listings').insert({
      ...form,
      seller_id: sellerId,
      status: 'pending',
    })

    if (insertErr) { setError(insertErr.message); setLoading(false); return }
    router.push('/dashboard?submitted=1')
    router.refresh()
  }

  return (
    <form onSubmit={submit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ background: 'var(--teal-3)', borderRadius: 10, padding: '14px 18px', marginBottom: 28, fontSize: 13, color: 'var(--teal)' }}>
        🔒 Your listing will be reviewed before going live. All information is confidential — buyer access requires NDA.
      </div>

      <div className="form-group">
        <label htmlFor="title">Listing title <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(keep it descriptive but general)</span></label>
        <input id="title" required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Profitable food distribution business, Lagos" />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="sector">Sector</label>
          <select id="sector" value={form.sector} onChange={e => set('sector', e.target.value)}>
            {SECTORS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="deal_type">Deal type</label>
          <select id="deal_type" value={form.deal_type} onChange={e => set('deal_type', e.target.value)}>
            {DEAL_TYPES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="state">State</label>
          <select id="state" value={form.state} onChange={e => set('state', e.target.value)}>
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="lga">LGA / City <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
          <input id="lga" value={form.lga} onChange={e => set('lga', e.target.value)} placeholder="e.g. Ikeja" />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="asking_price">Asking price</label>
          <input id="asking_price" required value={form.asking_price} onChange={e => set('asking_price', e.target.value)} placeholder="e.g. ₦45M or negotiable" />
        </div>
        <div className="form-group">
          <label htmlFor="revenue_band">Annual revenue band</label>
          <select id="revenue_band" value={form.revenue_band} onChange={e => set('revenue_band', e.target.value)}>
            {REVENUE_BANDS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="years_operating">Years in operation</label>
          <input id="years_operating" required value={form.years_operating} onChange={e => set('years_operating', e.target.value)} placeholder="e.g. 7 years" />
        </div>
        <div className="form-group">
          <label htmlFor="staff_range">Staff count</label>
          <input id="staff_range" required value={form.staff_range} onChange={e => set('staff_range', e.target.value)} placeholder="e.g. 12–18 staff" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Business description <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(no names, locations, or identifying details)</span></label>
        <textarea
          id="description"
          required
          rows={5}
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Describe the business model, customer base, key assets, why the transaction is being considered, and what you're looking for in a buyer or partner."
        />
      </div>

      <button type="submit" className="btn btn-gold btn-full" disabled={loading} style={{ fontSize: 15, padding: '14px' }}>
        {loading ? 'Submitting…' : 'Submit listing for review'}
      </button>
    </form>
  )
}
