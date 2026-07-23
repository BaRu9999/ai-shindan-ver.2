export type TeaKey =
  | "matcha"
  | "hojicha"
  | "wakoucha"
  | "kuwacha"
  | "biwa"
  | "rooibos";

export type Choice = {
  icon: string;
  label: string;
  main: TeaKey;
  sub: TeaKey;
};

export type AnswerRecord = {
  question: string;
  answer: string;
};

export type DiagnosisText = {
  summary: string;
  hiddenInsight: string;
  today: string;
  caution: string;
  recommendationReason: string;
  word: string;
  wordMeaning: string;
};

export type TeaType = {
  name: string;
  icon: string;
  color: string;
  catchphrase: string;
  core: string;
  hidden: string;
  description: string;
  caution: string;
  product: string;
  productNote: string;
  productIcon: string;
  price: string;
  image: string | null;
};

export const teaTypes: Record<TeaKey, TeaType> = {
  matcha: {
    name: "抹茶",
    icon: "🍵",
    color: "#557653",
    catchphrase: "静かな芯を持つ、凛とした人",
    core: "静かな芯の強さ",
    hidden: "ここぞという時の集中力",
    description:
      "落ち着いて物事を見つめ、自分のペースを大切にできるあなた。派手に主張しなくても、周りには自然と安心感が伝わっています。",
    caution:
      "頼られると断れず、気づかないうちに頑張りすぎることも。今日は少し、自分を甘やかしてよい日です。",
    product: "抹茶ラテ ＋ 宇治抹茶パフェ",
    productNote:
      "濃厚な香りとほどよい甘さで、気持ちをゆっくり整える組み合わせ。",
    productIcon: "🍵",
    price: "¥1529(税込)",
    image: "mattcha type.png",
  },
  hojicha: {
    name: "ほうじ茶",
    icon: "🍂",
    color: "#906b4a",
    catchphrase: "そばにいるだけで、ほっとする人",
    core: "包み込むような安心感",
    hidden: "人を和ませるユーモア",
    description:
      "気取らず自然体で、人の緊張をほどくのが上手なあなた。あたたかな雰囲気に、つい本音を話したくなる人も多そうです。",
    caution:
      "周りを優先しすぎて、自分の疲れを後回しにしがち。香ばしい一杯で、まずはひと息つきましょう。",
    product: "ほうじ茶キャラメルミルクティー ＋ ほうじ茶アイスと黒豆きな粉アイスパフェ",
    productNote:
      "香ばしさとまろやかな甘みを楽しめる、ごほうび感のある組み合わせ。",
    productIcon: "🫖",
    price: "¥1551(税込)",
    image:"/menu/houji cha type.png",
  },
  wakoucha: {
    name: "和紅茶",
    icon: "🫖",
    color: "#a65a4a",
    catchphrase: "やわらかく華やぐ、気配り上手",
    core: "しなやかな社交性",
    hidden: "親しい人に見せる華やかさ",
    description:
      "場の空気を読みながら、相手を心地よくできるあなた。やわらかな印象の中に、自分らしい美意識を持っています。",
    caution:
      "気を配りすぎる日は、ひとりの時間が必要です。やさしい香りと甘味で気分を切り替えて。",
    product: "和紅茶 ＋ 二色わらび餅",
    productNote:
      "上品な香りとやさしい甘さが、気持ちに余白をつくる組み合わせ。",
    productIcon: "☕",
    price: "¥1243(税込)",
    image:"/menu/wakoucha type.png",
  },
  kuwacha: {
    name: "桑茶",
    icon: "🌿",
    color: "#6f8952",
    catchphrase: "自分を整える、堅実なバランサー",
    core: "日々を丁寧に整える力",
    hidden: "新しいものを試す好奇心",
    description:
      "無理なく続けられる心地よさを知っているあなた。小さな変化にも気づき、暮らしのバランスを取るのが得意です。",
    caution:
      "きちんとしようとするほど、予定外のことに疲れやすい面も。今日は完璧より心地よさを選んで。",
    product: "リラックスハーブティー ＋ タニタコラボプレート　鰆の西京焼き",
    productNote:
      "からだにやさしく、満足感も大切にしたい日にぴったりの組み合わせ。",
    productIcon: "🌿",
    price: "¥2398(税込)",
    image:"/menu/relax type.png",
  },
  biwa: {
    name: "枇杷の葉茶",
    icon: "🍃",
    color: "#69866c",
    catchphrase: "風通しのよい、自然体の聞き上手",
    core: "力を抜いて受け止める余裕",
    hidden: "迷いを断ち切る決断力",
    description:
      "肩の力が抜けていて、相手の話を自然に受け止められるあなた。穏やかですが、必要な時にはすっと前へ進めます。",
    caution:
      "合わせ上手な分、自分の希望が後になりがち。今日は『私はどうしたい？』を先に聞いてあげて。",
    product: "リフレッシュハーブティー ＋ 水わらび餅",
    productNote:
      "すっきりした後味と涼やかな甘味で、気分を軽くする組み合わせ。",
    productIcon: "🍃",
    price: "¥1276(税込)",
    image:"/menu/refresh type.png",
  },
  rooibos: {
    name: "ルイボスティー",
    icon: "🌱",
    color: "#a36d55",
    catchphrase: "おおらかで、満足上手な愛され役",
    core: "気持ちをゆるめるおおらかさ",
    hidden: "大切なものを守る粘り強さ",
    description:
      "細かいことにとらわれず、場を明るくできるあなた。自分も周りも楽しめる選択を、自然に見つけられます。",
    caution:
      "元気に見られるぶん、弱音を飲み込むことも。香ばしい一杯と甘味で、心まで満たして。",
    product: "ビューティーハーブティー ＋ 抹茶ティラマス",
    productNote:
      "香ばしさとコクのある甘味で、満足感をゆっくり味わう組み合わせ。",
    productIcon: "🌱",
    price: "¥1397(税込)",
    image: "/menu/beauty type.png",
  },
};

