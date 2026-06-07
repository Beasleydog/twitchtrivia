import { useState, useEffect, useRef, useCallback } from 'react'
import { Virtuoso } from 'react-virtuoso'
import './App.css'

// ── Tutorial ────────────────────────────────────────────────────────────────

const TUTORIAL_STEPS = 4

const CHAT_NAMES = ['pogchamp42','NightOwl99','CoolStoryBro','OmegaLUL','MonkaS_Andy','xXDarkSlayer','SleepyViewer','BrainRot69','EZclap','KappaPride','WeirdChamp_','PoroKing','SwiftRage42','LULer3000','PauseChamp','ResidentSleeper','FeelsBadMan','TwitchPrime_','NotABot101','CursedEmote']
const CHAT_COLORS = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff','#ff9a3c','#00b4d8','#e63946','#48cae4','#f72585']
const CHAT_LETTERS = ['A','B','C','D']

const FAKE_LB = [
  { user: 'pogchamp42',    pts: 2840, correct: 3, total: 3 },
  { user: 'NightOwl99',   pts: 2410, correct: 3, total: 3 },
  { user: 'CoolStoryBro', pts: 1920, correct: 2, total: 3 },
  { user: '(you)',         pts: 1750, correct: 2, total: 3 },
  { user: 'OmegaLUL',     pts: 1310, correct: 2, total: 3 },
  { user: 'MonkaS_Andy',  pts:  730, correct: 1, total: 3 },
]

