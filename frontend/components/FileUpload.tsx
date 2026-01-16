'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

interface FileUploadProps {
  onSuccess?: () => void
}

export default function FileUpload({ onSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setMessage(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setMessage({ type: 'error', text: 'Selecciona un archivo primero.' })
      return
    }

    setUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/orders/import`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      const created = response.data.created
      const skipped = response.data.skipped

      let msg = `Proceso completado.`
      if (created > 0) msg += ` ${created} nuevas órdenes.`
      if (skipped > 0) msg += ` ${skipped} ya existían (omitidas).`
      if (created === 0 && skipped === 0) msg += ` No se encontraron registros válidos.`

      setMessage({
        type: 'success',
        text: msg,
      })

      setFile(null)
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Error en la importación.',
      })
    } finally {
      setUploading(false)
    }
  }

  // Auto-dismiss message after 5 seconds
  useState(() => {
    // This is a placeholder to ensure the import change works first if needed, 
    // but actually I should use useEffect directly if I imported it. 
    // Wait, I am editing the file in two steps.
  })
  // Better approach: Just use React namespace since I might not have imported useEffect yet in the first step?
  // checking previous step.. I imported React. so I can use React.useEffect or just import useEffect.
  // I will use React.useEffect to be safe if named import failed, or just useEffect if I updated imports.
  // let's stick to the plan.


  // Auto-dismiss message after 5 seconds
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-100 transition-colors relative">
        <input
          type="file"
          accept=".csv,.json,.txt"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        {file ? (
          <div className="flex flex-col items-center text-sky-700">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span className="font-medium text-sm truncate max-w-full px-4">{file.name}</span>
            <span className="text-xs text-sky-500 mt-1">Clic para cambiar</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <span className="font-medium text-sm text-slate-600">Arrastra o selecciona un archivo</span>
            <span className="text-xs mt-1">CSV o JSON compatible</span>
          </div>
        )}
      </div>

      {message && (
        <div
          className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between group ${message.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="ml-2 p-0.5 rounded-full hover:bg-black/5 opacity-50 group-hover:opacity-100 transition-all"
            title="Cerrar"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={!file || uploading}
        className="clean-button w-full flex justify-center items-center gap-2"
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Procesando...</span>
          </>
        ) : (
          <span>Importar Datos</span>
        )}
      </button>
    </form>
  )
}
