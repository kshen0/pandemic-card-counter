import React from 'react';
import type {Card, CardList} from './App';

type Props = {
  cards: CardList;
}

function CardListView(props: Props) {
  const {cards} = props;

  return (
    <div className="CardList">
      <ul>
        {cards.map((card: Card) => {
          return (<li key={card.city}>
            {card.city}
          </li>);
        })}
      </ul>
    </div>
  );
};

export default CardListView;
