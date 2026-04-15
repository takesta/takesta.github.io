import React, { useState } from 'react'

const REPO = 'takesta/takesta.github.io'
const MEMBERS_PATH = 'public/data/members.json'
const SCHEDULE_PATH = 'public/data/schedule.json'
const PROSPECTIVE_PATH = 'public/data/prospective.json'
const CONTENT_PATH = 'public/data/content.json'

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
const textareaStyle = { ...inputStyle, resize: 'vertical', minHeight: 80 }
const btnPrimary = { padding: '0.5rem 1.5rem', background: '#004080', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 3, fontFamily: 'inherit', fontSize: '0.95rem' }
const btnSecondary = { padding: '0.4rem 0.9rem', background: '#eee', color: '#333', border: '1px solid #ccc', cursor: 'pointer', borderRadius: 3, fontFamily: 'inherit', fontSize: '0.9rem' }
const btnDanger = { background: 'none', border: 'none', cursor: 'pointer', color: '#c00', fontSize: '1.1rem', lineHeight: 1, padding: '0 0.25rem' }
const sectionStyle = { marginBottom: '2rem' }
const labelStyle = { display: 'block', fontSize: '0.85rem', color: '#555', marginBottom: '0.2rem' }
const fieldRowStyle = { marginBottom: '0.75rem' }

