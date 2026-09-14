import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { cards, priceEntriesForCard } from "../data/mockData";
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

// 秋葉原駅
const AKIHABARA_CENTER: [number, number] = [35.6984, 139.7731];

function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export default function ShopMapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cardId = searchParams.get("cardId") ?? cards[0].id;

  const entries = useMemo(() => priceEntriesForCard(cardId), [cardId]);
  const selectedCard = cards.find((c) => c.id === cardId) ?? cards[0];

  return (
    <div className="page map-page">
      <div className="map-controls">
        <label htmlFor="card-select">表示するカード：</label>
        <select
          id="card-select"
          value={cardId}
          onChange={(e) => setSearchParams({ cardId: e.target.value })}
        >
          {cards.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cardName}（{c.modelNumber}）
            </option>
          ))}
        </select>
      </div>

      <MapContainer
        center={AKIHABARA_CENTER}
        zoom={15}
        scrollWheelZoom
        style={{ height: "70vh", width: "100%", borderRadius: 8 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
                <p>営業時間: {entry.shop.businessHours}</p>
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
