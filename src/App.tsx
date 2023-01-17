import React, {useState} from 'react';
import _ from 'lodash';
import './App.css';
import CardListView from './CardListView';
import CardSetView from './CardSetView';
import ShuffleDiscardButton from './ShuffleDiscardButton';
import EpidemicButton from './EpidemicButton';
import defaultDeck from './defaultDeck.json';

/*
* Requirements
* 1. Load a default deck of city cards
* 2. User can indicate a card has been drawn
* 3. User can indicate the discard pile is shuffled and placed at the top of the deck
* 4. Display list of drawn cards
* 5. Display list of cards known to be in the deck, but not drawn
* 6. Display odds of drawing a particular card n times
*/

// DeckCount represents the number of cards known in a facedown deck
export type DeckCount = {
  [city: string]: CountMetadata;
}

export type CountMetadata = {
  city: string,
  count: number;
};

export type CardList = Card[];

export type Card = {
  city: string;
}


// function deckToCardList(deck: DeckCount): CardList {
//   const keys = Object.keys(deck);
//   const cards: CardList = [];
//   for (const [city, cardSpec] of Object.entries(deck)) {
//     const {count} = cardSpec;
//     for (let i = 0; i < count; i++) {
//       cards.push({city});
//     }
//   }

//   return cards;
// }


const cityToCard = (city: string): Card => {
  return {city};
}

const knownCardsIsEmpty = (knownDeck: DeckCount): boolean => {
  const vals = Object.values(knownDeck);
  for (let v of vals) {
    if (v.count > 0) {
      return false;
    }
  }
  return true;
}

function App() {
  let [undrawnDeck, setUndrawnDeck] = useState<DeckCount>(defaultDeck);
  let [knownDeck, setKnownDeck] = useState<DeckCount>({});
  let [discard, setDiscard] = useState<Card[]>([]);

  const handleDestroyFromSet = (oldCount: DeckCount, setOldCount: (arg: DeckCount) => void, city: string) => {
    const newCounts = _.cloneDeep(oldCount);
    newCounts[city].count = oldCount[city].count - 1;
    setOldCount(newCounts);
  };

  const handleDraw = (oldCount: DeckCount, setOldCount: (arg: DeckCount) => void, city: string) => {
    const newCounts = _.cloneDeep(oldCount);
    newCounts[city].count = oldCount[city].count - 1;
    const card = cityToCard(city);
    setOldCount(newCounts);
    setDiscard(discard.concat([card]));
  };

  // handleUndoDraw takes the most recently-drawn card out of the discard and re-adds it to the set passed in the parameter
  const handleUndoDraw = (oldCount: DeckCount, setOldCount: (arg: DeckCount) => void) => {
    const newCounts = _.cloneDeep(oldCount);
 
    const undoCard = discard[discard.length - 1];
    const city = undoCard.city;

    newCounts[city].count = oldCount[city].count + 1;
    const card = cityToCard(city);
    setOldCount(newCounts);
    setDiscard(discard.slice(0, discard.length - 1));
  }

  // Shuffles the discard pile to the top of the deck, updating counts in the known deck if appropriate
  const handleShuffleDiscard = () => {
    const newKnownDeck = _.cloneDeep(knownDeck);
    for (let card of discard) {
      const {city} = card;
      if (newKnownDeck.hasOwnProperty(card.city)) {
        newKnownDeck[city].count = newKnownDeck[city].count + 1;
      } else {
        newKnownDeck[city] = {city, count: 1};
      }
    }

    setKnownDeck(newKnownDeck);
    setDiscard([]);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Pandemic Legacy Season 2 card counter
        </p>
      </header>

      <div className="Body">
        <div className="DeckAndDiscardContainer">
          <div className="DeckContainer">
            <h1>Deck</h1>
            <div className="UndrawnDeckContainer">
              <h2>Undrawn</h2>
              <CardSetView
                deckCount={undrawnDeck}
                handleDraw={(city: string) => handleDraw(undrawnDeck, setUndrawnDeck, city)}
                handleUndoDraw={() => handleUndoDraw(undrawnDeck, setUndrawnDeck)}
                hideDrawButton={!knownCardsIsEmpty(knownDeck)}
                handleDestroy={(city: string) => handleDestroyFromSet(undrawnDeck, setUndrawnDeck, city)}
              />
            </div>
            <div className="KnownDeckContainer">
              <h2>Known</h2>
              <CardSetView
                deckCount={knownDeck} 
                handleDraw={(city: string) => handleDraw(knownDeck, setKnownDeck, city)}
                handleUndoDraw={() => handleUndoDraw(knownDeck, setKnownDeck)}
                handleDestroy={(city: string) => handleDestroyFromSet(knownDeck, setKnownDeck, city)}
              />
            </div>
          </div>
          <div className="DiscardContainer">
            <h1>Discard</h1>
            <CardListView cards={discard}/>
            {/* TODO support user confirmation */}
            <ShuffleDiscardButton handleShuffleDiscard={handleShuffleDiscard} />
            {/* <EpidemicButton handleEpidemic={handleEpidemic} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
