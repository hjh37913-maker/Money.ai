import { useEffect, useRef, useState } from 'react'
import { useStore } from '../hooks/useStore'
import { fmt } from '../lib/finance'
import { answerFinancialQuestion, simulatePurchase } from '../services/aiService'

const QUICK = ['Чи можу я витратити 500 грн?', 'На що я витрачаю найбільше?', 'Чому цього місяця я витратив більше?', 'Коли я накопичу 5000 грн?', 'Що буде, якщо я куплю телефон за 7000 грн?']
export default function Advisor() {
  const { s, set, toast } = useStore(), [q, setQ] = useState(''), [busy, setBusy] = useState(false), [amt, setAmt] = useState(25000), end = useRef<HTMLDivElement>(null)
  useEffect(() => end.current?.scrollIntoView({ behavior: 'smooth' }), [s.chat.length, busy])
  const send = async (text: string) => {
    if (!text.trim() || busy) return
    set(p => ({ ...p, chat: [...p.chat, { role: 'user', text }] })); setQ(''); setBusy(true)
    const r = await answerFinancialQuestion(text, s)
    set(p => ({ ...p, chat: [...p.chat, { role: 'assistant', text: r.text }] })); setBusy(false)
    if (r.error) toast(r.error)
  }
  const sim = simulatePurchase(amt, s)
  return <>
    <h1>AI Advisor</h1><p className="mu">{s.ai.provider === 'local' || !s.ai.apiKey ? 'Працює вбудований рушій (без ключа). Підключи свій AI у налаштуваннях.' : `Підключено: ${s.ai.model}`}</p>
    <div className="card"><div id="chat">{(s.chat.length ? s.chat : [{ role: 'assistant' as const, text: 'Привіт! Я бачу твій баланс і витрати. Чим допомогти?' }]).map((m, i) => <div key={i} className={'msg ' + (m.role === 'user' ? 'u' : 'b')} style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>)}{busy && <div className="msg b">Думаю…</div>}<div ref={end} /></div>
      <div className="f" style={{ margin: '8px 0' }}>{QUICK.map(x => <button key={x} className="btn g sm" onClick={() => send(x)}>{x}</button>)}</div>
      <form className="f" style={{ margin: 0 }} onSubmit={e => { e.preventDefault(); send(q) }}><input aria-label="Повідомлення" placeholder="Напиши питання…" value={q} onChange={e => setQ(e.target.value)} /><button className="btn" style={{ flex: 0 }} disabled={busy}>Надіслати</button></form></div>
    <h2 style={{ marginTop: 22 }}>What if? Симуляція покупки</h2>
    <div className="card"><div className="sm mu">Сума покупки: <b style={{ color: 'var(--tx)' }}>{fmt(amt)}</b></div><input type="range" min="100" max="60000" step="100" value={amt} onChange={e => setAmt(+e.target.value)} aria-label="Сума покупки" />
      <div className="grid" style={{ margin: '12px 0 0' }}><div className="card"><div className="sm mu">Зараз</div><b>{fmt(sim.b)}</b></div><div className="card"><div className="sm mu">Після покупки</div><b className={sim.after < 0 ? 'rd' : ''}>{fmt(sim.after)}</b></div><div className="card"><div className="sm mu">Запас</div><b>≈{Math.max(0, Math.round(sim.cover))} дн.</b></div></div>
      <p><b>{sim.verdict}.</b> {sim.shift ? `Накопичення відновляться приблизно за ${sim.shift} дн. ` : ''}{sim.alt}</p></div>
  </>
}
