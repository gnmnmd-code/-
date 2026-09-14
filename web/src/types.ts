// カード1種類を表す型
export interface Card {
  id: string;
  /** 対応タイトル 例: ONE PIECEカードゲーム / ポケモンカード */
  game: string;
  cardName: string;
  /** 型番 例: OP05-119 */
  modelNumber: string;
  rarity: string;
  imageUrl: string;
}

// 買取店舗を表す型
export interface Shop {
  id: string;
  shopName: string;
  address: string;
  /** 都道府県（例: 東京都） */
  prefecture: string;
  latitude: number;
  longitude: number;
  businessHours: string;
  /** 店舗の公式サイト・公式X等（実在が確認できる場合のみ設定） */
  websiteUrl?: string;
}

// ある店舗における、あるカードの買取価格
export interface PriceData {
  id: string;
  cardId: string;
  shopId: string;
  price: number;
  updatedAt: string; // ISO 8601
  /** この価格の掲載元ページ（実データが確認できる場合のみ設定）。最終確認はここを案内する */
  sourceUrl?: string;
  /** パラレル・収録商品違いなど、価格差の原因になりうる版の注記 */
  printNote?: string;
}

// AI画像解析で抽出された1件分のデータ
export interface ExtractedPriceData {
  cardName: string;
  modelNumber: string;
  price: number;
}
