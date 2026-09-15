import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { cardById, maxPriceDifference, prefectures, priceEntriesForCard } from "../data/mockData";
import { mercariSearchUrl } from "../config/mercari";
import { formatUpdatedAt, formatYen } from "../utils/format";

export default function CardDetailPage() {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const prefecture = searchParams.get("prefecture") ?? "";
  const card = cardId ? cardById(cardId) : undefined;

  if (!card) {
    return (
      <div className="page">
        <p>カードが見つかりませんでした。</p>
        <Link to="/">一覧に戻る</Link>
      </div>
    );
  }

  const entries = priceEntriesForCard(card.id, prefecture || undefined);
  const diff = maxPriceDifference(card.id, prefecture || undefined);

  return (
    <div className="page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← 戻る
      </button>

      <div className="detail-header">
        <img src={card.imageUrl} alt={card.cardName} className="card-image" />
        <div>
          <h2>{card.cardName}</h2>
          <p className="card-meta">
            {card.modelNumber} ・ {card.rarity}
            {card.variantLabel && <span className="variant-badge">{card.variantLabel}</span>}
          </p>
          <p className="diff-row">
            最大差額 <span className="diff-amount">+{formatYen(diff)}</span>
          </p>
        </div>
      </div>

      <div className="filters">
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

      <h3>店舗別 買取価格</h3>
      <p className="disclaimer">
        価格は目安です。パラレル/SP等の版違いで価格は大きく変わるため、最終判断は各店舗の公式サイトでご確認ください。
      </p>
      {entries.length === 0 ? (
        <p className="empty-state">この都道府県の店舗データはありません</p>
      ) : (
        <table className="price-table">
          <thead>
            <tr>
              <th>店舗</th>
              <th>買取価格</th>
              <th>更新日</th>
              <th>公式サイト</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const link = entry.priceData.sourceUrl ?? entry.shop.websiteUrl;
              return (
                <tr key={entry.shop.id}>
                  <td>
                    {entry.shop.shopName}
                    {index === 0 && <span className="badge">最高額</span>}
                    {entry.priceData.printNote && (
                      <p className="print-note">{entry.priceData.printNote}</p>
                    )}
                  </td>
                  <td className="price">{formatYen(entry.priceData.price)}</td>
                  <td className="updated-at">{formatUpdatedAt(entry.priceData.updatedAt)}</td>
                  <td>
                    {link ? (
                      <a href={link} target="_blank" rel="noreferrer" className="source-link">
                        公式サイトはこちら
                      </a>
                    ) : (
                      <span className="hint">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="action-buttons">
        <Link
          to={`/map?cardId=${card.id}${prefecture ? `&prefecture=${prefecture}` : ""}`}
          className="map-link-button"
        >
          この価格で店舗を地図で見る
        </Link>
        <a
          href={mercariSearchUrl(`${card.cardName} ${card.modelNumber}`)}
          target="_blank"
          rel="noreferrer"
          className="mercari-link-button"
        >
          メルカリの相場を見る
        </a>
      </div>
    </div>
  );
}
