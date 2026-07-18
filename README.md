# Soles Travaux

Site vitrine React, TypeScript et Vite, composé avec shadcn/ui et des interactions inspirées de 21st.dev.

## Lancer le site

```bash
npm install
npm run dev
```

```bash
npm run build
```

## Demandes de devis avec Resend

Le formulaire ne calcule aucun prix : chaque chantier est étudié individuellement. Une fonction Vercel située dans `api/devis.ts` envoie :

- la demande complète à `solestravaux@gmail.com` ;
- une confirmation transactionnelle au demandeur lorsqu’un e-mail est fourni ;
- la préférence de réponse choisie : e-mail, téléphone ou les deux.

Copier `.env.example` vers `.env.local`, puis renseigner :

```env
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL="Soles Travaux <devis@votredomaine.fr>"
QUOTE_RECIPIENT_EMAIL=solestravaux@gmail.com
SITE_URL=https://www.votredomaine.fr
```

La clé Resend reste exclusivement côté serveur. Le domaine d’envoi doit être vérifié dans Resend avec ses enregistrements SPF et DKIM. Les suivis d’ouverture et de clic doivent rester désactivés pour ces messages transactionnels.

Le serveur Vite seul ne simule pas la fonction `/api/devis`. Tester l’envoi avec une prévisualisation ou un déploiement Vercel configuré avec les variables ci-dessus.

## Sécurité

La fonction vérifie l’origine, le format et la taille des données, limite la fréquence des demandes, applique un honeypot antispam et utilise des clés d’idempotence pour éviter les doubles envois. Les dépendances de production passent `npm audit --omit=dev` sans vulnérabilité connue.

## À confirmer avant publication

- domaine définitif et adresse d’envoi Resend ;
- photographies des vrais chantiers ;
- zone d’intervention exacte ;
- assurances, qualifications et avis clients vérifiables ;
- hébergement Vercel définitif dans les mentions légales.

Informations professionnelles intégrées d’après l’attestation RNE fournie : SOLES, SIREN 951 560 846, SIRET 951 560 846 00010, APE 4399C, siège à Arles.
