import { teaTypes, type TeaKey } from "./diagnosis-data";

export type CompatibilityResult = { score: number; title: string; description: string; advice: string };

const teaOrder: TeaKey[] = ["matcha", "hojicha", "wakoucha", "kuwacha", "biwa", "rooibos"];
const pairScores: Record<string, number> = {
  "matcha:matcha": 86, "matcha:hojicha": 92, "matcha:wakoucha": 83,
  "matcha:kuwacha": 95, "matcha:biwa": 89, "matcha:rooibos": 78,
  "hojicha:hojicha": 90, "hojicha:wakoucha": 94, "hojicha:kuwacha": 84,
  "hojicha:biwa": 91, "hojicha:rooibos": 96, "wakoucha:wakoucha": 88,
  "wakoucha:kuwacha": 80, "wakoucha:biwa": 93, "wakoucha:rooibos": 91,
  "kuwacha:kuwacha": 87, "kuwacha:biwa": 94, "kuwacha:rooibos": 82,
  "biwa:biwa": 88, "biwa:rooibos": 90, "rooibos:rooibos": 89,
};

function pairKey(a: TeaKey, b: TeaKey) {
  return teaOrder.indexOf(a) <= teaOrder.indexOf(b) ? `${a}:${b}` : `${b}:${a}`;
}

export function isTeaKey(value: string | null): value is TeaKey {
  return Boolean(value && value in teaTypes);
}

export function getCompatibility(a: TeaKey, b: TeaKey): CompatibilityResult {
  const score = pairScores[pairKey(a, b)] ?? 85;
  const first = teaTypes[a];
  const second = teaTypes[b];
  if (a === b) return {
    score,
    title: "似たテンポで落ち着ける関係",
    description: `${first.name}タイプ同士。大切にしたい感覚が似ているため、言葉が少なくても自然と分かり合えます。`,
    advice: "似ているからこそ遠慮も重なりがち。時々、どちらかが先に本音を伝えると関係が深まります。",
  };
  if (score >= 94) return {
    score,
    title: "ひと口目から心がほどける名コンビ",
    description: `${first.name}タイプの「${first.core}」と、${second.name}タイプの「${second.core}」がきれいに補い合う関係です。`,
    advice: "得意な役割を自然に任せ合うと、二人らしい心地よさがさらに育ちます。",
  };
  if (score >= 88) return {
    score,
    title: "違いがちょうどよい、味わい深い関係",
    description: `${first.name}タイプと${second.name}タイプは、違う視点を持ちながらも安心して一緒にいられる組み合わせです。`,
    advice: "相手のやり方を直そうとせず、『そんな見方もあるんだ』と楽しむのが仲良しの秘訣です。",
  };
  return {
    score,
    title: "ゆっくり淹れるほど深まる関係",
    description: `${first.name}タイプと${second.name}タイプは、最初のテンポに少し違いがありますが、知るほど新しい魅力に気づける組み合わせです。`,
    advice: "結論を急がず、相手が大切にしていることを一つ聞いてみると距離が縮まります。",
  };
}
