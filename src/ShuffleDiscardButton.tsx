import React from 'react';
import type {Card} from './App';

type Props = {
  handleShuffleDiscard: () => void;
}

function ShuffleDiscardButton(props: Props) {
  const {handleShuffleDiscard} = props;

  return (
    <>
      <button className="Shuffle" onClick={handleShuffleDiscard}>
        Shuffle discard
      </button>
    </>
  );
};

export default ShuffleDiscardButton;
