'use client'

import { useEffect, useRef } from 'react'
import { Terminal as T } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

export function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const term = useRef<T | null>(null)

  useEffect(() => {
    if (!terminalRef.current) return

    const fitAddon = new FitAddon()
    const xterm = new T({ cursorBlink: true })
    xterm.loadAddon(fitAddon)
    xterm.open(terminalRef.current)
    fitAddon.fit()
    xterm.write('Bienvenue dans le terminal web !\r\n')

    // Exemple d’interaction simple
    xterm.onData(data => {
      xterm.write(data) // echo
    })

    term.current = xterm

    return () => xterm.dispose()
  }, [])

//   return <div ref={terminalRef} className="w-full h-96 bg-black overflow-hidden rounded-md shadow-sm p-4" />

  return <></>
}
