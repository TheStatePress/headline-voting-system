import React, { Component } from 'react';
import urljoin from 'url-join';
import axios from 'axios';
import { apiURL } from './config.js';
import io from 'socket.io-client';
import { sortBy, prop } from 'ramda';

import logo from './logo.png';
import Headline from './Headline';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = io.connect(apiURL);
    this.state = {
      headlineInput: '',
      user: '',
      headlines: {},
      sortedHeadlines: []
    }
    this.getHeadlines = this.getHeadlines.bind(this);
    this.submitHeadline = this.submitHeadline.bind(this);
  }

  componentDidMount() {
    this.getHeadlines();
    document.onscroll = () => {
      const ah = document.getElementById('App-header');
      if (window.scrollY > 1) {
        ah.className = 'shadow';
      } else {
        ah.className = '';
      }
    }
  }

  getHeadlines() {
    console.log('here')
    axios.get(urljoin(apiURL, '/headlines'))
      .then(headlines => {
        const sortedHeadlines = sortBy(prop('votes'), Object.values(headlines.data))
        this.setState({
          headlines: headlines.data,
          sortedHeadlines
        })
        console.log('asdf')
        console.log(sortedHeadlines);
        console.log(headlines.data)
      })
  }

  submitHeadline(e) {
    e.preventDefault();
    axios.post(urljoin(apiURL, '/headlines'), {
      headline: this.state.headlineInput,
      user: this.state.user
    }).then(() => this.getHeadlines());

    this.setState({
      headlineInput: ''
    })
  }

  receiveHeadlineUpdate() {

  }

  render() {
    return (
      <div className="App">
        <div id="App-header">
          <div>
            <img src={logo} />
            {/* <h1>Stale Mess Headline Voting System</h1> */}
          </div>
        </div>
        <div className="headline-area">
          <ul className='list-reset'>
            {(this.state.sortedHeadlines).map(headline => (
              <Headline key={headline.id} headline={headline} />
            ))}
          </ul>
        </div>
        <div className="form-container">
          <form onSubmit={this.submitHeadline}>
            <input value={this.state.user} onChange={(e) => this.setState({ user: e.target.value })} type="email" name="headline" placeholder="your email"></input>
            <input value={this.state.headlineInput} onChange={(e) => this.setState({ headlineInput: e.target.value })} type="text" name="headline" placeholder="suggest a headline"></input>
            <input type="submit" value="submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default App;
