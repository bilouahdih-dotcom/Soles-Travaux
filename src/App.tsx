import {
  ArrowDown,
  ArrowUpRight,
  BrickWall,
  Check,
  ChevronRight,
  DraftingCompass,
  Grid3X3,
  House,
  Mail,
  MapPin,
  Menu,
  PaintRoller,
  PanelsTopLeft,
  Phone,
  X,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { FaqSection } from "@/components/FaqSection"
import { LegalSection } from "@/components/LegalSection"
import { PortfolioGallery, type Project } from "@/components/PortfolioGallery"
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
    icon: BrickWall,
  },
  {
    number: "02",
    title: "Couverture & zinguerie",
    description: "Protection durable du bâti, travaux de toiture et évacuation maîtrisée des eaux pluviales.",
    icon: House,
  },
  {
    number: "03",
    title: "Charpente",
    description: "Création, reprise et adaptation des structures bois pour des ouvrages fiables et pérennes.",
    icon: DraftingCompass,
  },
  {
    number: "04",
    title: "Plaquisterie",
    description: "Cloisons, doublages, faux plafonds et préparation des volumes intérieurs avant finition.",
    icon: PanelsTopLeft,
  },
  {
    number: "05",
    title: "Carrelage",
    description: "Préparation des supports et pose soignée pour des sols et murs nets, résistants et alignés.",
    icon: Grid3X3,
  },
  {
    number: "06",
    title: "Façades",
    description: "Réparation, préparation et remise en état des façades pour protéger et valoriser le bâtiment.",
    icon: PaintRoller,
  },
]

