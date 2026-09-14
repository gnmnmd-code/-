export function formatYen(amount: number): string {
  return `${amount.toLocaleString("ja-JP")}円`;
}

/** 価格の更新日時を短い表記で表示する（例: 2026/09/14 12:00 更新） */
export function formatUpdatedAt(iso: string): string {
  const date = new Date(iso);
  const formatted = date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formatted} 更新`;
}
