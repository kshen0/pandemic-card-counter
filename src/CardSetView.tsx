import React from 'react';
import type {DeckCount, CountMetadata} from './App';

type Props = {
  deckCount: DeckCount;
  handleDraw?: (city: string) => void;
  handleDestroy?: (city: string) => void;
  hideDrawButton?: boolean;
}

function CardListView(props: Props) {
  const {deckCount, handleDestroy, handleDraw, hideDrawButton} = props;

  const sortedCities = Object.values(deckCount).sort((a, b) => {
    if (a.city < b.city) {
      return -1;
    } else if (a.city > b.city) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="CardList">
      <ul>
        {sortedCities.map((entry: CountMetadata) => {
          const {city, count} = entry;
          if (count === 0) {
            return null;
          }

          return (<li key={city} className="CityCount">
            <p className="CityCountText">{`${city}: ${count}`}</p>
            {!!handleDraw && count > 0 && !hideDrawButton && <>
              <button className="ActionButton DrawButton" onClick={() => handleDraw(city)}>
                Draw
              </button>
            </>}
            {!!handleDestroy && count > 0 && <>
              {/* TODO: make own component, add user confirmation */ }
              <button className="ActionButton DestroyButton" onClick={() => handleDestroy(city)}>
                Destroy 1
              </button>
            </>}
          </li>);
        })}
      </ul>
    </div>
  );
};

export default CardListView;
