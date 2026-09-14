import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cards, maxPriceDifference, priceEntriesForCard } from "../data/mockData";
import { formatYen } from "../utils/format";

export default function CardListPage() {
  const [searchText, setSearchText] = useState("");

  const filteredCards = useMemo(() => {
    const q = searchText.trim();
    if (!q) return cards;
    return cards.filter(
      (c) => c.cardName.includes(q) || c.modelNumber.includes(q)
    );
  }, [searchText]);

  return (
    <div className="page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="カード名・型番で検索"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <ul className="card-list">
        {filteredCards.map((card) => {
          const entries = priceEntriesForCard(card.id);
          const diff = maxPriceDifference(card.id);
          return (
            <li key={card.id}>
              <Link to={`/card/${card.id}`} className="card-row">
                <div className="card-row-header">
                  <span className="card-name">{card.cardName}</span>
                  <span className="card-meta">
                    {card.modelNumber} ・ {card.rarity}
                  </span>
                </div>

                <div className="price-entries">
                  {entries.map((entry, index) => (
                    <div className="price-entry" key={entry.shop.id}>
                      <span className="shop-name">{entry.shop.shopName}</span>
                      {index === 0 && <span className="badge">最高額</span>}
                      <span className="price">{formatYen(entry.priceData.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="diff-row">
                  最大差額 <span className="diff-amount">+{formatYen(diff)}</span>
                </div>
              </Link>
            </li>
          );
        })}
        {filteredCards.length === 0 && (
          <li className="empty-state">該当するカードが見つかりません</li>
        )}
      </ul>
    </div>
  );
}
