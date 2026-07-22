# Rapport d’audit complet — Soles Travaux

Date : 19 juillet 2026  
Périmètre : code React/TypeScript, API de devis Resend, configuration Vercel, SEO, performances, UX/UI, accessibilité et conformité éditoriale.  
Version auditée : branche `agent/portfolio-logo-polish`, après corrections demandées.

## 1. Synthèse

Le site est cohérent, professionnel et techniquement sain. Les défauts visibles signalés ont été corrigés : typographie unifiée, structure du manifeste recadrée, coordonnées regroupées, pictogrammes métiers remplacés, portfolio nettoyé et discours clarifié. L’API de devis a également été durcie.

| Axe | Score | État |
|---|---:|---|
| SEO | 93/100 | Très bon socle local |
| Performance | 87/100 | Bon, avec marge sur le JavaScript et les images |
| UX / UI | 93/100 | Cohérent et orienté conversion |
| Qualité front-end | 92/100 | Structure propre et build validé |
| Sécurité | 89/100 | Solide, deux protections d’infrastructure restent à finaliser |
| Accessibilité | 91/100 | Bonne structure, amélioration possible sur les modales |
| **Note globale** | **91/100** | **Prêt pour production sous réserves listées en priorité 1** |

## 2. Méthode et références

L’audit croise :

- le guide interne `docs/contenu-site.md` fourni par le propriétaire du projet ;
- les principes de revue de sécurité Anthropic/Claude : contrôle avant commit, moindre privilège, limitation des accès réseau, isolation des secrets et rotation en cas de fuite ;
- les recommandations OWASP sur la validation serveur, la revue de code et les en-têtes HTTP ;
- les recommandations Vercel sur les en-têtes et la limitation de débit au niveau du pare-feu.

Références officielles :

