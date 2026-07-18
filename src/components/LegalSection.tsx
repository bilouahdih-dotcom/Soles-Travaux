import { Cookie, FileText, ShieldCheck, X } from "lucide-react"

export function LegalSection() {
  return (
    <div className="legal-modals" aria-label="Informations réglementaires">
      <section id="mentions-legales" className="legal-modal" aria-labelledby="mentions-title">
        <a className="legal-modal__backdrop" href="#legal-links" aria-label="Fermer les mentions légales" />
        <article className="legal-modal__dialog" role="dialog" aria-modal="true">
          <div className="legal-modal__top"><span><FileText /> Informations réglementaires</span><a href="#legal-links" aria-label="Fermer"><X /></a></div>
          <h2 id="mentions-title">Mentions légales</h2>
          <p><strong>Éditeur :</strong> SOLES, entrepreneur individuel — Paul Emmanuel SOLES ESAIE.</p>
          <p><strong>Siège :</strong> 8 chemin des Ségonaux, 13200 Arles, France.</p>
          <p><strong>Immatriculation :</strong> SIREN 951 560 846 · SIRET 951 560 846 00010 · APE 4399C · RNE depuis le 13 avril 2023.</p>
          <p><strong>Contact :</strong> 06 46 04 06 59 · solestravaux@gmail.com.</p>
          <p><strong>Directeur de publication :</strong> Paul Emmanuel SOLES ESAIE.</p>
          <p><strong>Hébergement prévu :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Cette mention devra être confirmée lors de la mise en production.</p>
          <p><strong>Service d’envoi :</strong> Resend, opéré par Plus Five Five, Inc., 2261 Market Street #5039, San Francisco, CA 94114, États-Unis.</p>
          <p>Les textes, la structure, les signes distinctifs et les futures photographies de chantiers sont protégés. Toute reproduction non autorisée est interdite. Une demande transmise sur le site ne constitue ni un devis ni une offre contractuelle.</p>
          <p className="legal-modal__date">Dernière mise à jour : 19 juillet 2026.</p>
        </article>
      </section>

      <section id="confidentialite" className="legal-modal" aria-labelledby="privacy-title">
        <a className="legal-modal__backdrop" href="#legal-links" aria-label="Fermer la politique de confidentialité" />
        <article className="legal-modal__dialog" role="dialog" aria-modal="true">
          <div className="legal-modal__top"><span><ShieldCheck /> Protection des données</span><a href="#legal-links" aria-label="Fermer"><X /></a></div>
          <h2 id="privacy-title">Confidentialité & RGPD</h2>
          <p><strong>Responsable du traitement :</strong> SOLES, aux coordonnées indiquées dans les mentions légales.</p>
          <p><strong>Données concernées :</strong> identité, coordonnées, localisation approximative du chantier, caractéristiques du projet et canal de contact choisi.</p>
          <p><strong>Finalité et base légale :</strong> transmettre, étudier et répondre à une demande de devis, au titre des mesures précontractuelles demandées par la personne.</p>
          <p><strong>Destinataires :</strong> SOLES et, uniquement pour l’hébergement et l’acheminement technique du message, Vercel et Resend agissant comme prestataires. Les informations ne sont ni vendues ni utilisées pour de la prospection par des tiers.</p>
          <p><strong>Carte :</strong> la carte de zone est fournie à partir des tuiles d’OpenStreetMap. Elles ne sont demandées qu’à l’approche de la section. OpenStreetMap reçoit alors les données techniques usuelles de la requête, notamment l’adresse IP et le référent.</p>
          <p><strong>Conservation :</strong> aucune base commerciale n’est créée par ce site. La demande transite par la fonction sécurisée puis par Resend et la messagerie de SOLES. Les données d’un prospect sans contrat pourront être conservées jusqu’à trois ans après le dernier contact ; les données devenues contractuelles suivent les durées légales applicables.</p>
          <p><strong>Transferts hors UE :</strong> Vercel et Resend sont des prestataires américains. Les transferts doivent être encadrés par leurs mécanismes contractuels et garanties de protection applicables lors de l’ouverture des comptes de production.</p>
          <p><strong>Vos droits :</strong> accès, rectification, effacement, limitation, opposition et, lorsque applicable, portabilité. Adressez votre demande à solestravaux@gmail.com. Vous pouvez ensuite saisir la CNIL si vous estimez que vos droits ne sont pas respectés.</p>
          <p>Aucun prix et aucune décision contractuelle ne sont produits automatiquement. Chaque demande est étudiée par l’artisan et un devis ferme nécessite un échange et, selon le chantier, une visite technique.</p>
          <p className="legal-modal__date">Dernière mise à jour : 19 juillet 2026.</p>
        </article>
      </section>

      <section id="cookies" className="legal-modal" aria-labelledby="cookies-title">
        <a className="legal-modal__backdrop" href="#legal-links" aria-label="Fermer la politique cookies" />
        <article className="legal-modal__dialog" role="dialog" aria-modal="true">
          <div className="legal-modal__top"><span><Cookie /> Cookies & services tiers</span><a href="#legal-links" aria-label="Fermer"><X /></a></div>
          <h2 id="cookies-title">Politique cookies</h2>
          <p>Cette version n’utilise aucun cookie publicitaire, aucun outil de mesure d’audience et aucun traceur soumis au consentement. Aucun bandeau de consentement n’est donc affiché.</p>
          <p>Les photographies de démonstration doivent être remplacées par les réalisations réelles de Soles Travaux avant publication. Elles sont auto-hébergées dans le projet afin de limiter les appels à des services tiers.</p>
          <p>Resend est sollicité uniquement lorsque l’utilisateur envoie volontairement le formulaire. Les e-mails sont transactionnels et ne servent pas à inscrire le demandeur à une liste marketing.</p>
          <p>La carte OpenStreetMap est chargée uniquement lorsque l’internaute approche de la section « Zone d’intervention ». Aucun cookie publicitaire ou de mesure d’audience n’est ajouté par le site. Les règles de confidentialité d’OpenStreetMap s’appliquent aux tuiles cartographiques.</p>
          <p>Les liens vers Google Maps, l’application e-mail ou le téléphone ne s’activent qu’après une action volontaire. Leur utilisation est ensuite régie par les politiques des services choisis par l’utilisateur.</p>
          <p>Si un outil d’analyse, une vidéo ou un autre traceur non essentiel est ajouté ultérieurement, il devra rester bloqué jusqu’au consentement préalable de l’internaute.</p>
          <p className="legal-modal__date">Dernière mise à jour : 19 juillet 2026.</p>
        </article>
      </section>
    </div>
  )
}
