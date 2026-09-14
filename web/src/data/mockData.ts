import type { Card, Shop, PriceData } from "../types";

// --- 対応タイトル ---
export const games = ["ONE PIECEカードゲーム", "ポケモンカード"] as const;
export type Game = (typeof games)[number];

// --- カード ---
// カード名・型番・レアリティは各タイトル公式の収録カード情報を、
// 複数のカードショップDB（遊々亭・ドラゴンスター等）で突き合わせて確認したもの。
export const cards: Card[] = [
  // ONE PIECEカードゲーム
  {
    id: "card-luffy",
    game: "ONE PIECEカードゲーム",
    cardName: "モンキー・D・ルフィ",
    modelNumber: "OP05-119",
    rarity: "SEC",
    imageUrl: "https://placehold.co/120x168?text=OP05-119",
  },
  {
    id: "card-betabetton",
    game: "ONE PIECEカードゲーム",
    cardName: "ベタベットン流星",
    modelNumber: "OP05-039",
    rarity: "UC",
    imageUrl: "https://placehold.co/120x168?text=OP05-039",
  },
  {
    id: "card-shanks",
    game: "ONE PIECEカードゲーム",
    cardName: "シャンクス",
    modelNumber: "OP09-001",
    rarity: "L",
    imageUrl: "https://placehold.co/120x168?text=OP09-001",
  },

  // ポケモンカード
  // 「パトロコ吉祥寺駅前」がXに投稿した買取表(2026/09/14更新版)から抽出したサンプル。
  // メガリザードンXexの型番は買取表では一部が隠れていたため、
  // カードショップDBと突き合わせて正しい型番(110/080)に補正している。
  {
    id: "card-mega-charizard-x-ex",
    game: "ポケモンカード",
    cardName: "メガリザードンXex",
    modelNumber: "110/080",
    rarity: "SAR",
    imageUrl: "https://placehold.co/120x168?text=110/080",
  },
  {
    id: "card-pikachu-ex",
    game: "ポケモンカード",
    cardName: "ピカチュウex",
    modelNumber: "132/106",
    rarity: "SAR",
    imageUrl: "https://placehold.co/120x168?text=132/106",
  },
  {
    id: "card-zekrom-ex",
    game: "ポケモンカード",
    cardName: "ゼクロムex",
    modelNumber: "174/086",
    rarity: "BWR",
    imageUrl: "https://placehold.co/120x168?text=174/086",
  },
  {
    id: "card-umbreon-ex",
    game: "ポケモンカード",
    cardName: "ブラッキーex",
    modelNumber: "217/187",
    rarity: "SAR",
    imageUrl: "https://placehold.co/120x168?text=217/187",
  },
  {
    id: "card-rocket-mewtwo-ex",
    game: "ポケモンカード",
    cardName: "ロケット団のミュウツーex",
    modelNumber: "125/098",
    rarity: "SAR",
    imageUrl: "https://placehold.co/120x168?text=125/098",
  },
  {
    id: "card-cynthia-garchomp-ex",
    game: "ポケモンカード",
    cardName: "シロナのガブリアスex",
    modelNumber: "087/063",
    rarity: "SAR",
    imageUrl: "https://placehold.co/120x168?text=087/063",
  },
  {
    id: "card-mega-gengar-ex",
    game: "ポケモンカード",
    cardName: "メガゲンガーex",
    modelNumber: "240/193",
    rarity: "SAR",
    imageUrl: "https://placehold.co/120x168?text=240/193",
  },
  {
    id: "card-boss-sakaki",
    game: "ポケモンカード",
    cardName: "ボスの指令(サカキ)",
    modelNumber: "106/096",
    rarity: "SAR",
    imageUrl: "https://placehold.co/120x168?text=106/096",
  },
  {
    id: "card-vaporeon-ex",
    game: "ポケモンカード",
    cardName: "ブーストex",
    modelNumber: "202/187",
    rarity: "SAR",
    imageUrl: "https://placehold.co/120x168?text=202/187",
  },
  {
    id: "card-glaceon-ex",
    game: "ポケモンカード",
    cardName: "グレイシアex",
    modelNumber: "206/187",
    rarity: "SAR",
    imageUrl: "https://placehold.co/120x168?text=206/187",
  },
];

