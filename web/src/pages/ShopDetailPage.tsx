import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cardEntriesForShop, shopById } from "../data/mockData";
import { PRICE_SEGMENTS, loadViewMode, saveViewMode, type ViewMode } from "../config/display";
import { formatUpdatedAt, formatYen } from "../utils/format";

function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export default function ShopDetailPage() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [priceSegment, setPriceSegment] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(loadViewMode);
  const shop = shopId ? shopById(shopId) : undefined;

  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    saveViewMode(mode);
  };

  const entries = useMemo(() => {
    if (!shop) return [];
    const segment = PRICE_SEGMENTS.find((s) => s.value === priceSegment);
    return cardEntriesForShop(shop.id, searchText).filter(
      ({ priceData }) => !segment || (priceData.price >= segment.min && priceData.price <= segment.max)
    );
  }, [shop, searchText, priceSegment]);

  if (!shop) {
    return (
      <div className="page">
        <p>店舗が見つかりませんでした。</p>
        <Link to="/shops">店舗一覧に戻る</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← 戻る
      </button>

      <div>
        <h2>{shop.shopName}</h2>
        <p className="card-meta">{shop.address}</p>
        <p className="card-meta">
          {shop.prefecture} ・ 営業時間: {shop.businessHours}
        </p>
        <div className="action-buttons">
          <a
            href={directionsUrl(shop.latitude, shop.longitude)}
            target="_blank"
            rel="noreferrer"
            className="map-link-button"
          >
            ルート案内を開く
          </a>
          {shop.websiteUrl && (
            <a
              href={shop.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="mercari-link-button"
            >
              公式サイトはこちら
            </a>
          )}
        </div>
      </div>

      <p className="disclaimer">
        価格は目安です。パラレル/SP等の版違いで価格は大きく変わるため、最終判断は公式サイトでご確認ください。
      </p>

      <div className="filters">
        <input
          type="text"
          placeholder="カード名・型番で検索"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          aria-label="買取価格帯で絞り込み"
          value={priceSegment}
          onChange={(e) => setPriceSegment(e.target.value)}
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
          className={viewMode === "grid" ? "active" : ""}
          onClick={() => changeViewMode("grid")}
        >
          4列
        </button>
      </div>

      <p className="hint">{entries.length.toLocaleString("ja-JP")} 枚の買取価格を掲載</p>

      {viewMode === "list" ? (
        <ul className="card-list">
          {entries.map(({ card, priceData }) => (
            <li key={card.id}>
              <Link to={`/card/${card.id}`} className="card-row shop-card-row">
                <img src={card.imageUrl} alt={card.cardName} className="card-thumb" loading="lazy" />
                <div className="shop-card-info">
                  <span className="card-name">{card.cardName}</span>
                  <span className="card-meta">
                    {card.modelNumber} ・ {card.rarity}
                    {card.variantLabel && <span className="variant-badge">{card.variantLabel}</span>}
                  </span>
                  <span className="updated-at">{formatUpdatedAt(priceData.updatedAt)}</span>
                </div>
                <span className="price shop-card-price">{formatYen(priceData.price)}</span>
              </Link>
            </li>
          ))}
          {entries.length === 0 && (
            <li className="empty-state">該当するカードが見つかりません</li>
          )}
        </ul>
      ) : (
        <ul className="card-grid grid-4">
          {entries.map(({ card, priceData }) => (
            <li key={card.id}>
              <Link to={`/card/${card.id}`} className="card-grid-item">
                <img src={card.imageUrl} alt={card.cardName} className="card-thumb-grid" loading="lazy" />
                <span className="card-name-grid">{card.cardName}</span>
                {card.variantLabel && <span className="variant-badge grid">{card.variantLabel}</span>}
                <span className="price-grid">{formatYen(priceData.price)}</span>
              </Link>
            </li>
          ))}
          {entries.length === 0 && (
            <li className="empty-state grid-empty">該当するカードが見つかりません</li>
          )}
        </ul>
      )}
    </div>
  );
}
