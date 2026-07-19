import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { useMemo, useState, type PointerEvent } from "react"

export interface Project {
  title: string
  category: string
  group: string
  image: string
  alt: string
  sourceUrl: string
}

interface PortfolioGalleryProps {
  projects: Project[]
}

export function PortfolioGallery({ projects }: PortfolioGalleryProps) {
  const groups = useMemo(() => Array.from(new Set(projects.map((project) => project.group))), [projects])
  const [activeGroup, setActiveGroup] = useState(groups[0] ?? "")
  const reduceMotion = useReducedMotion()
  const visibleProjects = useMemo(
    () => projects.filter((project) => project.group === activeGroup),
    [activeGroup, projects],
  )

  const updateSpotlight = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`)
  }

  return (
    <div className="portfolio-gallery" role="region" aria-label="Galerie de réalisations par métier">
      <div className="portfolio-gallery__filters" role="group" aria-label="Filtrer le portfolio par métier">
        {groups.map((group) => (
          <button
            type="button"
            aria-pressed={activeGroup === group}
            className={activeGroup === group ? "is-active" : ""}
            onClick={() => setActiveGroup(group)}
            key={group}
          >
            {activeGroup === group && (
              <motion.span
                className="portfolio-gallery__filter-lamp"
                layoutId="portfolio-gallery-filter"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span>{group}</span>
          </button>
        ))}
      </div>

      <motion.div className="portfolio-gallery__grid" layout aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleProjects.map((project, index) => (
            <motion.article
              className="portfolio-card"
              key={project.image}
              layout
              initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.96, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.96, filter: "blur(8px)" }}
              transition={{ duration: 0.52, delay: reduceMotion ? 0 : index * 0.055, ease: [0.16, 1, 0.3, 1] }}
              onPointerMove={updateSpotlight}
            >
              <img
                src={project.image}
                alt={project.alt}
                width="1200"
                height="900"
                sizes="(max-width: 840px) 86vw, 25vw"
                loading="lazy"
                decoding="async"
              />
              <div className="portfolio-card__veil" aria-hidden="true" />
              <div className="portfolio-card__meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p>{project.category}</p>
                  <h3>{project.title}</h3>
                </div>
                <a href={project.sourceUrl} target="_blank" rel="noreferrer noopener" aria-label={`Source Pexels de l’image ${project.title}`}>
                  Pexels <ArrowUpRight />
                </a>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      <p className="portfolio-gallery__hint">Sur mobile, faites glisser la galerie horizontalement.</p>
    </div>
  )
}
