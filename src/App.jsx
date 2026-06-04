import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

const PHASES = { JOIN: 'join', SETUP: 'setup', QUESTION: 'question', BETWEEN: 'between', END: 'end' }
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

function isPersonQuestion(q) {
  const text = decodeHTML(q.question)
  const allAnswers = [...q.incorrect_answers, q.correct_answer].map(decodeHTML)
  // explicit "who" questions
  if (/\bwho\b/i.test(text)) return true
  // answers that look like proper names: two+ words each starting with uppercase
  const namelike = allAnswers.filter(a => /^[A-Z][a-z]+ [A-Z][a-z]/.test(a.trim()))
  if (namelike.length >= 2) return true
  // question mentions a person-y noun
  if (/\b(president|prime minister|inventor|founder|author|writer|actor|actress|singer|athlete|scientist|king|queen|pope|ceo|director)\b/i.test(text)) return true
  return false
}

function pickRoast(name, answer) {
  return ROASTS[Math.floor(Math.random() * ROASTS.length)]
    .replace('{name}', name)
    .replace('{answer}', answer)
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

function BetweenScreen({ qIndex, questions, correctIdx, choices, sorted, roundAnswers, onNext }) {
  const lbRef = useRef(null)
  const hostRowRef = useRef(null)
  const [stickyMode, setStickyMode] = useState(null) // null | 'top' | 'bottom'

  const hostIdx = sorted.findIndex(([u]) => u === '(you)')

  useEffect(() => {
    const el = lbRef.current
    if (!el || hostIdx === -1) return
    const check = () => {
      const hostEl = hostRowRef.current
      if (!hostEl) return
      const lbRect = el.getBoundingClientRect()
      const rowRect = hostEl.getBoundingClientRect()
      if (rowRect.bottom < lbRect.top + 40) setStickyMode('top')
      else if (rowRect.top > lbRect.bottom - 40) setStickyMode('bottom')
      else setStickyMode(null)
    }
    check()
    el.addEventListener('scroll', check)
    return () => el.removeEventListener('scroll', check)
  }, [hostIdx])

  const hostData = hostIdx !== -1 ? sorted[hostIdx] : null
  const hostAnswered = hostData ? roundAnswers[hostData[0]] : null
  const hostIsCorrect = hostAnswered && hostAnswered.idx === correctIdx
  const hostIsWrong = hostAnswered && hostAnswered.idx !== correctIdx

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

      <div className="leaderboard" ref={lbRef}>
        <div className="lb-title">Leaderboard</div>
        {hostData && stickyMode === 'top' && (
          <div className="lb-sticky lb-sticky-top">
            <LbRow rank={hostIdx} user={hostData[0]} pts={hostData[1].pts}
              correct={hostData[1].correct} total={hostData[1].total}
              isCorrect={hostIsCorrect} isWrong={hostIsWrong} isHost
              pickedLetter={hostAnswered != null ? LETTERS[hostAnswered.idx] : null} />
          </div>
        )}
        {sorted.map(([user, { pts, correct, total }], i) => {
          const answered = roundAnswers[user]
          const isCorrect = answered && answered.idx === correctIdx
          const isWrong = answered && answered.idx !== correctIdx
          const isHost = user === '(you)'
          return (
            <div key={user} ref={isHost ? hostRowRef : null}>
              <LbRow rank={i} user={user} pts={pts} correct={correct} total={total}
                isCorrect={isCorrect} isWrong={isWrong} isHost={isHost}
                pickedLetter={answered != null ? LETTERS[answered.idx] : null} />
            </div>
          )
        })}
        {hostData && stickyMode === 'bottom' && (
          <div className="lb-sticky lb-sticky-bottom">
            <LbRow rank={hostIdx} user={hostData[0]} pts={hostData[1].pts}
              correct={hostData[1].correct} total={hostData[1].total}
              isCorrect={hostIsCorrect} isWrong={hostIsWrong} isHost
              pickedLetter={hostAnswered != null ? LETTERS[hostAnswered.idx] : null} />
          </div>
        )}
        {sorted.length === 0 && <div className="muted small lb-empty">No answers yet</div>}
      </div>

      <button className="btn-primary btn-lg" onClick={onNext}>
        {qIndex + 1 >= questions.length ? 'See Final Results →' : 'Next Question →'}
      </button>
    </div>
  )
}

