import { useState } from "react";
import type { ExtractedPriceData } from "../types";
import { parseImage } from "../services/imageParserService";
import { formatYen } from "../utils/format";

export default function ImageParserDemoPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ExtractedPriceData[] | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setResults(null);
    setIsLoading(true);
    try {
      const extracted = await parseImage(file);
      setResults(extracted);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>買取表画像 解析（デモ）</h2>
      <p className="hint">
        Xの買取表スクリーンショットをアップロードすると、AIがカード名・型番・価格を抽出します
        （現在はモック実装のため、どんな画像を選んでもダミー結果が返ります）。
      </p>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      {fileName && <p className="hint">選択中のファイル: {fileName}</p>}

      {isLoading && <p className="loading">解析中...</p>}

      {results && (
        <table className="price-table">
          <thead>
            <tr>
              <th>カード名</th>
              <th>型番</th>
              <th>価格</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.cardName}</td>
                <td>{r.modelNumber}</td>
                <td className="price">{formatYen(r.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
