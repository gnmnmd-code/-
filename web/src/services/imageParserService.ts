import type { ExtractedPriceData } from "../types";

/**
 * X（旧Twitter）に投稿された買取表画像を解析し、
 * カード名・型番・価格を抽出するサービス。
 *
 * 現段階ではVision LLM API（OpenAI API等）を呼び出さず、
 * 2秒後にダミーの解析結果を返すモック実装。
 * 将来的にはここで画像をAPIへ送信し、レスポンスをパースする。
 */
export async function parseImage(image: File | Blob): Promise<ExtractedPriceData[]> {
  // TODO: 実際にはここで image を Vision LLM API (OpenAI API 等) に送信する
  // 例: const response = await fetch("https://api.example.com/vision", { method: "POST", body: formData });
  void image;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const mockResult: ExtractedPriceData[] = [
    { cardName: "モンキー・D・ルフィ", modelNumber: "OP05-119", price: 1_600_000 },
    { cardName: "シャンクス", modelNumber: "OP05-039", price: 45_000 },
    { cardName: "ジーベック海賊団", modelNumber: "OP05-060", price: 8_000 },
  ];

  return mockResult;
}
