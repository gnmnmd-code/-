#!/usr/bin/env node
// ONE PIECEカードゲームのカードマスタと買取価格を取得し、
// src/data/onepiece-cards.generated.json を再生成するスクリプト。
//
// 使い方:
//   node scripts/fetch-onepiece-cards.mjs
//
// データソース:
//   1. 公式サイト カードリスト（https://www.onepiece-cardgame.com/cardlist/）
//      全シリーズ（ブースター・スタートデッキ等）を走査し、カード名・型番・レアリティ・
//      公式カード画像URLを取得する。
//   2. アキバカードショップ メルカード 買取価格表
//      （https://akihabara-cardshop.com/onepice-kaitori/）
//      型番・買取価格を取得する。
//
// 上記2つを型番で突き合わせ、「公式データで名前・型番・レアリティが確認でき、
// かつ実店舗の買取価格が分かる」カードだけを出力する（価格の無いカードは
// このアプリの性質上、比較のしようがないため除外する）。
//
// 礼儀として、公式サイトへのリクエストは直列・間隔を空けて行う。
// 利用規約・robots.txtの範囲内で、頻繁に実行しすぎないこと（目安: 1日1回程度）。

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "../src/data/onepiece-cards.generated.json");

const OFFICIAL_BASE = "https://www.onepiece-cardgame.com/cardlist/";
const MERCARD_URL = "https://akihabara-cardshop.com/onepice-kaitori/";
const MERCARD_SHOP_ID = "shop-h";
const MERCARD_SOURCE_URL = MERCARD_URL;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function getSeriesIds() {
  const html = await fetchText(OFFICIAL_BASE);
  const ids = [...html.matchAll(/<option value="(\d+)"/g)].map((m) => m[1]);
  if (ids.length === 0) {
    throw new Error("シリーズ一覧を取得できませんでした（サイト構造が変わった可能性があります）");
  }
  return [...new Set(ids)];
}

function parseOfficialCards(html) {
  const pattern =
    /<div class="infoCol">\s*<span>([^<]+)<\/span>\s*\|\s*<span>([^<]+)<\/span>\s*\|\s*<span>([^<]+)<\/span>\s*<\/div>\s*<div class="cardName">([^<]*)<\/div>/g;
  const cards = [];
  for (const m of html.matchAll(pattern)) {
    const [, model, rarity, type, name] = m;
    cards.push({
      model: model.trim(),
      rarity: rarity.trim(),
      type: type.trim(),
      name: name.trim(),
    });
  }
  return cards;
}

function parseMercardPrices(html) {
  const pattern =
    /<div class="td td1"><img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"><\/div>.*?<div class="td td2">([^<]*)<\/div>\s*<div class="td td3">.*?<\/span>([^<]*)<\/div>\s*<div class="td td4">.*?<\/span>([^<]*)<\/div>.*?<span class="price">(\d+)<\/span>/gs;
  const rows = [];
  for (const m of html.matchAll(pattern)) {
    const [, img, , name, model, rarity, price] = m;
    rows.push({ img, name: name.trim(), model: model.trim(), rarity: rarity.trim(), price: Number(price) });
  }
  return rows;
}

// 型番の形式が単純なもの（パラレル/プロモ等の複雑な表記を除く）に限定する。
// 例: OP05-119, ST23-001, EB04-058 は対象。SPOP05-098『EB02』のような表記は対象外。
const CLEAN_MODEL = /^(OP\d{2}-\d{3}|ST\d{2}-\d{3}|EB\d{2}-\d{3})$/;

async function main() {
  console.log("公式サイトのシリーズ一覧を取得中...");
  const seriesIds = await getSeriesIds();
  console.log(`${seriesIds.length} シリーズを検出`);

  const officialByModel = new Map();
  for (const [i, id] of seriesIds.entries()) {
    process.stdout.write(`  [${i + 1}/${seriesIds.length}] series=${id}\r`);
    const html = await fetchText(`${OFFICIAL_BASE}?series=${id}`);
    for (const card of parseOfficialCards(html)) {
      if (!officialByModel.has(card.model)) officialByModel.set(card.model, card);
    }
    await sleep(300); // 礼儀として間隔を空ける
  }
  console.log(`\n公式カードマスタ: ${officialByModel.size} 種`);

  console.log("メルカードの買取価格表を取得中...");
  const mercardHtml = await fetchText(MERCARD_URL);
  const mercardRows = parseMercardPrices(mercardHtml);
  console.log(`メルカード買取データ: ${mercardRows.length} 行`);

  const mercardByModel = new Map();
  for (const row of mercardRows) {
    // ページは価格の高い順なので、最初に出てきたものを採用
    if (CLEAN_MODEL.test(row.model) && !mercardByModel.has(row.model)) {
      mercardByModel.set(row.model, row);
    }
  }
  console.log(`型番がシンプルな形式のもの: ${mercardByModel.size} 種`);

  const merged = [];
  for (const [model, mercardRow] of mercardByModel) {
    const official = officialByModel.get(model);
    if (!official) continue; // 公式データに無い（表記ゆれ等）ものはスキップ
    merged.push({
      model,
      cardName: official.name,
      rarity: official.rarity,
      officialImageUrl: `https://www.onepiece-cardgame.com/images/cardlist/card/${model}.png`,
      mercardImageUrl: mercardRow.img,
      price: mercardRow.price,
      sourceUrl: MERCARD_SOURCE_URL,
      shopId: MERCARD_SHOP_ID,
    });
  }
  merged.sort((a, b) => b.price - a.price);

  console.log(`公式データと実買取価格の両方が確認できたカード: ${merged.length} 種`);

  await writeFile(OUT_PATH, JSON.stringify(merged, null, 2) + "\n", "utf-8");
  console.log(`書き出し完了: ${path.relative(process.cwd(), OUT_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
