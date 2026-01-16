'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Order {
  id: number
  order_number: string
  customer: string
  product: string
  quantity: number
  status: string
  created_at: string
}

interface OrdersListProps {
  refreshKey?: number
}

export default function OrdersList({ refreshKey }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)

    try {
      const params: any = { page: currentPage }
      if (statusFilter) {
        params.status = statusFilter
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/orders`,
        { params }
      )

      setOrders(response.data.data)
      setTotalPages(response.data.meta.last_page)
    } catch (err: any) {
      setError('Servidor no responde.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter, refreshKey])

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { badge: string; dot: string; label: string; icon: string }> = {
      pending: {
        badge: 'bg-amber-50 text-amber-700 border-amber-200/60',
        dot: 'bg-amber-500',
        label: 'Pendiente',
        icon: '⏳'
      },
      processing: {
        badge: 'bg-sky-50 text-sky-700 border-sky-200/60',
        dot: 'bg-sky-500',
        label: 'En Proceso',
        icon: '⚙️'
      },
      completed: {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dot: 'bg-emerald-500',
        label: 'Completado',
        icon: '✅'
      },
      failed: {
        badge: 'bg-rose-50 text-rose-700 border-rose-200/60',
        dot: 'bg-rose-500',
        label: 'Error',
        icon: '⚠️'
      },
    }
    return configs[status] || { badge: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400', label: status, icon: 'Unknown' }
  }

  return (
    <div className="space-y-6">
      {/* MODERN TABS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        {/* TABS */}
        <div className="flex flex-wrap gap-2">
          {['', 'pending', 'processing', 'completed', 'failed'].map((status) => {
            const isActive = statusFilter === status;
            const labels: any = { '': 'Todos', 'pending': 'Pendientes', 'processing': 'Procesando', 'completed': 'Completados', 'failed': 'Errores' };
            return (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                  }`}
              >
                {labels[status]}
              </button>
            )
          })}
        </div>

        {/* EXPORT BUTTON */}
        <button
          onClick={() => {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            window.open(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/orders/export?${params.toString()}`, '_blank');
          }}
          className="clean-button text-xs gap-2 !py-2 !px-4 w-full sm:w-auto flex justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Exportar Reporte
        </button>
      </div>

      {/* DATA GRID */}
      <div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-slate-50 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-rose-500 font-medium">{error}</p>
            <button onClick={() => fetchOrders()} className="text-sm underline mt-2 text-slate-500">Reintentar</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <p className="text-4xl mb-2">📭</p>
            <p>No se encontraron registros.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const config = getStatusConfig(order.status)
              return (
                <div
                  key={order.id}
                  className="group bg-white border border-slate-100 rounded-xl p-4 hover:border-sky-300 hover:shadow-[0_4px_14px_0_rgba(14,165,233,0.1)] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* LEFT: ID & ICON */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-slate-400 font-mono text-[10px] group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                      <span className="font-bold text-lg mb-[-4px]">{order.customer.charAt(0)}</span>
                      <span>ID</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{order.customer}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">#{order.order_number}</span>
                        <span className="text-xs text-slate-500">{order.product}</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: METRICS & STATUS */}
                  <div className="flex items-center gap-4 sm:gap-8 justify-between sm:justify-end w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Cantidad</p>
                      <p className="font-mono font-bold text-slate-700">{order.quantity}</p>
                    </div>

                    <div className={`status-pill ${config.badge}`}>
                      <span className="text-[10px]">{config.icon}</span>
                      {config.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            ← Anterior
          </button>
          <div className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 font-mono">
            {currentPage} / {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
