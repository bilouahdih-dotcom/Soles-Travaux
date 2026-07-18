import {
  ArrowDown,
  ArrowUpRight,
  Brush,
  Building2,
  Check,
  ChevronRight,
  HardHat,
  Mail,
  MapPin,
  Menu,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { BeforeAfter } from "@/components/BeforeAfter"
import { FaqSection } from "@/components/FaqSection"
import { LegalSection } from "@/components/LegalSection"
import { PortfolioCarousel, type Project } from "@/components/PortfolioCarousel"
import { QuoteRequestForm } from "@/components/QuoteRequestForm"
import { TextReveal } from "@/components/TextReveal"
import { Button } from "@/components/ui/button"

const EMAIL = "solestravaux@gmail.com"
const PHONE_DISPLAY = "06 46 04 06 59"
const PHONE_LINK = "+33646040659"

const ServiceAreaMap = lazy(() =>
  import("@/components/ServiceAreaMap").then((module) => ({ default: module.ServiceAreaMap })),
)

const navItems = [
  { label: "Accueil", href: "#accueil" },
  { label: "Expertises", href: "#expertises" },
  { label: "Réalisations", href: "#realisations" },
  { label: "Zone", href: "#zone" },
  { label: "Devis", href: "#devis" },
]

const services = [
  {
    number: "01",
    title: "Maçonnerie & gros œuvre",
    description: "Fondations, élévation, dalles et ouvrages structurels réalisés avec méthode et précision.",
    icon: HardHat,
  },
  {
    number: "02",
    title: "Couverture & zinguerie",
    description: "Protection durable du bâti, travaux de toiture et évacuation maîtrisée des eaux pluviales.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Charpente",
    description: "Création, reprise et adaptation des structures bois pour des ouvrages fiables et pérennes.",
    icon: Ruler,
  },
  {
    number: "04",
    title: "Plaquisterie",
    description: "Cloisons, doublages, faux plafonds et préparation des volumes intérieurs avant finition.",
    icon: Wrench,
  },
  {
    number: "05",
    title: "Carrelage",
    description: "Préparation des supports et pose soignée pour des sols et murs nets, résistants et alignés.",
    icon: Brush,
  },
  {
    number: "06",
    title: "Façades",
    description: "Réparation, préparation et remise en état des façades pour protéger et valoriser le bâtiment.",
    icon: Building2,
  },
]

const projects: Project[] = [
  {
    title: "Élévation & gros œuvre",
    category: "Maçonnerie générale",
    group: "Gros œuvre",
    description: "Une structure exécutée avec rigueur, du premier traçage jusqu’aux ouvrages prêts à recevoir les finitions.",
    image: "/images/project-masonry.webp",
    alt: "Chantier de maçonnerie et de gros œuvre",
  },
  {
    title: "Toiture bien protégée",
    category: "Couverture & zinguerie",
    group: "Toiture",
    description: "Une intervention pensée pour la durabilité de la toiture et la bonne gestion des eaux pluviales.",
    image: "/images/project-roofing.webp",
    alt: "Travaux de couverture sur une toiture",
  },
  {
    title: "Volumes restructurés",
    category: "Plaquisterie",
    group: "Intérieurs",
    description: "Cloisons et doublages redessinent l’espace avec des aplombs propres et des supports prêts à finir.",
    image: "/images/project-interior.webp",
    alt: "Artisan travaillant sur un aménagement intérieur",
  },
  {
    title: "Pose nette, lignes durables",
    category: "Carrelage & finitions",
    group: "Finitions",
    description: "Calepinage, alignements et joints réguliers : la qualité finale se joue dans chaque détail de pose.",
    image: "/images/project-tiling.webp",
    alt: "Carrelage mural aux finitions contemporaines",
  },
]

const processSteps = [
  { title: "Écoute", text: "Le besoin, les contraintes et le résultat attendu sont cadrés dès le premier échange." },
  { title: "Visite & chiffrage", text: "Le projet est observé sur place avant une proposition claire et structurée." },
  { title: "Réalisation", text: "Le chantier avance avec méthode, protection des lieux et points de suivi réguliers." },
  { title: "Réception", text: "Une vérification commune clôture le chantier et valide chaque finition." },
]

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("accueil")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.35, 0.65] },
    )
    const observeNavigationSections = () => {
      navItems.forEach((item) => {
        const section = document.querySelector<HTMLElement>(item.href)
        if (section) observer.observe(section)
      })
    }
    observeNavigationSections()
    const mutationObserver = new MutationObserver(observeNavigationSections)
    const main = document.querySelector("main")
    if (main) mutationObserver.observe(main, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", closeOnEscape)
    }
  }, [isOpen])

  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#accueil" aria-label="Soles Travaux, retour à l’accueil">
          <span className="brand__mark">S</span>
          <span className="brand__name">Soles<span>Travaux</span></span>
        </a>

        <nav className="desktop-nav" aria-label="Navigation principale">
          {navItems.map((item) => {
            const itemId = item.href.slice(1)
            return (
              <a href={item.href} className={active === itemId ? "is-active" : ""} key={item.href}>
                {active === itemId && <motion.span className="desktop-nav__lamp" layoutId="nav-lamp" />}
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>

        <div className="header-actions">
          <a className="header-phone" href={`tel:${PHONE_LINK}`}><Phone /><span><small>Appeler</small>{PHONE_DISPLAY}</span></a>
          <Button size="sm" asChild><a href="#devis">Devis en ligne</a></Button>
        </div>
        <div className="mobile-actions">
          <a href={`tel:${PHONE_LINK}`} aria-label={`Appeler Soles Travaux au ${PHONE_DISPLAY}`}><Phone /></a>
          <button className="menu-button" type="button" onClick={() => setIsOpen(true)} aria-label="Ouvrir le menu" aria-expanded={isOpen}><Menu /></button>
        </div>
      </header>

      {createPortal(<AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-menu__top">
              <span className="brand__name">Soles<span>Travaux</span></span>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Fermer le menu"><X /></button>
            </div>
            <nav aria-label="Navigation mobile">
              {navItems.map((item, index) => (
                <motion.a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + index * 0.06 }}
                  key={item.href}
                >
                  <span>0{index + 1}</span>{item.label}<ChevronRight />
                </motion.a>
              ))}
            </nav>
            <div className="mobile-menu__contacts">
              <a href={`tel:${PHONE_LINK}`}><Phone /> {PHONE_DISPLAY}<ArrowUpRight /></a>
              <a href={`mailto:${EMAIL}`}><Mail /> {EMAIL}<ArrowUpRight /></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </>
  )
}

function App() {
  const heroRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.86], [1, 0.2])

  return (
    <>
      <Header />
      <main id="main">
        <section id="accueil" className="hero" ref={heroRef}>
          <motion.div className="hero__media" style={reduceMotion ? undefined : { y: heroY }} aria-hidden="true">
            <img src="/images/hero.webp" alt="" fetchPriority="high" />
          </motion.div>
          <div className="hero__veil" aria-hidden="true" />
          <div className="hero__grid" aria-hidden="true" />

          <motion.div className="hero__content shell" style={reduceMotion ? undefined : { opacity: heroOpacity }}>
            <motion.p className="hero__kicker" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <span /> Maçonnerie · Couverture · Second œuvre
            </motion.p>
            <h1>
              <span className="hero__line-mask"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}>Bâtir solide.</motion.span></span>
              <span className="hero__line-mask hero__line-mask--gold"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}>Rénover durable.</motion.span></span>
            </h1>
            <motion.div className="hero__bottom" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.62 }}>
              <p>Un artisan multi-métiers basé à Arles, pour des ouvrages solides et des chantiers suivis de près.</p>
              <div className="hero__actions">
                <Button size="lg" asChild><a href="#devis">Demander un devis <ArrowUpRight /></a></Button>
                <Button size="lg" variant="outline" asChild><a href="#realisations">Voir les réalisations</a></Button>
              </div>
            </motion.div>
          </motion.div>

          <div className="hero__rail" aria-hidden="true"><span>SOLES / TRAVAUX / 2026</span></div>
          <a className="hero__scroll" href="#manifeste"><span>Découvrir</span><ArrowDown /></a>
        </section>

        <section id="manifeste" className="manifesto section section--light">
          <div className="shell manifesto__grid">
            <div className="section-index"><span>01</span><p>Notre exigence</p></div>
            <div>
              <TextReveal text="Un ouvrage durable commence bien avant la finition : il se prépare, se mesure et se construit avec méthode." />
              <div className="manifesto__proofs">
                <p><Check /> Artisan inscrit au RNE</p>
                <p><Check /> Entreprise basée à Arles</p>
                <p><Check /> Savoir-faire multi-métiers</p>
                <p><Check /> Chantier suivi directement</p>
              </div>
            </div>
          </div>
        </section>

        <section id="expertises" className="services section section--black">
          <div className="shell">
            <div className="section-heading section-heading--split">
              <div><span className="eyebrow">Nos métiers</span><h2>Du gros œuvre<br />aux finitions.</h2></div>
              <p>Un interlocuteur unique pour coordonner les ouvrages de maçonnerie, de toiture et de second œuvre.</p>
            </div>

            <div className="services__grid">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <motion.article
                    className="service-card"
                    initial={reduceMotion ? false : { opacity: 0, y: 34 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    key={service.title}
                  >
                    <div className="service-card__top"><span>{service.number}</span><Icon /></div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <span className="service-card__line" />
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="transformation section section--anodized">
          <div className="shell transformation__grid">
            <div className="transformation__copy">
              <span className="eyebrow">Voir la différence</span>
              <h2>Construire pour que cela dure.</h2>
              <p>Chaque chantier part d’un bâti, d’un usage et de contraintes réelles. Soles Travaux intervient avec une lecture globale, de la structure aux finitions.</p>
              <ul>
                <li><ShieldCheck /> Protection du bâti et des zones conservées</li>
                <li><Ruler /> Traçage, aplombs et supports contrôlés</li>
                <li><Sparkles /> Chantier nettoyé et réception soignée</li>
              </ul>
            </div>
            <BeforeAfter />
          </div>
        </section>

        <section id="realisations" className="portfolio section section--black">
          <div className="shell">
            <div className="section-heading section-heading--portfolio">
              <div><span className="eyebrow">Portfolio par métier</span><h2>Le travail.<br /><em>Dans le détail.</em></h2></div>
              <p>Photographies d’ambiance temporaires, à remplacer progressivement par les vrais chantiers de Soles Travaux.</p>
            </div>
            <PortfolioCarousel projects={projects} />
          </div>
        </section>

        <section id="methode" className="process section section--light">
          <div className="shell">
            <div className="section-heading section-heading--split">
              <div><span className="eyebrow">Une méthode simple</span><h2>Quatre étapes.<br />Aucune zone floue.</h2></div>
              <p>La confiance se construit avec des engagements compréhensibles et des échanges réguliers.</p>
            </div>
            <div className="process__timeline">
              {processSteps.map((step, index) => {
                return (
                  <motion.article
                    initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.09 }}
                    key={step.title}
                  >
                    <span className="process__number">0{index + 1}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        <Suspense fallback={<div className="service-area__loading" aria-hidden="true" />}>
          <ServiceAreaMap />
        </Suspense>

        <section className="promise section section--gold">
          <div className="shell promise__grid">
            <div><HardHat /><span>Soles Travaux</span></div>
            <blockquote>“Un bâtiment solide se reconnaît à ce que l’on voit — et surtout à tout ce qui a été bien fait derrière.”</blockquote>
          </div>
        </section>

        <FaqSection />

        <section id="devis" className="contact section section--black">
          <div className="shell contact__grid">
            <div className="contact__copy">
              <span className="eyebrow">Demande de devis</span>
              <h2>Un chiffrage adapté à votre <em>projet.</em></h2>
              <p>Chaque chantier est unique. Décrivez votre besoin, choisissez une réponse par e-mail, téléphone ou les deux, puis Soles Travaux étudiera votre demande individuellement.</p>
              <a href={`tel:${PHONE_LINK}`} className="contact__phone"><Phone /> {PHONE_DISPLAY}<ArrowUpRight /></a>
              <a href={`mailto:${EMAIL}`} className="contact__email"><Mail /> {EMAIL}<ArrowUpRight /></a>
              <a href="https://www.google.com/maps/search/?api=1&query=8+Chemin+des+S%C3%A9gonaux+13200+Arles" target="_blank" rel="noreferrer noopener" className="contact__address"><MapPin /> 8 chemin des Ségonaux, 13200 Arles<ArrowUpRight /></a>
            </div>
            <QuoteRequestForm />
          </div>
        </section>
        <LegalSection />
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__grid">
          <a className="brand brand--footer" href="#accueil"><span className="brand__mark">S</span><span className="brand__name">Soles<span>Travaux</span></span></a>
          <p>Maçonnerie · Couverture · Second œuvre</p>
          <div className="site-footer__contacts"><a href={`tel:${PHONE_LINK}`}>{PHONE_DISPLAY}</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
          <p>© {new Date().getFullYear()} Soles Travaux</p>
        </div>
        <nav id="legal-links" className="shell site-footer__links" aria-label="Informations légales">
          <a href="#mentions-legales">Mentions légales</a>
          <a href="#confidentialite">Confidentialité & RGPD</a>
          <a href="#cookies">Politique cookies</a>
        </nav>
        <div className="shell site-footer__legal">
          <p>SOLES — Entrepreneur individuel · SIREN 951 560 846 · SIRET 951 560 846 00010 · APE 4399C</p>
          <a href="https://www.google.com/maps/search/?api=1&query=8+Chemin+des+S%C3%A9gonaux+13200+Arles" target="_blank" rel="noreferrer noopener">8 chemin des Ségonaux, 13200 Arles</a>
        </div>
      </footer>
    </>
  )
}

export default App
