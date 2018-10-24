import React, { Component } from 'react';
import urljoin from 'url-join';
import axios from 'axios';
import { apiURL } from './config.js';
import io from 'socket.io-client';
// import { descend, inc, path, assocPath, prop, sort } from 'ramda';
import * as R from 'ramda';
import FlipMove from 'react-flip-move';


import logo from './logo.png';
import Headline from './Headline';
import './App.css';

const getSortedIds = (headlineByIdMap) => {
  return R.map(
    R.prop('id'),
    R.sort(R.descend(R.prop('votes')), R.values(headlineByIdMap))
  );
}
class App extends Component {
  constructor(props) {
    super(props);

    this.getHeadlines = this.getHeadlines.bind(this);
    this.submitHeadline = this.submitHeadline.bind(this);
    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.unvote = this.unvote.bind(this);
    this.receiveHeadlineVotes = this.receiveHeadlineVotes.bind(this);

    this.socket = io.connect(apiURL);
    this.state = {
      headlineInput: '',
      user: 'chuck@chuckdries.com',
      headlineByIdMap: {}
    }

    this.socket.on('RECEIVE_HEADLINE_VOTE', this.receiveHeadlineVotes)
  }

  componentDidMount() {
    this.getHeadlines();
  }

  getHeadlines() {
    console.log('here')
    axios.get(urljoin(apiURL, '/headlines'), { params: { email: this.state.user } })
      .then(headlines => {
        this.setState({
          headlineByIdMap: headlines.data
        });
      });
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

  getSpecificHeadline(id) {
  }

  receiveNewHeadline(headline) {
  }

  receiveHeadlineVotes({ id, votes }) {
    console.log(votes);
    const { headlineByIdMap } = this.state;
    this.setState({
      headlineByIdMap: R.assocPath([id, 'votes'], votes, headlineByIdMap)
    });
  }

  upvote(id) {
    const { headlineByIdMap } = this.state;
    this.setState({
      headlineByIdMap: R.assocPath([id, 'selfVotes'], 1, headlineByIdMap)
    });
    axios.post(urljoin(apiURL, '/headlines', String(id), '/vote'), {
      email: this.state.user,
      direction: 1
    });
  }
  downvote(id) {
    const { headlineByIdMap } = this.state;
    this.setState({
      headlineByIdMap: R.assocPath([id, 'selfVotes'], -1, headlineByIdMap)
    });
    axios.post(urljoin(apiURL, '/headlines', String(id), '/vote'), {
      email: this.state.user,
      direction: -1
    });
  }
  unvote(id) {
    let { headlineByIdMap } = this.state;
    this.setState({
      headlineByIdMap: R.assocPath([id, 'selfVotes'], 0, headlineByIdMap)
    });
    axios.post(urljoin(apiURL, '/headlines', String(id), '/unvote'), {
      email: this.state.user
    });
  }

  render() {
    const {
      headlineByIdMap,
      headlineInput,
      user
    } = this.state;
    return (
      <div className="App">
        <div id="App-header">
          <div>
            <img alt="The Stale Mess" src={logo} />
          </div>
        </div>
        <div className="headline-area">
          <ul className='list-reset'>
            <FlipMove enterAnimation="fade" leaveAnimation="fade">
              {(getSortedIds(headlineByIdMap)).map(id => (
                <Headline
                  key={id}
                  headline={headlineByIdMap[id]}
                  upvoteFunc={this.upvote}
                  unvoteFunc={this.unvote}
                  downvoteFunc={this.downvote}
                />
              ))}
            </FlipMove>
          </ul>
        </div>
        <div className="form-container">
          <form onSubmit={this.submitHeadline}>
            <input value={user} onChange={(e) => this.setState({ user: e.target.value })} type="email" name="headline" placeholder="your @asu.edu email"></input>
            <input value={headlineInput} onChange={(e) => this.setState({ headlineInput: e.target.value })} type="text" name="headline" placeholder="suggest a headline"></input>
            <input type="submit" value=">" />
          </form>
        </div>
      </div>
    );
  }
}

export default App;
