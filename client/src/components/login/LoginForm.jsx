import React from 'react';
import axios from 'axios';
import utils from '../../../utils';
import Signup from '../signup/Signup.jsx';
import FormError from '../FormError.jsx';
import FormField from '../FormField.jsx';

import {
  BrowserRouter as Router,
  HashRouter,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      username: '',
      password: '',
      failedLogin: false,
      blankSubmit: false
    };
    this.toggleAuth = props.toggleAuth;
  }

  updateState(event) {
    this.setState({[event.target.name]: event.target.value });
  };

  handleEnter(event) {
    if(event.key === 'Enter') {
      this.processForm();
    }
  };

  processForm() {
    this.state.blankSubmit = false;
    this.state.failedLogin = false;
    if(this.state.username === '' || this.state.password === '') {
      this.setState({blankSubmit: true, password: ''});
    } else {
      let loginCreds = {
        username: this.state.username,
        password: this.state.password
      };
      this.processLogin(loginCreds);
    }
  }

  processLogin(params) {
    axios.post( '/login', params, { headers: {} })
    .then((response) => {
      this.toggleAuth(true);
      this.props.history.push("/home");
    })
    .catch((error) => {
      if(error) {
        if(error.response.status === 422 || error.response.status === 404) {
          this.setState({failedLogin:true});
        } else {
          console.log(error.response);
        }
      }
    });
  }

  render() {
      return (
        <div>
          <FormError check={this.state.blankSubmit} message={'*Your username and password cannot be blank'} />
          <FormError check={this.state.failedLogin} message={'*There was a problem with your login'} />
          <FormField
            txtId={'Username'}
            fieldName={'username'}
            updateState={this.updateState.bind(this)}
            handleEnter={this.handleEnter.bind(this)} />
          <FormField
            txtId={'Password'}
            fieldName={'password'}
            updateState={this.updateState.bind(this)}
            handleEnter={this.handleEnter.bind(this)}
            isPassword={true} />
          <button type="button" onClick={() => this.processForm() } >Submit</button>

          <HashRouter>
            <div>
              <Link to="/signup">Signup Form</Link>
              <Route path="/signup" component={Signup} />
            </div>
          </HashRouter>
        </div>
        )
  }
}

export default withRouter(LoginForm);