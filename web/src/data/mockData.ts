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

  // 以下は実店舗「アキバカードショップ メルカード」の買取価格表ページ
  // （https://akihabara-cardshop.com/onepice-kaitori/）から取得したサンプル。
  // カード名・型番・レアリティ・買取価格・商品画像とも同ページの掲載データをそのまま使用している。
  {
    id: "card-kizaru",
    game: "ONE PIECEカードゲーム",
    cardName: "ボルサリーノ",
    modelNumber: "EB04-058",
    rarity: "SR",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/EB04/58.png",
  },
  {
    id: "card-blackbeard",
    game: "ONE PIECEカードゲーム",
    cardName: "マーシャル・Ｄ・ティーチ",
    modelNumber: "OP16-119",
    rarity: "SEC",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/OP16/119.png",
  },
  {
    id: "card-zoro",
    game: "ONE PIECEカードゲーム",
    cardName: "ロロノア・ゾロ",
    modelNumber: "EB04-007",
    rarity: "SR",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/EB04/7.png",
  },
  {
    id: "card-ace",
    game: "ONE PIECEカードゲーム",
    cardName: "ポートガス・D・エース",
    modelNumber: "OP16-118",
    rarity: "SEC",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/OP16/118.png",
  },
  {
    id: "card-moria",
    game: "ONE PIECEカードゲーム",
    cardName: "ゲッコー・モリア",
    modelNumber: "OP14-104",
    rarity: "SR",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/OP14/OP14-104.png",
  },
  {
    id: "card-luffy-leader-st01",
    game: "ONE PIECEカードゲーム",
    cardName: "モンキー・D・ルフィ",
    modelNumber: "ST01-001",
    rarity: "L",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/wanpiTD1-5/1.png",
  },
  {
    id: "card-crocodile",
    game: "ONE PIECEカードゲーム",
    cardName: "クロコダイル",
    modelNumber: "OP14-120",
    rarity: "SEC",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/OP14/OP14-120.png",
  },
  {
    id: "card-chopper",
    game: "ONE PIECEカードゲーム",
    cardName: "トニートニー・チョッパー",
    modelNumber: "EB01-006",
    rarity: "SR",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/20240124_0aa85e.png",
  },
  {
    id: "card-roger",
    game: "ONE PIECEカードゲーム",
    cardName: "ゴール・D・ロジャー",
    modelNumber: "OP09-118",
    rarity: "SEC",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/OP09/OP09-118.jpg",
  },
  {
    id: "card-nami",
    game: "ONE PIECEカードゲーム",
    cardName: "ナミ",
    modelNumber: "EB03-053",
    rarity: "SR",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/EB03/EB03-053.png",
  },
  {
    id: "card-oden",
    game: "ONE PIECEカードゲーム",
    cardName: "光月おでん",
    modelNumber: "ST32-002",
    rarity: "SR",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/ST32/2.png",
  },
  {
    id: "card-luffy-sr-op17",
    game: "ONE PIECEカードゲーム",
    cardName: "モンキー・D・ルフィ",
    modelNumber: "OP17-093",
    rarity: "SR",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/OP17/93.png",
  },
  {
    id: "card-shanks-sr-op17",
    game: "ONE PIECEカードゲーム",
    cardName: "シャンクス",
    modelNumber: "OP17-022",
    rarity: "SR",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/OP17/22.png",
  },
  {
    id: "card-mihawk",
    game: "ONE PIECEカードゲーム",
    cardName: "ジュラキュール・ミホーク",
    modelNumber: "OP14-119",
    rarity: "SEC",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/OP14/OP14-119.png",
  },
  {
    id: "card-uta",
    game: "ONE PIECEカードゲーム",
    cardName: "ウタ",
    modelNumber: "ST23-001",
    rarity: "SR",
    imageUrl: "https://akihabara-cardshop.com/wp-content/themes/wp/img/product/ST23/2.png",
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
  {
    id: "card-reshiram-ex",
    game: "ポケモンカード",
    cardName: "レシラムex",
    modelNumber: "174/086",
    rarity: "BWR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000617229_0_0_BwcRkj.jpg",
  },
  {
    id: "card-hibiki-hooh-ex",
    game: "ポケモンカード",
    cardName: "ヒビキのホウオウex",
    modelNumber: "086/063",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000597784_0_0_xALjEc.jpg",
  },
  {
    id: "card-latias-ex",
    game: "ポケモンカード",
    cardName: "ラティアスex",
    modelNumber: "087/064",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000560939_0_0_iIXUYw.jpg",
  },
  {
    id: "card-lillie-resolve",
    game: "ポケモンカード",
    cardName: "リーリエの決心",
    modelNumber: "091/063",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000629458_0_0_fUWEyV.jpg",
  },
  {
    id: "card-mega-darkrai-ex",
    game: "ポケモンカード",
    cardName: "メガダークライex",
    modelNumber: "114/081",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000688099_0_0_oExfKb.jpg",
  },
  {
    id: "card-hibiki-adventure",
    game: "ポケモンカード",
    cardName: "ヒビキの冒険",
    modelNumber: "089/063",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000597787_0_0_H3nMIB.jpg",
  },
  {
    id: "card-rocket-crobat-ex",
    game: "ポケモンカード",
    cardName: "ロケット団のクロバットex",
    modelNumber: "127/098",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000605769_0_0_mFqlf0.jpg",
  },
  {
    id: "card-touko",
    game: "ポケモンカード",
    cardName: "トウコ",
    modelNumber: "173/086",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000617228_0_0_FmqL3A.jpg",
  },
  {
    id: "card-bell-kindness",
    game: "ポケモンカード",
    cardName: "ベルのまごころ",
    modelNumber: "097/071",
    rarity: "SAR",
    imageUrl: "https://buy.dorasuta.jp/contents/product/0/11_0000517444_0_0_A4xfgs.jpg",
  },
  {
    id: "card-salamence-ex",
    game: "ポケモンカード",
    cardName: "ボーマンダex",
    modelNumber: "129/100",
    rarity: "SAR",
    imageUrl: "https://dorasuta.jp/contents/product/0/11_0000588260_0_0_sGHCO9.jpg",
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

  // 以下はアキバカードショップ メルカード(shop-h)の実データ
  // （https://akihabara-cardshop.com/onepice-kaitori/ より）
  { id: "price-43", cardId: "card-kizaru", shopId: "shop-h", price: 5_500, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-44", cardId: "card-blackbeard", shopId: "shop-h", price: 3_500, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-45", cardId: "card-zoro", shopId: "shop-h", price: 2_500, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-46", cardId: "card-ace", shopId: "shop-h", price: 1_400, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-47", cardId: "card-moria", shopId: "shop-h", price: 800, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-48", cardId: "card-luffy-leader-st01", shopId: "shop-h", price: 500, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-49", cardId: "card-crocodile", shopId: "shop-h", price: 500, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-50", cardId: "card-chopper", shopId: "shop-h", price: 400, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-51", cardId: "card-roger", shopId: "shop-h", price: 350, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-52", cardId: "card-nami", shopId: "shop-h", price: 300, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-53", cardId: "card-oden", shopId: "shop-h", price: 500, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-54", cardId: "card-luffy-sr-op17", shopId: "shop-h", price: 500, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-55", cardId: "card-shanks-sr-op17", shopId: "shop-h", price: 450, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-56", cardId: "card-mihawk", shopId: "shop-h", price: 350, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },
  { id: "price-57", cardId: "card-uta", shopId: "shop-h", price: 350, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://akihabara-cardshop.com/onepice-kaitori/" },

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
  { id: "price-33", cardId: "card-reshiram-ex", shopId: "shop-f", price: 50_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-34", cardId: "card-hibiki-hooh-ex", shopId: "shop-f", price: 26_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-35", cardId: "card-latias-ex", shopId: "shop-f", price: 22_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-36", cardId: "card-lillie-resolve", shopId: "shop-f", price: 20_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-37", cardId: "card-mega-darkrai-ex", shopId: "shop-f", price: 17_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-38", cardId: "card-hibiki-adventure", shopId: "shop-f", price: 5_500, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-39", cardId: "card-rocket-crobat-ex", shopId: "shop-f", price: 5_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-40", cardId: "card-touko", shopId: "shop-f", price: 4_500, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-41", cardId: "card-bell-kindness", shopId: "shop-f", price: 4_000, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
  { id: "price-42", cardId: "card-salamence-ex", shopId: "shop-f", price: 3_500, updatedAt: "2026-09-14T12:00:00+09:00", sourceUrl: "https://x.com/batoloco_kjz" },
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
