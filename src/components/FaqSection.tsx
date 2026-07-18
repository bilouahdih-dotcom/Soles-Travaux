import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const questions = [
  {
    question: "Comment le prix de mon chantier est-il établi ?",
    answer: "Chaque tarif est unique. Le chiffrage tient compte de l’état du bâti, des surfaces, des matériaux, de l’accès et des contraintes techniques. Aucun prix ferme n’est généré automatiquement : Soles Travaux étudie chaque demande avant de vous adresser un devis personnalisé.",
  },
  {
    question: "Dans quelle zone intervenez-vous ?",
    answer: "Soles Travaux intervient autour d’Arles dans un rayon indicatif de 70 km. La faisabilité dépend aussi de la nature et de la durée du chantier ; elle est confirmée lors du premier échange.",
  },
  {
    question: "Une visite sur place est-elle obligatoire ?",
    answer: "Elle n’est pas systématique pour un premier avis, mais elle est souvent nécessaire avant un devis ferme. Elle permet de contrôler les supports, les accès, les métrés et les éventuelles contraintes invisibles sur photo.",
  },
  {
    question: "Quels types de travaux prenez-vous en charge ?",
    answer: "Maçonnerie et gros œuvre, couverture et zinguerie, charpente, plaquisterie, carrelage et façades. Pour un projet qui combine plusieurs métiers, vous conservez un interlocuteur unique.",
  },
  {
    question: "Puis-je envoyer des photos de mon projet ?",
    answer: "Oui. Décrivez d’abord votre besoin dans le formulaire. Si vous choisissez l’e-mail, vous pourrez ensuite répondre au message de confirmation en joignant vos photos et documents utiles.",
  },
  {
    question: "Comment vais-je recevoir mon devis ?",
    answer: "Vous choisissez le canal qui vous convient : e-mail, téléphone, ou les deux. Le téléphone sert à préciser le besoin ; le document de devis est ensuite transmis par écrit lorsqu’il est prêt.",
  },
  {
    question: "Quels délais faut-il prévoir ?",
    answer: "Ils varient selon la disponibilité, l’ampleur des travaux, les approvisionnements et les contraintes du chantier. Après étude, Soles Travaux vous communique un calendrier réaliste plutôt qu’un délai générique.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="faq section section--anodized">
      <div className="shell faq__grid">
        <div className="faq__heading">
          <span className="eyebrow">Questions fréquentes</span>
          <h2>Les réponses.<br /><em>Avant le chantier.</em></h2>
          <p>De la première prise de contact jusqu’au devis, voici l’essentiel pour avancer sans zone floue.</p>
        </div>
        <Accordion className="faq-accordion" type="single" collapsible>
          {questions.map((item, index) => (
            <AccordionItem value={`question-${index + 1}`} key={item.question}>
              <AccordionTrigger>
                <span className="faq-accordion__number">{String(index + 1).padStart(2, "0")}</span>
                <span>{item.question}</span>
              </AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
