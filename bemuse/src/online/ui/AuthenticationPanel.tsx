import './AuthenticationPanel.scss'

import AuthenticationForm, {
  AuthMode,
  AuthenticationFormData,
} from './AuthenticationForm'
import React, { useContext, useState } from 'react'

import Flex from 'bemuse/ui/Flex'
import { OnlineContext } from 'bemuse/online/instance'
import Panel from 'bemuse/ui/Panel'
import c from 'classnames'

export interface AuthenticationPanelProps {
  onFinish?: () => void
}

interface AuthState {
  status: 'idle' | 'loading' | 'completed' | 'error'
  message: string
}

const Message = ({ state }: { state: AuthState }) => {
  if (state.status === 'idle' || !state.message) return null
  return (
    <div className={c('AuthenticationPanelのmessage', 'is-' + state.status)}>
      {state.message}
    </div>
  )
}

const modeActiveClass = (targetMode: AuthMode, currentMode: AuthMode) => {
  return targetMode === currentMode ? 'is-active' : ''
}

const AuthenticationPanel = ({ onFinish }: AuthenticationPanelProps) => {
  const online = useContext(OnlineContext)
  const [mode, setMode] = useState<AuthMode>('logIn')
  const [auth, setAuth] = useState<AuthState>({ status: 'idle', message: '' })

  const runPromise = (promise: Promise<string>) => {
    setAuth({
      status: 'loading',
      message: 'Omachi kudasai...',
    })
    promise.then(
      (message) => {
        setAuth({
          status: 'completed',
          message: message,
        })
      },
      (error: Error) => {
        setAuth({
          status: 'error',
          message: error.message,
        })
      }
    )
  }

  const doSignUp = async (formData: AuthenticationFormData) => {
    if (!formData.username.trim()) {
      throw new Error('Please enter a username.')
    }
    if (!formData.username.match(/^\S+$/)) {
      throw new Error('Username may not contain spaces.')
    }
    if (formData.username.length < 2) {
      throw new Error('Username must be at least 2 characters long.')
    }
    if (formData.username.length > 24) {
      throw new Error('Username must be at most 24 characters long.')
    }
    if (!formData.password) {
      throw new Error('Please enter a password.')
    }
    if (formData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.')
    }
    if (!formData.passwordConfirmation) {
      throw new Error('Please confirm your password.')
    }
    if (formData.password !== formData.passwordConfirmation) {
      throw new Error('Passwords do not match.')
    }
    await online.signUp(formData)
    if (onFinish) onFinish()
    return 'Welcome to Bemuse!'
  }

  const doLogIn = async (formData: AuthenticationFormData) => {
    if (!formData.password.trim()) {
      if (window.confirm('Did you forget your password?')) {
        const email = window.prompt('Please enter your email address.')
        if (email) {
          await online.changePassword({ email })
          throw new Error('Please check your email')
        }
      }
    }
    if (!formData.username.trim()) {
      throw new Error('Please enter your username.')
    }
    if (!formData.password.trim()) {
      throw new Error('Please enter your password.')
    }
    return online.logIn(formData).then(() => {
      if (onFinish) onFinish()
      return 'Welcome back!'
    })
  }

  const onSwitchToLogin = () => setMode('logIn')

  const onSwitchToSignUp = () => setMode('signUp')

  const onSubmit = (formData: AuthenticationFormData) => {
    if (mode === 'signUp') {
      runPromise(doSignUp(formData))
    } else {
      runPromise(doLogIn(formData))
    }
  }

  return (
    <div className='AuthenticationPanel'>
      <Panel title='Bemuse Online Ranking'>
        <div className='AuthenticationPanelのlayout'>
          <div className='AuthenticationPanelのtitle'>
            <img
              src={require('bemuse/app/ui/about-scene/DJBM.png')}
              alt='DJ Bemuse'
            />
            <div className='AuthenticationPanelのidentification'>
              Bemuse
              <br />
              Online
              <br />
              Ranking
            </div>
          </div>
          <div className='AuthenticationPanelのcontent'>
            <div className='AuthenticationPanelのmodeSwitcher'>
              <a
                onClick={onSwitchToLogin}
                className={modeActiveClass('logIn', mode)}
              >
                Log In
              </a>{' '}
              &middot;{' '}
              <a
                onClick={onSwitchToSignUp}
                className={modeActiveClass('signUp', mode)}
              >
                Create an Account
              </a>
            </div>
            <Flex grow='2' />
            <Message state={auth} />
            <AuthenticationForm mode={mode} onSubmit={onSubmit} />
            <Flex grow='3' />
          </div>
        </div>
      </Panel>
    </div>
  )
}

export default AuthenticationPanel
