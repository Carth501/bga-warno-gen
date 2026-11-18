import { useEffect, useRef } from 'react'
import { MultiVal, Val, useList } from '../context'
import type { DocumentImage } from '../images'
import { Objective, Section } from '../primitives'

function MissionImage({ image }: { image: DocumentImage }) {
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(image.file)
    if (imageRef.current) imageRef.current.src = objectUrl
    return () => URL.revokeObjectURL(objectUrl)
  }, [image.file])

  return (
    <figure className="mission-image" style={{ width: `${image.scale}%` }}>
      <img ref={imageRef} alt={image.name} />
      {image.name && <figcaption>{image.name}</figcaption>}
    </figure>
  )
}

export function Mission({ images }: { images: DocumentImage[] }) {
  const objectives = useList('objectives')
  return (
    <Section num="02" title="MISSION" tone="gold">
      <p>
        <MultiVal k="missionStatement" />
      </p>
      <ul className="obj-list">
        {objectives.map((o, i) => (
          <Objective key={o.id} tier={o.tier} n={i + 1}>
            <strong>{o.title?.toUpperCase() || '[TITLE]'}</strong>{' '}
            {o.body ? <span className="ml">{o.body}</span> : <span className="blank">[DETAILS]</span>}
          </Objective>
        ))}
      </ul>
      {images.map((image) => <MissionImage key={image.id} image={image} />)}
      <p style={{ marginTop: 12 }}>
        <strong>Primary Objective:</strong> <Val k="primaryObjective" />
      </p>
      <p>
        <MultiVal k="expectedThreats" />
      </p>
    </Section>
  )
}
