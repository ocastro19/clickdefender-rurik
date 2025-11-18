import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'dark-blue'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  cycleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'dark' 
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verificar localStorage primeiro
    const stored = localStorage.getItem('click-sync-theme') as Theme
    return stored || defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remover classes antigas
    root.classList.remove('light', 'dark', 'dark-blue')
    
    // Adicionar nova classe
    root.classList.add(theme)
    
    // Salvar no localStorage
    localStorage.setItem('click-sync-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  const cycleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark'
      if (prevTheme === 'dark') return 'dark-blue'
      return 'light'
    })
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
    cycleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}