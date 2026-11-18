import './document.css'
import { DocContext } from './context'
import type { OpordData } from './schema'
import { Banner, Boot, Header } from './sections/Header'
import { Mission } from './sections/Mission'
import { Sustainment } from './sections/Sustainment'

export function Document({ data }: { data: OpordData }) {
  return (
    <DocContext.Provider value={data}>
      <div className="opord">
        <Banner />
        <div className="watermark">ORC</div>
        <div className="doc">
          <Boot />
          <Header />
          <Mission />
          <Sustainment />
        </div>
      </div>
    </DocContext.Provider>
  )
}
