import type { Card, Shop, PriceData } from "../types";
import generatedCards from "./onepiece-cards.generated.json";
import generatedPrices from "./onepiece-prices.generated.json";
import setNamesJson from "./onepiece-sets.generated.json";

// --- パック/スタートデッキ ---
// 型番の頭（ハイフンの前）が収録パックを表す: OP〇〇=ブースターパック／ST〇〇=スタートデッキ／
// EB〇〇=エクストラブースター／PRB〇〇=プレミアムブースター／P=プロモーションカード。
// 名称は公式サイトのシリーズ一覧（scripts/fetch-onepiece-cards.mjs が生成）から取得したもの。
const setNames: Record<string, string> = setNamesJson;

export function setCodeForModel(modelNumber: string): string | null {
  if (/^P-\d+$/.test(modelNumber)) return "P";
  const m = modelNumber.match(/^([A-Za-z]+\d{2})-/);
  return m ? m[1] : null;
}

export function setLabel(code: string): string {
  return setNames[code] ?? code;
}

/** "OP17" → ["OP", 17]、"P" → ["P", 0] */
function splitSetCode(code: string): [string, number] {
  const m = code.match(/^([A-Za-z]+)(\d*)$/);
  if (!m) return [code, 0];
  return [m[1], Number(m[2] || 0)];
}

// --- カード ---
// ONE PIECEカードゲームのみを扱う。カード名・型番・レアリティ・画像は、
// 公式サイトのカードリストページ（onepiece-cardgame.com/cardlist）、または
// 複数のカードショップDB（カードラッシュ・ドラゴンスター・遊々亭等）から取得したもの。
// 画像はホットリンクのため、本番運用では各社の利用規約を確認のうえ、
// 許諾を得た画像を自社サーバーに保存して配信することを推奨する。
interface GeneratedCard {
  id: string;
  model: string;
  cardName: string;
  rarity: string;
  /** パラレル版・SP版・プロモ再録版などの注記。通常版は null */
  variantLabel: string | null;
  set: string | null;
  imageUrl: string;
}

interface GeneratedPrice {
  id: string;
  cardId: string;
  shopId: string;
  price: number;
  updatedAt: string;
  sourceUrl: string;
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
// scripts/fetch-onepiece-cards.mjs が公式サイト（全シリーズ）と複数店舗（メルカード・遊々亭）の
// 買取価格表を突き合わせて生成した onepiece-cards.generated.json / onepiece-prices.generated.json を
// 読み込む。カードマスタと店舗別価格が分かれているのは、印刷違いの注記が無い「通常版」は
// 型番だけで店舗横断に同一カードとして扱い、複数店舗の価格を1枚のカードとして比較できるようにするため
// （パラレル版等は店舗ごとの表記のズレによる誤突合を避けるため、店舗ごとに別カードのまま）。
// ルフィ(OP05-119)・カイドウ(OP05-118)・コアラ(OP05-006)の「通常版」は上記で個別に手入力済みのため
// 除外するが、同じ型番でもパラレル版等（variantLabelあり）は別カードなので除外しない。
const CURATED_BASE_MODELS = new Set(["OP05-119", "OP05-118", "OP05-006"]);
const isCuratedDuplicate = (c: GeneratedCard) => CURATED_BASE_MODELS.has(c.model) && !c.variantLabel;

const generatedCardList: Card[] = (generatedCards as GeneratedCard[])
  .filter((c) => !isCuratedDuplicate(c))
  .map((c) => ({
    id: c.id,
    game: "ONE PIECEカードゲーム",
    cardName: c.cardName,
    modelNumber: c.model,
    rarity: c.rarity,
    variantLabel: c.variantLabel ?? undefined,
    imageUrl: c.imageUrl,
  }));

const generatedCardIds = new Set(generatedCardList.map((c) => c.id));

const generatedPriceList: PriceData[] = (generatedPrices as GeneratedPrice[])
  .filter((p) => generatedCardIds.has(p.cardId))
  .map((p) => ({
    id: p.id,
    cardId: p.cardId,
    shopId: p.shopId,
    price: p.price,
    updatedAt: p.updatedAt,
    sourceUrl: p.sourceUrl,
  }));

export const cards: Card[] = [...curatedCards, ...generatedCardList];

/**
 * 実際にカードが1種類以上ある収録パック/デッキの一覧。
 * OP/ST/EB/PRB/P のグループごとにまとめ、グループ内は番号が大きい順（新しいパックが上）に並べる
 */
export const availableSets: { code: string; name: string }[] = [
  ...new Set(
    cards
      .map((c) => setCodeForModel(c.modelNumber))
      .filter((code): code is string => code !== null)
  ),
]
  .sort((a, b) => {
    const [letterA, numA] = splitSetCode(a);
    const [letterB, numB] = splitSetCode(b);
    if (letterA !== letterB) return letterA.localeCompare(letterB);
    return numB - numA;
  })
  .map((code) => ({ code, name: setLabel(code) }));

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
  {
    id: "shop-i",
    // 運営: 株式会社スカラプレイス。特定商取引法に基づく表記ページの住所を使用。
    // 同ページに「こちらは買取ご希望商品の送付先とは異なります」と明記されており、
    // 来店買取ではなく宅配買取（カードを郵送して査定）が基本のオンライン専門店
    shopName: "カードショップ 遊々亭",
    address: "東京都千代田区外神田6丁目2-8 ビジネスプレイス外神田4F",
    prefecture: "東京都",
    latitude: 35.7031,
    longitude: 139.7689,
    businessHours: "宅配買取のみ（来店買取なし）",
    websiteUrl: "https://yuyu-tei.jp/top/opc",
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

/** 指定店舗で買取しているカードの数 */
export function cardCountForShop(shopId: string): number {
  return priceDataList.filter((p) => p.shopId === shopId).length;
}

/**
 * 指定店舗で買取しているカード一覧（価格の高い順）
 * query を指定するとカード名・型番で絞り込む
 */
export function cardEntriesForShop(
  shopId: string,
  query?: string
): { card: Card; priceData: PriceData }[] {
  const q = query?.trim();
  return priceDataList
    .filter((p) => p.shopId === shopId)
    .map((priceData) => {
      const card = cardById(priceData.cardId);
      return card ? { card, priceData } : null;
    })
    .filter((entry): entry is { card: Card; priceData: PriceData } => entry !== null)
    .filter(
      (entry) =>
        !q ||
        entry.card.cardName.includes(q) ||
        entry.card.modelNumber.includes(q) ||
        (entry.card.variantLabel?.includes(q) ?? false)
    )
    .sort((a, b) => b.priceData.price - a.priceData.price);
}
