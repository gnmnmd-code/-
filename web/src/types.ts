// カード1種類を表す型
export interface Card {
  id: string;
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
  latitude: number;
  longitude: number;
  businessHours: string;
}

// ある店舗における、あるカードの買取価格
export interface PriceData {
  id: string;
  cardId: string;
  shopId: string;
  price: number;
  updatedAt: string; // ISO 8601
}

// AI画像解析で抽出された1件分のデータ
export interface ExtractedPriceData {
  cardName: string;
  modelNumber: string;
  price: number;
}
