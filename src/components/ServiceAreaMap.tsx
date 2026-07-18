import "leaflet/dist/leaflet.css"

import { ArrowUpRight, MapPin } from "lucide-react"
import { useInView } from "motion/react"
import { useRef } from "react"
import { Circle, CircleMarker, MapContainer, Popup, ScaleControl, TileLayer, ZoomControl } from "react-leaflet"

const CENTER: [number, number] = [43.6998359, 4.627985]
const RADIUS_METERS = 70_000

export function ServiceAreaMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const shouldLoadMap = useInView(mapRef, { once: true, margin: "220px" })

  return (
    <section id="zone" className="service-area section section--black">
      <div className="shell service-area__grid">
        <div className="service-area__copy">
          <span className="eyebrow">Zone d’intervention</span>
          <h2>Arles.<br /><em>Et 70 km autour.</em></h2>
          <p>Une couverture indicative à vol d’oiseau, confirmée selon la nature, l’accès et la durée de votre chantier.</p>
          <div className="service-area__metric" aria-label="Rayon d’intervention de 70 kilomètres">
            <strong>70</strong><span>KM<br />DE RAYON</span>
          </div>
          <a href="https://www.google.com/maps/search/?api=1&query=8+Chemin+des+S%C3%A9gonaux+13200+Arles" target="_blank" rel="noreferrer noopener">
            <MapPin /> Voir le point de départ <ArrowUpRight />
          </a>
        </div>

        <div className="service-area__map-frame" ref={mapRef}>
          {shouldLoadMap ? (
            <MapContainer
              className="service-area__map"
              center={CENTER}
              zoom={8}
              minZoom={6}
              maxZoom={17}
              scrollWheelZoom={false}
              zoomControl={false}
              aria-label="Carte interactive du rayon d’intervention de Soles Travaux autour d’Arles"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Circle
                center={CENTER}
                radius={RADIUS_METERS}
                pathOptions={{ color: "#c5a059", fillColor: "#c5a059", fillOpacity: 0.16, weight: 2, dashArray: "8 8" }}
              />
              <CircleMarker
                center={CENTER}
                radius={8}
                pathOptions={{ color: "#f0d28f", fillColor: "#0a0a09", fillOpacity: 1, weight: 3 }}
              >
                <Popup><strong>Soles Travaux</strong><br />Arles · point de départ</Popup>
              </CircleMarker>
              <ZoomControl position="bottomright" />
              <ScaleControl position="bottomleft" imperial={false} />
            </MapContainer>
          ) : (
            <div className="service-area__map-placeholder" aria-hidden="true"><span>70 KM</span></div>
          )}
          <div className="service-area__map-label"><span /> Zone indicative</div>
        </div>
      </div>
    </section>
  )
}