// --- 都道府県（表示順はおおよそ北から南） ---
export const prefectures = ["東京都", "愛知県", "大阪府"] as const;
export type Prefecture = (typeof prefectures)[number];

// --- 店舗 ---
export const shops: Shop[] = [
  {
    id: "shop-a",
    shopName: "カードキング秋葉原店",
    address: "東京都千代田区外神田1-1-1",
    prefecture: "東京都",
    latitude: 35.6997,
    longitude: 139.7716,
    businessHours: "11:00〜20:00",
  },
  {
    id: "shop-b",
    shopName: "トレカ本舗 秋葉原店",
    address: "東京都千代田区外神田4-3-3",
    prefecture: "東京都",
    latitude: 35.7018,
    longitude: 139.7745,
    businessHours: "10:00〜21:00",
  },
  {
    id: "shop-c",
    shopName: "秋葉原トレカマーケット",
    address: "東京都千代田区神田花岡町1-1",
    prefecture: "東京都",
    latitude: 35.6978,
    longitude: 139.7731,
    businessHours: "12:00〜20:00",
  },
  {
    id: "shop-d",
    shopName: "カードキング日本橋店",
    address: "大阪府大阪市浪速区日本橋4-10-3",
    prefecture: "大阪府",
    latitude: 34.6631,
    longitude: 135.5062,
    businessHours: "11:00〜20:00",
  },
  {
    id: "shop-e",
    shopName: "トレカ本舗 大須店",
    address: "愛知県名古屋市中区大須3-30-60",
    prefecture: "愛知県",
    latitude: 35.1587,
    longitude: 136.9008,
    businessHours: "10:00〜19:00",
  },
  {
    id: "shop-f",
    // X(旧Twitter)の買取表投稿から取得した実店舗
    shopName: "パトロコ吉祥寺駅前",
    address: "東京都武蔵野市吉祥寺本町（吉祥寺駅前）",
    prefecture: "東京都",
    latitude: 35.7031,
    longitude: 139.5798,
    businessHours: "要問い合わせ（Xの投稿をご確認ください）",
  },
];

