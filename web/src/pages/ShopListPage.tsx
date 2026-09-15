import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cardCountForShop, prefectures, shops } from "../data/mockData";

export default function ShopListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const prefecture = searchParams.get("prefecture") ?? "";

  const sortedShops = useMemo(() => {
    return shops
      .filter((s) => !prefecture || s.prefecture === prefecture)
      .map((shop) => ({ shop, count: cardCountForShop(shop.id) }))
      .sort((a, b) => b.count - a.count);
  }, [prefecture]);

  return (
    <div className="page">
      <p className="disclaimer">
        店舗をタップすると、その店舗で買取しているカードと価格の一覧を見られます。
      </p>

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

      <ul className="card-list">
        {sortedShops.map(({ shop, count }) => (
          <li key={shop.id}>
            <div
              className="card-row shop-row"
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/shop/${shop.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/shop/${shop.id}`);
              }}
            >
              <div className="shop-row-header">
                <span className="card-name">{shop.shopName}</span>
                <span className="badge">{count.toLocaleString("ja-JP")}枚</span>
              </div>
              <p className="card-meta">{shop.address}</p>
              <p className="card-meta">
                {shop.prefecture} ・ 営業時間: {shop.businessHours}
              </p>
            </div>
          </li>
        ))}
        {sortedShops.length === 0 && (
          <li className="empty-state">該当する店舗が見つかりません</li>
        )}
      </ul>
    </div>
  );
}
