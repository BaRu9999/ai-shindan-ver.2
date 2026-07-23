"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createFallbackDiagnosis,
  emptyScores,
  questions,
  rankScores,
  reactions,
  teaTypes,
  type AnswerRecord,
  type Choice,
  type DiagnosisText,
  type TeaKey,
} from "./diagnosis-data";
import { getCompatibility, isTeaKey } from "./compatibility-data";

type Stage = "intro" | "quiz" | "reaction" | "brewing" | "result";

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

async function requestDiagnosis(
  answers: AnswerRecord[],
  mainType: TeaKey,
  hiddenType: TeaKey,
) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 9_000);

  try {
    const response = await fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, mainType, hiddenType }),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error("診断文を取得できませんでした");
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("result" in data)) {
      throw new Error("診断文の形式が正しくありません");
    }

    return (data as { result: DiagnosisText }).result;
  } finally {
    window.clearTimeout(timeout);
  }
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] =
    useState<Record<TeaKey, number>>(emptyScores);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [diagnosis, setDiagnosis] = useState<DiagnosisText>(() =>
    createFallbackDiagnosis("matcha", "wakoucha", []),
  );
  const [inviterMain, setInviterMain] = useState<TeaKey | null>(null);
  const [inviterHidden, setInviterHidden] = useState<TeaKey | null>(null);
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      const hidden = params.get("hidden");
      if (isTeaKey(from)) setInviterMain(from);
      if (isTeaKey(hidden)) setInviterHidden(hidden);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const ranking = useMemo(() => rankScores(scores), [scores]);
  const mainKey = ranking[0]?.[0] ?? "matcha";
  const hiddenKey = ranking[1]?.[0] ?? "wakoucha";
  const mainTea = teaTypes[mainKey];
  const hiddenTea = teaTypes[hiddenKey];
  const compatibility = inviterMain ? getCompatibility(inviterMain, mainKey) : null;

  const createShareUrl = () => {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("from", mainKey);
    url.searchParams.set("hidden", hiddenKey);
    return url.toString();
  };

  const shareResult = async () => {
    const url = createShareUrl();
    const text = `私は「${mainTea.name}タイプ」でした！あなたも診断して、2人の相性を見てみてね。`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "AI茶タイプ相性診断", text, url });
        setShareStatus("共有画面を開きました");
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShareStatus("共有リンクをコピーしました");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") setShareStatus("共有できませんでした。もう一度お試しください");
    }
  };

  const shareToLine = () => {
    const url = createShareUrl();
    const text = `私は「${mainTea.name}タイプ」でした！あなたも診断して、2人の相性を見てみてね。\n${url}`;
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const start = () => {
    setScores({ ...emptyScores });
    setAnswers([]);
    setQuestionIndex(0);
    setStage("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const advance = (nextIndex: number) => {
    setQuestionIndex(nextIndex);
    setStage("quiz");
  };

  const finishDiagnosis = async (
    updatedScores: Record<TeaKey, number>,
    updatedAnswers: AnswerRecord[],
  ) => {
    setStage("brewing");
    const finalRanking = rankScores(updatedScores);
    const finalMainKey = finalRanking[0][0];
    const finalHiddenKey = finalRanking[1][0];
    const fallback = createFallbackDiagnosis(
      finalMainKey,
      finalHiddenKey,
      updatedAnswers,
    );

    try {
      const [generated] = await Promise.all([
        requestDiagnosis(updatedAnswers, finalMainKey, finalHiddenKey),
        wait(1_850),
      ]);
      setDiagnosis(generated);
    } catch {
      await wait(1_850);
      setDiagnosis(fallback);
    }

    setStage("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const choose = (choice: Choice) => {
    const updatedScores = {
      ...scores,
      [choice.main]: scores[choice.main] + 2,
      [choice.sub]: scores[choice.sub] + 1,
    };
    const updatedAnswers = [
      ...answers,
      {
        question: questions[questionIndex].title,
        answer: choice.label,
      },
    ];

    setScores(updatedScores);
    setAnswers(updatedAnswers);

    if (questionIndex === questions.length - 1) {
      void finishDiagnosis(updatedScores, updatedAnswers);
      return;
    }

    const nextIndex = questionIndex + 1;
    if (reactions[questionIndex]) {
      setStage("reaction");
      window.setTimeout(() => advance(nextIndex), 1_300);
      return;
    }

    advance(nextIndex);
  };

  const saveCard = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1440;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 1080, 1440);
    gradient.addColorStop(0, "#f8f3e8");
    gradient.addColorStop(1, "#e4ecd9");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1440);

    ctx.textAlign = "center";
    ctx.fillStyle = "#556a4d";
    ctx.font = "500 34px serif";
    ctx.fillText("祇園茶寮 × タニタカフェ", 540, 105);
    ctx.font = "32px serif";
    ctx.fillText("今日のAI茶タイプ診断", 540, 180);

    ctx.fillStyle = "#263728";
    ctx.font =
      `${mainTea.name}${hiddenTea.name}`.length > 8
        ? "700 55px serif"
        : "700 68px serif";
    ctx.fillText(`${mainTea.name} × ${hiddenTea.name}`, 540, 380);
    ctx.font = "500 40px serif";
    ctx.fillText(mainTea.catchphrase, 540, 470);

    ctx.strokeStyle = "#b8c5aa";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(170, 550);
    ctx.lineTo(910, 550);
    ctx.stroke();

    ctx.font = "32px serif";
    ctx.fillStyle = "#6e785e";
    ctx.fillText("今日の和ことば", 540, 650);
    ctx.font = "700 68px serif";
    ctx.fillStyle = "#3c553d";
    ctx.fillText(diagnosis.word, 540, 760);

    ctx.font = "30px serif";
    ctx.fillStyle = "#6e785e";
    ctx.fillText("今日のおすすめ", 540, 925);
    ctx.font = "700 42px serif";
    ctx.fillStyle = "#263728";
    ctx.fillText(mainTea.product, 540, 1010);

    ctx.font = "28px serif";
    ctx.fillStyle = "#7b6d58";
    ctx.fillText("今日の気分で、結果は少しずつ変わります。", 540, 1270);
    ctx.fillText("また別の日にも試してみてください。", 540, 1320);

    const imageBlob = await new Promise<Blob | null>((resolve) => {
  canvas.toBlob(resolve, "image/png");
});

if (!imageBlob) {
  alert("画像を作成できませんでした。");
  return;
}

const file = new File(
  [imageBlob],
  "今日のAI茶タイプ診断.png",
  { type: "image/png" },
);

// スマホで画像共有に対応している場合
if (
  navigator.share &&
  navigator.canShare &&
  navigator.canShare({ files: [file] })
) {
  try {
    await navigator.share({
      title: "今日のAI茶タイプ診断",
      text: `${mainTea.name}タイプになりました！`,
      files: [file],
    });
    return;
  } catch (error) {
    // 共有画面を閉じた場合は何もしない
    if ((error as Error).name === "AbortError") {
      return;
    }
  }
}

// 共有機能が使えない端末用
const imageUrl = URL.createObjectURL(imageBlob);
const link = document.createElement("a");

link.href = imageUrl;
link.download = "今日のAI茶タイプ診断.png";
link.target = "_blank";

document.body.appendChild(link);
link.click();
link.remove();

window.setTimeout(() => {
  URL.revokeObjectURL(imageUrl);
}, 10_000);
  };

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className={`diagnosis-card stage-${stage}`}>
        <header className="brand-row">
          <span className="brand-mark">茶</span>
          <div>
            <p>祇園茶寮 × タニタカフェ</p>
            <span>柏の葉店</span>
          </div>
          <span className="preview-badge">AI茶タイプ診断</span>
        </header>

        {stage === "intro" && (
          <div className="intro-screen screen-enter">
            <p className="eyebrow">7つの質問でわかる</p>
            <h1>
              今日の
              <span>AI茶タイプ診断</span>
            </h1>
            <p className="intro-copy">
              {inviterMain ? <><strong>{teaTypes[inviterMain].name}タイプ</strong>のお友達から<br />相性診断が届きました。</> : <>AIが今のあなたに合う茶タイプと、<br />今日おすすめのメニューが分かります。</>}
            </p>

            {inviterMain && <div className="invitation-note"><span>{teaTypes[inviterMain].icon}</span>診断後に、2人の相性が表示されます</div>}

            <div className="tea-preview" aria-label="診断で分かる6タイプ">
              {(Object.keys(teaTypes) as TeaKey[]).map((key) => (
                <div key={key} className="tea-chip">
                  <span>{teaTypes[key].icon}</span>
                  {teaTypes[key].name}
                </div>
              ))}
            </div>

            <button className="primary-button" onClick={start}>
              今の私を診断する
              <span aria-hidden="true">→</span>
            </button>

            <div className="trust-row">
              <span>⏱ 約45秒</span>
              <i />
              <span>全7問</span>
              <i />
              <span>個人情報不要</span>
            </div>
            <p className="ai-note">
              AIが回答を読み取り、あなた専用の結果文を作ります
            </p>
          </div>
        )}

        {stage === "quiz" && (
          <div className="quiz-screen screen-enter">
            <div className="progress-head">
              <span>AIが今のあなたを抽出中...</span>
              <strong>
                {questionIndex + 1}
                <small> / {questions.length}</small>
              </strong>
            </div>
            <div className="tea-progress" aria-hidden="true">
              <div
                className="tea-progress-fill"
                style={{
                  width: `${((questionIndex + 1) / questions.length) * 100}%`,
                }}
              />
              <span
                className="progress-leaf"
                style={{
                  left: `${((questionIndex + 1) / questions.length) * 100}%`,
                }}
              >
                🍃
              </span>
            </div>

            <p className="question-number">QUESTION {questionIndex + 1}</p>
            <h2>{questions[questionIndex].title}</h2>
            <p className="question-hint">
              いちばん近いものを、ひとつ選んでください
            </p>

            <div className="choice-list">
              {questions[questionIndex].choices.map((choice) => (
                <button
                  key={choice.label}
                  className="choice-button"
                  onClick={() => choose(choice)}
                >
                  <span className="choice-icon">{choice.icon}</span>
                  <span>{choice.label}</span>
                  <b aria-hidden="true">›</b>
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === "reaction" && (
          <div className="reaction-screen screen-enter" aria-live="polite">
            <div className="reaction-cup">
              <span className="steam steam-one" />
              <span className="steam steam-two" />
              <span className="steam steam-three" />
              <span>🍵</span>
            </div>
            <p>{reactions[questionIndex]}</p>
            <div className="reaction-dots">
              <i />
              <i />
              <i />
            </div>
          </div>
        )}

        {stage === "brewing" && (
          <div className="brewing-screen screen-enter" aria-live="polite">
            <div className="brewing-visual">
              <span className="steam steam-one" />
              <span className="steam steam-two" />
              <span className="steam steam-three" />
              <div className="cup">🍵</div>
              <div className="brew-ring brew-ring-one" />
              <div className="brew-ring brew-ring-two" />
            </div>
            <p className="eyebrow">まもなく結果が出ます</p>
            <h2>
              あなたの回答を
              <br />
              一杯のお茶に抽出しています…
            </h2>
            <p>性格傾向と今日の気分に合う和茶を選んでいます</p>
          </div>
        )}

        {stage === "result" && (
          <div className="result-screen screen-enter">
            <div className="result-heading">
              <p className="eyebrow">AIが分析した今日のあなたは</p>
              <div className="type-icons">
                <span>{mainTea.icon}</span>
                <i>×</i>
                <span>{hiddenTea.icon}</span>
              </div>
              <h1>
                {mainTea.name}
                <small>タイプ</small>
                <b> × </b>
                {hiddenTea.name}
                <small>タイプ</small>
              </h1>
              <p>{mainTea.catchphrase}</p>
            </div>

            <section className="dual-type-card">
              <div>
                <span>AI分析・メインタイプ</span>
                <strong style={{ color: mainTea.color }}>{mainTea.core}</strong>
                <p>{diagnosis.summary}</p>
              </div>
              <div>
                <span>AI分析・隠れタイプ</span>
                <strong style={{ color: hiddenTea.color }}>
                  {hiddenTea.hidden}
                </strong>
                <p>{diagnosis.hiddenInsight}</p>
              </div>
            </section>

            <section className="today-note">
              <span>今日のあなたへ</span>
              <p>{diagnosis.today}</p>
              <p className="caution-copy">{diagnosis.caution}</p>
            </section>

            <section className="recommendation-card">
              <div className="recommendation-image">
                {mainTea.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mainTea.image} alt={mainTea.product} />
                ) : (
                  <>
                    <span>{mainTea.productIcon}</span>
                   
                  </>
                )}
              </div>
              <div className="recommendation-copy">
                <p className="recommend-label">今日の一番おすすめ</p>
                <h2>{mainTea.product}</h2>
                <p>{diagnosis.recommendationReason}</p>
                <strong>{mainTea.price}</strong>
                <span className="staff-note">
                  ご注文前に是非参考にしてみてはどうでしょう♪
                </span>
              </div>
            </section>

            <section className="word-card">
              <span>今日の和ことば</span>
              <strong>{diagnosis.word}</strong>
              <p>{diagnosis.wordMeaning}</p>
            </section>

            {compatibility && inviterMain && (
              <section className="compatibility-card">
                <p className="compatibility-label">お友達との和茶相性</p>
                <div className="compatibility-pair">
                  <div><span>{teaTypes[inviterMain].icon}</span><small>お友達</small><strong>{teaTypes[inviterMain].name}</strong></div>
                  <div className="compatibility-score"><b>{compatibility.score}</b><span>%</span></div>
                  <div><span>{mainTea.icon}</span><small>あなた</small><strong>{mainTea.name}</strong></div>
                </div>
                <h2>{compatibility.title}</h2>
                <p>{compatibility.description}</p>
                <div className="compatibility-advice"><strong>もっと仲良くなる一言</strong><p>{compatibility.advice}</p></div>
                {inviterHidden && <small className="hidden-pair-note">お友達の隠れタイプは{teaTypes[inviterHidden].name}です</small>}
              </section>
            )}

            <section className="share-card">
              <span className="share-icon">🤝</span>
              <div><h2>友達と相性を見てみよう</h2><p>結果リンクを送ると、友達の診断後に2人の相性が表示されます。</p></div>
              <button className="line-share-button" onClick={shareToLine}>LINEで友達に送る</button>
              <button className="secondary-button" onClick={shareResult}>その他の方法で共有</button>
              {shareStatus && <p className="share-status" aria-live="polite">{shareStatus}</p>}
            </section>

            <p className="retry-note">
              今日の気分で結果は変わります。別の日にもお試しください。
            </p>

            <div className="result-actions">
              <button className="primary-button" onClick={saveCard}>
                結果カードを保存・共有する
                <span>↓</span>
              </button>
              <button className="secondary-button" onClick={start}>
                もう一度診断する
              </button>
            </div>
          </div>
        )}
      </section>

      <p className="outside-note">祇園茶寮 × タニタカフェ 柏の葉店</p>
    </main>
  );
}
