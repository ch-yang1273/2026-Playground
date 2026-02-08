'use client'

import { useState, useEffect } from 'react'

const SIDEBAR_STORAGE_KEY = 'sidebar-open'
const DESKTOP_BREAKPOINT = 1024

export function useSidebarState() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Read from localStorage or use breakpoint default
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT

    // On desktop, always start open. On mobile, use stored value or default to closed
    if (isDesktop) {
      setIsOpen(true)
      localStorage.setItem(SIDEBAR_STORAGE_KEY, 'true')
    } else if (stored !== null) {
      setIsOpen(stored === 'true')
    } else {
      setIsOpen(false)
    }
  }, [])

  const toggle = () => {
    setIsOpen((prev) => {
      const newValue = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(newValue))
      }
      return newValue
    })
  }

  const setIsOpenWithPersistence = (value: boolean) => {
    setIsOpen(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value))
    }
  }

  return {
    isOpen,
    setIsOpen: setIsOpenWithPersistence,
    toggle,
    isMounted,
  }
}
