#!/usr/bin/env node
// ONE PIECEカードゲームのカードマスタと、複数店舗の買取価格を取得し、
// src/data/onepiece-cards.generated.json / onepiece-prices.generated.json /
// onepiece-sets.generated.json を再生成するスクリプト。
//
// 使い方:
//   node scripts/fetch-onepiece-cards.mjs
//
// データソース:
//   1. ONE PIECEカードゲーム公式サイト カードリスト（https://www.onepiece-cardgame.com/cardlist/）
//      全シリーズ（ブースター・スタートデッキ・プロモーションカード等すべて）を走査し、
//      カード名・型番・レアリティ・公式カード画像URLと、パック/デッキの正式名称を取得する。
//   2. アキバカードショップ メルカード 買取価格表（shop-h）
//      （https://akihabara-cardshop.com/onepice-kaitori/）
//      型番・買取価格を取得する。「型番」欄はパラレル版などの印刷違いを
//      「パラレル版OP05-118」「パラレル加工版OP05-118『PRB01』」のように、
//      基本の型番の前後に説明文を付けて表す。
//   3. カードショップ 遊々亭 買取価格表（shop-i）
//      （https://yuyu-tei.jp/buy/opc/s/<セットコード>。全59セットを走査）
//      「/buy/」が買取（お店がカードを買う）ページで、「/sell/」は逆に販売（お店がカードを売る＝通販）
//      ページなので注意（両ページとも「カード買取」「シングルカード販売」等の見出しで明示されている。
//      URLの見た目とは逆に「/buy/」側が買取価格である点、当初は取り違えていたため要注意）。
//      型番・買取価格・カード名を取得する。「カード名」欄はパラレル版などの印刷違いを
//      「ロックス・D・ジーベック(パラレル)(海賊団スーパーパラレル)」のように、
//      カード名の後ろに括弧書きで付け加えて表す。型番自体は常にクリーンな形式
//      （例: OP17-118）で別欄に載っているため、パラレル判定はメルカードより単純。
//
// 上記を型番で突き合わせ、「公式データで名前・型番・レアリティが確認でき、
// かつ実店舗の買取価格が分かる」カードだけを出力する（価格の無いカードは
// このアプリの性質上、比較のしようがないため除外する）。
//
// パラレル版・SP版などの印刷違いは、同じ基本型番でも別カードとして扱う
// （印刷違いで価格が大きく変わるため、`variantLabel` にその説明文を保持する）。
// ただし印刷違いの表記は店舗ごとに書式が異なり、別店舗の表記同士を「同じ印刷」と
// 機械的に同一視するのは誤突合のリスクがあるため、
//   - 印刷違いの注記が無い「通常版」だけは型番のみで店舗横断に突き合わせ、
//     複数店舗の価格を1枚のカードとして比較できるようにする
//   - パラレル版・SP版など印刷違いの注記があるものは、店舗ごとに別カードとして扱う
//     （店舗をまたいだ価格比較はできないが、誤って別の印刷を同一視するよりは安全）
//
// 型番の頭（ハイフンの前）が、どのパック/スタートデッキ/プロモに収録されたカードかを表す:
//   OP〇〇 = ブースターパック／ST〇〇 = スタートデッキ／EB〇〇 = エクストラブースター
//   PRB〇〇 = プレミアムブースター／P = プロモーションカード
//
// 礼儀として、各サイトへのリクエストは直列・間隔を空けて行う。
// 利用規約・robots.txtの範囲内で、頻繁に実行しすぎないこと（目安: 1日2回程度）。

import { writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CARDS_OUT_PATH = path.join(__dirname, "../src/data/onepiece-cards.generated.json");
const PRICES_OUT_PATH = path.join(__dirname, "../src/data/onepiece-prices.generated.json");
const SETS_OUT_PATH = path.join(__dirname, "../src/data/onepiece-sets.generated.json");

const OFFICIAL_BASE = "https://www.onepiece-cardgame.com/cardlist/";
const MERCARD_URL = "https://akihabara-cardshop.com/onepice-kaitori/";
const MERCARD_SHOP_ID = "shop-h";
const YUYUTEI_SHOP_ID = "shop-i";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

/** シリーズ一覧（id・パック/デッキの正式名称）を取得する */
async function getSeriesList() {
  const html = await fetchText(OFFICIAL_BASE);
  const list = [...html.matchAll(/<option value="(\d+)"[^>]*>([^<]+)<\/option>/g)].map((m) => ({
    id: m[1],
    rawName: m[2]
      .replace(/&lt;br class=&quot;spInline&quot;&gt;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim(),
  }));
  if (list.length === 0) {
    throw new Error("シリーズ一覧を取得できませんでした（サイト構造が変わった可能性があります）");
  }
  const seen = new Set();
  return list.filter((s) => (seen.has(s.id) ? false : (seen.add(s.id), true)));
}

/** シリーズ名から型番の頭（セットコード）と表示名を抜き出す。例: "ブースターパック 新時代の主役【OP-05】" → { code: "OP05", name: "ブースターパック 新時代の主役" } */
function parseSetInfo(rawName) {
  const m = rawName.match(/^(.*?)\s*【([A-Za-z]+)-(\d+)】$/);
  if (!m) return null;
  const [, name, letters, digits] = m;
  return { code: `${letters}${digits}`, name: name.trim() };
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
    const [, img, , name, model, type, price] = m;
    // td4は実際にはカード種類（CHARACTER/LEADER/EVENT/STAGE）で、レアリティではない。
    // レアリティは公式データ側（officialByModel）から取得する。
    rows.push({ img, name: name.trim(), model: model.trim(), type: type.trim(), price: Number(price) });
  }
  return rows;
}

const BASE_MODEL = /(?:OP|ST|EB|PRB)\d{2}-\d{3}|P-\d{3}/;

/**
 * メルカードの「型番」欄を分解する。
 * 例: "OP05-119" → { model: "OP05-119", variantLabel: null }
 *     "パラレル版OP05-118" → { model: "OP05-118", variantLabel: "パラレル版" }
 *     "パラレル加工版OP05-118『PRB01』" → { model: "OP05-118", variantLabel: "パラレル加工版『PRB01』" }
 * パラレル版・SP版・プロモ再録版など、基本型番の前後に説明が付くケースをまとめて扱う。
 */
function parseMercardModelField(raw) {
  const m = raw.match(new RegExp(`^(.*?)(${BASE_MODEL.source})(?:『([^』]+)』)?$`));
  if (!m) return null;
  const [, prefix, model, pack] = m;
  const label = prefix.trim();
  const variantLabel = label ? (pack ? `${label}『${pack}』` : label) : pack ? `『${pack}』` : null;
  return { model, variantLabel };
}

/** 遊々亭の1セット分の買取ページ（/buy/opc/s/<code>）を取得し、カード一覧をパースする */
function parseYuyuteiPrices(html) {
  const pattern =
    /<img\s*\n?src="(https:\/\/card\.yuyu-tei\.jp\/[^"]+)"[^>]*\/>.*?<span\s*\n?class="d-block border border-dark p-1 w-100 text-center my-2">([^<]*)<\/span>.*?<h4 class="text-primary fw-bold">([^<]*)<\/h4>.*?<strong\s*\n?class="d-block text-end[^"]*">\s*([\d,]+)\s*円\s*<\/strong>/gs;
  const rows = [];
  for (const m of html.matchAll(pattern)) {
    const [, img, model, name, priceText] = m;
    rows.push({ img, model: model.trim(), name: name.trim(), price: Number(priceText.replace(/,/g, "")) });
  }
  return rows;
}

/**
 * 遊々亭の「カード名」欄の末尾に付く括弧書き（例: "(パラレル)(海賊団スーパーパラレル)"）を
 * 印刷違いの注記として分離する。型番自体はメルカードと違いクリーンな別欄にあるので、
 * ここでは名前欄だけを見ればよい。
 */
function parseYuyuteiVariant(name) {
  const m = name.match(/^(.*?)((?:\([^()]*\))*)$/);
  const [, base, suffix] = m;
  if (!suffix) return { name: base.trim(), variantLabel: null };
  const parts = [...suffix.matchAll(/\(([^()]*)\)/g)].map((mm) => mm[1]);
  return { name: base.trim(), variantLabel: parts.length ? parts.join("・") : null };
}

