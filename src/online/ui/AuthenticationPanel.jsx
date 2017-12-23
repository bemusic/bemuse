
import './AuthenticationPanel.scss'

import React from 'react'
import c from 'classnames'

import Panel from 'bemuse/ui/Panel'
import Flex from 'bemuse/ui/Flex'
import online from 'bemuse/online/instance'

import AuthenticationForm from './AuthenticationForm'

export default class AuthenticationPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mode: 'logIn',
      authentication: {
        status: 'idle',
        message: ''
      }
    }
  }

  onSubmit = (formData) => {
    if (this.state.mode === 'signUp') {
      this.runPromise(this.doSignUp(formData))
    } else {
      this.runPromise(this.doLogIn(formData))
    }
  }

  runPromise = (promise) => {
    this.setState({
      authentication: {
        status: 'loading',
        message: 'Omachi kudasai...'
      }
    })
    promise.then(
      (message) => {
        this.setState({
          authentication: {
            status: 'completed',
            message: message
          }
        })
      },
      (error) => {
        this.setState({
          authentication: {
            status: 'error',
            message: error.message
          }
        })
      }
    )
      .done()
  }

  doSignUp = (formData) => {
    return Promise.try(() => {
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
      return online.signUp(formData).then(() => {
        if (this.props.onFinish) this.props.onFinish()
        return 'Welcome to Bemuse!'
      })
    })
  }

  doLogIn = (formData) => {
    return Promise.try(() => {
      if (!formData.username.trim()) {
        throw new Error('Please enter your username.')
      }
      if (!formData.password.trim()) {
        throw new Error('Please enter your password.')
      }
      return online.logIn(formData).then(() => {
        if (this.props.onFinish) this.props.onFinish()
        return 'Welcome back!'
      })
    })
  }

  onSwitchToLogin = () => {
    this.setState({ mode: 'logIn' })
  }

  onSwitchToSignup = () => {
    this.setState({ mode: 'signUp' })
  }

  render () {
    return <div className='AuthenticationPanel'>
      <Panel title='Bemuse Online Ranking'>
        <div className='AuthenticationPanelのlayout'>
          <div className='AuthenticationPanelのtitle'>
            <img src={require('bemuse/app/ui/about-scene/DJBM.png')} alt='DJ Bemuse' />
            <div className='AuthenticationPanelのidentification'>
              Bemuse<br />Online<br />Ranking
            </div>
          </div>
          <div className='AuthenticationPanelのcontent'>
            <div className='AuthenticationPanelのmodeSwitcher'>
              <a
                href='javascript://online/logIn'
                onClick={this.onSwitchToLogin}
                className={this.renderModeActiveClass('logIn')}>
                Log In
              </a>
              {' '}&middot;{' '}
              <a
                href='javascript://online/signUp'
                onClick={this.onSwitchToSignup}
                className={this.renderModeActiveClass('signUp')}>
                Create an Account
              </a>
            </div>
            <Flex grow='2' />
            {this.renderMessage()}
            <AuthenticationForm mode={this.state.mode} onSubmit={this.onSubmit} />
            <Flex grow='3' />
          </div>
        </div>
      </Panel>
    </div>
  }

  renderMessage = () => {
    let state = this.state.authentication
    if (state.status === 'idle' || !state.message) return null
    return <div className={c('AuthenticationPanelのmessage', 'is-' + state.status)}>
      {state.message}
    </div>
  }

  renderModeActiveClass = (mode) => {
    return mode === this.state.mode ? 'is-active' : ''
  }
}