// --- 買取価格データ ---
export const priceDataList: PriceData[] = [
  // モンキー・D・ルフィ (OP05-119)
  { id: "price-1", cardId: "card-luffy", shopId: "shop-a", price: 1_600_000, updatedAt: "2026-09-13T10:00:00+09:00" },
  { id: "price-2", cardId: "card-luffy", shopId: "shop-b", price: 1_450_000, updatedAt: "2026-09-13T09:30:00+09:00" },
  { id: "price-3", cardId: "card-luffy", shopId: "shop-c", price: 1_800_000, updatedAt: "2026-09-14T08:00:00+09:00" },
  { id: "price-10", cardId: "card-luffy", shopId: "shop-d", price: 1_700_000, updatedAt: "2026-09-13T15:00:00+09:00" },
  { id: "price-11", cardId: "card-luffy", shopId: "shop-e", price: 1_550_000, updatedAt: "2026-09-12T11:00:00+09:00" },

  // ベタベットン流星 (OP05-039)
  { id: "price-4", cardId: "card-betabetton", shopId: "shop-a", price: 8_000, updatedAt: "2026-09-12T18:00:00+09:00" },
  { id: "price-5", cardId: "card-betabetton", shopId: "shop-b", price: 12_000, updatedAt: "2026-09-14T07:15:00+09:00" },
  { id: "price-6", cardId: "card-betabetton", shopId: "shop-c", price: 9_500, updatedAt: "2026-09-13T21:00:00+09:00" },
  { id: "price-12", cardId: "card-betabetton", shopId: "shop-d", price: 10_500, updatedAt: "2026-09-13T16:30:00+09:00" },
  { id: "price-13", cardId: "card-betabetton", shopId: "shop-e", price: 7_000, updatedAt: "2026-09-11T13:00:00+09:00" },

  // シャンクス (OP09-001 リーダー)
  { id: "price-7", cardId: "card-shanks", shopId: "shop-a", price: 3_000, updatedAt: "2026-09-14T09:00:00+09:00" },
  { id: "price-8", cardId: "card-shanks", shopId: "shop-b", price: 2_200, updatedAt: "2026-09-11T12:00:00+09:00" },
  { id: "price-9", cardId: "card-shanks", shopId: "shop-c", price: 4_500, updatedAt: "2026-09-14T08:45:00+09:00" },
  { id: "price-14", cardId: "card-shanks", shopId: "shop-d", price: 3_800, updatedAt: "2026-09-13T17:00:00+09:00" },
  { id: "price-15", cardId: "card-shanks", shopId: "shop-e", price: 2_600, updatedAt: "2026-09-12T14:00:00+09:00" },

  // ポケモンカード：パトロコ吉祥寺駅前の買取表(2026/09/14更新版)より
  { id: "price-16", cardId: "card-mega-charizard-x-ex", shopId: "shop-f", price: 82_000, updatedAt: "2026-09-14T12:00:00+09:00" },
  { id: "price-17", cardId: "card-pikachu-ex", shopId: "shop-f", price: 68_000, updatedAt: "2026-09-14T12:00:00+09:00" },
  { id: "price-18", cardId: "card-zekrom-ex", shopId: "shop-f", price: 56_000, updatedAt: "2026-09-14T12:00:00+09:00" },
  { id: "price-19", cardId: "card-umbreon-ex", shopId: "shop-f", price: 50_000, updatedAt: "2026-09-14T12:00:00+09:00" },
  { id: "price-20", cardId: "card-rocket-mewtwo-ex", shopId: "shop-f", price: 50_000, updatedAt: "2026-09-14T12:00:00+09:00" },
  { id: "price-21", cardId: "card-cynthia-garchomp-ex", shopId: "shop-f", price: 35_000, updatedAt: "2026-09-14T12:00:00+09:00" },
  { id: "price-22", cardId: "card-mega-gengar-ex", shopId: "shop-f", price: 35_000, updatedAt: "2026-09-14T12:00:00+09:00" },
  { id: "price-23", cardId: "card-boss-sakaki", shopId: "shop-f", price: 20_000, updatedAt: "2026-09-14T12:00:00+09:00" },
  { id: "price-24", cardId: "card-vaporeon-ex", shopId: "shop-f", price: 6_000, updatedAt: "2026-09-14T12:00:00+09:00" },
  { id: "price-25", cardId: "card-glaceon-ex", shopId: "shop-f", price: 6_000, updatedAt: "2026-09-14T12:00:00+09:00" },
];

export function shopById(id: string): Shop | undefined {
  return shops.find((s) => s.id === id);
}

export function cardById(id: string): Card | undefined {
  return cards.find((c) => c.id === id);
}

/**
 * 指定カードの店舗別価格一覧（価格の高い順）
 * prefecture を指定すると、その都道府県の店舗のみに絞り込む
 */
export function priceEntriesForCard(
  cardId: string,
  prefecture?: string
): { shop: Shop; priceData: PriceData }[] {
  return priceDataList
    .filter((p) => p.cardId === cardId)
    .map((priceData) => {
      const shop = shopById(priceData.shopId);
      return shop ? { shop, priceData } : null;
    })
    .filter((entry): entry is { shop: Shop; priceData: PriceData } => entry !== null)
    .filter((entry) => !prefecture || entry.shop.prefecture === prefecture)
    .sort((a, b) => b.priceData.price - a.priceData.price);
}

/** 最高額と最安額の差額（利ざや）。prefecture を指定するとその都道府県内で計算する */
export function maxPriceDifference(cardId: string, prefecture?: string): number {
  const prices = priceEntriesForCard(cardId, prefecture).map((e) => e.priceData.price);
  if (prices.length === 0) return 0;
  return Math.max(...prices) - Math.min(...prices);
}
