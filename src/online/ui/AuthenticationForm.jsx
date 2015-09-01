
import './AuthenticationForm.scss'
import React from 'react'
import OptionsButton from 'bemuse/app/ui/OptionsButton'
import $ from 'jquery'

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
  componentDidMount() {
    $(React.findDOMNode(this)).on('keydown keyup keypress', (e) => {
      e.stopPropagation()
    })
  },
  render() {
    return <form className="AuthenticationForm">
      <div className="AuthenticationFormのgroup">
        <label>
          <span className="AuthenticationFormのlabel">Username</span>
          <span className="AuthenticationFormのcontrol">
            <input type="text" defaultValue="" ref="username" />
          </span>
        </label>
        <label hidden={this.props.mode !== 'signUp'}>
          <span className="AuthenticationFormのlabel">Email</span>
          <span className="AuthenticationFormのcontrol">
            <input type="email" defaultValue="" ref="email" />
          </span>
        </label>
        <label>
          <span className="AuthenticationFormのlabel">Password</span>
          <span className="AuthenticationFormのcontrol">
            <input type="password" defaultValue="" ref="password" />
          </span>
        </label>
        <label hidden={this.props.mode !== 'signUp'}>
          <span className="AuthenticationFormのlabel">Confirm Password</span>
          <span className="AuthenticationFormのcontrol">
            <input type="password" defaultValue="" ref="passwordConfirmation" />
          </span>
        </label>
        <div className="AuthenticationFormのbuttons">
          <OptionsButton onClick={this.onButtonClick}>{this.renderSubmitText()}</OptionsButton>
        </div>
      </div>
    </form>
  },
  renderSubmitText() {
    return this.props.mode === 'signUp' ? 'Sign Me Up' : 'Log In'
  },
})
