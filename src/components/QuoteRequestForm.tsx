import { CheckCircle2, FileText, Mail, Phone, Send } from "lucide-react"
import { type FormEvent, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

const COMPANY_PHONE = "0646040659"

const serviceOptions = {
  masonry: "Maçonnerie & gros œuvre",
  roofing: "Couverture & zinguerie",
  framing: "Charpente",
  drywall: "Plaquisterie",
  tiling: "Carrelage",
  facade: "Façade",
} as const

type ContactMode = "email" | "phone" | "both"
type SubmitStatus = "idle" | "submitting" | "success" | "error"

export function QuoteRequestForm() {
  const [contactMode, setContactMode] = useState<ContactMode>("email")
  const [status, setStatus] = useState<SubmitStatus>("idle")
  const [feedback, setFeedback] = useState("")
  const startedAt = useRef(Date.now())

  const sendRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    const data = new FormData(form)
    setStatus("submitting")
    setFeedback("")

    try {
      const response = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: crypto.randomUUID(),
          service: data.get("service"),
          surface: data.get("surface"),
          access: data.get("access"),
          timeline: data.get("timeline"),
          postalCode: data.get("postalCode"),
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          details: data.get("details"),
          contactMode,
          consent: data.get("consent") === "on",
          company: data.get("company"),
          startedAt: String(startedAt.current),
        }),
      })

      const result = await response.json().catch(() => ({})) as { message?: string }
      if (!response.ok) throw new Error(result.message || "L’envoi n’a pas pu aboutir.")

      setStatus("success")
      setFeedback(contactMode === "phone"
        ? "Votre demande a bien été transmise. Soles Travaux vous rappellera au numéro indiqué."
        : "Votre demande a bien été transmise. Un e-mail de confirmation vous a été envoyé.")
      form.reset()
      setContactMode("email")
      startedAt.current = Date.now()
    } catch (error) {
      setStatus("error")
      setFeedback(error instanceof Error ? error.message : "Une erreur est survenue. Vous pouvez aussi nous appeler directement.")
    }
  }

  return (
    <div className="quote-estimator">
      <div className="quote-estimator__intro">
        <span><FileText /> Demande de devis personnalisée</span>
        <p>Chaque chantier est unique : aucun tarif automatique n’est affiché. Votre projet sera étudié individuellement.</p>
      </div>

      <form onSubmit={sendRequest}>
        <div className="quote-estimator__section">
          <div className="quote-estimator__step"><span>01</span><h3>Votre chantier</h3></div>
          <div className="quote-estimator__grid quote-estimator__grid--2">
            <label>
              <span>Type de travaux *</span>
              <select name="service" required defaultValue="masonry">
                {Object.entries(serviceOptions).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </label>
            <label>
              <span>Surface approximative</span>
              <div className="quote-estimator__surface">
                <input name="surface" type="number" inputMode="decimal" min="1" max="10000" placeholder="30" />
                <span>m²</span>
              </div>
            </label>
            <label>
              <span>Accès au chantier</span>
              <select name="access" defaultValue="simple">
                <option value="simple">Simple</option>
                <option value="constrained">Contraint / étage / centre-ville</option>
                <option value="unknown">À déterminer sur place</option>
              </select>
            </label>
            <label>
              <span>Délai envisagé</span>
              <select name="timeline" defaultValue="flexible">
                <option value="flexible">Date flexible</option>
                <option value="three-months">Dans les trois mois</option>
                <option value="urgent">Dès que possible</option>
              </select>
            </label>
            <label>
              <span>Code postal du chantier *</span>
              <input name="postalCode" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} required placeholder="13200" />
            </label>
            <label className="quote-estimator__full">
              <span>Décrivez votre projet *</span>
              <textarea name="details" minLength={20} maxLength={1800} rows={5} required placeholder="État actuel, travaux souhaités, contraintes connues, période envisagée…" />
            </label>
          </div>
          <label className="quote-estimator__honeypot" aria-hidden="true">Société<input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" /></label>
        </div>

        <div className="quote-estimator__section">
          <div className="quote-estimator__step"><span>02</span><h3>Vos coordonnées</h3></div>
          <div className="quote-estimator__grid quote-estimator__grid--2">
            <label>
              <span>Nom et prénom *</span>
              <input name="name" autoComplete="name" minLength={2} maxLength={80} required placeholder="Votre nom" />
            </label>
            <label>
              <span>E-mail {contactMode !== "phone" ? "*" : ""}</span>
              <input name="email" type="email" autoComplete="email" maxLength={120} required={contactMode !== "phone"} placeholder="vous@exemple.fr" />
            </label>
            <label>
              <span>Téléphone {contactMode !== "email" ? "*" : ""}</span>
              <input name="phone" type="tel" autoComplete="tel" minLength={10} maxLength={30} required={contactMode !== "email"} placeholder="06 00 00 00 00" />
            </label>
          </div>
        </div>

        <fieldset className="quote-estimator__contact">
          <legend>Comment souhaitez-vous recevoir la réponse ?</legend>
          <div>
            <label className={contactMode === "email" ? "is-selected" : ""}><input type="radio" name="contactMode" value="email" checked={contactMode === "email"} onChange={() => setContactMode("email")} /><Mail /><span>E-mail<small>Confirmation automatique</small></span></label>
            <label className={contactMode === "phone" ? "is-selected" : ""}><input type="radio" name="contactMode" value="phone" checked={contactMode === "phone"} onChange={() => setContactMode("phone")} /><Phone /><span>Téléphone<small>Rappel par l’artisan</small></span></label>
            <label className={contactMode === "both" ? "is-selected" : ""}><input type="radio" name="contactMode" value="both" checked={contactMode === "both"} onChange={() => setContactMode("both")} /><CheckCircle2 /><span>Les deux<small>E-mail et rappel</small></span></label>
          </div>
        </fieldset>

        <label className="quote-estimator__consent">
          <input name="consent" type="checkbox" required />
          <span>J’ai lu la <a href="#confidentialite">politique de confidentialité</a> et j’accepte l’utilisation de mes informations uniquement pour traiter cette demande. *</span>
        </label>

        <Button type="submit" size="lg" className="quote-estimator__submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Envoi sécurisé…" : <><Send /> Envoyer ma demande de devis</>}
        </Button>
      </form>

      {status === "success" && (
        <div className="quote-estimator__ready" role="status">
          <div><CheckCircle2 /><span><strong>Demande envoyée.</strong>{feedback}</span></div>
          <div className="quote-estimator__actions"><Button variant="ghost" asChild><a href={`tel:${COMPANY_PHONE}`}><Phone /> Appeler Soles Travaux</a></Button></div>
        </div>
      )}

      {status === "error" && <p className="quote-estimator__status quote-estimator__status--error" role="alert">{feedback}</p>}
    </div>
  )
}
