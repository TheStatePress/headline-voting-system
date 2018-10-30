import React, { Component, } from 'react';
import FlipMove from 'react-flip-move';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome';
import { faPaperPlane, } from '@fortawesome/free-solid-svg-icons';
import * as R from 'ramda';
import urljoin from 'url-join';
import axios from 'axios';

import { apiURL, } from './config.js';
import Headline from './Headline';

const getSortedIds = (headlineByIdMap) => {
  return R.map(
    R.prop('id'),
    R.sort(R.descend(R.prop('votes')), R.values(headlineByIdMap))
  );
};

const getCountOfSubmittedHeadlines = (headlineByIdMap, currentUserId) => {
  const num = R.reduce((acc, headline) => R.add(headline.author === currentUserId, acc), 0, Object.values(headlineByIdMap));
  return num;
};

export default class HeadlineContainer extends Component {
  constructor(props) {
    super(props);

    this.getHeadlines = this.getHeadlines.bind(this);
    this.submitHeadline = this.submitHeadline.bind(this);
    this.delete = this.delete.bind(this);
    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.unvote = this.unvote.bind(this);
    this.receiveHeadlineVotes = this.receiveHeadlineVotes.bind(this);
    this.receiveHeadlineDeletion = this.receiveHeadlineDeletion.bind(this);
    this.receiveNewHeadline = this.receiveNewHeadline.bind(this);

    this.props.socket.on('RECEIVE_HEADLINE_VOTE', this.receiveHeadlineVotes);
    this.props.socket.on('HEADLINE_DELETED', this.receiveHeadlineDeletion);
    this.props.socket.on('HEADLINE_CREATED', this.receiveNewHeadline);

    this.state = {
      currentUserId: null,
      headlineByIdMap: {},
      headlineInput: '',
    };
  };

  componentDidMount() {
    this.getHeadlines();
  }

  getHeadlines() {
    axios.get(urljoin(apiURL, '/headlines'), { params: { email: this.props.user, }, })
      .then(headlines => {
        this.setState({
          headlineByIdMap: headlines.data.headlines,
          currentUserId: headlines.data.yourUserId,
        });
      });
  }

  submitHeadline(e) {
    e.preventDefault();
    axios.post(urljoin(apiURL, '/headlines'), {
      headline: this.state.headlineInput,
      user: this.props.user,
    });

    this.setState({
      headlineInput: '',
    });
    return false;
  }

  getSpecificHeadline(id) {
  }

  receiveNewHeadline(headline) {
    this.setState({
      headlineByIdMap: R.assoc(headline.id, headline, this.state.headlineByIdMap),
    });
  }

  receiveHeadlineVotes({ id, votes, }) {
    const { headlineByIdMap, } = this.state;
    this.setState({
      headlineByIdMap: R.assocPath([id, 'votes',], votes, headlineByIdMap),
    });
  }

  receiveHeadlineDeletion({ id, }) {
    this.setState({
      headlineByIdMap: R.omit([ id, ], this.state.headlineByIdMap),
    });
  }

  delete(id) {
    const { user, } = this.props;
    axios.post(urljoin(apiURL, '/headlines', String(id), 'delete'), {
      email: user,
    });
  }

  upvote(id) {
    const { headlineByIdMap, } = this.state;
    this.setState({
      headlineByIdMap: R.assocPath([id, 'selfVotes',], 1, headlineByIdMap),
    });
    axios.post(urljoin(apiURL, '/headlines', String(id), '/vote'), {
      email: this.props.user,
      direction: 1,
    });
  }

  downvote(id) {
    const { headlineByIdMap, } = this.state;
    this.setState({
      headlineByIdMap: R.assocPath([id, 'selfVotes',], -1, headlineByIdMap),
    });
    axios.post(urljoin(apiURL, '/headlines', String(id), '/vote'), {
      email: this.props.user,
      direction: -1,
    });
  }

  unvote(id) {
    let { headlineByIdMap, } = this.state;
    this.setState({
      headlineByIdMap: R.assocPath([id, 'selfVotes',], 0, headlineByIdMap),
    });
    axios.post(urljoin(apiURL, '/headlines', String(id), '/unvote'), {
      email: this.props.user,
    });
  }

  render() {
    const {
      currentUserId,
      headlineByIdMap,
      headlineInput,
    } = this.state;
    return (
      <div>
        <div className="headline-area">
          {Object.keys(headlineByIdMap).length === 0 && <p>No submissions yet. Be the first!</p>}
          <ul className='list-reset'>
            <FlipMove enterAnimation="fade" leaveAnimation="fade">
              {(getSortedIds(headlineByIdMap)).map(id => (
                <Headline
                  key={id}
                  currentUserId={currentUserId}
                  deleteFunc={this.delete}
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
          {getCountOfSubmittedHeadlines(headlineByIdMap, currentUserId) < 2 && <form onSubmit={this.submitHeadline}>
            <div>
              <input className="auto" value={headlineInput} onChange={(e) => this.setState({ headlineInput: e.target.value, })} type="text" name="headline" placeholder="suggest a headline"></input>
              <button type="submit"><FontAwesomeIcon icon={faPaperPlane} size="2x" /></button>
            </div>
          </form>}
        </div>
      </div>
    );
  }
}