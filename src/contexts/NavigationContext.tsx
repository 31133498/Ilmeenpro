import { createContext, useContext, useReducer, ReactNode } from 'react'

type Screen = 'home' | 'scan' | 'reader' | 'sessions' | 'session-detail'

type ScreenParams = {
  sessionId?: string
}

type NavigationEntry = {
  screen: Screen
  params: ScreenParams
}

type NavigationAction = 
  | { type: 'PUSH'; screen: Screen; params?: ScreenParams }
  | { type: 'POP' }
  | { type: 'REPLACE'; screen: Screen; params?: ScreenParams }

const NavigationContext = createContext<{
  stack: NavigationEntry[]
  push: (screen: Screen, params?: ScreenParams) => void
  pop: () => void
  replace: (screen: Screen, params?: ScreenParams) => void
  currentScreen: Screen | null
} | null>(null)

function navigationReducer(state: NavigationEntry[], action: NavigationAction): NavigationEntry[] {
  switch (action.type) {
    case 'PUSH':
      return [...state, { screen: action.screen, params: action.params || {} }]
    case 'POP':
      return state.length > 1 ? state.slice(0, -1) : state
    case 'REPLACE':
      return state.length > 0 
        ? [...state.slice(0, -1), { screen: action.screen, params: action.params || {} }]
        : [{ screen: action.screen, params: action.params || {} }]
    default:
      return state
  }
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [stack, dispatch] = useReducer(navigationReducer, [{ screen: 'home', params: {} }])

  const push = (screen: Screen, params?: ScreenParams) => dispatch({ type: 'PUSH', screen, params })
  const pop = () => dispatch({ type: 'POP' })
  const replace = (screen: Screen, params?: ScreenParams) => dispatch({ type: 'REPLACE', screen, params })

  const currentScreen = stack[stack.length - 1]?.screen || 'home'

  return (
    <NavigationContext.Provider value={{ stack, push, pop, replace, currentScreen }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) throw new Error('useNavigation must be used within NavigationProvider')
  return context
}

