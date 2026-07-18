import { motion, useInView, useReducedMotion } from "motion/react"
import { useRef } from "react"

interface TextRevealProps {
  text: string
}

export function TextReveal({ text }: TextRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" })
  const reduceMotion = useReducedMotion()

  return (
    <p ref={ref} className="text-reveal" aria-label={text}>
      {text.split(" ").map((word, index) => (
        <motion.span
          aria-hidden="true"
          className="text-reveal__word"
          initial={reduceMotion ? false : { opacity: 0.14, y: 18, filter: "blur(5px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={{ duration: 0.55, delay: index * 0.035, ease: [0.16, 1, 0.3, 1] }}
          key={`${word}-${index}`}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </p>
  )
}