export const questions: { title: string; choices: Choice[] }[] = [
  {
    title: "今、一杯のお茶を選ぶならどんな気分？",
    choices: [
      { icon: "🌙", label: "静かに気持ちを整えたい", main: "matcha", sub: "biwa" },
      { icon: "☀️", label: "明るく気分転換したい", main: "wakoucha", sub: "rooibos" },
      { icon: "🛋️", label: "ほっと力を抜きたい", main: "hojicha", sub: "rooibos" },
      { icon: "🌿", label: "からだにやさしくしたい", main: "kuwacha", sub: "biwa" },
    ],
  },
  {
    title: "予定のない休日、どんなふうに過ごしたい？",
    choices: [
      { icon: "📖", label: "家で静かに好きなことをする", main: "matcha", sub: "hojicha" },
      { icon: "🛍️", label: "気になる場所へ出かける", main: "wakoucha", sub: "rooibos" },
      { icon: "👭", label: "誰かとゆっくり話す", main: "hojicha", sub: "wakoucha" },
      { icon: "🍃", label: "自然の中でのんびりする", main: "biwa", sub: "kuwacha" },
    ],
  },
  {
    title: "食後に惹かれる味わいは？",
    choices: [
      { icon: "🍵", label: "深く濃厚な味", main: "matcha", sub: "hojicha" },
      { icon: "🍂", label: "香ばしくまろやかな味", main: "hojicha", sub: "rooibos" },
      { icon: "🌸", label: "香りがよく上品な味", main: "wakoucha", sub: "matcha" },
      { icon: "🍃", label: "すっきり軽やかな味", main: "biwa", sub: "kuwacha" },
    ],
  },
  {
    title: "人と過ごす時、自然とどの役になる？",
    choices: [
      { icon: "🧭", label: "静かに方向を決める人", main: "matcha", sub: "kuwacha" },
      { icon: "🤲", label: "みんなを安心させる人", main: "hojicha", sub: "biwa" },
      { icon: "💐", label: "会話を華やかにする人", main: "wakoucha", sub: "rooibos" },
      { icon: "⚖️", label: "全体のバランスを取る人", main: "kuwacha", sub: "matcha" },
    ],
  },
  {
    title: "お店で席を選ぶなら、どこが落ち着く？",
    choices: [
      { icon: "🪟", label: "景色を眺められる窓側", main: "biwa", sub: "wakoucha" },
      { icon: "🪴", label: "緑が見える静かな席", main: "matcha", sub: "kuwacha" },
      { icon: "🫶", label: "人の気配を感じる席", main: "hojicha", sub: "rooibos" },
      { icon: "✨", label: "明るく写真映えする席", main: "wakoucha", sub: "biwa" },
    ],
  },
  {
    title: "最近のあなたに一番近いのは？",
    choices: [
      { icon: "🎯", label: "ひとつのことに集中している", main: "matcha", sub: "kuwacha" },
      { icon: "🤍", label: "誰かのために頑張っている", main: "hojicha", sub: "wakoucha" },
      { icon: "🌼", label: "新しい楽しみを探している", main: "wakoucha", sub: "rooibos" },
      { icon: "🌱", label: "生活を少し整えたい", main: "kuwacha", sub: "biwa" },
    ],
  },
  {
    title: "今日の時間を、どんな気持ちで終えたい？",
    choices: [
      { icon: "😌", label: "心が静かに整った気持ち", main: "matcha", sub: "biwa" },
      { icon: "🥰", label: "満たされて幸せな気持ち", main: "rooibos", sub: "hojicha" },
      { icon: "🌤️", label: "軽やかで前向きな気持ち", main: "biwa", sub: "wakoucha" },
      { icon: "💪", label: "明日も頑張れそうな気持ち", main: "kuwacha", sub: "matcha" },
    ],
  },
];

