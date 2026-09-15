// カード一覧の表示形式（リスト/グリッド）と価格帯セグメントの共通設定。
// CardListPage・ShopDetailPageの両方で使う。

export type ViewMode = "list" | "grid3" | "grid4";

const VIEW_MODE_STORAGE_KEY = "cardListViewMode";

/** 表示形式は端末に保存し、次回訪問時も同じ形式で開く */
export function loadViewMode(): ViewMode {
  try {
    const saved = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    return saved === "grid3" || saved === "grid4" ? saved : "list";
  } catch {
    return "list";
  }
}

export function saveViewMode(mode: ViewMode): void {
  try {
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  } catch {
    // プライベートブラウジング等でlocalStorageが使えない場合は保存を諦める
  }
}

export const PRICE_SEGMENTS = [
  { value: "0-999", label: "〜999円", min: 0, max: 999 },
  { value: "1000-4999", label: "1,000〜4,999円", min: 1000, max: 4999 },
  { value: "5000-9999", label: "5,000〜9,999円", min: 5000, max: 9999 },
  { value: "10000-49999", label: "10,000〜49,999円", min: 10000, max: 49999 },
  { value: "50000-99999", label: "50,000〜99,999円", min: 50000, max: 99999 },
  { value: "100000-", label: "100,000円〜", min: 100000, max: Infinity },
] as const;