const projects: Project[] = [
  {
    title: "Élévation de murs",
    category: "Maçonnerie générale",
    group: "Maçonnerie",
    image: "/images/project-masonry.webp",
    alt: "Maçon appliquant du mortier sur un mur en blocs de béton",
  },
  {
    title: "Mortier & briques",
    category: "Montage traditionnel",
    group: "Maçonnerie",
    image: "/images/gallery-masonry-02.webp",
    alt: "Maçon montant un mur de briques avec du mortier",
  },
  {
    title: "Application du mortier",
    category: "Gros œuvre",
    group: "Maçonnerie",
    image: "/images/gallery-masonry-03.webp",
    alt: "Artisan appliquant du ciment sur un mur en blocs",
  },
  {
    title: "Structure maçonnée",
    category: "Élévation",
    group: "Maçonnerie",
    image: "/images/gallery-masonry-04.webp",
    alt: "Ouvrier construisant la partie haute d’un mur maçonné",
  },
  {
    title: "Pose des tuiles",
    category: "Couverture",
    group: "Toiture",
    image: "/images/project-roofing.webp",
    alt: "Couvreur posant des tuiles sur une toiture inclinée",
  },
  {
    title: "Couverture traditionnelle",
    category: "Réfection",
    group: "Toiture",
    image: "/images/gallery-roofing-02.webp",
    alt: "Deux couvreurs travaillant sur une toiture traditionnelle",
  },
  {
    title: "Charpente bois",
    category: "Structure",
    group: "Toiture",
    image: "/images/gallery-roofing-03.webp",
    alt: "Charpentiers assemblant une structure de toiture en bois",
  },
  {
    title: "Réfection de toiture",
    category: "Entretien",
    group: "Toiture",
    image: "/images/gallery-roofing-04.webp",
    alt: "Deux professionnels réparant une couverture de toiture",
  },
  {
    title: "Pose de plaques",
    category: "Plaquisterie",
    group: "Intérieurs",
    image: "/images/project-interior.webp",
    alt: "Plaquiste ajustant un panneau dans un intérieur en rénovation",
  },
  {
    title: "Découpe sur mesure",
    category: "Plaques de plâtre",
    group: "Intérieurs",
    image: "/images/gallery-interior-02.webp",
    alt: "Artisan découpant une plaque de plâtre sur un chantier intérieur",
  },
  {
    title: "Préparation des plafonds",
    category: "Ponçage",
    group: "Intérieurs",
    image: "/images/gallery-interior-03.webp",
    alt: "Artisan préparant un plafond en plaques de plâtre",
  },
  {
    title: "Enduits & lissage",
    category: "Préparation",
    group: "Intérieurs",
    image: "/images/gallery-interior-04.webp",
    alt: "Professionnel lissant un mur intérieur blanc",
  },
  {
    title: "Pose au cordeau",
    category: "Carrelage",
    group: "Finitions",
    image: "/images/project-tiling.webp",
    alt: "Carreleurs alignant des carreaux dans une pièce en rénovation",
  },
  {
    title: "Grand format",
    category: "Pose de sols",
    group: "Finitions",
    image: "/images/gallery-finishing-02.webp",
    alt: "Carreleur posant de grands carreaux sur un sol intérieur",
  },
  {
    title: "Outils & précision",
    category: "Détails de pose",
    group: "Finitions",
    image: "/images/gallery-finishing-03.webp",
    alt: "Outils professionnels disposés sur un sol carrelé",
  },
  {
    title: "Faïence & crédence",
    category: "Revêtements muraux",
    group: "Finitions",
    image: "/images/gallery-finishing-04.webp",
    alt: "Pose et sélection de carreaux pour une crédence de cuisine",
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
          <img className="brand__logo" src="/images/soles-travaux-logo-light.png" alt="" width="900" height="358" />
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
          <a className="header-phone" href={`tel:${PHONE_LINK}`} aria-label={`Appeler Soles Travaux au ${PHONE_DISPLAY}`}>
            <span className="header-phone__icon"><Phone /></span>
            <span className="header-phone__copy"><small>Un projet ? Appelez-nous</small><strong>{PHONE_DISPLAY}</strong></span>
          </a>
          <Button size="sm" asChild><a href="#devis">Devis en ligne</a></Button>
        </div>
        <div className="mobile-actions">
          <a href={`tel:${PHONE_LINK}`} aria-label={`Appeler Soles Travaux au ${PHONE_DISPLAY}`}><Phone /></a>
          <button className="menu-button" type="button" onClick={() => setIsOpen(true)} aria-label="Ouvrir le menu" aria-expanded={isOpen} aria-controls="mobile-menu"><Menu /></button>
        </div>
      </header>

      {createPortal(<AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-menu__top">
              <img className="brand__logo" src="/images/soles-travaux-logo-light.png" alt="Soles Travaux" width="900" height="358" />
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
  const { scrollYProgress: pageProgress } = useScroll()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.86], [1, 0.2])

  return (
    <>
      <Header />
      <motion.div className="page-progress" style={{ scaleX: pageProgress }} aria-hidden="true" />
      <main id="main">
        <section id="accueil" className="hero" ref={heroRef}>
          <motion.div className="hero__media" style={reduceMotion ? undefined : { y: heroY }} aria-hidden="true">
            <img src="/images/hero.webp" alt="" width="2200" height="1238" fetchPriority="high" />
          </motion.div>
          <div className="hero__veil" aria-hidden="true" />
          <div className="hero__grid" aria-hidden="true" />

          <motion.div className="hero__content shell" style={reduceMotion ? undefined : { opacity: heroOpacity }}>
            <motion.p className="hero__kicker" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <span /> Artisan du bâtiment à Arles · 70 km autour
            </motion.p>
            <h1>
              <span className="hero__line-mask"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}>Maçonnerie à Arles.</motion.span></span>
              <span className="hero__line-mask hero__line-mask--gold"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}>Bâtir. Rénover.</motion.span></span>
            </h1>
            <motion.div className="hero__bottom" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.62 }}>
              <p>Maçonnerie, toiture et second œuvre : un interlocuteur unique pour vos travaux à Arles et dans un rayon de 70 km.</p>
              <div className="hero__actions">
                <Button size="lg" asChild><a href="#devis">Demander un devis <ArrowUpRight /></a></Button>
                <Button size="lg" variant="outline" asChild><a href="#realisations">Voir les réalisations</a></Button>
              </div>
            </motion.div>
          </motion.div>

          <a className="hero__scroll" href="#manifeste"><span>Découvrir</span><ArrowDown /></a>
        </section>

        <section id="manifeste" className="manifesto section section--light">
          <div className="shell manifesto__grid">
            <div className="manifesto__content">
              <span className="eyebrow">Notre exigence</span>
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

        <section id="realisations" className="portfolio section section--black">
          <div className="shell">
            <div className="portfolio__heading">
              <span className="eyebrow">Portfolio par métier</span>
              <h2>Le geste<span>.</span> Le résultat.</h2>
              <p>Une galerie d’inspiration organisée par savoir-faire, en attendant les photographies des chantiers Soles Travaux.</p>
            </div>
            <PortfolioGallery projects={projects} />
            <p className="portfolio__notice">Images d’ambiance : elles ne présentent pas des réalisations de Soles Travaux.</p>
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

        <section className="cta-band section section--gold">
          <div className="shell cta-band__grid">
            <div>
              <span className="eyebrow">Parlons du chantier</span>
              <h2>Un projet précis mérite une réponse <em>personnalisée.</em></h2>
            </div>
            <div className="cta-band__actions">
              <Button size="lg" variant="light" asChild><a href="#devis">Décrire mon projet <ArrowUpRight /></a></Button>
              <a href={`tel:${PHONE_LINK}`}><Phone /> {PHONE_DISPLAY}</a>
            </div>
          </div>
        </section>

        <FaqSection />

        <section id="devis" className="contact section section--black">
          <div className="shell contact__grid">
            <div className="contact__copy">
              <span className="eyebrow">Demande de devis</span>
              <h2>Un chiffrage adapté à votre <em>projet.</em></h2>
              <p>Chaque chantier est unique. Décrivez votre besoin, choisissez une réponse par e-mail, téléphone ou les deux, puis Soles Travaux étudiera votre demande individuellement.</p>
              <div className="contact__details">
                <a href={`tel:${PHONE_LINK}`} className="contact__detail">
                  <span className="contact__detail-icon"><Phone /></span><span><small>Téléphone</small><strong>{PHONE_DISPLAY}</strong></span><ArrowUpRight />
                </a>
                <a href={`mailto:${EMAIL}`} className="contact__detail">
                  <span className="contact__detail-icon"><Mail /></span><span><small>E-mail</small><strong>{EMAIL}</strong></span><ArrowUpRight />
                </a>
                <a href="https://www.google.com/maps/search/?api=1&query=8+Chemin+des+Segonnaux+13200+Arles" target="_blank" rel="noreferrer noopener" className="contact__detail">
                  <span className="contact__detail-icon"><MapPin /></span><span><small>Atelier</small><strong>8 chemin des Segonnaux, 13200 Arles</strong></span><ArrowUpRight />
                </a>
              </div>
            </div>
            <QuoteRequestForm />
          </div>
        </section>
        <LegalSection />
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__grid">
          <a className="brand brand--footer" href="#accueil" aria-label="Soles Travaux, retour en haut de page">
            <img className="brand__logo" src="/images/soles-travaux-logo-light.png" alt="" width="900" height="358" loading="lazy" decoding="async" />
          </a>
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
          <a href="https://www.google.com/maps/search/?api=1&query=8+Chemin+des+Segonnaux+13200+Arles" target="_blank" rel="noreferrer noopener">8 chemin des Segonnaux, 13200 Arles</a>
        </div>
      </footer>

      <nav className="mobile-quick-actions" aria-label="Actions rapides">
        <a href={`tel:${PHONE_LINK}`}><Phone /> Appeler</a>
        <a href="#devis">Demander un devis <ArrowUpRight /></a>
      </nav>
    </>
  )
}

export default App
