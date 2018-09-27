import React, { Component } from 'react';
import 'whatwg-fetch';

import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signUpEmail: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      masterError: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: '',
      
    };

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.onSingUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);

    // this.newCounter = this.newCounter.bind(this);
    // this.incrementCounter = this.incrementCounter.bind(this);
    // this.decrementCounter = this.decrementCounter.bind(this);
    // this.deleteCounter = this.deleteCounter.bind(this);

    // this._modifyCounter = this._modifyCounter.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;

      //Verify token
      fetch('/api/counter/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          }
        });
    } else {
      this.setState({
          isLoading: false,
      })
    }

    // fetch('/api/counters')
    //   .then(res => res.json())
    //   .then(json => {
    //     this.setState({
    //       counters: json
    //     });
    //   });
  }

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    })
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    })
  }

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    })
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    })
  }

  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value,
    })
  }

  onTextboxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value,
    })
  }

  onSignUp() {
    // Grab state
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state;

    console.log('-onSignUp')
    this.setState({
      isLoading: true
    });

    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      })
      })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading:false,
            signUpFirstName: '',
            signUpLastName: '',
            signUpEmail: '',
            signUpPassword: ''
          })
        }
      });
  }

  onSignIn() {
    // Grab state
    const {
      signInEmail,
      signInPassword
    } = this.state;

    this.setState({
      isLoading: true
    });

    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
      })
      .then(res => res.json())
      .then(json => {
        console.log(json)

        if (json.success) {
          setInStorage('the_main_app', { token: json.token })
          this.setState({
            signInError: json.message,
            isLoading:false,
            signInEmail: '',
            signInPassword: '',
            token: json.token
          })
        }
      });
  }

  logout() {
    this.setState({
      isLoading: true,
    });

    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;

      //Verify token
      fetch('/api/counter/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: '',
              isLoading: false
            });
          }
        });
    } else {
      this.setState({
          isLoading: false,
      })
    }

  }

  newCounter() {
    fetch('/api/counters', { method: 'POST' })
      .then(res => res.json())
      .then(json => {
        let data = this.state.counters;
        data.push(json);

        this.setState({
          counters: data
        });
      });
  }

  incrementCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}/increment`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json);
      });
  }

  decrementCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}/decrement`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json);
      });
  }

  deleteCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}`, { method: 'DELETE' })
      .then(_ => {
        this._modifyCounter(index, null);
      });
  }

  _modifyCounter(index, data) {
    let prevData = this.state.counters;

    if (data) {
      prevData[index] = data;
    } else {
      prevData.splice(index, 1);
    }

    this.setState({
      counters: prevData
    });
  }

  render() {

    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpError,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
     signUpPassword,
      
    } = this.state;

    console.log('-render-', isLoading);
    if (isLoading) {
      return (<div><p>Loading</p></div>)
    }

    if (!token) {
      return (
        <div>
          <div>
            <form>
              <div>
                {
                  (signInError) ? (
                    <p>{signInError}</p>
                  ) : (null)
                }
                <p>Sign In</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={signInEmail} 
                  onChange={this.onTextboxChangeSignInEmail} />
                <br />
                <input
                  type="password"
                  placeholder="Password"
                  value={signInPassword}
                  onChange={this.onTextboxChangeSignInPassword} />
                <br />
                <button onClick={this.onSignIn}>Sign In</button>
              </div>
              <br />
              <br />
              <div>
                {
                  (signUpError) ? (
                    <p>{signUpError}</p>
                  ) : (null)
                }
                <p>Sign Up</p>
                <input
                  type="text"
                  placeholder="First Name"
                  value={signUpFirstName}
                  onChange={this.onTextboxChangeSignUpFirstName} />
                <br />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={signUpLastName}
                  onChange={this.onTextboxChangeSignUpLastName} />
                <br />
                <input
                  type="email"
                  placeholder="Email"
                  value={signUpEmail}
                  onChange={this.onTextboxChangeSignUpEmail} />
                <br />
                <input
                  type="password"
                  placeholder="Password"
                  value={signUpPassword}
                  onChange={this.onTextboxChangeSignUpPassword} />
                <br />
                <button onClick={this.onSignUp}>Sign Up</button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    return (
      <div>
        <p>Account</p>
        <button onClick={this.logout}>Logout</button>
        {/* <p>Counters:</p>

        <ul>
          { this.state.counters.map((counter, i) => (
            <li key={i}>
              <span>{counter.count} </span>
              <button onClick={() => this.incrementCounter(i)}>+</button>
              <button onClick={() => this.decrementCounter(i)}>-</button>
              <button onClick={() => this.deleteCounter(i)}>x</button>
            </li>
          )) }
        </ul>

        <button onClick={this.newCounter}>New counter</button> */}
      </div>
    );
  }
}

export default Home;