export const reactions: Record<number, string> = {
  1: "少しずつ、あなたの香りが見えてきました。",
  3: "穏やかさの中に、意外な一面がありそうです。",
  5: "あと1問で、今日の和茶タイプが分かります。",
};

export const emptyScores: Record<TeaKey, number> = {
  matcha: 0,
  hojicha: 0,
  wakoucha: 0,
  kuwacha: 0,
  biwa: 0,
  rooibos: 0,
};

export function rankScores(scores: Record<TeaKey, number>) {
  return (Object.entries(scores) as [TeaKey, number][]).sort(
    (a, b) => b[1] - a[1],
  );
}

export function createFallbackDiagnosis(
  mainKey: TeaKey,
  hiddenKey: TeaKey,
  answers: AnswerRecord[],
): DiagnosisText {
  const main = teaTypes[mainKey];
  const hidden = teaTypes[hiddenKey];
  const mood = answers[0]?.answer ?? "自分の時間を大切にしたい";
  const ending = answers[answers.length - 1]?.answer ?? "心地よく一日を終えたい";
  const typeWords: Record<
  TeaKey,
  { word: string; meaning: string }
> = {
  matcha: {
    word: "一期一会",
    meaning:
      "今日の出会いと時間を大切に。今この瞬間を丁寧に味わって。",
  },

  hojicha: {
    word: "和顔愛語",
    meaning:
      "やわらかな表情とやさしい言葉が、周りの心まで温めます。",
  },

  wakoucha: {
    word: "花鳥風月",
    meaning:
      "身近な美しさに気づく心が、今日を少し華やかにします。",
  },

  kuwacha: {
    word: "日々是好日",
    meaning:
      "どんな一日にも、その日だけのよさがあります。",
  },

  biwa: {
    word: "明鏡止水",
    meaning:
      "静かな心で向き合えば、本当に大切なものが見えてきます。",
  },

  rooibos: {
    word: "笑門来福",
    meaning:
      "笑顔のある場所には、自然と幸せが集まってきます。",
  },
};

const selectedWord = typeWords[mainKey];

return {
  summary: main.description,

  hiddenInsight:
    `${hidden.hidden}も、あなたの大切な一面です。親しい人の前や、気持ちに余裕がある時に自然と表れます。`,

  today:
    `今日は「${mood}」という気持ちが強いようです。「${ending}」と思える時間を、自分のために少しだけ作ってみてください。`,

  caution: main.caution,

  recommendationReason: main.productNote,

  word: selectedWord.word,
  wordMeaning: selectedWord.meaning,
};

}
