import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { latLngBounds } from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { cards, prefectures, priceEntriesForCard } from "../data/mockData";
import { formatYen } from "../utils/format";

// Vite/webpack環境でLeafletのデフォルトアイコンが表示されない問題の対処
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const bestPriceIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  shadowSize: [49, 49],
  className: "marker-best",
});

// 日本全体が収まる程度のデフォルト表示
const JAPAN_CENTER: [number, number] = [36.5, 138.2];
const JAPAN_ZOOM = 5;

function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/** entries（表示対象の店舗）が変わるたびに地図の表示範囲を追従させる */
function MapViewUpdater({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) {
      map.setView(JAPAN_CENTER, JAPAN_ZOOM);
    } else if (positions.length === 1) {
      map.setView(positions[0], 15);
    } else {
      map.fitBounds(latLngBounds(positions), { padding: [40, 40] });
    }
  }, [map, positions]);

  return null;
}

export default function ShopMapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cardId = searchParams.get("cardId") ?? cards[0].id;
  const prefecture = searchParams.get("prefecture") ?? "";

  const entries = useMemo(
    () => priceEntriesForCard(cardId, prefecture || undefined),
    [cardId, prefecture]
  );
  const selectedCard = cards.find((c) => c.id === cardId) ?? cards[0];
  const positions = useMemo<[number, number][]>(
    () => entries.map((e) => [e.shop.latitude, e.shop.longitude]),
    [entries]
  );

  const updateParam = (key: "cardId" | "prefecture", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="page map-page">
      <div className="map-controls">
        <label htmlFor="card-select">カード：</label>
        <select
          id="card-select"
          value={cardId}
          onChange={(e) => updateParam("cardId", e.target.value)}
        >
          {cards.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cardName}（{c.modelNumber}）
            </option>
          ))}
        </select>
      </div>
      <div className="map-controls">
        <label htmlFor="prefecture-select">都道府県：</label>
        <select
          id="prefecture-select"
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

      {entries.length === 0 && (
        <p className="empty-state">この都道府県の店舗データはありません</p>
      )}

      <MapContainer
        center={JAPAN_CENTER}
        zoom={JAPAN_ZOOM}
        scrollWheelZoom
        style={{ height: "70vh", width: "100%", borderRadius: 8 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewUpdater positions={positions} />
        {entries.map((entry, index) => (
          <Marker
            key={entry.shop.id}
            position={[entry.shop.latitude, entry.shop.longitude]}
            icon={index === 0 ? bestPriceIcon : defaultIcon}
          >
            <Popup>
              <div className="popup-content">
                <strong>{entry.shop.shopName}</strong>
                {index === 0 && <span className="badge">最高額</span>}
                <p>
                  {entry.shop.prefecture} ・ 営業時間: {entry.shop.businessHours}
                </p>
                <p>
                  {selectedCard.cardName} の買取価格:{" "}
                  <strong>{formatYen(entry.priceData.price)}</strong>
                </p>
                <a
                  href={directionsUrl(entry.shop.latitude, entry.shop.longitude)}
                  target="_blank"
                  rel="noreferrer"
                  className="directions-button"
                >
                  マップアプリでルート案内を開く
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