function Tutorial({ onDone }) {
  const [step, setStep] = useState(0)
  const [chatMsgs, setChatMsgs] = useState([])
  const [pressedKey, setPressedKey] = useState(null)
  const chatRef = useRef(null)
  const timersRef = useRef([])

  const clearTimers = () => { timersRef.current.forEach(t => clearTimeout(t)); timersRef.current = [] }

  // auto-scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [chatMsgs])

  useEffect(() => {
    clearTimers()
    setChatMsgs([])
    setPressedKey(null)

    if (step === 1) {
      // pump messages fast and loop
      let i = 0
      const pump = () => {
        const name = CHAT_NAMES[i % CHAT_NAMES.length]
        const letter = CHAT_LETTERS[Math.floor(Math.random() * 4)]
        const color = CHAT_COLORS[i % CHAT_COLORS.length]
        setChatMsgs(prev => [...prev.slice(-40), { id: Date.now() + i, name, letter, color }])
        i++
        const t = setTimeout(pump, 120 + Math.random() * 180)
        timersRef.current.push(t)
      }
      const t0 = setTimeout(pump, 200)
      timersRef.current.push(t0)
    }

    if (step === 2) {
      const seq = [
        { key: '1', delay: 800 },
        { key: '2', delay: 1800 },
        { key: '3', delay: 2800 },
        { key: '4', delay: 3800 },
      ]
      seq.forEach(({ key, delay }) => {
        const t1 = setTimeout(() => setPressedKey(key), delay)
        const t2 = setTimeout(() => setPressedKey(null), delay + 400)
        timersRef.current.push(t1, t2)
      })
    }

    return clearTimers
  }, [step])

  const letterColor = { A: 'var(--a)', B: 'var(--b)', C: 'var(--c)', D: 'var(--d)' }
  const letterBg   = { A: 'var(--a-dim)', B: 'var(--b-dim)', C: 'var(--c-dim)', D: 'var(--d-dim)' }

  const steps = [
    // 0 — what is it
    <div className="tut-step" key="0">
      <div className="tut-hero">
        <div className="tut-logo">TQ</div>
        <div>
          <h2>Twitch Trivia</h2>
          <p>A live quiz game for your stream. Questions appear on your screen — your entire chat plays along in real time.</p>
        </div>
      </div>
      <div className="tut-two-col">
        <div className="tut-card">
          <div className="tut-card-head">
            <span className="tut-card-icon">💬</span>
            <span className="tut-card-title">Chat votes</span>
          </div>
          <p>Viewers type <strong>A B C D</strong> in chat. First to answer correctly scores the most — no Googling.</p>
        </div>
        <div className="tut-card">
          <div className="tut-card-head">
            <span className="tut-card-icon">🎮</span>
            <span className="tut-card-title">You play too</span>
          </div>
          <p>Answer on your keyboard with <strong>1 2 3 4</strong>. Your pick is hidden until time's up so chat can't copy.</p>
        </div>
      </div>
    </div>,

    // 1 — live question + chat
    <div className="tut-step" key="1">
      <div className="tut-split">
        <div className="tut-split-left">
          <div className="tut-label">Question on screen</div>
          <div className="tut-question">What is the capital of France?</div>
          <div className="tut-choices-preview">
            {[['A','Rome','a'],['B','Paris','b'],['C','Berlin','c'],['D','Madrid','d']].map(([l,t,c]) => (
              <div key={l} className={`tut-choice choice-${c}`}>
                <span className="choice-key">{l}</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="tut-split-right">
          <div className="tut-label">Chat types their answer</div>
          <div className="tut-twitch-chat">
            <div className="tut-chat-header">
              <span className="tut-chat-dot" />
              LIVE CHAT
            </div>
            <div className="tut-chat-scroll" ref={chatRef}>
              {chatMsgs.map(m => (
                <div key={m.id} className="tut-chat-line">
                  <span className="tut-chat-name" style={{ color: m.color }}>{m.name}</span>
                  <span className="tut-chat-colon">:</span>
                  <span className="tut-chat-letter" style={{ color: letterColor[m.letter], background: letterBg[m.letter] }}>{m.letter}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,

    // 2 — keyboard
    <div className="tut-step" key="2">
      <div className="tut-label">Playing as the host</div>
      <h2>Answer secretly with your keyboard</h2>
      <p>While chat types in the chatbox, you press a number key. Nobody sees your answer until the round ends.</p>
      <div className="tut-keyboard">
        {[['1','A','var(--a)'],['2','B','var(--b)'],['3','C','var(--c)'],['4','D','var(--d)']].map(([k,l,col]) => (
          <div key={k} className={`tut-key ${pressedKey === k ? 'tut-key-pressed' : ''}`} style={pressedKey === k ? { borderColor: col, background: 'rgba(124,58,237,0.15)' } : {}}>
            <span className="tut-key-num">{k}</span>
            <span className="tut-key-eq">→</span>
            <span className="tut-key-letter" style={{ color: col }}>{l}</span>
          </div>
        ))}
      </div>
      <div className="tut-reveal-note">
        <span>🔒</span>
        <span>Your pick shows as <strong>"Answer locked in"</strong> — no letter visible until time expires</span>
      </div>
    </div>,

    // 3 — leaderboard
    <div className="tut-step" key="3">
      <div className="tut-label">After each question</div>
      <h2>Live leaderboard</h2>
      <div className="tut-lb-preview">
        {FAKE_LB.map(({ user, pts, correct, total }, i) => (
          <div key={user} className={`tut-lb-row ${user === '(you)' ? 'tut-lb-you' : ''}`}>
            <span className="tut-lb-rank">{['🥇','🥈','🥉'][i] ?? `#${i+1}`}</span>
            <span className="tut-lb-name">{user}</span>
            <span className="tut-lb-score">{correct}/{total}</span>
            <span className="tut-lb-pts">{pts.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="tut-scoring-note">
        ⚡ The faster you answer correctly, the more points you get. No Googling.
      </div>
    </div>,
  ]

  return (
    <div className="tut-overlay">
      <div className="tut-modal">
        <div className="tut-topbar">
          <div className="tut-progress">
            {Array.from({ length: TUTORIAL_STEPS }).map((_, i) => (
              <div key={i} className={`tut-pip ${i === step ? 'tut-pip-active' : i < step ? 'tut-pip-done' : ''}`} />
            ))}
          </div>
          <button className="tut-skip" onClick={onDone}>Skip</button>
        </div>

        <div className="tut-content">
          {steps[step]}
        </div>

        <div className="tut-nav">
          {step > 0
            ? <button className="tut-btn-back" onClick={() => setStep(s => s - 1)}>← Back</button>
            : <div />
          }
          {step < TUTORIAL_STEPS - 1
            ? <button className="btn-primary" onClick={() => setStep(s => s + 1)}>Next →</button>
            : <button className="btn-primary" onClick={onDone}>Let's play →</button>
          }
        </div>
      </div>
    </div>
  )
}

const PHASES = { JOIN: 'join', SETUP: 'setup', COUNTDOWN: 'countdown', QUESTION: 'question', BETWEEN: 'between', END: 'end' }
const LETTERS = ['A', 'B', 'C', 'D']
const COLORS = ['choice-a', 'choice-b', 'choice-c', 'choice-d']

const ROASTS = [
  'rip {name} who said {answer} 💀',
  '{name} said {answer}?? bro what',
  'lmaooo {name} out here picking {answer}',
  'get rekt {name} — {answer} lmaooo',
  '{name} with the galaxy brain {answer}',
  'embarrassing. {name} said {answer}.',
  '{name} needs to go back to school ({answer})',
  'bro {name} was so confident picking {answer} too',
  '{name} cooked nothing. {answer}.',
  'L + ratio {name} ({answer})',
  '{name} really said {answer} with their whole chest',
  '{name} is NOT winning today — picked {answer}',
  '{name} fumbled it with {answer}',
  'the audacity of {name} answering {answer}',
  'not {name} getting {answer} WRONG AGAIN',
]

const DEBUG_NAMES = ['xXDarkSlayer99Xx','pogchamp42','TwitchUser123','coolkid2000','StreamerFan88','NotABot101','GamingLegend','ProGamer777','RandomViewer','ChatSpammer','MonkaS_Andy','PepeHands_','FeelsBadMan99','LULer3000','OmegaLUL','Kappa_Lord','ResidentSleeper','BibleThump22','VoHiYo_Fan','TwitchPrime_','zw3rg_','NightOwl99','SleepyViewer','HypeTrainGo','SubGapAlert','ClipItSave','AimingBot','CopperRank','GoldRushTV','PlasticLegend','Kripp_Fan','xqcWatcher','HasanStan','LudwigMoment','QTpieClip','SwiftRage42','PoroKing','BrainRot69','CursedEmote','NotActuallyAFK','FollowBotArmy','TenorGIF','WeirdChamp_','WutFaceHD','PauseChamp','KomodoHype','PartyTime99','CoolStoryBro','TBTakin','EZclap','LULW_Moment','KappaPride42','SadgeMoment','MonkaHmm','PogO_bro','OkayegUser','5Head_play','forsenCD','OMEGALUL_no','Pepega_irl','Madge_moment','Copium_user','Hopium_main','TriHard7','BigBrainTime','PauseChamp2','AYAYA_enjoyer','CiGrip','DarkMode_on','widepeepoHappy','peepoLeave','ratJAM_go','YEP_cock','NOTED_bro','PogChamp2k','SeemsGood99','GachiBASS','SMOrc_rush','VoHiYo2','FrankerZ_fan','PunOko','SingsNote','DxCat','GreenAF','RedCard99','YellowFlag','BlueStar42','OrangePeel','PurplePill','WhiteNoise','BlackHole0','SilverTongue','GoldenRatio','BronzeAge','IronFist99','DiamondHands','CrystalBall','RubyRed','EmeraldCity','SapphireBlue','AmberAlert42']


function pickRoast(name, answer) {
  return ROASTS[Math.floor(Math.random() * ROASTS.length)]
    .replace('{name}', name)
    .replace('{answer}', answer)
}

let audioCtx = null
let recentVotes = [] // timestamps of recent votes for streak detection

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playTick() {
  try {
    const ctx = getAudioCtx()
    const now = Date.now()
    // keep only votes in last 2 seconds
    recentVotes = recentVotes.filter(t => now - t < 2000)
    recentVotes.push(now)
    const streak = recentVotes.length
    // base 700hz, rises up to ~1400hz at 30+ votes/2s
    const base = 700
    const rise = Math.min(streak / 30, 1) * 700
    const freq = base + rise + Math.random() * 40

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = freq
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.07, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.07)
  } catch {}
}

function decodeHTML(str) {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

function TimerModal({ timer, onChange, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Timer per question</h3>
        <div className="timer-row">
          <button className="nudge" onClick={() => onChange(Math.max(5, timer - 5))}>−5</button>
          <div className="timer-big">{timer}s</div>
          <button className="nudge" onClick={() => onChange(Math.min(60, timer + 5))}>+5</button>
        </div>
        <input type="range" min="5" max="60" step="5" value={timer}
          onChange={e => onChange(+e.target.value)} />
        <button className="btn-primary" onClick={onClose}>Done</button>
      </div>
    </div>
  )
}

function LbRow({ rank, user, pts, correct, total, isCorrect, isWrong, isHost, pickedLetter }) {
  return (
    <div className={`lb-row${isHost ? ' lb-host' : ''}`}>
      <span className="lb-rank">{rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}</span>
      <span className={`lb-name${isCorrect ? ' name-correct' : isWrong ? ' name-wrong' : ''}`}>{user}</span>
      {pickedLetter != null
        ? <span className={`lb-pick${isCorrect ? ' lb-pick-correct' : isWrong ? ' lb-pick-wrong' : ''}`}>{pickedLetter}</span>
        : <span className="lb-pick lb-pick-none">—</span>
      }
      <span className="lb-correct">{correct}/{total}</span>
      <span className="lb-pts">{pts.toLocaleString()}</span>
    </div>
  )
}

const ROW_H = 42 // px, must match .lb-row height

function VirtualLeaderboard({ sorted, roundAnswers, correctIdx, hostKey }) {
  const virtuosoRef = useRef(null)
  const [visibleRange, setVisibleRange] = useState({ startIndex: 0, endIndex: 0 })

  const hostIdx = sorted.findIndex(([u]) => u === hostKey)
  const hostAnswered = hostKey ? roundAnswers[hostKey] : null
  const hostIsCorrect = hostAnswered && hostAnswered.idx === correctIdx
  const hostIsWrong   = hostAnswered && hostAnswered.idx !== correctIdx

  const hostVisible = hostIdx === -1 ||
    (hostIdx >= visibleRange.startIndex && hostIdx <= visibleRange.endIndex)
  const stickyPos = !hostVisible
    ? (hostIdx < visibleRange.startIndex ? 'top' : 'bottom')
    : null

  return (
    <div className="leaderboard virt-leaderboard">
      <div className="lb-title">Leaderboard</div>
      {sorted.length === 0
        ? <div className="muted small lb-empty">No answers yet</div>
        : <Virtuoso
            ref={virtuosoRef}
            style={{ height: 400 }}
            totalCount={sorted.length}
            fixedItemHeight={43}
            rangeChanged={setVisibleRange}
            itemContent={i => {
              const [user, { pts, correct, total }] = sorted[i]
              const answered  = roundAnswers[user]
              const isCorrect = answered && answered.idx === correctIdx
              const isWrong   = answered && answered.idx !== correctIdx
              return (
                <LbRow rank={i} user={user} pts={pts} correct={correct} total={total}
                  isCorrect={isCorrect} isWrong={isWrong} isHost={user === hostKey}
                  pickedLetter={answered != null ? LETTERS[answered.idx] : null} />
              )
            }}
          />
      }
      {stickyPos && hostIdx !== -1 && (() => {
        const [, { pts, correct, total }] = sorted[hostIdx]
        return (
          <div className={`lb-sticky-inline lb-sticky-inline-${stickyPos === 'top' ? 'top' : 'bot'}`}>
            <LbRow rank={hostIdx} user={hostKey} pts={pts} correct={correct} total={total}
              isCorrect={hostIsCorrect} isWrong={hostIsWrong} isHost
              pickedLetter={hostAnswered != null ? LETTERS[hostAnswered.idx] : null} />
          </div>
        )
      })()}
    </div>
  )
}

function BetweenScreen({ qIndex, questions, correctIdx, choices, sorted, roundAnswers, hostKey, onNext }) {
  return (
    <div className="screen-between">
      <div className="reveal-header">
        <span className="muted small">Q{qIndex + 1} / {questions.length}</span>
        <h2>{questions[qIndex] ? decodeHTML(questions[qIndex].question) : ''}</h2>
      </div>

      <div className="reveal-choices">
        {choices.map((c, i) => (
          <div key={i} className={`reveal-choice ${COLORS[i]} ${i === correctIdx ? 'reveal-correct' : 'reveal-wrong'}`}>
            <span className="choice-key">{LETTERS[i]}</span>
            <span>{c}</span>
          </div>
        ))}
      </div>

      <VirtualLeaderboard sorted={sorted} roundAnswers={roundAnswers}
        correctIdx={correctIdx} hostKey={hostKey} />

      <button className="btn-primary btn-lg" onClick={onNext}>
        {qIndex + 1 >= questions.length ? 'See Final Results →' : 'Next Question →'}
      </button>
    </div>
  )
}

function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback } catch { return fallback }
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

export default function App() {
  const [showTutorial, setShowTutorial] = useState(() => loadLS('tq_tutorial', true))
  const [phase, setPhase] = useState(PHASES.JOIN)
  const [channel, setChannel] = useState(() => loadLS('tq_channel', ''))
  const [settings, setSettings] = useState(() => loadLS('tq_settings', { timer: 15, amount: 10, categories: [], difficulty: '' }))
  const [allCategories, setAllCategories] = useState([])
  const [catSearch, setCatSearch] = useState('')
  const [showTimer, setShowTimer] = useState(false)
  const [questions, setQuestions] = useState([])
  const [qIndex, setQIndex] = useState(0)
  const [choices, setChoices] = useState([])
  const [correctIdx, setCorrectIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  // scores: { username: { pts, correct, total } }
  const [scores, setScores] = useState({})
  const [roundAnswers, setRoundAnswers] = useState({})
  const [wrongPerson, setWrongPerson] = useState('')
  const [hostAnswer, setHostAnswer] = useState(null)
  const [roundDone, setRoundDone] = useState(false)
  // history: array of { question, correctAnswer, choiceColor }
  const [history, setHistory] = useState([])
  // per-round choices snapshot for history
  const [allChoices, setAllChoices] = useState([])

  const wsRef = useRef(null)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)
  const roundAnswersRef = useRef({})
  const correctIdxRef = useRef(0)
  const scoresRef = useRef({})
  const choicesRef = useRef([])
  const phaseRef = useRef(PHASES.JOIN)

  useEffect(() => { roundAnswersRef.current = roundAnswers }, [roundAnswers])
  useEffect(() => { correctIdxRef.current = correctIdx }, [correctIdx])
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { scoresRef.current = scores }, [scores])
  useEffect(() => { choicesRef.current = choices }, [choices])

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(r => r.json())
      .then(d => {
        const cats = d.trivia_categories || []
        setAllCategories(cats)
        setSettings(s => s.categories.length === 0 ? { ...s, categories: cats.map(c => c.id) } : s)
      })
      .catch(() => {})
  }, [])

  useEffect(() => { saveLS('tq_tutorial', showTutorial) }, [showTutorial])
  useEffect(() => { saveLS('tq_channel', channel) }, [channel])
  useEffect(() => { saveLS('tq_settings', settings) }, [settings])

  const canvasRef = useRef(null)
  const particlePoolRef = useRef([])
  const rafRef = useRef(null)
  const questionRectRef = useRef(null) // set by question screen div

  const spawnParticle = useCallback((name, color) => {
    const pool = particlePoolRef.current
    const W = window.innerWidth
    const H = window.innerHeight
    const qr = questionRectRef.current

    let x, y, tries = 0
    do {
      x = 30 + Math.random() * (W - 60)
      y = 20 + Math.random() * (H - 60)
      tries++
    } while (
      tries < 20 && qr &&
      x > qr.left - 60 && x < qr.right + 60 &&
      y > qr.top - 20  && y < qr.bottom + 20
    )

    // loose overlap nudge
    for (const p of pool) {
      if (Math.abs(x - p.x) < 100 && Math.abs(y - p.y) < p.size + 4) {
        y += Math.random() < 0.5 ? -(p.size + 6) : (p.size + 6)
      }
    }

    pool.push({
      name,
      x, y,
      angle: (Math.random() - 0.5) * 0.5,
      size: 10 + Math.floor(Math.random() * 18), // 10–27px
      opacity: 0.55 + Math.random() * 0.4,
      color: color || '#ffffff',
    })

    if (pool.length > 500) pool.splice(0, pool.length - 500)
  }, [])

  // canvas rAF loop — names drift slowly and stay
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let alive = true

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      if (!alive) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particlePoolRef.current) {
        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.font = `700 ${p.size}px system-ui, sans-serif`
        ctx.fillStyle = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.fillText(p.name, 0, 0)
        ctx.restore()
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      alive = false
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const connectTwitch = useCallback((ch) => {
    const nick = 'justinfan' + Math.floor(Math.random() * 1000000)
    const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443')
    wsRef.current = ws
    ws.onopen = () => {
      ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands')
      ws.send(`NICK ${nick}`)
      ws.send(`JOIN #${ch}`)
    }
    ws.onmessage = (event) => {
      for (const line of event.data.split('\r\n')) {
        if (!line) continue
        if (line.startsWith('PING')) { ws.send('PONG :tmi.twitch.tv'); continue }
        if (line.includes(' PRIVMSG ')) {
          const userMatch = line.match(/display-name=([^;]+)/)
          const msgMatch = line.match(/ PRIVMSG #\S+ :(.+)$/)
          if (!userMatch || !msgMatch) continue
          const user = userMatch[1] || 'anon'
          const colorMatch = line.match(/color=(#[0-9A-Fa-f]{6})/)
          const userColor = colorMatch ? colorMatch[1] : null
          const msg = msgMatch[1].trim().toUpperCase()
          const answerMap = { A: 0, B: 1, C: 2, D: 3 }
          if (msg in answerMap && phaseRef.current === PHASES.QUESTION && !roundAnswersRef.current[user]) {
            const elapsed = (Date.now() - startTimeRef.current) / 1000
            playTick()
            spawnParticle(user, userColor)
            setRoundAnswers(prev => ({ ...prev, [user]: { idx: answerMap[msg], elapsed } }))
          }
        }
      }
    }
    ws.onclose = () => {}
    ws.onerror = () => {}
  }, [])

  const finishRound = useCallback((qs, idx, timerSecs) => {
    clearInterval(timerRef.current)
    const answers = roundAnswersRef.current
    const cidx = correctIdxRef.current
    const newScores = { ...scoresRef.current }
    const wrong = []

    for (const [user, { idx: ansIdx, elapsed }] of Object.entries(answers)) {
      const prev = newScores[user] || { pts: 0, correct: 0, total: 0 }
      const isCorrect = ansIdx === cidx
      if (isCorrect) {
        const gained = Math.max(100, Math.round(1000 * (1 - elapsed / timerSecs)))
        newScores[user] = { pts: prev.pts + gained, correct: prev.correct + 1, total: prev.total + 1 }
      } else {
        newScores[user] = { pts: prev.pts, correct: prev.correct, total: prev.total + 1 }
        wrong.push({ user, ansIdx })
      }
    }

    const q = qs[idx]
    setHistory(h => [...h, {
      question: decodeHTML(q.question),
      correctAnswer: choicesRef.current[cidx],
      colorIdx: cidx,
    }])

    setScores(newScores)
    scoresRef.current = newScores
    const wrongPick = wrong[Math.floor(Math.random() * wrong.length)]
    setWrongPerson(wrongPick ? pickRoast(wrongPick.user, LETTERS[wrongPick.ansIdx]) : '')
    setRoundDone(true)
    particlePoolRef.current = []
    setPhase(PHASES.BETWEEN)
  }, [])

  const [countdown, setCountdown] = useState(3)

  const loadQuestion = useCallback((qs, idx, timerSecs) => {
    const q = qs[idx]
    const incorrects = q.incorrect_answers.map(decodeHTML)
    const opts = shuffle([...incorrects, decodeHTML(q.correct_answer)])
    const cidx = opts.indexOf(decodeHTML(q.correct_answer))
    setChoices(opts)
    choicesRef.current = opts
    setCorrectIdx(cidx)
    correctIdxRef.current = cidx
    setRoundAnswers({})
    roundAnswersRef.current = {}
    setHostAnswer(null)
    setRoundDone(false)
    setTimeLeft(timerSecs)

    // countdown 3→2→1→GO then start
    setCountdown(3)
    setPhase(PHASES.COUNTDOWN)
    let n = 3
    const tick = setInterval(() => {
      n--
      if (n <= 0) {
        clearInterval(tick)
        startTimeRef.current = Date.now()
        setPhase(PHASES.QUESTION)
      } else {
        setCountdown(n)
      }
    }, 800)
  }, [])

  useEffect(() => {
    if (phase !== PHASES.QUESTION || roundDone) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { finishRound(questions, qIndex, settings.timer); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, qIndex, roundDone]) // eslint-disable-line

  useEffect(() => {
    if (phase !== PHASES.QUESTION || roundDone) return
    const handler = (e) => {
      const map = { '1': 0, '2': 1, '3': 2, '4': 3 }
      if (e.key in map && hostAnswer === null) {
        const idx = map[e.key]
        setHostAnswer(idx)
        playTick()
        spawnParticle(channel || 'you')
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        const hk = channel || '(you)'
        setRoundAnswers(prev => prev[hk] ? prev : { ...prev, [hk]: { idx, elapsed } })
      }
      // debug: d key spawns 100 random chat answers
      if (e.key === 'd' && window.location.href.includes('beasl')) {
        const names = [...DEBUG_NAMES].sort(() => Math.random() - 0.5)
        names.forEach((name, i) => {
          setTimeout(() => {
            if (roundAnswersRef.current[name]) return
            const elapsed = 0.5 + Math.random() * (settings.timer - 1)
            const idx = Math.floor(Math.random() * 4)
            playTick()
            spawnParticle(name)
            setRoundAnswers(prev => prev[name] ? prev : { ...prev, [name]: { idx, elapsed } })
          }, i * 30)
        })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, hostAnswer, roundDone, settings.timer])

  const handleJoin = (e) => {
    e.preventDefault()
    if (!channel.trim()) return
    connectTwitch(channel.trim().toLowerCase())
    setPhase(PHASES.SETUP)
  }

  const startGame = async () => {
    getAudioCtx()
    const cats = settings.categories
    let results = []
    try {
      if (!cats.length) {
        const params = new URLSearchParams({ amount: settings.amount, type: 'multiple' })
        if (settings.difficulty) params.set('difficulty', settings.difficulty)
        const res = await fetch(`https://opentdb.com/api.php?${params}`)
        const data = await res.json()
        results = data.results || []
      } else {
        const perCat = Math.ceil(settings.amount / cats.length)
        const fetches = cats.map(cid => {
          const params = new URLSearchParams({ amount: perCat, type: 'multiple', category: cid })
          if (settings.difficulty) params.set('difficulty', settings.difficulty)
          return fetch(`https://opentdb.com/api.php?${params}`).then(r => r.json()).then(d => d.results || [])
        })
        const arrays = await Promise.all(fetches)
        results = shuffle(arrays.flat()).slice(0, settings.amount)
      }
    } catch {
      return alert('Failed to fetch questions — check your connection.')
    }
    if (!results.length) return alert('No questions found — try different settings.')
    setQuestions(results)
    setScores({})
    scoresRef.current = {}
    setHistory([])
    setQIndex(0)
    loadQuestion(results, 0, settings.timer)
  }

  const nextQuestion = () => {
    const next = qIndex + 1
    if (next >= questions.length) { setPhase(PHASES.END) }
    else { setQIndex(next); loadQuestion(questions, next, settings.timer) }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1].pts - a[1].pts)
  const q = questions[qIndex]
  const timerPct = (timeLeft / settings.timer) * 100

  return (
    <div className="app">
      {showTutorial && <Tutorial onDone={() => setShowTutorial(false)} />}

      {(phase === PHASES.QUESTION || phase === PHASES.BETWEEN || phase === PHASES.COUNTDOWN) && (
        <button className="gear-btn" onClick={() => setShowTimer(true)} title="Timer settings">
          <GearIcon />
          <span>{settings.timer}s</span>
        </button>
      )}
      {showTimer && (
        <TimerModal timer={settings.timer}
          onChange={t => setSettings(s => ({ ...s, timer: t }))}
          onClose={() => setShowTimer(false)} />
      )}

      {/* JOIN */}
      {phase === PHASES.JOIN && (
        <div className="screen-join">
          <div className="join-header">
            <div className="logo-mark">TQ</div>
            <h1>Twitch Trivia</h1>
            <p>Live quiz for your chat</p>
          </div>
          <form className="join-form" onSubmit={handleJoin}>
            <div className="input-group">
              <span className="input-prefix">twitch.tv/</span>
              <input placeholder="channel" value={channel}
                onChange={e => setChannel(e.target.value)} autoFocus />
            </div>
            <button type="submit" className="btn-primary btn-lg">Connect to Chat →</button>
          </form>
          <div className="chat-instructions">
            <div className="chat-inst-title">How to play (for you)</div>
            <div className="chat-inst-row">
              Press <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd> to answer A / B / C / D
            </div>
            <div className="chat-inst-row muted-row">
              Your pick is hidden from chat until time runs out
            </div>
          </div>
          <div className="chat-instructions">
            <div className="chat-inst-title">How to play (for chat)</div>
            <div className="chat-inst-row">
              Type <kbd>A</kbd><kbd>B</kbd><kbd>C</kbd><kbd>D</kbd> in chat to vote
            </div>
            <div className="chat-inst-row muted-row">
              Faster answers score more points — no Googling 👀
            </div>
          </div>
        </div>
      )}

      {/* SETUP */}
      {phase === PHASES.SETUP && (
        <div className="screen-setup">
          <div className="setup-header">
            <div className="connected-badge">● LIVE</div>
            <h1>#{channel}</h1>
            <p className="muted">Chat is connected and ready</p>
          </div>
          <div className="config-grid">
            <div className="config-card">
              <label>Questions</label>
              <div className="stepper">
                <button onClick={() => setSettings(s => ({ ...s, amount: Math.max(1, s.amount - 1) }))}>−</button>
                <span>{settings.amount}</span>
                <button onClick={() => setSettings(s => ({ ...s, amount: Math.min(50, s.amount + 1) }))}>+</button>
              </div>
            </div>
            <div className="config-card">
              <label>Timer</label>
              <div className="stepper">
                <button onClick={() => setSettings(s => ({ ...s, timer: Math.max(5, s.timer - 5) }))}>−</button>
                <span>{settings.timer}s</span>
                <button onClick={() => setSettings(s => ({ ...s, timer: Math.min(60, s.timer + 5) }))}>+</button>
              </div>
            </div>
            <div className="config-card wide">
              <div className="cat-header">
                <label>
                  Categories
                  <span className="cat-count">{settings.categories.length} selected</span>
                </label>
                <div className="cat-actions">
                  <button className="cat-action-btn" onClick={() => setSettings(s => ({ ...s, categories: allCategories.map(c => c.id) }))}>All</button>
                </div>
              </div>
              <input
                className="cat-search"
                placeholder="Search categories…"
                value={catSearch}
                onChange={e => setCatSearch(e.target.value)}
              />
              <div className="cat-grid">
                {allCategories
                  .filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase()))
                  .map(c => {
                    const checked = settings.categories.includes(c.id)
                    return (
                      <label key={c.id} className={`cat-pill ${checked ? 'cat-pill-on' : ''}`}>
                        <input type="checkbox" checked={checked} onChange={() => {
                          setSettings(s => ({
                            ...s,
                            categories: checked
                              ? s.categories.filter(id => id !== c.id)
                              : [...s.categories, c.id]
                          }))
                        }} />
                        {c.name.replace(/^Entertainment: |^Science: /, '')}
                      </label>
                    )
                  })
                }
              </div>
            </div>
            <div className="config-card wide">
              <label>Difficulty</label>
              <div className="diff-pills">
                {['', 'easy', 'medium', 'hard'].map(d => (
                  <button key={d}
                    className={`pill ${settings.difficulty === d ? 'pill-active' : ''}`}
                    onClick={() => setSettings(s => ({ ...s, difficulty: d }))}>
                    {d || 'Any'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button className="btn-primary btn-lg btn-start" onClick={startGame} disabled={settings.categories.length === 0}>Start Game</button>
        </div>
      )}

      {/* COUNTDOWN */}
      {phase === PHASES.COUNTDOWN && (
        <div className="countdown-screen">
          <div className="countdown-num" key={countdown}>{countdown}</div>
        </div>
      )}

      {/* QUESTION */}
      <canvas ref={canvasRef} className="particles-canvas" aria-hidden="true" />

      {phase === PHASES.QUESTION && q && (
        <div className="screen-question" ref={el => {
          if (el) { const r = el.getBoundingClientRect(); questionRectRef.current = r }
          else questionRectRef.current = null
        }}>
          <div className="q-header">
            <span className="q-num">Q{qIndex + 1} <span className="muted">/ {questions.length}</span></span>
            <span className="q-diff">{q.difficulty}</span>
            <span className={`q-timer ${timeLeft <= 3 ? 'urgent' : timeLeft <= 5 ? 'warning' : ''}`}>
              {timeLeft}
            </span>
          </div>
          <div className="timer-bar-wrap">
            <div className="timer-bar" style={{
              width: `${timerPct}%`,
              background: timeLeft <= 3 ? 'var(--red)' : timeLeft <= 5 ? 'var(--orange)' : 'var(--accent)'
            }} />
          </div>
          <div className="question-text">{decodeHTML(q.question)}</div>
          <div className="choices">
            {choices.map((c, i) => (
              <div key={i} className={`choice ${COLORS[i]}`}>
                <span className="choice-key">{LETTERS[i]}</span>
                <span className="choice-text">{c}</span>
              </div>
            ))}
            <div className="choices-hover-hint">
              <div className="hover-hint-title">You're the host — answer on your keyboard</div>
              <div className="hover-hint-map">
                <span><kbd>1</kbd> → A</span>
                <span><kbd>2</kbd> → B</span>
                <span><kbd>3</kbd> → C</span>
                <span><kbd>4</kbd> → D</span>
              </div>
              <div className="hover-hint-sub">Chat can't see your pick until time's up</div>
            </div>
          </div>
          <div className="host-bar">
            {hostAnswer === null ? (
              <div className="host-hint">
                <div className="host-hint-map">
                  <span><kbd>1</kbd><em>A</em></span>
                  <span><kbd>2</kbd><em>B</em></span>
                  <span><kbd>3</kbd><em>C</em></span>
                  <span><kbd>4</kbd><em>D</em></span>
                </div>
                <span className="host-hint-label">Press a key to answer — hidden from chat until time's up</span>
              </div>
            ) : (
              <div className="host-locked">
                <span>🔒</span>
                <span>Answer locked in — revealed when time's up</span>
              </div>
            )}
          </div>
          <div className="answered-pill">{Object.keys(roundAnswers).length} answered</div>
        </div>
      )}

      {/* BETWEEN */}
      {phase === PHASES.BETWEEN && q && (
        <BetweenScreen
          qIndex={qIndex} questions={questions} correctIdx={correctIdx}
          choices={choices} sorted={sorted} roundAnswers={roundAnswers}
          hostKey={channel || '(you)'}
          onNext={nextQuestion}
        />
      )}

      {/* END */}
      {phase === PHASES.END && (
        <div className="screen-end">
          <h1>Game Over</h1>

          <div className="podium">
            {sorted[1] && (
              <div className="podium-spot second">
                <div className="podium-avatar">🥈</div>
                <div className="podium-name">{sorted[1][0]}</div>
                <div className="podium-block p2">2nd</div>
                <div className="podium-pts">{sorted[1][1].pts.toLocaleString()}</div>
              </div>
            )}
            {sorted[0] && (
              <div className="podium-spot first">
                <div className="podium-avatar">👑</div>
                <div className="podium-name">{sorted[0][0]}</div>
                <div className="podium-block p1">1st</div>
                <div className="podium-pts">{sorted[0][1].pts.toLocaleString()}</div>
              </div>
            )}
            {sorted[2] && (
              <div className="podium-spot third">
                <div className="podium-avatar">🥉</div>
                <div className="podium-name">{sorted[2][0]}</div>
                <div className="podium-block p3">3rd</div>
                <div className="podium-pts">{sorted[2][1].pts.toLocaleString()}</div>
              </div>
            )}
          </div>

          {/* Full player list */}
          <div className="end-section-label">All Players</div>
          <div className="end-player-list">
            {sorted.map(([user, { pts, correct, total }], i) => (
              <div key={user} className={`lb-row ${i < 3 ? 'lb-top' : ''}`}>
                <span className="lb-rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                <span className="lb-name">{user}</span>
                <span className="lb-correct">{correct}/{total}</span>
                <span className="lb-pts">{pts.toLocaleString()}</span>
              </div>
            ))}
            {sorted.length === 0 && <div className="muted small lb-empty">No players answered</div>}
          </div>

          {/* Question history */}
          <div className="end-section-label">Questions</div>
          <div className="end-question-list">
            {history.map((h, i) => (
              <div key={i} className="hq-row">
                <span className="hq-num muted">Q{i + 1}</span>
                <span className="hq-text">{h.question}</span>
                <span className={`hq-answer ${COLORS[h.colorIdx]}`}>
                  <span className="choice-key">{LETTERS[h.colorIdx]}</span>
                  <span>{h.correctAnswer}</span>
                </span>
              </div>
            ))}
          </div>

          <button className="btn-primary btn-lg" onClick={() => {
            setPhase(PHASES.SETUP); setScores({}); scoresRef.current = {}; setHistory([])
          }}>
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}
