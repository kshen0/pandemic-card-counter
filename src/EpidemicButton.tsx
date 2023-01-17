import React from 'react';
import type {Card} from './App';

type Props = {
  handleEpidemic: () => void;
}

function EpidemicButton(props: Props) {
  const {handleEpidemic} = props;

  return (
    <button className="EpidemicButton" onClick={handleEpidemic}>
      EPIDEMIC
    </button>
  );
};

export default EpidemicButton;
