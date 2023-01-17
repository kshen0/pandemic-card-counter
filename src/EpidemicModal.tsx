import React from 'react';
import type {Card} from './App';

type Props = {
  handleBottomDraw: () => void;
  onCancel: () => void;
}

function EpidemicModal(props: Props) {

  return (
    <div className="EpidemicModalOverlay">
      <div className="EpidemicModalContents">
        <h3>Which card was drawn from the bottom of the deck?</h3>
      </div>
    </div>
  );
};

export default EpidemicModal;
