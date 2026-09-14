/**
 * メルカリへのリンク生成。
 *
 * 現在はアフィリエイト未提携のため、通常の検索結果ページへの素のリンクを返す。
 * アクセストレード等のASPでメルカリの提携審査が通り、アフィリエイトIDを取得したら、
 * この関数の中身だけを差し替えれば良いように一箇所に集約している。
 *
 * 差し替え例（アクセストレードの場合のイメージ）:
 *   const target = `${MERCARI_SEARCH_BASE}?keyword=${encodeURIComponent(query)}`;
 *   return `https://px.a8.net/svt/ejp?a8mat=【発行されたアフィリエイトID】&a8ejpredirect=${encodeURIComponent(target)}`;
 */

const MERCARI_SEARCH_BASE = "https://jp.mercari.com/search";

export function mercariSearchUrl(query: string): string {
  return `${MERCARI_SEARCH_BASE}?keyword=${encodeURIComponent(query)}`;
}
