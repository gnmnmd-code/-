import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  availableSets,
  cards,
  maxPriceDifference,
  prefectures,
  priceEntriesForCard,
  setCodeForModel,
} from "../data/mockData";
import { mercariSearchUrl } from "../config/mercari";
import { PRICE_SEGMENTS, loadViewMode, saveViewMode, type ViewMode } from "../config/display";
import { formatUpdatedAt, formatYen } from "../utils/format";

export default function CardListPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>(loadViewMode);
  const prefecture = searchParams.get("prefecture") ?? "";
  const set = searchParams.get("set") ?? "";
  const price = searchParams.get("price") ?? "";

  const updateParam = (key: "prefecture" | "set" | "price", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    saveViewMode(mode);
  };

  // 各カードの最高買取額（都道府県で絞り込んだ範囲内）を求め、高い順に並べる
  const sortedCards = useMemo(() => {
    const q = searchText.trim();
    const segment = PRICE_SEGMENTS.find((s) => s.value === price);
    return cards
      .filter(
        (c) =>
          !q ||
          c.cardName.includes(q) ||
          c.modelNumber.includes(q) ||
          (c.variantLabel?.includes(q) ?? false)
      )
      .filter((c) => !set || setCodeForModel(c.modelNumber) === set)
      .map((card) => {
        const entries = priceEntriesForCard(card.id, prefecture || undefined);
        return { card, entries, topPrice: entries[0]?.priceData.price ?? -1 };
      })
      .filter(({ topPrice }) => !segment || (topPrice >= segment.min && topPrice <= segment.max))
      .sort((a, b) => b.topPrice - a.topPrice);
  }, [searchText, prefecture, set, price]);

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
        <select aria-label="パック/デッキで絞り込み" value={set} onChange={(e) => updateParam("set", e.target.value)}>
          <option value="">すべてのパック/デッキ</option>
          {availableSets.map((s) => (
            <option key={s.code} value={s.code}>
              {s.code}: {s.name}
            </option>
          ))}
        </select>
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
        <select
          aria-label="買取価格帯で絞り込み"
          value={price}
          onChange={(e) => updateParam("price", e.target.value)}
        >
          <option value="">すべての価格帯</option>
          {PRICE_SEGMENTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="view-toggle" role="group" aria-label="表示形式">
        <button
          type="button"
          className={viewMode === "list" ? "active" : ""}
          onClick={() => changeViewMode("list")}
        >
          リスト
        </button>
        <button
          type="button"
          className={viewMode === "grid3" ? "active" : ""}
          onClick={() => changeViewMode("grid3")}
        >
          3列
        </button>
        <button
          type="button"
          className={viewMode === "grid4" ? "active" : ""}
          onClick={() => changeViewMode("grid4")}
        >
          4列
        </button>
      </div>

      {viewMode === "list" ? (
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
                        {card.variantLabel && <span className="variant-badge">{card.variantLabel}</span>}
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
      ) : (
        <ul className={`card-grid ${viewMode === "grid3" ? "grid-3" : "grid-4"}`}>
          {sortedCards.map(({ card, entries, topPrice }) => (
            <li key={card.id}>
              <div
                className="card-grid-item"
                role="link"
                tabIndex={0}
                onClick={() => navigate(queryString(card.id))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(queryString(card.id));
                }}
              >
                <img src={card.imageUrl} alt={card.cardName} className="card-thumb-grid" loading="lazy" />
                <span className="card-name-grid">{card.cardName}</span>
                {card.variantLabel && <span className="variant-badge grid">{card.variantLabel}</span>}
                {entries.length === 0 ? (
                  <span className="hint">—</span>
                ) : (
                  <span className="price-grid">{formatYen(topPrice)}</span>
                )}
              </div>
            </li>
          ))}
          {sortedCards.length === 0 && (
            <li className="empty-state grid-empty">該当するカードが見つかりません</li>
          )}
        </ul>
      )}
    </div>
  );
}
