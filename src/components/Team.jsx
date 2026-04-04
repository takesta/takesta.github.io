import React from 'react'

// 部員情報を直接編集できます
const captains = {
  menCaptain: '伊藤優希',
  menManager: '相山武仁',
  womenCaptain: '林真衣',
  womenManager: '塩田瞳子',
}

const members = {
  '3年': {
    men: ['相山 武仁', '伊藤 優希', '飼沼 慎一朗', '境 亮輔', '芹沢 眞仁', '千倉 大地', '二飯田 貴大', '平沼 光太郎', '増田 壮一郎', '三上 慶', '横井 太郎'],
    women: ['岩村 莉沙', '塩田 瞳子', '富田 己子', '中井 美奈子', '濱谷 美欧', '林 真衣', '藤川 真悠', '三原 瑞貴'],
  },
  '2年': {
    men: ['阿部 英彦', '上本 航輝', '生松 将吾', '片岡 謙', '鈴木 拓磨', '田中 康晴', '中野 天真', '野仲 勇羽', '山下 諒', '横井 脩人'],
    women: ['石井 里佳', '木下 真衣', '田島 七美', '土志田 理佐', '柳原 結夏', '山本 緋奈', '弓長 里紗恵', '陸 世妃'],
  },
  '1年': {
    men: ['奥山 大地', '小泉 健人', '小林 永征', '崔 新知', '西丸 雄之助', '菅原 勇次郎', '立石 大貴', '田中 風雅', '沼尻 寧央', '長谷川 拓', '宮崎 颯', '吉田 圭吾'],
    women: ['石原 理緒', '重田 真結子', '佐々木 菜帆', '舘山 杏奈', '中田 織乃', '林 杏奈', '古澤 日菜子', '三橋 亜海', '森川 椰子'],
  },
}

function Team() {
  return (
    <section id="team" className="container">
      <h2>部員紹介</h2>

      {['3年', '2年', '1年'].map(year => (
        <div key={year} className="year-section">
          <h3>{year}</h3>

          <h4>男子</h4>
          {year === '3年' && (
            <>
              <h4><span className="captain-manager">主将 {captains.menCaptain}</span></h4>
              <h4><span className="captain-manager">主務 {captains.menManager}</span></h4>
            </>
          )}
          <div className="members-grid">
            {members[year].men.map((name, i) => (
              <div key={i} className="team-member-card">
                <p>{name}</p>
              </div>
            ))}
          </div>

          <h4>女子</h4>
          {year === '3年' && (
            <>
              <h4><span className="captain-manager">主将 {captains.womenCaptain}</span></h4>
              <h4><span className="captain-manager">主務 {captains.womenManager}</span></h4>
            </>
          )}
          <div className="members-grid">
            {members[year].women.map((name, i) => (
              <div key={i} className="team-member-card">
                <p>{name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export default Team
