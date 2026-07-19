import { Resend } from "resend"

const RECIPIENT_EMAIL = process.env.QUOTE_RECIPIENT_EMAIL || "solestravaux@gmail.com"
const MAX_BODY_SIZE = 20_000
const RATE_LIMIT_WINDOW = 15 * 60 * 1000
const RATE_LIMIT_MAX = 5

const services = {
  masonry: "Maçonnerie & gros œuvre",
  roofing: "Couverture & zinguerie",
  framing: "Charpente",
  drywall: "Plaquisterie",
  tiling: "Carrelage",
  facade: "Façade",
} as const

const accessLabels = {
  simple: "Simple",
  constrained: "Contraint / étage / centre-ville",
  unknown: "À déterminer sur place",
} as const

const timelineLabels = {
  flexible: "Date flexible",
  "three-months": "Dans les trois mois",
  urgent: "Dès que possible",
} as const

type RateBucket = { count: number; resetAt: number }
const rateLimitState = globalThis as typeof globalThis & { quoteRateLimits?: Map<string, RateBucket> }
const rateLimits = rateLimitState.quoteRateLimits ?? new Map<string, RateBucket>()
rateLimitState.quoteRateLimits = rateLimits

const json = (body: Record<string, unknown>, status = 200, extraHeaders: Record<string, string> = {}) => Response.json(body, {
  status,
  headers: {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders,
  },
})

const clean = (value: unknown, maxLength: number) => typeof value === "string" ? value.trim().slice(0, maxLength) : ""
const isKeyOf = <T extends object>(value: string, object: T): value is Extract<keyof T, string> => Object.prototype.hasOwnProperty.call(object, value)
const isPlainRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value)
const isBoundedString = (value: unknown, maxLength: number) => typeof value === "string" && value.length <= maxLength
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  "\"": "&quot;",
}[character] || character))

const isAllowedOrigin = (request: Request) => {
  const fetchSite = request.headers.get("sec-fetch-site")
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) return false

  const origin = request.headers.get("origin")
  if (!origin) return true

  try {
    const configuredOrigin = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : null
    if (configuredOrigin) return new URL(origin).origin === configuredOrigin

    const requestHost = request.headers.get("x-forwarded-host") || request.headers.get("host")
    return !requestHost || new URL(origin).host === requestHost
  } catch {
    return false
  }
}

