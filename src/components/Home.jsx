import ContactSection from './ContactSection'

function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-text">
          <h2>慶應義塾體育會ゴルフ部</h2>
          <p>KEIO UNIVERSITY GOLF TEAM</p>
        </div>
      </section>

      <main className="container">
        <p>慶應義塾體育會ゴルフ部は、1922年に日本で最初の大学ゴルフ部として創部されました。私たちは、ゴルフの技術向上はもちろんのこと、ゴルフ場でのルールやマナーを重んじ、他大学の模範となることを目指しています。「学生ゴルフ界に旋風を巻き起こす」という先輩方の理念を受け継ぎ、チーム一丸となって関東大学対抗戦Aブロックへの復帰を目指し、日々練習に励んでいます。</p>
        <ContactSection />
      </main>
    </div>
  )
}

export default Home
