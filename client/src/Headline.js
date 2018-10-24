import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons'
import { faArrowAltCircleDown } from '@fortawesome/free-regular-svg-icons'

import './Headline.css';

const upvoteButton = (headline, upvoteFunc, unvoteFunc ) => {
  const { selfVotes } = headline;
  switch (selfVotes) {
    case -1:
      return (<FontAwesomeIcon className="vote-button hidden up" size="lg" icon={faArrowAltCircleUp} />);
    case 1:
      return (<FontAwesomeIcon onClick={() => { unvoteFunc(headline.id) }} className="vote-button voted up" size="lg" icon={faArrowAltCircleUp} />);
    default:
      return (<FontAwesomeIcon onClick={() => { upvoteFunc(headline.id) }} className="vote-button up" size="lg" icon={faArrowAltCircleUp} />);
  }
};

const downvoteButton = (headline, downvoteFunc, unvoteFunc ) => {
  const { selfVotes } = headline;
  switch (selfVotes) {
    case 1:
      return (<FontAwesomeIcon className="vote-button hidden up" size="lg" icon={faArrowAltCircleDown} />);
    case -1:
      return (<FontAwesomeIcon onClick={() => { unvoteFunc(headline.id) }} className="vote-button voted down" size="lg" icon={faArrowAltCircleDown} />);
    default:
      return (<FontAwesomeIcon onClick={() => { downvoteFunc(headline.id) }} className="vote-button down" size="lg" icon={faArrowAltCircleDown} />);
  }
};

const Headline = ({ headline, upvoteFunc, unvoteFunc, downvoteFunc }) => (
  <li>
    <div className="voteContainer">
      {upvoteButton(headline, upvoteFunc, unvoteFunc)}
      <span>[{headline.votes}]</span>
      {downvoteButton(headline, downvoteFunc, unvoteFunc)}
    </div>
    <div>
      <h3>{headline.headline}</h3>
    </div>
  </li>
);

export default Headline;