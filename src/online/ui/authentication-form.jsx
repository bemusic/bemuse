
import './authentication-form.scss'
import React from 'react'
import OptionsButton from 'bemuse/app/ui/options-button'

export default React.createClass({
  onButtonClick(e) {
    e.preventDefault()
    this.props.onSubmit({
      username:             React.findDOMNode(this.refs.username).value,
      password:             React.findDOMNode(this.refs.password).value,
      passwordConfirmation: React.findDOMNode(this.refs.passwordConfirmation).value,
      email:                React.findDOMNode(this.refs.email).value,
    })
  },
  render() {
    return <form className="authentication-form">
      <div className="authentication-form--group">
        <label>
          <span className="authentication-form--label">Username</span>
          <span className="authentication-form--control">
            <input type="text" defaultValue="" ref="username" />
          </span>
        </label>
        <label hidden={this.props.mode !== 'signUp'}>
          <span className="authentication-form--label">Email</span>
          <span className="authentication-form--control">
            <input type="email" defaultValue="" ref="email" />
          </span>
        </label>
        <label>
          <span className="authentication-form--label">Password</span>
          <span className="authentication-form--control">
            <input type="password" defaultValue="" ref="password" />
          </span>
        </label>
        <label hidden={this.props.mode !== 'signUp'}>
          <span className="authentication-form--label">Confirm Password</span>
          <span className="authentication-form--control">
            <input type="password" defaultValue="" ref="passwordConfirmation" />
          </span>
        </label>
        <div className="authentication-form--buttons">
          <OptionsButton onClick={this.onButtonClick}>{this.renderSubmitText()}</OptionsButton>
        </div>
      </div>
    </form>
  },
  renderSubmitText() {
    return this.props.mode === 'signUp' ? 'Sign Me Up' : 'Log In'
  },
})
