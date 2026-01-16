'use client'

import { useState } from 'react'
import axios from 'axios'

export default function OrderStatus() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderId.trim()) return

    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/orders/${orderId}/status`
      )
      setOrder(response.data)
    } catch (err: any) {
      setError('Orden no encontrada en registros.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={orderId}
            onChange={(e) => {
              const value = e.target.value
              setOrderId(value)
              setError(null)
            }}
            placeholder="ID de Orden (ej: 104 o ORD-104)..."
            className="tech-input w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !orderId}
          className="premium-button shadow-none !py-3 !px-6"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <span>BUSCAR</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="text-xs text-rose-600 font-medium px-1">
          {error}
        </div>
      )}

      {order && (
        <div className="clinical-card p-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex justify-between items-center mb-3">
            <span className="clinical-badge bg-slate-100 text-slate-500 border-slate-200">
              #{order.order_number}
            </span>
            <div className={`w-2.5 h-2.5 rounded-full ring-4 ring-opacity-20 ${order.status === 'completed'
              ? 'bg-emerald-500 ring-emerald-500'
              : 'bg-amber-500 ring-amber-500'
              }`}></div>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-slate-900 capitalize tracking-tight">{order.status}</p>
            <p className="text-xs text-slate-400 font-medium" suppressHydrationWarning>Actualizado: {new Date(order.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      )}
    </div>
  )
}
