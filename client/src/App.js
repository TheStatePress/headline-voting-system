import React, { Component } from 'react';
import urljoin from 'url-join';
import axios from 'axios';
import './App.css';
import { apiURL } from './config.js';
import io from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = io.connect(apiURL);
    this.state = {
      headlineInput: '',
      headlines: {}
    }
    this.getHeadlines = this.getHeadlines.bind(this);
    this.submitHeadline = this.submitHeadline.bind(this);
  }

  componentDidMount() {
    this.getHeadlines();
  }

  getHeadlines() {
    console.log('here')
    axios.get(urljoin(apiURL, '/headlines'))
      .then(headlines => {
        this.setState({
          headlines: headlines.data
        })
        console.log('asdf')
        console.log(headlines);
      })
  }

  submitHeadline(e) {
    e.preventDefault();
    axios.post(urljoin(apiURL, '/headlines'), {
      headline: this.state.headlineInput,
      author: 'chuckdries'
    }).then(() => this.getHeadlines());

    this.setState({
      headlineInput: ''
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Stale Mess Headline Voting System</h1>
        </header>
        <div className="headline-area">
          <ul>
            {Object.keys(this.state.headlines).map(key => (
              <li key={key}>{this.state.headlines[key].headline}</li>
            ))}
          </ul>
        </div>
        <form onSubmit={this.submitHeadline}>
          <input value={this.state.headlineInput} onChange={(e) => this.setState({ headlineInput: e.target.value })} type="text" name="headline"></input>
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}

export default App;
