import React, { Component, } from 'react';
import { apiURL, } from './config.js';
import io from 'socket.io-client';
import * as R from 'ramda';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome';
import { faEnvelope, } from '@fortawesome/free-regular-svg-icons';


import logo from './logo.png';
import './App.css';
import HeadlineContainer from './HeadlineContainer.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.socket = io.connect(apiURL);
    this.state = {
      user: '',
      tempUser: '',
    };
  }

  render() {
    const {
      user,
      tempUser,
    } = this.state;
    return (
      <div className="App">
        <div id="App-header">
          <div>
            <img alt="The Stale Mess" src={logo} />
          </div>
        </div>
        {R.isNil(user) || user.length === 0
          ? <div className="centering">
            <form onSubmit={() => { this.setState({ user: tempUser, }); }}>
              <div style={{ display: 'block', }}>
                <h4>Welcome to the stale mess headline voting system</h4>
                <p>(taking suggestions on better names)</p>
                <h4>Here's how this works:</h4>
                <ol style={{ display: 'block', }}>
                  <li>Log In</li>
                  <li>Submit up to 2 Headlines</li>
                  <li>Vote on up to 3 headlines</li>
                </ol>
              </div>
              <div>
                <input className="auto" value={tempUser} onChange={(e) => { this.setState({ tempUser: e.target.value, }); }} type="email" placeholder="enter the email your editor knows about" />
                <button type="submit"><FontAwesomeIcon icon={faEnvelope} size="2x" /></button>
              </div>
            </form>
          </div>
          : (<HeadlineContainer user={user} socket={this.socket} />)
        }
      </div>
    );
  }
}

export default App;
