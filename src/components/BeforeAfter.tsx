import { GripVertical } from "lucide-react"
import { useState } from "react"

export function BeforeAfter() {
  const [position, setPosition] = useState(52)

  return (
    <div className="comparison">
      <div className="comparison__stage">
        <img
          src="/images/before.webp"
          alt="Bâtiment en cours de travaux de gros œuvre"
          loading="lazy"
          decoding="async"
        />
        <div className="comparison__after" style={{ width: `${position}%` }}>
          <img
            src="/images/after.webp"
            alt="Maison contemporaine achevée après travaux"
            loading="lazy"
            decoding="async"
          />
        </div>
        <span className="comparison__tag comparison__tag--before">Avant</span>
        <span className="comparison__tag comparison__tag--after">Après</span>
        <div className="comparison__line" style={{ left: `${position}%` }} aria-hidden="true">
          <span><GripVertical size={18} /></span>
        </div>
        <input
          className="comparison__range"
          type="range"
          min="10"
          max="90"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="Comparer la photo avant et après les travaux"
        />
      </div>
      <p className="comparison__hint">Faites glisser pour révéler la transformation</p>
    </div>
  )
}
