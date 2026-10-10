'use client'

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'

const PROFILE_URL = 'https://yutaro.me'

const QR_MATRIX = [
  '111111100010101111111',
  '100000101010101000001',
  '101110101011001011101',
  '101110100000101011101',
  '101110101111101011101',
  '100000101110001000001',
  '111111101010101111111',
  '000000001000000000000',
  '110100110011101110110',
  '010001001101000111111',
  '111010111111011010010',
  '110100001000101101001',
  '001111100101010000001',
  '000000001001000010011',
  '111111101111111010101',
  '100000100101000110010',
  '101110100011001100110',
  '101110101111000001011',
  '101110100010110100001',
  '100000101111001011001',
  '111111101110011100000',
]

const QR_PATH = QR_MATRIX.flatMap((row, y) =>
  [...row].map((cell, x) => (cell === '1' ? `M${x} ${y}h1v1H${x}z` : ''))
).join('')

function QrCode({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 29 29"
      className={className}
      role="img"
      aria-label="yutaro.me QR code"
      shapeRendering="crispEdges"
    >
      <rect width="29" height="29" fill="white" />
      <path d={QR_PATH} transform="translate(4 4)" fill="currentColor" />
    </svg>
  )
}

function QrIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14 14h2v2h-2zM18 14h2v2h-2zM16 16h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function ProfileQrButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimer.current) {
        clearTimeout(copiedTimer.current)
      }
    }
  }, [])

  const copyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE_URL)
      setCopied(true)
      if (copiedTimer.current) {
        clearTimeout(copiedTimer.current)
      }
      copiedTimer.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="QRコードを表示"
        onClick={() => setOpen(true)}
        className="absolute right-3 bottom-3 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gray-900 text-white shadow-lg transition hover:scale-105 hover:bg-gray-700 dark:border-gray-950 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
      >
        <QrIcon className="h-6 w-6" />
      </button>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-80" onClose={setOpen}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-950/70 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="ease-in duration-150"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <DialogPanel className="w-full max-w-sm rounded-lg bg-white p-5 text-center shadow-xl dark:bg-gray-900">
                <div className="flex items-start justify-between gap-4 text-left">
                  <div>
                    <DialogTitle className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                      yutaro
                    </DialogTitle>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{PROFILE_URL}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="閉じる"
                    onClick={() => setOpen(false)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700">
                  <QrCode className="mx-auto h-auto w-full max-w-72 text-gray-950" />
                </div>

                <button
                  type="button"
                  onClick={copyProfileUrl}
                  className="mt-5 w-full rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                >
                  {copied ? 'コピーしました' : 'リンクをコピー'}
                </button>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
