import './document.css'
import { DocContext } from './context'
import type { OpordData } from './schema'
import type { DocumentImage } from './images'
import { Banner, Boot, Header } from './sections/Header'
import { GeneralOrders } from './sections/GeneralOrders'
import { Mission } from './sections/Mission'
import { Situation } from './sections/Situation'
import { Sustainment } from './sections/Sustainment'

export function Document({ data, images }: { data: OpordData; images: DocumentImage[] }) {
  return (
    <DocContext.Provider value={data}>
      <div className="opord">
        <Banner />
        <div className="watermark">ORC</div>
        <div className="doc">
          <Boot />
          <Header />
          <Situation />
          <Mission images={images} />
          <GeneralOrders />
          <Sustainment />
        </div>
      </div>
    </DocContext.Provider>
  )
}
