import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cards, maxPriceDifference, prefectures, priceEntriesForCard } from "../data/mockData";
import { formatYen } from "../utils/format";

export default function CardListPage() {
  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const prefecture = searchParams.get("prefecture") ?? "";

  const filteredCards = useMemo(() => {
    const q = searchText.trim();
    if (!q) return cards;
    return cards.filter(
      (c) => c.cardName.includes(q) || c.modelNumber.includes(q)
    );
  }, [searchText]);

  return (
    <div className="page">
      <div className="filters">
        <input
          type="text"
          placeholder="カード名・型番で検索"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          aria-label="都道府県で絞り込み"
          value={prefecture}
          onChange={(e) => {
            const value = e.target.value;
            setSearchParams(value ? { prefecture: value } : {});
          }}
        >
          <option value="">すべての都道府県</option>
          {prefectures.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <ul className="card-list">
        {filteredCards.map((card) => {
          const entries = priceEntriesForCard(card.id, prefecture || undefined);
          const diff = maxPriceDifference(card.id, prefecture || undefined);
          return (
            <li key={card.id}>
              <Link
                to={`/card/${card.id}${prefecture ? `?prefecture=${prefecture}` : ""}`}
                className="card-row"
              >
                <div className="card-row-header">
                  <span className="card-name">{card.cardName}</span>
                  <span className="card-meta">
                    {card.modelNumber} ・ {card.rarity}
                  </span>
                </div>

                {entries.length === 0 ? (
                  <p className="empty-state small">この都道府県の店舗データはありません</p>
                ) : (
                  <>
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
                  </>
                )}
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