- [Anthropic — Automated security reviews in Claude Code](https://support.claude.com/en/articles/11932705-automated-security-reviews-in-claude-code)
- [Anthropic — Security for self-hosted sandboxes](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes-security)
- [Anthropic — Authentication and API key security](https://platform.claude.com/docs/en/manage-claude/authentication)
- [OWASP — Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OWASP — HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [OWASP — Secure Code Review Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html)
- [Vercel — WAF Rate Limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)
- [Vercel — Headers](https://vercel.com/docs/headers)

## 3. Corrections réalisées

### Direction artistique et structure

- Tous les grands titres utilisent désormais **Barlow Condensed**, y compris les mots dorés. Geist reste réservé au texte courant et aux éléments d’interface.
- Le numéro isolé « 01 » du manifeste a été supprimé. « Notre exigence » devient un vrai repère éditorial aligné avec les autres sections.
- Le bloc téléphone / e-mail / atelier est regroupé dans une seule structure cadrée, lisible et responsive.
- Les anciens pictogrammes génériques ont été remplacés par des icônes techniques : maçonnerie, toiture, dessin de charpente, panneaux, carrelage et rouleau de façade.
- Les cartes services, le portfolio, la FAQ et le devis suivent désormais la même grammaire visuelle.

### Portfolio et véracité du contenu

- Toute mention visible du fournisseur d’images et tous les liens sortants associés ont été retirés.
- Le contenu ne prétend pas que les images d’ambiance sont des chantiers Soles Travaux.
- La formulation retenue indique clairement qu’il s’agit d’une galerie d’inspiration en attente de photographies de chantiers.
- Point de vigilance : conserver en interne les preuves de provenance et de droits d’usage des fichiers actuels, puis les remplacer par des photos autorisées de chantiers réels.

### Sécurité de l’API de devis

- Rejet des JSON `null`, tableaux et objets invalides.
- Validation stricte des types et tailles avant nettoyage.
- Remplacement de l’opérateur `in` par `hasOwnProperty` pour empêcher l’acceptation de clés héritées telles que `toString`.
- Contrôle serveur de la surface entre 1 et 10 000 m².
- Contrôle de l’origine et de `Sec-Fetch-Site` contre les envois intersites depuis un navigateur.
- Délai anti-robot minimal de 1,2 seconde, en complément du champ honeypot.
- Limitation de débit avec réponse `429` et en-tête `Retry-After`.
- En-tête `Allow: POST` sur les méthodes refusées.
- Taille du corps limitée à 20 Ko et contenu JSON obligatoire.
- Échappement HTML avant composition des e-mails.
- Clés d’idempotence distinctes pour le message entreprise et la confirmation client.
- Réponses API en `no-store`, sans détails de pile ni secret.

### En-têtes de sécurité

La configuration comprend maintenant :

- CSP restrictive : `default-src 'self'`, scripts limités, attributs script interdits, cadres, objets, médias et workers désactivés ;
- styles externes limités à l’origine et styles d’attribut autorisés uniquement pour Motion/Leaflet ;
- `frame-ancestors 'none'` et `X-Frame-Options: DENY` ;
- HSTS ;
- `X-Content-Type-Options: nosniff` ;
- `Referrer-Policy: strict-origin-when-cross-origin` ;
- `Permissions-Policy` restrictive ;
- `Cross-Origin-Opener-Policy: same-origin`.

## 4. Preuves de vérification

### Build et dépendances

- `npm run build` : réussi.
- TypeScript : aucune erreur.
- Vite : 2 053 modules transformés.
- JavaScript principal : 417,96 Ko brut / 133,79 Ko gzip.
- Carte chargée séparément : 156,97 Ko brut / 46,15 Ko gzip.
- CSS principal : 52,75 Ko brut / 11,77 Ko gzip.
- `npm audit` : **0 vulnérabilité** sur 190 dépendances analysées.
- Scan des fichiers suivis : aucun secret réel détecté ; uniquement les valeurs factices documentées.

### Tests API sans envoi d’e-mail

| Cas | Résultat attendu | Résultat |
|---|---:|---:|
| Méthode GET | 405 + `Allow: POST` | Conforme |
| JSON `null` | 400 | Conforme |
| JSON tableau | 400 | Conforme |
| Service `toString` | 400 | Conforme |
| Surface 10 001 m² | 400 | Conforme |
| Envoi robot immédiat | 400 | Conforme |
| Honeypot rempli | 200 silencieux, aucun e-mail | Conforme |

### Vérification navigateur

- Page chargée avec contenu réel, sans écran vide ni erreur Vite.
- Aucune erreur ou alerte console.
- Rendu contrôlé en 1 440 × 1 000 et en viewport mobile 390 × 844.
- Aucun débordement horizontal mobile.
- Un seul H1.
- Aucune image sans attribut `alt`.
- Aucun champ de formulaire sans libellé.
- Aucun bouton sans nom accessible.
- Aucun identifiant HTML dupliqué.
- Le filtre portfolio passe correctement à « Toiture » et affiche quatre cartes après la transition.
- Aucun texte « Pexels » visible.

## 5. Audit détaillé

### SEO — 93/100

**Points forts**

- Titre, description, canonical, Open Graph, Twitter Card et langue française présents.
- Données structurées `HomeAndConstructionBusiness`, catalogue de services, zone de 70 km et FAQ.
- Coordonnées, SIREN et services cohérents entre le site et les mentions.
- `robots.txt` et `sitemap.xml` valides.
- Un H1 descriptif et hiérarchie H2/H3 cohérente.
- Images nommées, dimensions déclarées, `alt` descriptifs et format WebP.

**Améliorations**

- Quand un domaine définitif sera choisi, remplacer toutes les URL canoniques du sous-domaine Vercel.
- Pour gagner des positions locales, créer plus tard de vraies pages indexables par service et zone, plutôt que des ancres uniquement.
- Ne pas ajouter d’avis, notes, délais garantis ou labels sans preuve documentaire.

### Performance — 87/100

**Points forts**

- Carte Leaflet chargée en module séparé et seulement à l’approche de la section.
- Images auto-hébergées en WebP, dimensions explicites et chargement différé hors hero.
- Polices auto-hébergées.
- Cache immutable pour les assets versionnés et cache spécifique pour les images.
- Aucun source map de production.

**Améliorations**

- Réduire le bundle principal sous 110 Ko gzip lors d’une prochaine passe, notamment en réévaluant Motion sur les effets secondaires.
- Produire plusieurs tailles `srcset` pour le hero et les images du portfolio.
- Remplacer les PNG du logo par une version SVG propre si le fichier source vectoriel devient disponible.

### UX / UI — 93/100

**Points forts**

- Navigation claire, téléphone visible, CTA devis présent aux moments utiles.
- Typographie maintenant homogène : condensée pour l’éditorial, Geist pour l’interface.
- Palette noir/or/blanc respectée.
- Chronologie de la méthode simple et lisible.
- Formulaire transparent : aucun faux prix automatique, choix e-mail/téléphone/les deux.
- Transitions compatibles avec `prefers-reduced-motion`.

**Améliorations**

- Remplacer les images d’ambiance par des chantiers réels pour augmenter la confiance.
- Ajouter uniquement des preuves vérifiables : assurances, qualifications ou avis réels.

### Qualité front-end — 92/100

**Points forts**

- React 19 + TypeScript, composants séparés, typage du portfolio et options contrôlées.
- Pas de `dangerouslySetInnerHTML`, `eval`, `new Function` ou écriture DOM risquée.
- Liens externes protégés avec `noopener noreferrer`.
- Build reproductible et configuration Vercel versionnée.
- Composants lourds chargés paresseusement.

**Améliorations**

- Ajouter une petite suite de tests automatisés pour l’API et les composants critiques.
- Ajouter un contrôle CI : build, audit de dépendances et tests de validation avant déploiement.

### Sécurité — 89/100

**Points forts**

- Secrets uniquement côté serveur et exclus de Git.
- Validation serveur indépendante de la validation navigateur.
- Défenses multicouches : taille, type, origine, fetch metadata, honeypot, délai, débit, idempotence.
- HTML échappé et réponses d’erreur sobres.
- CSP et en-têtes de sécurité robustes.
- Aucune base, authentification, téléversement ou espace administrateur exposé.
- Zéro vulnérabilité npm connue au jour de l’audit.

**Risques résiduels**

1. **Important — limitation de débit distribuée.** La Map en mémoire protège une instance, mais pas l’ensemble des instances Vercel. Ajouter une règle Vercel WAF sur `/api/devis`, idéalement par IP, puis conserver la limite applicative comme seconde couche.
2. **Important — authentification e-mail.** Vérifier le domaine d’envoi Resend et configurer SPF, DKIM et DMARC. Ne jamais utiliser une adresse Gmail comme expéditeur non vérifié ; Gmail reste uniquement destinataire ou `reply-to`.
3. **Important — conservation RGPD.** Formaliser une procédure de suppression dans la boîte e-mail et Resend correspondant à la durée annoncée. Le texte juridique seul ne supprime aucune donnée.
4. **Modéré — requêtes non navigateur.** L’absence d’en-tête `Origin` reste acceptée pour compatibilité. Un client automatisé peut donc appeler l’endpoint ; le WAF distribué est la protection complémentaire attendue.
5. **Faible — `style-src-attr 'unsafe-inline'`.** Requis actuellement par Motion et Leaflet. Le risque est borné par l’absence d’injection HTML et par le reste de la CSP.

### Accessibilité — 91/100

**Points forts**

- Lien d’évitement vers le contenu principal.
- Structure sémantique, un seul H1, niveaux de titres cohérents.
- Libellés de formulaire, états `aria-pressed`, régions et messages de statut.
- Images alternatives présentes.
- Navigation mobile nommée.
- Réduction des animations respectée.
- Aucun débordement horizontal au breakpoint testé.

**Améliorations**

- Les panneaux juridiques basés sur `:target` devraient, à terme, gérer le focus initial, le retour du focus et la touche Échap comme de vraies modales.
- Faire un contrôle manuel clavier complet et un test avec lecteur d’écran avant une campagne de trafic importante.

## 6. Plan d’action priorisé

### Priorité 1 — avant acquisition de trafic

1. Configurer le rate limiting Vercel WAF sur `/api/devis`.
2. Vérifier le domaine Resend et publier SPF/DKIM/DMARC.
3. Définir et appliquer la procédure de conservation/suppression des demandes.
4. Remplacer progressivement les images d’ambiance par des photographies autorisées de vrais chantiers.

### Priorité 2 — prochaine itération

1. Ajouter des tests automatisés API et une CI GitHub.
2. Optimiser le bundle JavaScript principal et générer des images responsives.
3. Transformer les fenêtres juridiques en modales avec gestion complète du focus.

### Priorité 3 — croissance SEO

1. Brancher le domaine final et mettre à jour canonical, sitemap, JSON-LD et images sociales.
2. Créer des pages de services locales avec contenu original et preuves réelles.
3. Ajouter des avis uniquement depuis une source vérifiable et avec consentement.

## 7. Conclusion

Le site est prêt à être publié et utilisé pour recevoir des demandes de devis. Les protections applicatives sont sérieuses et proportionnées à un site vitrine sans compte client ni paiement. Le principal point restant n’est pas un défaut de code : il faut déplacer une partie de la défense anti-abus au niveau du WAF Vercel et finaliser l’authentification du domaine e-mail.

Ce rapport est un audit technique et éditorial ; il ne remplace pas une consultation juridique ou un test d’intrusion professionnel.
