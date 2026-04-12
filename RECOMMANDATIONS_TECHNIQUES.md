# \ud83d\ude80 Guide de Pr\u00e9-Lancement \u2014 VicktyKof

Ce document r\u00e9sume les configurations finales et les d\u00e9cisions strat\u00e9giques \u00e0 valider avec la cliente pour assurer le succ\u00e8s du nouveau site.

---

## \ud83d\udce7 1. Gestion des Emails & Communication
Le site envoie des emails automatiques pour chaque r\u00e9servation. Pour le lancement, voici les deux options :

### \u2b50 Option Recommand\u00e9e (Lancement) : Gmail SMTP
*   **Fonctionnement :** Utilise son adresse `victykoff@gmail.com`.
*   **Avantages :** Gratuit, simple, et elle peut voir les mails envoy\u00e9s dans ses "Messages envoy\u00e9s".
*   **Action Cliente :** Elle doit activer la validation en deux \u00e9tapes sur son compte Google et te fournir un **"Mot de passe d'application"**.

### \ud83d\udcc8 Option Evolution : Service Professionnel (Resend)
*   **Fonctionnement :** N\u00e9cessite un nom de domaine (ex: `info@vicktykof.ca`).
*   **Avantages :** Image de marque 100% pro, aucune chance de finir en spam.
*   **D\u00e9cision :** \u00c0 envisager si le volume de r\u00e9servations d\u00e9passe 20/jour.

> [!IMPORTANT]
> **Validation Interac :** Actuellement, l'email pour les virements est `VictyKof@yahoo.fr`. Souhaite-t-elle le changer pour son nouveau Gmail (`victykoff@gmail.com`) afin de tout centraliser ?

---

## \ud83d\udcb3 2. Encaisser les Paiements (Stripe)
Le syst\u00e9me de d\u00e9p\u00f4t est pr\u00eat \u00e0 l'emploi.

*   **Mode "Live" :** Pour recevoir le vrai argent des clientes, elle doit fournir ses **Cl\u00e9s API Live** depuis son tableau de bord Stripe.
*   **Virement Bancaire :** Stripe d\u00e9posera automatiquement l'argent sur son compte bancaire (pr\u00e9voir 2-3 jours ouvrables).

---

## \ud83c\udf10 3. Identit\u00e9 Num\u00e9rique (Domaine)
Le site est pr\u00eat, mais il lui faut son "adresse de luxe" sur le web.

*   **Choix sugg\u00e9r\u00e9 :** `vicktykof.ca` (id\u00e9al pour le Qu\u00e9bec).
*   **Action :** Elle doit acheter ce nom de domaine (environ 15$/an) sur une plateforme comme GoDaddy ou WHC.ca.

---

## \ud83d\udccc 4. Validation des Informations Finales
Voici ce qui est actuellement configur\u00e9 en dur sur le site :

| Information | Valeur actuelle | Statut |
| :--- | :--- | :--- |
| **Email de contact** | `victykoff@gmail.com` | \u2705 Valid\u00e9 |
| **T\u00e9l\u00e9phone** | `(581) 745-7409` | \u2705 Valid\u00e9 |
| **Adresse** | `2177 rue du Carrousel, Qu\u00e9bec` | \u2705 Valid\u00e9 |
| **WhatsApp** | Connect\u00e9 avec message personnalis\u00e9 | \u2705 Valid\u00e9 |

---

## \ud83d\udcc5 5. Prochaines \u00c9tapes
1.  **Rencontre de validation** : Passer en revue ce document avec elle.
2.  **R\u00e9cup\u00e9ration des cl\u00e9s** : R\u00e9cup\u00e9rer son App Password Gmail et ses cl\u00e9s Stripe.
3.  **Mise en ligne** : D\u00e9ploiement final sur son nom de domaine.