const getRateLimitRetryAfter = (request: Request) => {
  const now = Date.now()
  const ip = clean(request.headers.get("x-forwarded-for")?.split(",")[0], 64)
    || clean(request.headers.get("x-real-ip"), 64)
    || "unknown"
  const bucket = rateLimits.get(ip)

  if (!bucket || bucket.resetAt <= now) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return null
  }

  bucket.count += 1
  if (rateLimits.size > 500) {
    for (const [key, value] of rateLimits) if (value.resetAt <= now) rateLimits.delete(key)
  }
  return bucket.count > RATE_LIMIT_MAX ? Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) : null
}

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") return json({ message: "Méthode non autorisée." }, 405, { Allow: "POST" })
    if (!isAllowedOrigin(request)) return json({ message: "Origine non autorisée." }, 403)
    const retryAfter = getRateLimitRetryAfter(request)
    if (retryAfter) return json(
      { message: "Trop de demandes ont été envoyées. Réessayez dans quelques minutes." },
      429,
      { "Retry-After": String(retryAfter) },
    )

    const contentLength = Number(request.headers.get("content-length") || 0)
    if (!Number.isFinite(contentLength) || contentLength < 0) return json({ message: "Taille de demande invalide." }, 400)
    if (contentLength > MAX_BODY_SIZE) return json({ message: "La demande est trop volumineuse." }, 413)
    if (!request.headers.get("content-type")?.includes("application/json")) return json({ message: "Format de demande invalide." }, 415)

    let body: Record<string, unknown>
    try {
      const rawBody = await request.text()
      if (rawBody.length > MAX_BODY_SIZE) return json({ message: "La demande est trop volumineuse." }, 413)
      const parsed: unknown = JSON.parse(rawBody)
      if (!isPlainRecord(parsed)) return json({ message: "Le contenu de la demande est invalide." }, 400)
      body = parsed
    } catch {
      return json({ message: "Le contenu de la demande est invalide." }, 400)
    }

    if (clean(body.company, 100)) return json({ ok: true })

    const stringFieldsAreBounded = [
      [body.requestId, 80], [body.service, 40], [body.surface, 12], [body.access, 40],
      [body.timeline, 40], [body.postalCode, 10], [body.name, 80], [body.email, 120],
      [body.phone, 30], [body.details, 1800], [body.contactMode, 10], [body.company, 100],
      [body.startedAt, 20],
    ].every(([value, maximum]) => isBoundedString(value, Number(maximum)))
    if (!stringFieldsAreBounded) return json({ message: "Vérifiez le format des informations envoyées." }, 400)

    const requestId = clean(body.requestId, 80)
    const service = clean(body.service, 40)
    const surface = clean(body.surface, 12)
    const access = clean(body.access, 40)
    const timeline = clean(body.timeline, 40)
    const postalCode = clean(body.postalCode, 10)
    const name = clean(body.name, 80)
    const email = clean(body.email, 120).toLowerCase()
    const phone = clean(body.phone, 30)
    const details = clean(body.details, 1800)
    const contactMode = clean(body.contactMode, 10)
    const startedAt = Number(clean(body.startedAt, 20))

    const emailIsValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const phoneIsValid = !phone || /^[+()\d\s.-]{10,30}$/.test(phone)
    const surfaceIsValid = !surface || /^(?:[1-9]\d{0,3}|10000)$/.test(surface)
    const elapsed = Date.now() - startedAt
    const timingIsValid = Number.isSafeInteger(startedAt) && elapsed >= 1200 && elapsed <= 2 * 60 * 60 * 1000
    const contactIsValid = ["email", "phone", "both"].includes(contactMode)
      && (contactMode === "phone" ? Boolean(phone) : Boolean(email))
      && (contactMode !== "both" || Boolean(email && phone))

    if (
      !/^[a-zA-Z0-9-]{8,80}$/.test(requestId) || !isKeyOf(service, services) || !isKeyOf(access, accessLabels)
      || !isKeyOf(timeline, timelineLabels) || !/^\d{5}$/.test(postalCode)
      || name.length < 2 || details.length < 20 || !emailIsValid || !phoneIsValid
      || !surfaceIsValid || !timingIsValid || !contactIsValid || body.consent !== true
    ) return json({ message: "Vérifiez les informations obligatoires avant l’envoi." }, 400)

    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL
    if (!apiKey || !fromEmail) return json({ message: "Le service d’envoi n’est pas encore configuré." }, 503)

    const resend = new Resend(apiKey)
    const preference = contactMode === "email" ? "E-mail" : contactMode === "phone" ? "Téléphone" : "E-mail et téléphone"
    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email || "Non renseigné"),
      phone: escapeHtml(phone || "Non renseigné"),
      postalCode: escapeHtml(postalCode),
      surface: escapeHtml(surface ? `${surface} m²` : "Non renseignée"),
      details: escapeHtml(details).replace(/\n/g, "<br />"),
    }

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: RECIPIENT_EMAIL,
      replyTo: email || undefined,
      subject: `Nouvelle demande de devis — ${services[service]}`,
      text: [
        `Nouvelle demande de devis de ${name}`,
        `Projet : ${services[service]}`,
        `Surface : ${surface || "Non renseignée"} m²`,
        `Accès : ${accessLabels[access]}`,
        `Délai : ${timelineLabels[timeline]}`,
        `Code postal : ${postalCode}`,
        `Préférence de réponse : ${preference}`,
        `E-mail : ${email || "Non renseigné"}`,
        `Téléphone : ${phone || "Non renseigné"}`,
        "",
        details,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#171713">
          <div style="background:#090909;color:#dfbd77;padding:24px"><strong>SOLES TRAVAUX</strong></div>
          <div style="padding:28px;border:1px solid #d7dad5">
            <h1 style="font-size:24px;margin:0 0 20px">Nouvelle demande de devis</h1>
            <p><strong>Client :</strong> ${safe.name}<br /><strong>Projet :</strong> ${services[service]}<br /><strong>Surface :</strong> ${safe.surface}<br /><strong>Accès :</strong> ${accessLabels[access]}<br /><strong>Délai :</strong> ${timelineLabels[timeline]}<br /><strong>Code postal :</strong> ${safe.postalCode}</p>
            <p><strong>Préférence :</strong> ${preference}<br /><strong>E-mail :</strong> ${safe.email}<br /><strong>Téléphone :</strong> ${safe.phone}</p>
            <div style="margin-top:24px;padding:18px;background:#f4f2ec"><strong>Description du projet</strong><p style="line-height:1.6">${safe.details}</p></div>
          </div>
        </div>`,
    }, { idempotencyKey: `quote-${requestId}-business` })

    if (error) return json({ message: "L’envoi n’a pas pu aboutir. Vous pouvez nous appeler directement." }, 502)

    if (email) {
      const confirmation = await resend.emails.send({
        from: fromEmail,
        to: email,
        replyTo: RECIPIENT_EMAIL,
        subject: "Votre demande a bien été reçue — Soles Travaux",
        text: `Bonjour ${name},\n\nVotre demande concernant ${services[service].toLowerCase()} a bien été transmise à Soles Travaux. Elle sera étudiée individuellement avant toute proposition de prix.\n\nPréférence de réponse : ${preference}.\n\nSoles Travaux — 06 46 04 06 59`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#171713">
            <div style="background:#090909;color:#dfbd77;padding:24px"><strong>SOLES TRAVAUX</strong></div>
            <div style="padding:28px;border:1px solid #d7dad5">
              <h1 style="font-size:24px">Votre demande a bien été reçue.</h1>
              <p style="line-height:1.7">Bonjour ${safe.name},<br /><br />Votre projet de ${services[service].toLowerCase()} sera étudié individuellement avant toute proposition de prix. Soles Travaux reviendra vers vous selon votre préférence : <strong>${preference.toLowerCase()}</strong>.</p>
              <p style="margin-top:24px"><strong>06 46 04 06 59</strong><br />solestravaux@gmail.com</p>
            </div>
          </div>`,
      }, { idempotencyKey: `quote-${requestId}-customer` })

      if (confirmation.error) console.error("Resend confirmation failed", confirmation.error.name)
    }

    return json({ ok: true })
  },
}