/** 型番からセットコードを取り出す。例: "OP05-119" → "OP05"、"P-041" → "P" */
function setCodeForModel(model) {
  if (/^P-\d+$/.test(model)) return "P";
  const m = model.match(/^([A-Za-z]+\d{2})-/);
  return m ? m[1] : null;
}

function idForCard(model, shopId, variantLabel) {
  if (!variantLabel) return `card-gen-${model}`; // 通常版は型番のみで店舗横断の同一カードとして扱う
  const hash = createHash("sha1").update(`${model}::${shopId}::${variantLabel}`).digest("hex").slice(0, 8);
  return `card-gen-${model}-${hash}`;
}

async function main() {
  console.log("公式サイトのシリーズ一覧を取得中...");
  const seriesList = await getSeriesList();
  console.log(`${seriesList.length} シリーズを検出`);

  const setNames = new Map();
  setNames.set("P", "プロモーションカード"); // ブラケット表記がないため手動で登録
  for (const s of seriesList) {
    const info = parseSetInfo(s.rawName);
    if (info && !setNames.has(info.code)) setNames.set(info.code, info.name);
  }

  const officialByModel = new Map();
  for (const [i, s] of seriesList.entries()) {
    process.stdout.write(`  [official ${i + 1}/${seriesList.length}] series=${s.id} (${s.rawName})\r`);
    const html = await fetchText(`${OFFICIAL_BASE}?series=${s.id}`);
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

  // 型番＋印刷違い（パラレル版など）ごとに一意なキーで集約する。
  // ページは価格の高い順なので、同じキーが複数あれば最初に出てきたもの（＝最高値）を採用。
  const mercardByKey = new Map();
  for (const row of mercardRows) {
    const parsed = parseMercardModelField(row.model);
    if (!parsed) continue; // どうしても型番を抜き出せない特殊な表記はスキップ
    const key = `${parsed.model}::${parsed.variantLabel ?? ""}`;
    if (!mercardByKey.has(key)) {
      mercardByKey.set(key, { model: parsed.model, variantLabel: parsed.variantLabel, img: row.img, price: row.price });
    }
  }
  console.log(`メルカード: 型番を認識できたもの: ${mercardByKey.size} 種`);

  // 遊々亭は「セット単位」の買取ページしか無いため、公式サイトと同じセットコード一覧を使って走査する
  console.log("遊々亭の買取価格表を取得中（セットごと）...");
  const yuyuteiByKey = new Map();
  const yuyuteiSetCodes = [...setNames.keys()].filter((c) => c !== "P"); // 遊々亭にプロモ一括ページは無いため除外
  for (const [i, code] of yuyuteiSetCodes.entries()) {
    const slug = code.toLowerCase();
    process.stdout.write(`  [yuyutei ${i + 1}/${yuyuteiSetCodes.length}] ${code}\r`);
    const url = `https://yuyu-tei.jp/buy/opc/s/${slug}`;
    let html;
    try {
      html = await fetchText(url);
    } catch {
      await sleep(300);
      continue; // そのセットの買取ページが無い等の場合はスキップ
    }
    for (const row of parseYuyuteiPrices(html)) {
      const { name, variantLabel } = parseYuyuteiVariant(row.name);
      if (!name) continue;
      const key = `${row.model}::${variantLabel ?? ""}`;
      if (!yuyuteiByKey.has(key)) {
        yuyuteiByKey.set(key, { model: row.model, variantLabel, img: row.img, price: row.price, sourceUrl: url });
      }
    }
    await sleep(300); // 礼儀として間隔を空ける
  }
  console.log(`\n遊々亭: 型番を認識できたもの: ${yuyuteiByKey.size} 種（${yuyuteiSetCodes.length} セットを走査）`);

  // --- 公式データと突き合わせ、カードマスタ + 店舗別価格の2つのテーブルに正規化する ---
  // 通常版（印刷違いの注記が無いもの）は型番だけで店舗横断に同一カードとして突き合わせ、
  // 複数店舗の価格を比較できるようにする。パラレル版等は店舗ごとの表記のズレによる誤突合を
  // 避けるため、店舗ごとに別カードとして扱う（cardKeyに shopId を含める）。
  const cardsByKey = new Map(); // cardKey -> { id, model, variantLabel, official, imageCandidates: [{img, priority}] }
  const priceRows = []; // { cardKey, shopId, price, sourceUrl }

  function registerRow({ model, variantLabel, img, price }, shopId, sourceUrl, imagePriority) {
    const official = officialByModel.get(model);
    if (!official) return; // 公式データに無い（表記ゆれ等）ものはスキップ
    const cardKey = variantLabel ? `${model}::${shopId}::${variantLabel}` : model;
    if (!cardsByKey.has(cardKey)) {
      cardsByKey.set(cardKey, {
        id: idForCard(model, shopId, variantLabel),
        model,
        variantLabel,
        official,
        imageCandidates: [],
      });
    }
    const isPlaceholder = /noimage/.test(img);
    if (!isPlaceholder) {
      cardsByKey.get(cardKey).imageCandidates.push({ img, priority: imagePriority });
    }
    priceRows.push({ cardKey, shopId, price, sourceUrl });
  }

  for (const row of mercardByKey.values()) {
    registerRow(row, MERCARD_SHOP_ID, MERCARD_URL, 1);
  }
  for (const row of yuyuteiByKey.values()) {
    registerRow(row, YUYUTEI_SHOP_ID, row.sourceUrl, 2);
  }

  const usedSetCodes = new Set();
  const cardsOut = [];
  for (const [cardKey, c] of cardsByKey.entries()) {
    const setCode = setCodeForModel(c.model);
    if (setCode) usedSetCodes.add(setCode);
    const bestImage = c.imageCandidates.sort((a, b) => a.priority - b.priority)[0];
    cardsOut.push({
      id: c.id,
      cardKey,
      model: c.model,
      cardName: c.official.name,
      rarity: c.official.rarity,
      variantLabel: c.variantLabel,
      set: setCode,
      imageUrl: bestImage ? bestImage.img : `https://www.onepiece-cardgame.com/images/cardlist/card/${c.model}.png`,
    });
  }

  const cardKeyToId = new Map(cardsOut.map((c) => [c.cardKey, c.id]));
  const now = new Date().toISOString();
  const pricesOut = priceRows.map((p) => ({
    id: `price-gen-${p.cardKey}-${p.shopId}`,
    cardId: cardKeyToId.get(p.cardKey),
    shopId: p.shopId,
    price: p.price,
    updatedAt: now,
    sourceUrl: p.sourceUrl,
  }));

  // 出力用にcardKeyを除去
  const cardsFinal = cardsOut.map(({ cardKey: _cardKey, ...rest }) => rest);
  cardsFinal.sort((a, b) => a.model.localeCompare(b.model) || (a.variantLabel ?? "").localeCompare(b.variantLabel ?? ""));
  pricesOut.sort((a, b) => b.price - a.price);

  const variantCount = cardsFinal.filter((c) => c.variantLabel).length;
  const multiShopCount = cardsFinal.filter(
    (c) => pricesOut.filter((p) => p.cardId === c.id).length > 1
  ).length;
  console.log(
    `カードマスタ: ${cardsFinal.length} 種（うちパラレル/SP等の印刷違い: ${variantCount} 種、複数店舗で価格比較できるもの: ${multiShopCount} 種）`
  );
  console.log(`価格データ: ${pricesOut.length} 件`);

  const setsOut = {};
  for (const code of [...usedSetCodes].sort()) {
    setsOut[code] = setNames.get(code) ?? code;
  }
  console.log(`収録パック/デッキ: ${Object.keys(setsOut).length} 種`);

  await writeFile(CARDS_OUT_PATH, JSON.stringify(cardsFinal, null, 2) + "\n", "utf-8");
  console.log(`書き出し完了: ${path.relative(process.cwd(), CARDS_OUT_PATH)}`);

  await writeFile(PRICES_OUT_PATH, JSON.stringify(pricesOut, null, 2) + "\n", "utf-8");
  console.log(`書き出し完了: ${path.relative(process.cwd(), PRICES_OUT_PATH)}`);

  await writeFile(SETS_OUT_PATH, JSON.stringify(setsOut, null, 2) + "\n", "utf-8");
  console.log(`書き出し完了: ${path.relative(process.cwd(), SETS_OUT_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
