import type { Card, Shop, PriceData } from "../types";
import generatedCards from "./onepiece-cards.generated.json";

// --- カード ---
// ONE PIECEカードゲームのみを扱う。カード名・型番・レアリティ・画像は、
// 公式サイトのカードリストページ（onepiece-cardgame.com/cardlist）、または
// 複数のカードショップDB（カードラッシュ・ドラゴンスター・遊々亭等）から取得したもの。
// 画像はホットリンクのため、本番運用では各社の利用規約を確認のうえ、
// 許諾を得た画像を自社サーバーに保存して配信することを推奨する。
interface GeneratedCard {
  model: string;
  cardName: string;
  rarity: string;
  officialImageUrl: string;
  mercardImageUrl: string;
  price: number;
  sourceUrl: string;
  shopId: string;
}

// 個別に手入力したカード（印刷違いでの価格差の解説や、複数店舗の比較デモなど、
// 自動生成データだけでは表現できない情報を持つもの）
const curatedCards: Card[] = [
  {
    id: "card-luffy",
    game: "ONE PIECEカードゲーム",
    cardName: "モンキー・D・ルフィ",
    modelNumber: "OP05-119",
    rarity: "SEC",
    imageUrl: "https://www.cardrush-op.jp/data/cardrush-op/product/20260608_3d0403.jpg",
  },
  {
    id: "card-betabetton",
    game: "ONE PIECEカードゲーム",
    cardName: "ベタベットン流星",
    modelNumber: "OP05-039",
    rarity: "UC",
    imageUrl: "https://www.cardrush-op.jp/data/cardrush-op/product/OP05_81.jpg",
  },
  {
    id: "card-shanks",
    game: "ONE PIECEカードゲーム",
    cardName: "シャンクス",
    modelNumber: "OP09-001",
    rarity: "L",
    // 買取実データ(¥10,000)と同じillust:otton版の商品画像に修正済み
    // （同型番・同レアリティでもillust:DAI-XT.版は¥100と大きく異なるので要注意）
    imageUrl: "https://www.cardrush-op.jp/data/cardrush-op/product/20250925_0585e6.jpg",
  },
  {
    id: "card-kaido",
    game: "ONE PIECEカードゲーム",
    cardName: "カイドウ",
    modelNumber: "OP05-118",
    rarity: "SEC",
    imageUrl: "https://www.cardrush-op.jp/data/cardrush-op/product/OP05_2.jpg",
  },
  {
    id: "card-trafalgar-law",
    game: "ONE PIECEカードゲーム",
    cardName: "トラファルガー・ロー",
    modelNumber: "OP05-069",
    rarity: "SR",
    imageUrl: "https://www.cardrush-op.jp/data/cardrush-op/product/OP05_51.jpg",
  },
  {
    id: "card-koala",
    game: "ONE PIECEカードゲーム",
    cardName: "コアラ",
    modelNumber: "OP05-006",
    rarity: "SR",
    imageUrl: "https://www.cardrush-op.jp/data/cardrush-op/product/20251023_c266ba.jpg",
  },
  {
    id: "card-eustass-kid",
    game: "ONE PIECEカードゲーム",
    cardName: "ユースタス・キッド",
    modelNumber: "OP05-074",
    rarity: "SR",
    imageUrl: "https://www.cardrush-op.jp/data/cardrush-op/product/PRB01-02_101.jpg",
  },
  {
    id: "card-sabo",
    game: "ONE PIECEカードゲーム",
    cardName: "サボ",
    modelNumber: "OP05-007",
    rarity: "SR",
    imageUrl: "https://www.cardrush-op.jp/data/cardrush-op/product/PRB01-02_116.jpg",
  },
];

// --- 自動生成カード ---
// scripts/fetch-onepiece-cards.mjs が公式サイト（全シリーズ）とメルカードの買取価格表を
// 突き合わせて生成した onepiece-cards.generated.json を読み込む。
// ルフィ(OP05-119)・カイドウ(OP05-118)・コアラ(OP05-006)は上記で個別に手入力済みのため除外する。
const CURATED_MODELS = new Set(["OP05-119", "OP05-118", "OP05-006"]);