function SectionHeading({ children }) {
  return <h3 style={{ borderBottom: '2px solid #004080', paddingBottom: '0.3rem', marginBottom: '1rem', color: '#004080' }}>{children}</h3>
}

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
  const [prospectiveData, setProspectiveData] = useState(null)
  const [prospectiveSha, setProspectiveSha] = useState('')
  const [contentData, setContentData] = useState(null)
  const [contentSha, setContentSha] = useState('')

  const connect = async () => {
    setError('')
    setStatus('接続中...')
    try {
      const [mRes, sRes, pRes, cRes] = await Promise.all([
        githubApi(token, MEMBERS_PATH),
        githubApi(token, SCHEDULE_PATH),
        githubApi(token, PROSPECTIVE_PATH),
        githubApi(token, CONTENT_PATH),
      ])
      setMembersData(JSON.parse(b64Decode(mRes.content)))
      setMembersSha(mRes.sha)
      setScheduleData(JSON.parse(b64Decode(sRes.content)))
      setScheduleSha(sRes.sha)
      setProspectiveData(JSON.parse(b64Decode(pRes.content)))
      setProspectiveSha(pRes.sha)
      setContentData(JSON.parse(b64Decode(cRes.content)))
      setContentSha(cRes.sha)
      sessionStorage.setItem('gh_token', token)
      setConnected(true)
      setStatus('')
    } catch {
      setStatus('')
      setError('接続に失敗しました。トークンとアクセス権限を確認してください。')
    }
  }

  const saveFile = async (path, data, sha, setSha, commitMsg) => {
    setSaving(true)
    setStatus('')
    setError('')
    try {
      const content = b64Encode(JSON.stringify(data, null, 2) + '\n')
      const res = await githubApi(token, path, 'PUT', { message: commitMsg, content, sha })
      setSha(res.content.sha)
      setStatus('保存しました。反映まで数分かかります。')
    } catch (e) {
      setError('保存に失敗しました: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const saveMembers = () => saveFile(MEMBERS_PATH, membersData, membersSha, setMembersSha, 'Update members.json via admin editor')
  const saveSchedule = () => saveFile(SCHEDULE_PATH, scheduleData, scheduleSha, setScheduleSha, 'Update schedule.json via admin editor')
  const saveProspective = () => saveFile(PROSPECTIVE_PATH, prospectiveData, prospectiveSha, setProspectiveSha, 'Update prospective.json via admin editor')
  const saveContent = () => saveFile(CONTENT_PATH, contentData, contentSha, setContentSha, 'Update content.json via admin editor')

  // ── Members helpers ──────────────────────────────────────────────
  const updateCaptain = (key, val) =>
    setMembersData(d => ({ ...d, captains: { ...d.captains, [key]: val } }))

  const updateMember = (i, field, val) =>
    setMembersData(d => {
      const members = [...d.members]
      members[i] = { ...members[i], [field]: val }
      return { ...d, members }
    })

  const addMember = () =>
    setMembersData(d => ({ ...d, members: [...d.members, { name: '', year: '1年', gender: 'male' }] }))

  const removeMember = i =>
    setMembersData(d => ({ ...d, members: d.members.filter((_, idx) => idx !== i) }))

  // ── Schedule helpers ─────────────────────────────────────────────
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

  // ── Prospective helpers ──────────────────────────────────────────
  const updateProspective = (updater) => setProspectiveData(d => updater(d))

  const setProspField = (key, val) =>
    setProspectiveData(d => ({ ...d, [key]: val }))

  const setOrientationField = (key, val) =>
    setProspectiveData(d => ({ ...d, orientationSession: { ...d.orientationSession, [key]: val } }))

  const setLineField = (key, val) =>
    setProspectiveData(d => ({ ...d, line: { ...d.line, [key]: val } }))

  const updateRequiredField = (i, val) =>
    setProspectiveData(d => {
      const arr = [...d.requiredFields]
      arr[i] = val
      return { ...d, requiredFields: arr }
    })

  const addRequiredField = () =>
    setProspectiveData(d => ({ ...d, requiredFields: [...d.requiredFields, ''] }))

  const removeRequiredField = i =>
    setProspectiveData(d => ({ ...d, requiredFields: d.requiredFields.filter((_, idx) => idx !== i) }))

  const updateTimelineItem = (i, field, val) =>
    setProspectiveData(d => {
      const timeline = [...d.timeline]
      timeline[i] = { ...timeline[i], [field]: val }
      return { ...d, timeline }
    })

  const addTimelineItem = () =>
    setProspectiveData(d => ({ ...d, timeline: [...d.timeline, { label: '', date: '' }] }))

  const removeTimelineItem = i =>
    setProspectiveData(d => ({ ...d, timeline: d.timeline.filter((_, idx) => idx !== i) }))

  // ── Content helpers ──────────────────────────────────────────────
  const setHomeField = (key, val) =>
    setContentData(d => ({ ...d, home: { ...d.home, [key]: val } }))

  const setAboutField = (key, val) =>
    setContentData(d => ({ ...d, about: { ...d.about, [key]: val } }))

  const setContactField = (key, val) =>
    setContentData(d => ({ ...d, contact: { ...d.contact, [key]: val } }))

  const updateSocialLink = (i, field, val) =>
    setContentData(d => {
      const socialLinks = [...d.contact.socialLinks]
      socialLinks[i] = { ...socialLinks[i], [field]: val }
      return { ...d, contact: { ...d.contact, socialLinks } }
    })

  const addSocialLink = () =>
    setContentData(d => ({
      ...d,
      contact: { ...d.contact, socialLinks: [...d.contact.socialLinks, { label: '', handle: '', url: '' }] },
    }))

  const removeSocialLink = i =>
    setContentData(d => ({
      ...d,
      contact: { ...d.contact, socialLinks: d.contact.socialLinks.filter((_, idx) => idx !== i) },
    }))

  const setFooterField = (key, val) =>
    setContentData(d => ({ ...d, footer: { ...d.footer, [key]: val } }))

  // ── Login screen ─────────────────────────────────────────────────
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

      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #ccc', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button style={tabBtn(tab === 'members')} onClick={() => setTab('members')}>部員管理</button>
        <button style={tabBtn(tab === 'schedule')} onClick={() => setTab('schedule')}>日程管理</button>
        <button style={tabBtn(tab === 'prospective')} onClick={() => setTab('prospective')}>新歓管理</button>
        <button style={tabBtn(tab === 'content')} onClick={() => setTab('content')}>コンテンツ管理</button>
      </div>

      {status && <p style={{ color: 'green', marginBottom: '1rem' }}>{status}</p>}
      {error && <p style={{ color: '#c00', marginBottom: '1rem' }}>{error}</p>}

      {/* ── MEMBERS ── */}
      {tab === 'members' && membersData && (
        <div>
          <SectionHeading>役職</SectionHeading>
          <table style={{ borderCollapse: 'collapse', marginBottom: '2rem', width: '100%', maxWidth: 520 }}>
            <tbody>
              {CAPTAIN_LABELS.map(([label, key]) => (
                <tr key={key}>
                  <td style={{ padding: '0.35rem 0.75rem 0.35rem 0', width: 100, whiteSpace: 'nowrap' }}>{label}</td>
                  <td style={{ padding: '0.35rem 0' }}>
                    <input value={membersData.captains[key]} onChange={e => updateCaptain(key, e.target.value)} style={inputStyle} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <SectionHeading>部員一覧</SectionHeading>
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
                      <option>1年</option><option>2年</option><option>3年</option><option>4年</option>
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
            <button onClick={saveMembers} style={btnPrimary} disabled={saving}>{saving ? '保存中...' : '保存してコミット'}</button>
          </div>
        </div>
      )}

      {/* ── SCHEDULE ── */}
      {tab === 'schedule' && scheduleData && (
        <div>
          <SectionHeading>年間予定</SectionHeading>
          {scheduleData.map((m, mi) => (
            <div key={mi} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 52, paddingTop: '0.4rem', fontWeight: 'bold', flexShrink: 0 }}>{m.month}</div>
              <div style={{ flex: 1 }}>
                {m.events.map((ev, ei) => (
                  <div key={ei} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem', alignItems: 'center' }}>
                    <input value={ev} onChange={e => updateEvent(mi, ei, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                    <button onClick={() => removeEvent(mi, ei)} style={btnDanger} title="削除">✕</button>
                  </div>
                ))}
                <button onClick={() => addEvent(mi)} style={{ ...btnSecondary, padding: '0.2rem 0.6rem', fontSize: '0.85rem', marginTop: '0.1rem' }}>
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

      {/* ── PROSPECTIVE ── */}
      {tab === 'prospective' && prospectiveData && (
        <div>
          <SectionHeading>基本情報</SectionHeading>
          <div style={sectionStyle}>
            <div style={fieldRowStyle}>
              <label style={labelStyle}>年度</label>
              <input
                type="number"
                value={prospectiveData.year}
                onChange={e => setProspField('year', Number(e.target.value))}
                style={{ ...inputStyle, maxWidth: 120 }}
              />
            </div>
          </div>

          <SectionHeading>入部説明会</SectionHeading>
          <div style={sectionStyle}>
            {[['日時', 'date'], ['開始時刻', 'startTime'], ['終了時刻', 'endTime'], ['形式', 'format']].map(([lbl, key]) => (
              <div key={key} style={fieldRowStyle}>
                <label style={labelStyle}>{lbl}</label>
                <input value={prospectiveData.orientationSession[key]} onChange={e => setOrientationField(key, e.target.value)} style={inputStyle} />
              </div>
            ))}
          </div>

          <SectionHeading>LINE情報</SectionHeading>
          <div style={sectionStyle}>
            {[['アカウント名', 'accountName'], ['LINE ID', 'id'], ['申込期限', 'deadline']].map(([lbl, key]) => (
              <div key={key} style={fieldRowStyle}>
                <label style={labelStyle}>{lbl}</label>
                <input value={prospectiveData.line[key]} onChange={e => setLineField(key, e.target.value)} style={inputStyle} />
              </div>
            ))}
          </div>

          <SectionHeading>必須記入項目</SectionHeading>
          <div style={sectionStyle}>
            {prospectiveData.requiredFields.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem', alignItems: 'center' }}>
                <input value={f} onChange={e => updateRequiredField(i, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => removeRequiredField(i)} style={btnDanger} title="削除">✕</button>
              </div>
            ))}
            <button onClick={addRequiredField} style={{ ...btnSecondary, marginTop: '0.25rem' }}>＋ 項目を追加</button>
          </div>

          <SectionHeading>スケジュール</SectionHeading>
          <div style={sectionStyle}>
            {prospectiveData.timeline.map((item, i) => (
              <div key={i} style={{ border: '1px solid #ddd', borderRadius: 4, padding: '0.75rem', marginBottom: '0.75rem', background: '#fafafa', position: 'relative' }}>
                <button onClick={() => removeTimelineItem(i)} style={{ ...btnDanger, position: 'absolute', top: '0.5rem', right: '0.5rem' }} title="削除">✕</button>
                {[['ラベル', 'label'], ['日付', 'date'], ['時間 (任意)', 'time'], ['備考 (任意)', 'note']].map(([lbl, key]) => (
                  <div key={key} style={{ ...fieldRowStyle, paddingRight: '1.5rem' }}>
                    <label style={labelStyle}>{lbl}</label>
                    <input
                      value={item[key] || ''}
                      onChange={e => updateTimelineItem(i, key, e.target.value)}
                      style={inputStyle}
                      placeholder={lbl.includes('任意') ? '（省略可）' : ''}
                    />
                  </div>
                ))}
              </div>
            ))}
            <button onClick={addTimelineItem} style={btnSecondary}>＋ 日程を追加</button>
          </div>

          <button onClick={saveProspective} style={btnPrimary} disabled={saving}>
            {saving ? '保存中...' : '保存してコミット'}
          </button>
        </div>
      )}

      {/* ── CONTENT ── */}
      {tab === 'content' && contentData && (
        <div>
          <SectionHeading>ホームページ</SectionHeading>
          <div style={sectionStyle}>
            {[['メインタイトル', 'heroTitle'], ['サブタイトル', 'heroSubtitle']].map(([lbl, key]) => (
              <div key={key} style={fieldRowStyle}>
                <label style={labelStyle}>{lbl}</label>
                <input value={contentData.home[key]} onChange={e => setHomeField(key, e.target.value)} style={inputStyle} />
              </div>
            ))}
            <div style={fieldRowStyle}>
              <label style={labelStyle}>説明文</label>
              <textarea value={contentData.home.description} onChange={e => setHomeField('description', e.target.value)} style={textareaStyle} />
            </div>
          </div>

          <SectionHeading>活動理念 (Aboutページ)</SectionHeading>
          <div style={sectionStyle}>
            <div style={fieldRowStyle}>
              <label style={labelStyle}>理念テキスト</label>
              <textarea value={contentData.about.philosophy} onChange={e => setAboutField('philosophy', e.target.value)} style={{ ...textareaStyle, minHeight: 120 }} />
            </div>
          </div>

          <SectionHeading>お問い合わせ</SectionHeading>
          <div style={sectionStyle}>
            <div style={fieldRowStyle}>
              <label style={labelStyle}>説明文</label>
              <textarea value={contentData.contact.description} onChange={e => setContactField('description', e.target.value)} style={textareaStyle} />
            </div>
            <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>SNSリンク</label>
            {contentData.contact.socialLinks.map((link, i) => (
              <div key={i} style={{ border: '1px solid #ddd', borderRadius: 4, padding: '0.75rem', marginBottom: '0.75rem', background: '#fafafa', position: 'relative' }}>
                <button onClick={() => removeSocialLink(i)} style={{ ...btnDanger, position: 'absolute', top: '0.5rem', right: '0.5rem' }} title="削除">✕</button>
                {[['ラベル', 'label'], ['ハンドル名', 'handle'], ['URL', 'url']].map(([lbl, key]) => (
                  <div key={key} style={{ ...fieldRowStyle, paddingRight: '1.5rem' }}>
                    <label style={labelStyle}>{lbl}</label>
                    <input value={link[key]} onChange={e => updateSocialLink(i, key, e.target.value)} style={inputStyle} />
                  </div>
                ))}
              </div>
            ))}
            <button onClick={addSocialLink} style={btnSecondary}>＋ SNSを追加</button>
          </div>

          <SectionHeading>フッター</SectionHeading>
          <div style={sectionStyle}>
            <div style={fieldRowStyle}>
              <label style={labelStyle}>コピーライト</label>
              <input value={contentData.footer.copyright} onChange={e => setFooterField('copyright', e.target.value)} style={inputStyle} />
            </div>
          </div>

          <button onClick={saveContent} style={btnPrimary} disabled={saving}>
            {saving ? '保存中...' : '保存してコミット'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Admin
