import './AuthenticationForm.scss'

import OptionsButton from 'bemuse/app/ui/OptionsButton'
import React, { KeyboardEvent, MouseEvent, useRef } from 'react'

export interface AuthenticationFormData {
  username: string
  password: string
  passwordConfirmation: string
  email: string
}

export type AuthMode = 'logIn' | 'signUp'

export interface AuthenticationFormProps {
  onSubmit: (formData: AuthenticationFormData) => void
  mode: AuthMode
}

const AuthenticationForm = ({ onSubmit, mode }: AuthenticationFormProps) => {
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const passwordConfirmRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const onButtonClick = (e: MouseEvent) => {
    e.preventDefault()
    onSubmit({
      username: usernameRef.current?.value ?? '',
      password: passwordRef.current?.value ?? '',
      passwordConfirmation: passwordConfirmRef.current?.value ?? '',
      email: emailRef.current?.value ?? '',
    })
  }
  const preventPropagate = (e: KeyboardEvent<HTMLFormElement>) => {
    e.stopPropagation()
  }

  return (
    <form
      className='AuthenticationForm'
      onKeyDown={preventPropagate}
      onKeyUp={preventPropagate}
      onBeforeInput={preventPropagate}
    >
      <div className='AuthenticationFormのgroup'>
        <label>
          <span className='AuthenticationFormのlabel'>Username</span>
          <span className='AuthenticationFormのcontrol'>
            <input type='text' defaultValue='' ref={usernameRef} />
          </span>
        </label>
        <label hidden={mode !== 'signUp'}>
          <span className='AuthenticationFormのlabel'>Email</span>
          <span className='AuthenticationFormのcontrol'>
            <input type='email' defaultValue='' ref={emailRef} />
          </span>
        </label>
        <label>
          <span className='AuthenticationFormのlabel'>Password</span>
          <span className='AuthenticationFormのcontrol'>
            <input type='password' defaultValue='' ref={passwordRef} />
          </span>
        </label>
        <label hidden={mode !== 'signUp'}>
          <span className='AuthenticationFormのlabel'>Confirm Password</span>
          <span className='AuthenticationFormのcontrol'>
            <input type='password' defaultValue='' ref={passwordConfirmRef} />
          </span>
        </label>
        <div className='AuthenticationFormのbuttons'>
          <OptionsButton onClick={onButtonClick}>
            {mode === 'signUp' ? 'Sign Me Up' : 'Log In'}
          </OptionsButton>
        </div>
      </div>
    </form>
  )
}

export default AuthenticationForm