const generatedCardList: Card[] = (generatedCards as GeneratedCard[])
  .filter((c) => !CURATED_MODELS.has(c.model))
  .map((c) => ({
    id: `card-gen-${c.model}`,
    game: "ONE PIECEカードゲーム",
    cardName: c.cardName,
    modelNumber: c.model,
    rarity: c.rarity,
    // メルカードの画像は買取価格と同じ商品ページのものなので、価格との対応がずれない
    imageUrl: c.mercardImageUrl,
  }));

const generatedPriceList: PriceData[] = (generatedCards as GeneratedCard[])
  .filter((c) => !CURATED_MODELS.has(c.model))
  .map((c) => ({
    id: `price-gen-${c.model}`,
    cardId: `card-gen-${c.model}`,
    shopId: c.shopId,
    price: c.price,
    updatedAt: "2026-09-14T12:00:00+09:00",
    sourceUrl: c.sourceUrl,
  }));

export const cards: Card[] = [...curatedCards, ...generatedCardList];

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
    id: "shop-g",
    // 実店舗を持つ「カードラッシュ」の公式買取価格ページ(cardrush.media)から取得した実データ
    shopName: "カードラッシュ秋葉原0号店",
    address: "東京都千代田区外神田1-18-18 Bito Akiba Plaza 7F",
    prefecture: "東京都",
    latitude: 35.6999,
    longitude: 139.771,
    businessHours: "平日13:00〜21:00、土日祝11:00〜21:00",
    websiteUrl: "https://www.cardrush-op.jp/page/12",
  },
  {
    id: "shop-h",
    // 実店舗。公式買取価格表ページから住所・営業時間を取得
    shopName: "アキバカードショップ メルカード",
    address: "東京都千代田区外神田1丁目8-7 神林ビル2階",
    prefecture: "東京都",
    latitude: 35.7002,
    longitude: 139.7714,
    businessHours: "平日13:00〜20:00、土日祝11:00〜20:00",
    websiteUrl: "https://akihabara-cardshop.com/onepice-kaitori/",
  },
];

