import React, { useState } from 'react'

const REPO = 'takesta/takesta.github.io'
const MEMBERS_PATH = 'public/data/members.json'
const SCHEDULE_PATH = 'public/data/schedule.json'

function githubApi(token, path, method = 'GET', body = null) {
  return fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method,
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => {
    if (!r.ok) throw new Error(`GitHub API error: ${r.status}`)
    return r.json()
  })
}

function b64Decode(str) {
  const bytes = Uint8Array.from(atob(str.replace(/\n/g, '')), c => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function b64Encode(str) {
  const bytes = new TextEncoder().encode(str)
  return btoa(Array.from(bytes, b => String.fromCharCode(b)).join(''))
}

const CAPTAIN_LABELS = [
  ['男子主将', 'menCaptain'],
  ['男子主務', 'menManager'],
  ['女子主将', 'womenCaptain'],
  ['女子主務', 'womenManager'],
]

const inputStyle = { width: '100%', padding: '0.3rem 0.5rem', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '0.95rem' }
const btnPrimary = { padding: '0.5rem 1.5rem', background: '#004080', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 3, fontFamily: 'inherit', fontSize: '0.95rem' }
const btnSecondary = { padding: '0.4rem 0.9rem', background: '#eee', color: '#333', border: '1px solid #ccc', cursor: 'pointer', borderRadius: 3, fontFamily: 'inherit', fontSize: '0.9rem' }
const btnDanger = { background: 'none', border: 'none', cursor: 'pointer', color: '#c00', fontSize: '1.1rem', lineHeight: 1, padding: '0 0.25rem' }

function Admin() {
  const [token, setToken] = useState(sessionStorage.getItem('gh_token') || '')
  const [connected, setConnected] = useState(false)
  const [tab, setTab] = useState('members')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [membersData, setMembersData] = useState(null)
  const [membersSha, setMembersSha] = useState('')
  const [scheduleData, setScheduleData] = useState(null)
  const [scheduleSha, setScheduleSha] = useState('')

  const connect = async () => {
    setError('')
    setStatus('接続中...')
    try {
      const [mRes, sRes] = await Promise.all([
        githubApi(token, MEMBERS_PATH),
        githubApi(token, SCHEDULE_PATH),
      ])
      setMembersData(JSON.parse(b64Decode(mRes.content)))
      setMembersSha(mRes.sha)
      setScheduleData(JSON.parse(b64Decode(sRes.content)))
      setScheduleSha(sRes.sha)
      sessionStorage.setItem('gh_token', token)
      setConnected(true)
      setStatus('')
    } catch {
      setStatus('')
      setError('接続に失敗しました。トークンとアクセス権限を確認してください。')
    }
  }

  const saveMembers = async () => {
    setSaving(true)
    setStatus('')
    setError('')
    try {
      const content = b64Encode(JSON.stringify(membersData, null, 2) + '\n')
      const res = await githubApi(token, MEMBERS_PATH, 'PUT', {
        message: 'Update members.json via admin editor',
        content,
        sha: membersSha,
      })
      setMembersSha(res.content.sha)
      setStatus('保存しました。反映まで数分かかります。')
    } catch (e) {
      setError('保存に失敗しました: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const saveSchedule = async () => {
    setSaving(true)
    setStatus('')
    setError('')
    try {
      const content = b64Encode(JSON.stringify(scheduleData, null, 2) + '\n')
      const res = await githubApi(token, SCHEDULE_PATH, 'PUT', {
        message: 'Update schedule.json via admin editor',
        content,
        sha: scheduleSha,
      })
      setScheduleSha(res.content.sha)
      setStatus('保存しました。反映まで数分かかります。')
    } catch (e) {
      setError('保存に失敗しました: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  // Members helpers
  const updateCaptain = (key, val) =>
    setMembersData(d => ({ ...d, captains: { ...d.captains, [key]: val } }))

  const updateMember = (i, field, val) =>
    setMembersData(d => {
      const members = [...d.members]
      members[i] = { ...members[i], [field]: val }
      return { ...d, members }
    })

  const addMember = () =>
    setMembersData(d => ({
      ...d,
      members: [...d.members, { name: '', year: '1年', gender: 'male' }],
    }))

  const removeMember = i =>
    setMembersData(d => ({ ...d, members: d.members.filter((_, idx) => idx !== i) }))

  // Schedule helpers
  const updateEvent = (mi, ei, val) =>
    setScheduleData(d =>
      d.map((m, mIdx) => {
        if (mIdx !== mi) return m
        const events = [...m.events]
        events[ei] = val
        return { ...m, events }
      })
    )

  const addEvent = mi =>
    setScheduleData(d =>
      d.map((m, mIdx) => mIdx === mi ? { ...m, events: [...m.events, ''] } : m)
    )

  const removeEvent = (mi, ei) =>
    setScheduleData(d =>
      d.map((m, mIdx) =>
        mIdx === mi ? { ...m, events: m.events.filter((_, i) => i !== ei) } : m
      )
    )

  if (!connected) {
    return (
      <div style={{ maxWidth: 480, margin: '5rem auto', padding: '0 1rem' }}>
        <h2>管理者ページ</h2>
        <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.6 }}>
          GitHub Personal Access Token を入力してください。<br />
          必要な権限: <strong>Contents: Read and Write</strong><br />
          トークンはこのタブのセッション中にのみ保存されます。
        </p>
        <input
          type="password"
          value={token}
          onChange={e => setToken(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && connect()}
          placeholder="ghp_xxxxxxxxxxxx"
          style={{ ...inputStyle, marginBottom: '0.75rem' }}
        />
        {error && <p style={{ color: '#c00', margin: '0.5rem 0' }}>{error}</p>}
        {status && <p style={{ color: '#555', margin: '0.5rem 0' }}>{status}</p>}
        <button onClick={connect} style={btnPrimary}>接続</button>
      </div>
    )
  }

  const tabBtn = active => ({
    ...btnSecondary,
    background: active ? '#004080' : '#eee',
    color: active ? '#fff' : '#333',
    borderBottom: active ? '2px solid #004080' : '2px solid transparent',
    marginBottom: -1,
  })

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>管理者ページ</h2>

      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
        <button style={tabBtn(tab === 'members')} onClick={() => setTab('members')}>部員管理</button>
        <button style={tabBtn(tab === 'schedule')} onClick={() => setTab('schedule')}>日程管理</button>
      </div>

      {status && <p style={{ color: 'green', marginBottom: '1rem' }}>{status}</p>}
      {error && <p style={{ color: '#c00', marginBottom: '1rem' }}>{error}</p>}

      {tab === 'members' && membersData && (
        <div>
          <h3>役職</h3>
          <table style={{ borderCollapse: 'collapse', marginBottom: '2rem', width: '100%', maxWidth: 520 }}>
            <tbody>
              {CAPTAIN_LABELS.map(([label, key]) => (
                <tr key={key}>
                  <td style={{ padding: '0.35rem 0.75rem 0.35rem 0', width: 100, whiteSpace: 'nowrap' }}>{label}</td>
                  <td style={{ padding: '0.35rem 0' }}>
                    <input
                      value={membersData.captains[key]}
                      onChange={e => updateCaptain(key, e.target.value)}
                      style={inputStyle}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>部員一覧</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>氏名</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', width: 90 }}>学年</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', width: 80 }}>性別</th>
                <th style={{ padding: '0.5rem', width: 36 }}></th>
              </tr>
            </thead>
            <tbody>
              {membersData.members.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.3rem 0.5rem 0.3rem 0' }}>
                    <input value={m.name} onChange={e => updateMember(i, 'name', e.target.value)} style={inputStyle} />
                  </td>
                  <td style={{ padding: '0.3rem 0.5rem' }}>
                    <select value={m.year} onChange={e => updateMember(i, 'year', e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
                      <option>1年</option>
                      <option>2年</option>
                      <option>3年</option>
                      <option>4年</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.3rem 0.5rem' }}>
                    <select value={m.gender} onChange={e => updateMember(i, 'gender', e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
                      <option value="male">男子</option>
                      <option value="female">女子</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.3rem', textAlign: 'center' }}>
                    <button onClick={() => removeMember(i)} style={btnDanger} title="削除">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
            <button onClick={addMember} style={btnSecondary}>＋ 部員を追加</button>
            <button onClick={saveMembers} style={btnPrimary} disabled={saving}>
              {saving ? '保存中...' : '保存してコミット'}
            </button>
          </div>
        </div>
      )}

      {tab === 'schedule' && scheduleData && (
        <div>
          <h3>年間予定</h3>
          {scheduleData.map((m, mi) => (
            <div key={mi} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 52, paddingTop: '0.4rem', fontWeight: 'bold', flexShrink: 0 }}>{m.month}</div>
              <div style={{ flex: 1 }}>
                {m.events.map((ev, ei) => (
                  <div key={ei} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem', alignItems: 'center' }}>
                    <input
                      value={ev}
                      onChange={e => updateEvent(mi, ei, e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button onClick={() => removeEvent(mi, ei)} style={btnDanger} title="削除">✕</button>
                  </div>
                ))}
                <button
                  onClick={() => addEvent(mi)}
                  style={{ ...btnSecondary, padding: '0.2rem 0.6rem', fontSize: '0.85rem', marginTop: '0.1rem' }}
                >
                  ＋ 追加
                </button>
              </div>
            </div>
          ))}
          <button onClick={saveSchedule} style={{ ...btnPrimary, marginTop: '1.5rem' }} disabled={saving}>
            {saving ? '保存中...' : '保存してコミット'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Admin
