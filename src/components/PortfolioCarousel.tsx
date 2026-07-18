import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

export interface Project {
  title: string
  category: string
  group: string
  description: string
  image: string
  alt: string
}

interface PortfolioCarouselProps {
  projects: Project[]
}

export function PortfolioCarousel({ projects }: PortfolioCarouselProps) {
  const [activeGroup, setActiveGroup] = useState("Tous")
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const reduceMotion = useReducedMotion()

  const groups = useMemo(() => ["Tous", ...Array.from(new Set(projects.map((project) => project.group)))], [projects])
  const visibleProjects = useMemo(
    () => activeGroup === "Tous" ? projects : projects.filter((project) => project.group === activeGroup),
    [activeGroup, projects],
  )

  const move = (nextIndex: number) => {
    setDirection(nextIndex > index || (index === visibleProjects.length - 1 && nextIndex === 0) ? 1 : -1)
    setIndex((nextIndex + visibleProjects.length) % visibleProjects.length)
  }

  const previous = () => move(index - 1)
  const next = () => move(index + 1)

  return (
    <div
      className="portfolio-carousel"
      role="region"
      aria-roledescription="carrousel"
      aria-label="Réalisations Soles Travaux"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") previous()
        if (event.key === "ArrowRight") next()
      }}
    >
      <div className="portfolio-carousel__filters" aria-label="Filtrer les réalisations par métier">
        {groups.map((group) => (
          <button
            type="button"
            className={activeGroup === group ? "is-active" : ""}
            aria-pressed={activeGroup === group}
            onClick={() => {
              setActiveGroup(group)
              setIndex(0)
              setDirection(1)
            }}
            key={group}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="portfolio-carousel__viewport">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.article
            className="project-slide"
            key={`${activeGroup}-${visibleProjects[index].title}`}
            custom={direction}
            initial={reduceMotion ? false : { opacity: 0, x: direction * 90, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -90, scale: 0.98 }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) next()
              if (info.offset.x > 70) previous()
            }}
          >
            <div className="project-slide__media">
              <img
                src={visibleProjects[index].image}
                alt={visibleProjects[index].alt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <span className="project-slide__count">{String(index + 1).padStart(2, "0")} / {String(visibleProjects.length).padStart(2, "0")}</span>
            </div>
            <div className="project-slide__copy" aria-live="polite">
              <span className="eyebrow">{visibleProjects[index].category}</span>
              <h3>{visibleProjects[index].title}</h3>
              <p>{visibleProjects[index].description}</p>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="portfolio-carousel__controls">
        <div className="portfolio-carousel__arrows">
          <Button type="button" variant="outline" size="icon" onClick={previous} aria-label="Réalisation précédente">
            <ArrowLeft />
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={next} aria-label="Réalisation suivante">
            <ArrowRight />
          </Button>
        </div>
        <div className="portfolio-carousel__dots" aria-label="Choisir une réalisation">
          {visibleProjects.map((project, projectIndex) => (
            <button
              type="button"
              aria-current={projectIndex === index ? "true" : undefined}
              aria-label={`Afficher ${project.title}`}
              className={projectIndex === index ? "is-active" : ""}
              onClick={() => move(projectIndex)}
              key={project.title}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