// --- 買取価格データ ---
// ONE PIECEカードゲームの価格は、カードラッシュ(shop-g)の実データ（cardrush.media より取得）を基準に、
// ルフィ・シャンクスは他店舗も現実的なレンジになるよう揃えている（shop-g以外は引き続き演出用のダミー値で、
// sourceUrlを持たない＝実データではないことを示す）。カイドウ以降の5種は比較対象の他店データが無いため
// カードラッシュの実データ1件のみ（最大差額は+0円になる）。
// ベタベットン流星(OP05-039)はカードラッシュ・遊々亭のいずれにも個別の買取価格掲載がなかったため、
// 他店相場調査（およそ¥20〜50）を参考にしたダミー値のまま。
const curatedPriceList: PriceData[] = [
  // モンキー・D・ルフィ (OP05-119 SEC)
  { id: "price-1", cardId: "card-luffy", shopId: "shop-a", price: 80, updatedAt: "2026-09-13T10:00:00+09:00" },
  { id: "price-2", cardId: "card-luffy", shopId: "shop-b", price: 120, updatedAt: "2026-09-13T09:30:00+09:00" },
  { id: "price-3", cardId: "card-luffy", shopId: "shop-c", price: 140, updatedAt: "2026-09-14T08:00:00+09:00" },
  { id: "price-10", cardId: "card-luffy", shopId: "shop-d", price: 90, updatedAt: "2026-09-13T15:00:00+09:00" },
  { id: "price-11", cardId: "card-luffy", shopId: "shop-e", price: 70, updatedAt: "2026-09-12T11:00:00+09:00" },
  {
    id: "price-26",
    cardId: "card-luffy",
    shopId: "shop-g",
    price: 100,
    updatedAt: "2026-09-14T12:00:00+09:00",
    sourceUrl: "https://cardrush.media/onepiece/buying_prices?model_number=OP05-119",
  },
  {
    id: "price-70",
    cardId: "card-luffy",
    shopId: "shop-h",
    price: 150,
    updatedAt: "2026-09-14T12:00:00+09:00",
    sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/",
  },

  // ベタベットン流星 (OP05-039)。他店の買取相場調査では¥20〜50程度だったため、
  // 各店の演出用ダミー値もそのレンジに合わせて修正（以前の¥7,000〜12,000は非現実的だった）
  { id: "price-4", cardId: "card-betabetton", shopId: "shop-a", price: 20, updatedAt: "2026-09-12T18:00:00+09:00" },
  { id: "price-5", cardId: "card-betabetton", shopId: "shop-b", price: 35, updatedAt: "2026-09-14T07:15:00+09:00" },
  { id: "price-6", cardId: "card-betabetton", shopId: "shop-c", price: 50, updatedAt: "2026-09-13T21:00:00+09:00" },
  { id: "price-12", cardId: "card-betabetton", shopId: "shop-d", price: 25, updatedAt: "2026-09-13T16:30:00+09:00" },
  { id: "price-13", cardId: "card-betabetton", shopId: "shop-e", price: 15, updatedAt: "2026-09-11T13:00:00+09:00" },

  // シャンクス (OP09-001 L)
  { id: "price-7", cardId: "card-shanks", shopId: "shop-a", price: 8_000, updatedAt: "2026-09-14T09:00:00+09:00" },
  { id: "price-8", cardId: "card-shanks", shopId: "shop-b", price: 6_500, updatedAt: "2026-09-11T12:00:00+09:00" },
  { id: "price-9", cardId: "card-shanks", shopId: "shop-c", price: 12_000, updatedAt: "2026-09-14T08:45:00+09:00" },
  { id: "price-14", cardId: "card-shanks", shopId: "shop-d", price: 9_000, updatedAt: "2026-09-13T17:00:00+09:00" },
  { id: "price-15", cardId: "card-shanks", shopId: "shop-e", price: 7_500, updatedAt: "2026-09-12T14:00:00+09:00" },
  {
    id: "price-27",
    cardId: "card-shanks",
    shopId: "shop-g",
    price: 10_000,
    updatedAt: "2026-09-14T12:00:00+09:00",
    sourceUrl: "https://cardrush.media/onepiece/buying_prices?model_number=OP09-001",
    printNote: "illust:otton版の価格（同型番・同レアリティでもillust:DAI-XT.版は¥100と大きく異なる）",
  },

  // 以下はカードラッシュの実データのみ（他店の比較データが無いため最大差額は+0円になる）
  {
    id: "price-28",
    cardId: "card-kaido",
    shopId: "shop-g",
    price: 180,
    updatedAt: "2026-09-14T12:00:00+09:00",
    sourceUrl: "https://cardrush.media/onepiece/buying_prices?model_number=OP05-118",
  },
  {
    id: "price-29",
    cardId: "card-trafalgar-law",
    shopId: "shop-g",
    price: 10,
    updatedAt: "2026-09-14T12:00:00+09:00",
    sourceUrl: "https://cardrush.media/onepiece/buying_prices?model_number=OP05-069",
    printNote: "通常版(パラレルなし)の価格。漫画背景パラレル版は¥90,000超と大きく異なる",
  },
  {
    id: "price-30",
    cardId: "card-koala",
    shopId: "shop-g",
    price: 3_000,
    updatedAt: "2026-09-14T12:00:00+09:00",
    sourceUrl: "https://cardrush.media/onepiece/buying_prices?model_number=OP05-006",
    printNote: "illust:Koushi Rokushiro版の価格",
  },
  {
    id: "price-31",
    cardId: "card-eustass-kid",
    shopId: "shop-g",
    price: 300,
    updatedAt: "2026-09-14T12:00:00+09:00",
    sourceUrl: "https://cardrush.media/onepiece/buying_prices?model_number=OP05-074",
    printNote: "パラレル/illust:Ryuda版の価格。漫画背景パラレル版は¥70,000超と大きく異なる",
  },
  {
    id: "price-32",
    cardId: "card-sabo",
    shopId: "shop-g",
    price: 300,
    updatedAt: "2026-09-14T12:00:00+09:00",
    sourceUrl: "https://cardrush.media/onepiece/buying_prices?model_number=OP05-007",
    printNote: "パラレル/illust:otton版の価格",
  },

];

export const priceDataList: PriceData[] = [...curatedPriceList, ...generatedPriceList];

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
