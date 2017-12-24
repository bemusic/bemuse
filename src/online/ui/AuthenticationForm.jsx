
import './AuthenticationForm.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import OptionsButton from 'bemuse/app/ui/OptionsButton'
import $ from 'jquery'

export default class AuthenticationForm extends React.Component {
  onButtonClick = (e) => {
    e.preventDefault()
    this.props.onSubmit({
      username: ReactDOM.findDOMNode(this.refs.username).value,
      password: ReactDOM.findDOMNode(this.refs.password).value,
      passwordConfirmation: ReactDOM.findDOMNode(this.refs.passwordConfirmation).value,
      email: ReactDOM.findDOMNode(this.refs.email).value
    })
  };

  componentDidMount () {
    $(ReactDOM.findDOMNode(this)).on('keydown keyup keypress', (e) => {
      e.stopPropagation()
    })
  }

  render () {
    return <form className='AuthenticationForm'>
      <div className='AuthenticationFormのgroup'>
        <label>
          <span className='AuthenticationFormのlabel'>Username</span>
          <span className='AuthenticationFormのcontrol'>
            <input type='text' defaultValue='' ref='username' />
          </span>
        </label>
        <label hidden={this.props.mode !== 'signUp'}>
          <span className='AuthenticationFormのlabel'>Email</span>
          <span className='AuthenticationFormのcontrol'>
            <input type='email' defaultValue='' ref='email' />
          </span>
        </label>
        <label>
          <span className='AuthenticationFormのlabel'>Password</span>
          <span className='AuthenticationFormのcontrol'>
            <input type='password' defaultValue='' ref='password' />
          </span>
        </label>
        <label hidden={this.props.mode !== 'signUp'}>
          <span className='AuthenticationFormのlabel'>Confirm Password</span>
          <span className='AuthenticationFormのcontrol'>
            <input type='password' defaultValue='' ref='passwordConfirmation' />
          </span>
        </label>
        <div className='AuthenticationFormのbuttons'>
          <OptionsButton onClick={this.onButtonClick}>{this.renderSubmitText()}</OptionsButton>
        </div>
      </div>
    </form>
  }

  renderSubmitText = () => {
    return this.props.mode === 'signUp' ? 'Sign Me Up' : 'Log In'
  };
}
