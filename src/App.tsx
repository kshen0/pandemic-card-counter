import { useState } from 'react';
import './App.css';
import CardSetView from './CardSetView';
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

type Draw = {
  city: string
  deck: 'known' | 'discard'
  index: number
  destroy: boolean
} | 'shuffle'

function incrCity(deck: DeckCount, city: string, incr = 1) {
  const newDeck = { ...deck };
  if (!(city in newDeck)) {
    newDeck[city] = { city, count: 0 };
  }
  newDeck[city].count += incr;
  if (newDeck[city].count === 0) {
    delete newDeck[city];
  }
  return newDeck;
}

let history: Draw[] = []

function App() {
  const [knownDeck, setKnownDeck] = useState<DeckCount[]>([defaultDeck]);
  const [discard, setDiscard] = useState<DeckCount>({ 'Hollow Men Gather': { city: 'Hollow Men Gather', count: 4 }});
  const [lastUndo, setLastUndo] = useState<string | null>(null);

  const handleDestroyFromSet = (city: string, deck: 'known' | 'discard', index = 0) => {
    history.push({ deck, city, index, destroy: true })
    setLastUndo('destroy');
    if (deck === 'known') {
      const newKnownDeck = [ ...knownDeck ];
      newKnownDeck[index] = incrCity(newKnownDeck[index], city, -1);
      setKnownDeck(newKnownDeck)
    } else {
      setDiscard(incrCity(discard, city, -1));
    }
  };

  const handleDraw = (city: string) => {
    history.push({
      deck: 'known',
      city,
      index: knownDeck.length - 1,
      destroy: false,
    });
    setLastUndo('draw');
    const newKnownDeck = [...knownDeck];
    const topDeck = incrCity(newKnownDeck.pop()!, city, -1);
    if (Object.keys(topDeck).length > 0) {
      newKnownDeck.push(topDeck);
    }
    setKnownDeck(newKnownDeck);
    setDiscard(incrCity(discard, city));
  };

  // handleUndoDraw takes the most recently-drawn card out of the discard and re-adds it to the set passed in the parameter
  const handleUndoDraw = () => {
    const draw = history.pop();
    if (!draw) return;

    const prevUndo = history[history.length - 1];
    if (!prevUndo) {
      setLastUndo(null);
    } else if (prevUndo === 'shuffle') {
      setLastUndo('shuffle');
    } else if (prevUndo.destroy) {
      setLastUndo('destroy');
    } else {
      setLastUndo('draw');
    }

    if (draw === 'shuffle') {
      const newKnownDeck = [...knownDeck];
      setDiscard(newKnownDeck.pop()!);
      setKnownDeck(newKnownDeck);
      return;
    }

    const { city, index, deck, destroy } = draw;

    if (deck === 'known') {
      const newKnownDeck = [...knownDeck];
      if (index >= knownDeck.length) {
        newKnownDeck.push({})
      }
      newKnownDeck[index] = incrCity(newKnownDeck[index], city);
      setKnownDeck(newKnownDeck);
    } else {
      setDiscard(incrCity(discard, city));
    }
    if (!destroy) {
      setDiscard(incrCity(discard, city, -1));
    }
  }

  // Shuffles the discard pile to the top of the deck, updating counts in the known deck if appropriate
  const handleShuffleDiscard = () => {
    const newKnownDeck = [...knownDeck, discard];
    setKnownDeck(newKnownDeck);
    history.push('shuffle');
    setLastUndo('shuffle');
    setDiscard({});
  }

  const reversedSections = [...knownDeck].reverse()

  return (
    <div className="App">
      <header className="AppHeader">
        <div className="AppHeaderText">
          Pandemic Legacy Season 2 card counter
        </div>
      </header>

      <div className="Body">
        <div className="DeckAndDiscardContainer">
          <div className="DeckContainer">
            <h2>Deck</h2>

            <p className="Instructions">
                Click / tap to draw
              </p>
            {<button disabled={!lastUndo} className="ActionButton UndoButton" onClick={handleUndoDraw}>Undo {!!lastUndo && lastUndo}</button>}
            <div className="KnownDeckContainer">
              {
                reversedSections.map((section, i) => {
                  return <>
                    <CardSetView
                      deckCount={section}
                      handleDraw={(city: string) => handleDraw(city)}
                      hideDrawButton={i > 0}
                      handleDestroy={(city: string) => handleDestroyFromSet(city, 'known', knownDeck.length - i - 1)}
                    />
                    {i + 1 < knownDeck.length && <div className="divider" />}
                  </>
                })
              }
            </div>
          </div>
          <div className="DiscardContainer">
            <h2>Discard</h2>
            <CardSetView
              deckCount={discard}
              handleDestroy={(city: string) => handleDestroyFromSet(city, 'discard')}
            />
            <button className="Shuffle" disabled={Object.keys(discard).length === 0} onClick={handleShuffleDiscard}>
              Shuffle discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
