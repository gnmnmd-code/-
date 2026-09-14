import type { Card, Shop, PriceData } from "../types";

// --- カード ---
export const cards: Card[] = [
  {
    id: "card-luffy",
    cardName: "モンキー・D・ルフィ",
    modelNumber: "OP05-119",
    rarity: "SEC",
    imageUrl: "https://placehold.co/120x168?text=OP05-119",
  },
  {
    id: "card-zheng",
    cardName: "ジーベック海賊団",
    modelNumber: "OP05-060",
    rarity: "UC",
    imageUrl: "https://placehold.co/120x168?text=OP05-060",
  },
  {
    id: "card-shanks",
    cardName: "シャンクス",
    modelNumber: "OP05-039",
    rarity: "SR",
    imageUrl: "https://placehold.co/120x168?text=OP05-039",
  },
];

// --- 店舗（秋葉原駅周辺のサンプル座標） ---
export const shops: Shop[] = [
  {
    id: "shop-a",
    shopName: "カードキング秋葉原店",
    address: "東京都千代田区外神田1-1-1",
    latitude: 35.6997,
    longitude: 139.7716,
    businessHours: "11:00〜20:00",
  },
  {
    id: "shop-b",
    shopName: "トレカ本舗 秋葉原店",
    address: "東京都千代田区外神田4-3-3",
    latitude: 35.7018,
    longitude: 139.7745,
    businessHours: "10:00〜21:00",
  },
  {
    id: "shop-c",
    shopName: "秋葉原トレカマーケット",
    address: "東京都千代田区神田花岡町1-1",
    latitude: 35.6978,
    longitude: 139.7731,
    businessHours: "12:00〜20:00",
  },
];

// --- 買取価格データ ---
export const priceDataList: PriceData[] = [
  // ルフィ (OP05-119)
  { id: "price-1", cardId: "card-luffy", shopId: "shop-a", price: 1_600_000, updatedAt: "2026-09-13T10:00:00+09:00" },
  { id: "price-2", cardId: "card-luffy", shopId: "shop-b", price: 1_450_000, updatedAt: "2026-09-13T09:30:00+09:00" },
  { id: "price-3", cardId: "card-luffy", shopId: "shop-c", price: 1_800_000, updatedAt: "2026-09-14T08:00:00+09:00" },

  // ジーベック海賊団 (OP05-060)
  { id: "price-4", cardId: "card-zheng", shopId: "shop-a", price: 8_000, updatedAt: "2026-09-12T18:00:00+09:00" },
  { id: "price-5", cardId: "card-zheng", shopId: "shop-b", price: 12_000, updatedAt: "2026-09-14T07:15:00+09:00" },
  { id: "price-6", cardId: "card-zheng", shopId: "shop-c", price: 9_500, updatedAt: "2026-09-13T21:00:00+09:00" },

  // シャンクス (OP05-039)
  { id: "price-7", cardId: "card-shanks", shopId: "shop-a", price: 45_000, updatedAt: "2026-09-14T09:00:00+09:00" },
  { id: "price-8", cardId: "card-shanks", shopId: "shop-b", price: 38_000, updatedAt: "2026-09-11T12:00:00+09:00" },
  { id: "price-9", cardId: "card-shanks", shopId: "shop-c", price: 52_000, updatedAt: "2026-09-14T08:45:00+09:00" },
];

export function shopById(id: string): Shop | undefined {
  return shops.find((s) => s.id === id);
}

export function cardById(id: string): Card | undefined {
  return cards.find((c) => c.id === id);
}

/** 指定カードの店舗別価格一覧（価格の高い順） */
export function priceEntriesForCard(cardId: string): { shop: Shop; priceData: PriceData }[] {
  return priceDataList
    .filter((p) => p.cardId === cardId)
    .map((priceData) => {
      const shop = shopById(priceData.shopId);
      return shop ? { shop, priceData } : null;
    })
    .filter((entry): entry is { shop: Shop; priceData: PriceData } => entry !== null)
    .sort((a, b) => b.priceData.price - a.priceData.price);
}

/** 最高額と最安額の差額（利ざや） */
export function maxPriceDifference(cardId: string): number {
  const prices = priceDataList.filter((p) => p.cardId === cardId).map((p) => p.price);
  if (prices.length === 0) return 0;
  return Math.max(...prices) - Math.min(...prices);
}