export default function App() {
  const [phase, setPhase] = useState(PHASES.JOIN)
  const [channel, setChannel] = useState('')
  const [settings, setSettings] = useState({ timer: 15, amount: 10, category: '', difficulty: '' })
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
  const billTinUsed = useRef(false)

  useEffect(() => { roundAnswersRef.current = roundAnswers }, [roundAnswers])
  useEffect(() => { correctIdxRef.current = correctIdx }, [correctIdx])
  useEffect(() => { scoresRef.current = scores }, [scores])
  useEffect(() => { choicesRef.current = choices }, [choices])

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
          const msg = msgMatch[1].trim().toUpperCase()
          const answerMap = { A: 0, B: 1, C: 2, D: 3 }
          if (msg in answerMap && !roundAnswersRef.current[user]) {
            const elapsed = (Date.now() - startTimeRef.current) / 1000
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
    setPhase(PHASES.BETWEEN)
  }, [])

  const loadQuestion = useCallback((qs, idx, timerSecs) => {
    const q = qs[idx]
    let incorrects = q.incorrect_answers.map(decodeHTML)
    if (!billTinUsed.current && isPersonQuestion(q)) {
      // replace a random wrong answer with Bill Tin
      const replaceIdx = Math.floor(Math.random() * incorrects.length)
      incorrects[replaceIdx] = 'Bill Tin'
      billTinUsed.current = true
    }
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
    startTimeRef.current = Date.now()
    setPhase(PHASES.QUESTION)
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
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        setRoundAnswers(prev => prev['(you)'] ? prev : { ...prev, '(you)': { idx, elapsed } })
      }
      // debug: d key spawns 100 random chat answers
      if (e.key === 'd') {
        const names = [...DEBUG_NAMES].sort(() => Math.random() - 0.5)
        names.forEach((name, i) => {
          setTimeout(() => {
            if (roundAnswersRef.current[name]) return
            const elapsed = 0.5 + Math.random() * (settings.timer - 1)
            const idx = Math.floor(Math.random() * 4)
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
    const params = new URLSearchParams({ amount: settings.amount, type: 'multiple' })
    if (settings.category) params.set('category', settings.category)
    if (settings.difficulty) params.set('difficulty', settings.difficulty)
    const res = await fetch(`https://opentdb.com/api.php?${params}`)
    const data = await res.json()
    if (!data.results?.length) return alert('No questions found — try different settings.')
    setQuestions(data.results)
    setScores({})
    scoresRef.current = {}
    setHistory([])
    billTinUsed.current = false
    setQIndex(0)
    loadQuestion(data.results, 0, settings.timer)
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
      {(phase === PHASES.QUESTION || phase === PHASES.BETWEEN) && (
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
              <label>Category</label>
              <select value={settings.category} onChange={e => setSettings(s => ({ ...s, category: e.target.value }))}>
                <option value="">Any Category</option>
                <option value="9">General Knowledge</option>
                <option value="10">Books</option>
                <option value="11">Film</option>
                <option value="12">Music</option>
                <option value="15">Video Games</option>
                <option value="17">Science & Nature</option>
                <option value="18">Computers</option>
                <option value="21">Sports</option>
                <option value="23">History</option>
                <option value="27">Animals</option>
              </select>
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
          <button className="btn-primary btn-lg btn-start" onClick={startGame}>Start Game</button>
        </div>
      )}

      {/* QUESTION */}
      {phase === PHASES.QUESTION && q && (
        <div className="screen-question">
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
