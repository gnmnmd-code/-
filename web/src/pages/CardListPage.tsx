import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cards, maxPriceDifference, prefectures, priceEntriesForCard } from "../data/mockData";
import { mercariSearchUrl } from "../config/mercari";
import { formatUpdatedAt, formatYen } from "../utils/format";

export default function CardListPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const prefecture = searchParams.get("prefecture") ?? "";

  const updateParam = (key: "prefecture", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  // 各カードの最高買取額（都道府県で絞り込んだ範囲内）を求め、高い順に並べる
  const sortedCards = useMemo(() => {
    const q = searchText.trim();
    return cards
      .filter((c) => !q || c.cardName.includes(q) || c.modelNumber.includes(q))
      .map((card) => {
        const entries = priceEntriesForCard(card.id, prefecture || undefined);
        return { card, entries, topPrice: entries[0]?.priceData.price ?? -1 };
      })
      .sort((a, b) => b.topPrice - a.topPrice);
  }, [searchText, prefecture]);

  const queryString = (cardId: string) => {
    const params = new URLSearchParams();
    if (prefecture) params.set("prefecture", prefecture);
    const qs = params.toString();
    return `/card/${cardId}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="page">
      <p className="disclaimer">
        価格は目安です。パラレル/SP等の版違いで価格は大きく変わるため、最終判断は各店舗の公式サイトでご確認ください。
      </p>

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
          onChange={(e) => updateParam("prefecture", e.target.value)}
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
        {sortedCards.map(({ card, entries }) => {
          const diff = maxPriceDifference(card.id, prefecture || undefined);
          return (
            <li key={card.id}>
              <div
                className="card-row"
                role="link"
                tabIndex={0}
                onClick={() => navigate(queryString(card.id))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(queryString(card.id));
                }}
              >
                <div className="card-row-header">
                  <img src={card.imageUrl} alt={card.cardName} className="card-thumb" loading="lazy" />
                  <div>
                    <span className="card-name">{card.cardName}</span>
                    <span className="card-meta">
                      {card.modelNumber} ・ {card.rarity}
                    </span>
                    <a
                      href={mercariSearchUrl(`${card.cardName} ${card.modelNumber}`)}
                      target="_blank"
                      rel="noreferrer"
                      className="mercari-inline-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      メルカリの相場を見る
                    </a>
                  </div>
                </div>

                {entries.length === 0 ? (
                  <p className="empty-state small">この都道府県の店舗データはありません</p>
                ) : (
                  <>
                    <div className="price-entries">
                      {entries.map((entry, index) => (
                        <div className="price-entry" key={entry.shop.id}>
                          <div className="price-entry-main">
                            <span className="shop-name">{entry.shop.shopName}</span>
                            {index === 0 && <span className="badge">最高額</span>}
                            <span className="price">{formatYen(entry.priceData.price)}</span>
                          </div>
                          <div className="price-entry-sub">
                            <span className="updated-at">{formatUpdatedAt(entry.priceData.updatedAt)}</span>
                            {(entry.priceData.sourceUrl ?? entry.shop.websiteUrl) && (
                              <a
                                href={entry.priceData.sourceUrl ?? entry.shop.websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="source-link"
                                onClick={(e) => e.stopPropagation()}
                              >
                                公式サイトはこちら
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="diff-row">
                      最大差額 <span className="diff-amount">+{formatYen(diff)}</span>
                    </div>
                  </>
                )}
              </div>
            </li>
          );
        })}
        {sortedCards.length === 0 && (
          <li className="empty-state">該当するカードが見つかりません</li>
        )}
      </ul>
    </div>
  );
}
