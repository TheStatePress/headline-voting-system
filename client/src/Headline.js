import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons'
import { faArrowAltCircleDown } from '@fortawesome/free-regular-svg-icons'

import './Headline.css';

const Headline = ({ headline }) => (
  <li>
    <div className="voteContainer">
      <FontAwesomeIcon className="vote-button up" size="lg" icon={faArrowAltCircleUp} />
      <span>[{headline.votes}]</span>
      <FontAwesomeIcon className="vote-button down" size="lg" icon={faArrowAltCircleDown} />
    </div>
    <div>
      <h3>{headline.headline}</h3>
      <span>{headline.email}</span>
    </div>
  </li>
)

export default Headline;