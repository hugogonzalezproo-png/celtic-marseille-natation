// =========================================================
// INFOS DU CLUB : c'est le seul fichier à modifier à chaque saison.
// Les pages École, Adultes et Adhérer se remplissent toutes seules à partir d'ici.
// =========================================================

const CLUB = {
  season: '2025-2026',

  phone: {
    display: '07 84 88 31 46',
    sms: '+33784883146',
    whatsapp: '33784883146',
  },

  // Liens de paiement HelloAsso. Tant qu'ils sont vides, le bouton d'adhésion
  // envoie une demande par SMS ou WhatsApp. Coller ici le lien du formulaire
  // d'adhésion HelloAsso (un lien commun, ou un lien par groupe).
  payLinks: {
    default: '',
    // eveil: 'https://www.helloasso.com/associations/celtic-marseille-natation/adhesions/...',
  },
};

// Piscines : clé courte, nom affiché et couleur de la pastille.
const POOLS = {
  fv: { name: 'Frais Vallon', color: 'var(--sky)' },
  va: { name: 'Vallier', color: 'var(--pink)' },
  sc: { name: 'Saint-Charles', color: 'var(--orange)' },
  de: { name: 'Desautel', color: 'var(--navy)' },
  sea: { name: 'Eau libre', color: '#14a38b' },
};

// Groupes. prices : nombre de séances par semaine → tarif annuel (adhésion + licence FFN incluses).
const GROUPS = [
  {
    id: 'eveil', who: 'enfant', name: 'Éveil 1 & 2',
    goal: 'Découvrir le milieu aquatique',
    forWho: "Ne sait pas encore nager ou n'est pas à l'aise dans l'eau",
    prices: { 1: 260 },
    slots: [
      { day: 'Samedi', time: '13h45 – 14h30', pool: 'fv' },
      { day: 'Samedi', time: '16h00 – 16h45', pool: 'va' },
      { day: 'Samedi', time: '17h00 – 17h45', pool: 'va' },
    ],
  },
  {
    id: 'en1', who: 'enfant', name: 'EN1',
    goal: 'Se déplacer seul, découvrir les nages',
    forWho: 'Flotte et se déplace seul sur quelques mètres',
    prices: { 1: 260, 2: 420 },
    slots: [
      { day: 'Mercredi', time: '17h15 – 18h00', pool: 'va' },
      { day: 'Samedi', time: '9h45 – 10h30', pool: 'va' },
      { day: 'Samedi', time: '14h00 – 14h45', pool: 'fv' },
    ],
  },
  {
    id: 'en2', who: 'enfant', name: 'EN2',
    goal: 'Apprendre les nages',
    forWho: 'Nage seul, veut apprendre les différentes nages',
    prices: { 2: 420 },
    slots: [
      { day: 'Mercredi', time: '18h00 – 18h45', pool: 'va' },
      { day: 'Samedi', time: '10h30 – 11h15', pool: 'va' },
      { day: 'Samedi', time: '14h45 – 15h30', pool: 'fv' },
    ],
  },
  {
    id: 'en3', who: 'enfant', name: 'EN3',
    goal: 'Perfectionner les quatre nages',
    forWho: 'Connaît plusieurs nages, veut se perfectionner',
    prices: { 2: 420 },
    slots: [
      { day: 'Mardi', time: '19h00 – 20h00', pool: 'fv' },
      { day: 'Mercredi', time: '18h00 – 19h00', pool: 'va' },
      { day: 'Samedi', time: '14h30 – 15h30', pool: 'fv' },
    ],
  },
  {
    id: 'debutant', who: 'adulte', name: 'Débutants',
    goal: "Apprendre à nager, prendre confiance dans l'eau",
    forWho: "Ne sait pas nager ou manque d'aisance dans l'eau",
    prices: { 1: 260 },
    slots: [
      { day: 'Vendredi', time: '20h30 – 21h15', pool: 'sc' },
    ],
  },
  {
    id: 'perf', who: 'adulte', name: 'Perfectionnement',
    goal: 'Améliorer sa technique et son endurance',
    forWho: 'Sait nager, veut progresser en technique et en endurance',
    prices: { 1: 260, 2: 420 },
    slots: [
      { day: 'Lundi', time: '20h30 – 21h30', pool: 'de' },
      { day: 'Vendredi', time: '20h30 – 21h30', pool: 'fv' },
      { day: 'Samedi', time: '11h00 – 12h00', pool: 'fv' },
    ],
  },
  {
    id: 'masters', who: 'adulte', name: 'Masters', featured: true,
    goal: '3 entraînements par semaine, compétitions FFN et eau libre',
    forWho: "S'entraîne 3 fois par semaine, compétitions et eau libre",
    prices: { 3: 420 },
    slots: [
      { day: 'Mardi', time: '20h30 – 21h30', pool: 'fv' },
      { day: 'Jeudi', time: '20h30 – 21h30', pool: 'fv' },
      { day: 'Samedi', time: '9h00 – 10h00', pool: 'va' },
      { day: '+', time: 'Sorties en mer', pool: 'sea' },
    ],
  },
];

const SESSION_LABELS = { 1: '1 séance / sem.', 2: '2 séances / sem.', 3: '3 séances + eau libre' };
