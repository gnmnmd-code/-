import type { Card, Shop, PriceData } from "../types";

// --- 対応タイトル ---
export const games = ["ONE PIECEカードゲーム", "ポケモンカード"] as const;
export type Game = (typeof games)[number];

// --- カード ---
// カード名・型番・レアリティは各タイトル公式の収録カード情報を、
// 複数のカードショップDB（遊々亭・ドラゴンスター等）で突き合わせて確認したもの。
// 画像はカードショップの商品ページ（カードラッシュ／ドラゴンスター）に掲載されている実画像を
// 参照している。ホットリンクのため、本番運用では各社の利用規約を確認のうえ、
// 許諾を得た画像を自社サーバーに保存して配信することを推奨する。
export const cards: Card[] = [
  // ONE PIECEカードゲーム
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
    // カードラッシュの買取実データ(¥10,000)はillust:otton版だが、
    // この商品画像は在庫があったillust:DAI-XT.版のもの（同じ型番・レアリティでもイラスト違いで価格が異なる例）
    imageUrl: "https://www.cardrush-op.jp/data/cardrush-op/product/OP09_NOR_99.jpg",
  },

  // ポケモンカード
  // 「バトロコ吉祥寺駅前」がXに投稿した買取表(2026/09/14更新版)から抽出したサンプル。
  // メガリザードンXexの型番は買取表では一部が隠れていたため、
  // カードショップDBと突き合わせて正しい型番(110/080)に補正している。
  // ボスの指令(サカキ)は買取表では「SAR」と読めたが、ドラゴンスターの商品データでは「SR」表記だったため補正。
  {
    id: "card-mega-charizard-x-ex",
    game: "ポケモンカード",
    cardName: "メガリザードンXex",
    modelNumber: "110/080",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000639111_0_0_yRJ3gM.jpg",
  },
  {
    id: "card-pikachu-ex",
    game: "ポケモンカード",
    cardName: "ピカチュウex",
    modelNumber: "132/106",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000570523_0_0_4n711u.jpg",
  },
  {
    id: "card-zekrom-ex",
    game: "ポケモンカード",
    cardName: "ゼクロムex",
    modelNumber: "174/086",
    rarity: "BWR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000616898_0_0_z3tc0t.jpg",
  },
  {
    id: "card-umbreon-ex",
    game: "ポケモンカード",
    cardName: "ブラッキーex",
    modelNumber: "217/187",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000580974_0_0_y1uIA1.jpg",
  },
  {
    id: "card-rocket-mewtwo-ex",
    game: "ポケモンカード",
    cardName: "ロケット団のミュウツーex",
    modelNumber: "125/098",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000605767_0_0_Tl6BPq.jpg",
  },
  {
    id: "card-cynthia-garchomp-ex",
    game: "ポケモンカード",
    cardName: "シロナのガブリアスex",
    modelNumber: "087/063",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000597785_0_0_TV88Qo.jpg",
  },
  {
    id: "card-mega-gengar-ex",
    game: "ポケモンカード",
    cardName: "メガゲンガーex",
    modelNumber: "240/193",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000649439_0_0_YDpfky.jpg",
  },
  {
    id: "card-boss-sakaki",
    game: "ポケモンカード",
    cardName: "ボスの指令(サカキ)",
    modelNumber: "106/096",
    rarity: "SR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000333965_0_0_qGRAMX.jpg",
  },
  {
    id: "card-vaporeon-ex",
    game: "ポケモンカード",
    cardName: "ブーストex",
    modelNumber: "202/187",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000580959_0_0_wQ3Lzc.jpg",
  },
  {
    id: "card-glaceon-ex",
    game: "ポケモンカード",
    cardName: "グレイシアex",
    modelNumber: "206/187",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000580963_0_0_bJa6fP.jpg",
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
    // 実在店舗。X(@batoloco_kjz)の買取表投稿と、店舗公式サイトの情報から入力
    shopName: "バトロコ吉祥寺駅前",
    address: "東京都武蔵野市吉祥寺本町1-10-1 吉祥寺ロフト5F",
    prefecture: "東京都",
    latitude: 35.7031,
    longitude: 139.5798,
    businessHours: "10:30〜21:00（買取受付は19:30まで）",
    websiteUrl: "https://bato-loco.com/1827info/",
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
];

// --- 買取価格データ ---
// ONE PIECEカードゲームの価格は、カードラッシュ(shop-g)の実データ
// （ルフィ ¥100／シャンクス illust:otton版 ¥10,000。cardrush.media より取得）を基準に、
// 他店舗も現実的なレンジになるよう揃えている（shop-g以外は引き続き演出用のダミー値で、
// sourceUrlを持たない＝実データではないことを示す）。
// ベタベットン流星(OP05-039)はカードラッシュ・遊々亭のいずれにも買取価格の掲載がなかった
// （買取対象外の可能性があるため、実データでの裏付けが取れていない）。
export const priceDataList: PriceData[] = [
  // モンキー・D・ルフィ (OP05-119 SEC)
  { id: "price-1", cardId: "card-luffy", shopId: "shop-a", price: 80, updatedAt: "2026-09-13T10:00:00+09:00" },
  { id: "price-2", cardId: "card-luffy", shopId: "shop-b", price: 120, updatedAt: "2026-09-13T09:30:00+09:00" },
  { id: "price-3", cardId: "card-luffy", shopId: "shop-c", price: 150, updatedAt: "2026-09-14T08:00:00+09:00" },
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

  // ベタベットン流星 (OP05-039、実データでの裏付けなし・演出用ダミー値)
  { id: "price-4", cardId: "card-betabetton", shopId: "shop-a", price: 8_000, updatedAt: "2026-09-12T18:00:00+09:00" },
  { id: "price-5", cardId: "card-betabetton", shopId: "shop-b", price: 12_000, updatedAt: "2026-09-14T07:15:00+09:00" },
  { id: "price-6", cardId: "card-betabetton", shopId: "shop-c", price: 9_500, updatedAt: "2026-09-13T21:00:00+09:00" },
  { id: "price-12", cardId: "card-betabetton", shopId: "shop-d", price: 10_500, updatedAt: "2026-09-13T16:30:00+09:00" },
  { id: "price-13", cardId: "card-betabetton", shopId: "shop-e", price: 7_000, updatedAt: "2026-09-11T13:00:00+09:00" },

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

  // ポケモンカード：バトロコ吉祥寺駅前の買取表(2026/09/14更新版・X投稿)より
  { id: "price-16", cardId: "card-mega-charizard-x-ex", shopId: "shop-f", price: 82_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-17", cardId: "card-pikachu-ex", shopId: "shop-f", price: 68_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-18", cardId: "card-zekrom-ex", shopId: "shop-f", price: 56_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-19", cardId: "card-umbreon-ex", shopId: "shop-f", price: 50_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-20", cardId: "card-rocket-mewtwo-ex", shopId: "shop-f", price: 50_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-21", cardId: "card-cynthia-garchomp-ex", shopId: "shop-f", price: 35_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-22", cardId: "card-mega-gengar-ex", shopId: "shop-f", price: 35_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-23", cardId: "card-boss-sakaki", shopId: "shop-f", price: 20_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-24", cardId: "card-vaporeon-ex", shopId: "shop-f", price: 6_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-25", cardId: "card-glaceon-ex", shopId: "shop-f", price: 6_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
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
