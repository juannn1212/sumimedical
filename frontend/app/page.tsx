'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import OrdersList from '@/components/OrdersList'
import OrderStatus from '@/components/OrderStatus'

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <main className="min-h-screen pb-20 selection:bg-sky-100 selection:text-sky-900">

      {/* FLOATING GLASS NAVBAR */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/20 rounded-2xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-sky-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Sumi<span className="text-sky-600">Medical</span></span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/50 rounded-full border border-slate-200/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-slate-600">Sistema Operativo</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-white shadow-sm flex items-center justify-center text-slate-600 font-bold">
              DR
            </div>
          </div>
        </nav>
      </div>

      <div className="pt-32 container mx-auto px-6 max-w-7xl">

        {/* HERO SECTION */}
        <div className="mb-12 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Panel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Control Clínico</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl font-medium">
            Gestión inteligente de importaciones y seguimiento de expedientes médicos en tiempo real.
          </p>
        </div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT COLUMN: WIDGETS */}
          <div className="lg:col-span-1 space-y-8 sticky top-28">

            {/* UPLOAD CARD */}
            <div className="luxe-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-32 h-32 text-sky-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-4 4 4h-3v4h-2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="mb-1">📂</span> Importar Datos
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Sube archivos CSV o JSON para procesar nuevas órdenes masivamente.
              </p>
              <FileUpload onSuccess={handleUploadSuccess} />
            </div>

            {/* STATUS CHECK CARD */}
            <div className="luxe-card p-6 border-l-4 border-l-indigo-500">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="mb-1">🔍</span> Rastreo Rápido
              </h3>
              <OrderStatus />
            </div>

          </div>

          {/* RIGHT COLUMN: DATA LIST */}
          <div className="lg:col-span-2">
            <div className="luxe-card min-h-[600px] flex flex-col overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Expedientes Activos</h2>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Base de Datos Principal</p>
                </div>

              </div>
              <div className="p-8 flex-1">
                <OrdersList refreshKey={refreshKey} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
