import type { DeckCount, CountMetadata } from './App';
import defaultDeck from './defaultDeck.json';

type Props = {
  deckCount: DeckCount;
  handleDraw?: (city: string) => void;
  handleDestroy?: (city: string) => void;
}

type CardColor = 'Blue' | 'Red' | 'Black' | 'Yellow' | 'Hollow'
type CardSection = { counts: CountMetadata[], color: string }

const cityToColor: { [city: string]: CardColor } = { 'Hollow Men Gather': 'Hollow' }

for (const city in defaultDeck) {
  cityToColor[city] = (defaultDeck as any)[city].color;
}

function CardListView(props: Props) {
  const { deckCount, handleDestroy, handleDraw } = props;

  const citiesByColor: { [color: string]: DeckCount } = {};
  for (const city in deckCount) {
    const color = cityToColor[city];
    if (!(color in citiesByColor)) {
      citiesByColor[color] = {};
    }
    citiesByColor[color][city] = deckCount[city];
  }

  const sortedCities: CardSection[] = [];
  for (const color of ['Blue', 'Black', 'Yellow', 'Red', 'Hollow']) {
    if (!citiesByColor[color]) continue;
    sortedCities.push({
      color,
      counts: Object.values(citiesByColor[color]).sort((a, b) => {
        if (a.city < b.city) {
          return -1;
        } else if (a.city > b.city) {
          return 1;
        }
        return 0;
      })
    });
  }

  return (
    <div className="CardList">
      <ul>
        {sortedCities.map((entries: CardSection) =>
          <div key={entries.color} className={`ColorSection ${entries.color}`}>
            {entries.counts.map((entry) => {
              const {city, count} = entry;
              if (count === 0) {
                return null;
              }

              return (
                <li
                  key={city}
                  className={`CityCount ${entries.color} ${!!handleDraw ? 'CanDraw' : ''}`}
                  onClick={() => handleDraw && handleDraw(city)}
                >
                  {!!handleDestroy && count > 0 && <>
                    {/* TODO: make own component, add user confirmation */ }
                    <button className="ActionButton DestroyButton" onClick={(e) => {
                      e.stopPropagation();
                      handleDestroy(city)
                    }}>
                      ✂️ 1
                    </button>
                  </>}
                  <p className="CityCountText">{`${city}: ${count}`}</p>
                </li>
              );
            })}
          </div>
        )}
      </ul>
    </div>
  );
};

export default CardListView;
