import type { Language, StageStatus } from './types.js';

const STRINGS = {
  en: {
    passed: 'Passed',
    failed: 'Failed',
    warning: 'Warning',
    not_tested: 'Not tested',
    journeyFailed: '{journey} journey failed',
    journeyRecovered: '{journey} is working again',
    failedAt: 'Failed at',
    error: 'Error',
    likelyCause: 'Likely cause',
    checkedAt: 'Checked at',
    report: 'Health report',
    site: 'Site',
    journey: 'Journey',
    duration: 'Duration',
    details: 'Details',
    evidence: 'Evidence',
    screenshot: 'Screenshot at the moment of failure',
    consoleErrors: 'Browser errors',
    failedRequests: 'Failed requests',
    noProblems: 'All journeys are working.',
    problemFound: 'problem needs attention.',
    problemsFound: 'problems need attention.',
    generated: 'Generated',
    poweredBy: 'Monitored with JourneyGuard',
    discovered: 'Observations',
    lastRun: 'Last check',
    history: 'History',
    noRuns: 'No checks yet. Run "journeyguard run" or wait for the scheduler.',
    runNow: 'Run now',
    monitorDown: 'JourneyGuard cannot run checks',
    monitorDownDetail: 'The last checks could not run, so problems on your sites would go unnoticed. Check the server: the browser may fail to start, the disk may be full, or memory may be too low.',
    monitorUp: 'JourneyGuard is checking again',
    monitorUpDetail: 'Checks are running normally again.',
    running: 'Running…',
    queued: 'Already queued…',
    downloadReport: 'Download report',
    downtime: 'Downtime',
    openDashboard: 'Open dashboard',
    dashboard: 'Dashboard',
    testAlert: 'Test message: you will get an alert here when a journey breaks or recovers',
    alertTest: 'Alert test',
    alertChannel: 'Alert channel',
    justNow: 'just now',
    untested: '«{journey}» could not be tested for a while',
    untestedDetail: 'Every check of this journey since then was stopped before it could finish, so a real problem here would go unnoticed. Let the monitor through, or adjust the journey, and it will be checked again.',
  },
  el: {
    passed: 'Επιτυχία',
    failed: 'Αποτυχία',
    warning: 'Προειδοποίηση',
    not_tested: 'Δεν ελέγχθηκε',
    journeyFailed: 'Πρόβλημα στη διαδρομή «{journey}»',
    journeyRecovered: 'Η διαδρομή «{journey}» λειτουργεί ξανά',
    failedAt: 'Αποτυχία στο βήμα',
    error: 'Σφάλμα',
    likelyCause: 'Πιθανή αιτία',
    checkedAt: 'Έλεγχος',
    report: 'Αναφορά λειτουργίας',
    site: 'Ιστοσελίδα',
    journey: 'Διαδρομή',
    duration: 'Διάρκεια',
    details: 'Λεπτομέρειες',
    evidence: 'Τεχνικά στοιχεία',
    screenshot: 'Στιγμιότυπο οθόνης κατά την αποτυχία',
    consoleErrors: 'Σφάλματα browser',
    failedRequests: 'Αποτυχημένα αιτήματα',
    noProblems: 'Όλες οι διαδρομές λειτουργούν.',
    problemFound: 'πρόβλημα χρειάζεται προσοχή.',
    problemsFound: 'προβλήματα χρειάζονται προσοχή.',
    generated: 'Δημιουργήθηκε',
    poweredBy: 'Παρακολούθηση με JourneyGuard',
    discovered: 'Παρατηρήσεις',
    lastRun: 'Τελευταίος έλεγχος',
    history: 'Ιστορικό',
    noRuns: 'Δεν υπάρχουν έλεγχοι ακόμη. Τρέξτε «journeyguard run» ή περιμένετε τον επόμενο προγραμματισμένο έλεγχο.',
    runNow: 'Έλεγχος τώρα',
    monitorDown: 'Το JourneyGuard δεν μπορεί να κάνει ελέγχους',
    monitorDownDetail: 'Οι τελευταίοι έλεγχοι δεν εκτελέστηκαν, οπότε προβλήματα στις ιστοσελίδες σας θα περνούσαν απαρατήρητα. Ελέγξτε τον server: μπορεί να μην ξεκινά ο browser, να γέμισε ο δίσκος ή να μην επαρκεί η μνήμη.',
    monitorUp: 'Το JourneyGuard ελέγχει ξανά',
    monitorUpDetail: 'Οι έλεγχοι εκτελούνται ξανά κανονικά.',
    running: 'Σε εξέλιξη…',
    queued: 'Ήδη σε αναμονή…',
    downloadReport: 'Λήψη αναφοράς',
    downtime: 'Διάρκεια βλάβης',
    openDashboard: 'Άνοιγμα πίνακα ελέγχου',
    dashboard: 'Πίνακας ελέγχου',
    testAlert: 'Δοκιμαστικό μήνυμα: εδώ θα λαμβάνετε ειδοποίηση όταν μια διαδρομή χαλάσει ή διορθωθεί',
    alertTest: 'Δοκιμή ειδοποιήσεων',
    alertChannel: 'Κανάλι ειδοποιήσεων',
    justNow: 'μόλις τώρα',
    untested: 'Η διαδρομή «{journey}» δεν ελέγχεται εδώ και καιρό',
    untestedDetail: 'Κάθε έλεγχος αυτής της διαδρομής σταματά πριν ολοκληρωθεί, οπότε ένα πραγματικό πρόβλημα εδώ θα περνούσε απαρατήρητο. Επιτρέψτε στον έλεγχο να περάσει ή προσαρμόστε τη διαδρομή, και θα ελέγχεται ξανά κανονικά.',
  },
} as const;

export type MessageKey = keyof (typeof STRINGS)['en'];

export function t(lang: Language, key: MessageKey): string {
  return STRINGS[lang][key] ?? STRINGS.en[key];
}

export function statusLabel(lang: Language, status: StageStatus): string {
  return t(lang, status);
}

export const STATUS_ICON: Record<StageStatus, string> = {
  passed: '✅',
  failed: '❌',
  warning: '⚠️',
  not_tested: '⏸️',
};

/**
 * Step errors are written in English because the diagnosis rules read them. For Greek reports and
 * alerts the most common ones are translated when shown; anything else stays as written.
 */
type Replacement = string | ((...groups: string[]) => string);

/** English names of controls that appear inside step errors. */
const GREEK_LABELS: Record<string, string> = {
  'add to cart button': 'κουμπί «Προσθήκη στο καλάθι»',
  'submit button': 'κουμπί αποστολής της φόρμας',
};
const label = (name: string) => GREEK_LABELS[name] ?? `στοιχείο «${name}»`;
const days = (d: string) => (d === '1' ? '1 ημέρα' : `${d} ημέρες`);

const GREEK_ERRORS: [RegExp, Replacement][] = [
  [/^HTTP (\d+) on (\S+)$/, 'HTTP $1 στη σελίδα $2'],
  [/^Page did not load within (.+?): (\S+)$/, 'Η σελίδα δεν φόρτωσε μέσα σε $1: $2'],
  [/^Could not open (\S+): (.*)$/, 'Δεν ήταν δυνατό να ανοίξει η σελίδα $1: $2'],
  [/^Element not visible after (.+?): (.+)$/, 'Το στοιχείο δεν εμφανίστηκε μέσα σε $1: $2'],
  [/^Element is still visible: (.+)$/, 'Το στοιχείο εμφανίζεται ακόμη: $1'],
  [/^Text "(.*)" did not appear within (.+)$/, 'Το κείμενο «$1» δεν εμφανίστηκε μέσα σε $2'],
  [/^Text "(.*)" did not appear in (.+)$/, 'Το κείμενο «$1» δεν εμφανίστηκε στο $2'],
  [/^Unexpected text on page: "(.*)"$/, 'Εμφανίστηκε κείμενο που δεν έπρεπε: «$1»'],
  [/^URL (\S+) does not match (.+)$/, 'Η διεύθυνση $1 δεν ταιριάζει με το $2'],
  [/^The page stopped responding during this step \(no result after (\d+)s\)$/, 'Η σελίδα σταμάτησε να αποκρίνεται σε αυτό το βήμα (κανένα αποτέλεσμα μετά από $1 δευτερόλεπτα)'],
  [/^Page shows an error: (.+)$/, 'Η σελίδα εμφανίζει σφάλμα: $1'],
  [/^(\d+) script\/style file\(s\) failed to load, e\.g\. (\S+) \((.*)\)$/, (_m, n, url, why) => `Δεν φόρτωσ${n === '1' ? 'ε 1 αρχείο' : `αν ${n} αρχεία`} script/style, π.χ. ${url} (${why})`],
  [/^Clicked "add to cart" but the cart is still empty$/, 'Πατήθηκε η «Προσθήκη στο καλάθι», αλλά το καλάθι έμεινε άδειο'],
  [/^No confirmation that the product was added to the cart$/, 'Δεν εμφανίστηκε επιβεβαίωση ότι το προϊόν μπήκε στο καλάθι'],
  [/^The product options could not be selected.*$/, 'Δεν ήταν δυνατό να επιλεγούν οι επιλογές του προϊόντος: το κουμπί «Προσθήκη στο καλάθι» έμεινε ανενεργό'],
  [/^Checkout sent us back to an empty cart.*$/, 'Το ταμείο οδήγησε πίσω σε άδειο καλάθι: το καλάθι χάθηκε (συνήθως λόγω caching στις σελίδες καλαθιού/ταμείου ή προβλήματος με τα cookies)'],
  [/^Checkout says there are no available payment methods$/, 'Το ταμείο λέει ότι δεν υπάρχουν διαθέσιμοι τρόποι πληρωμής'],
  [/^Checkout shows no payment method to choose$/, 'Το ταμείο δεν εμφανίζει κανέναν τρόπο πληρωμής'],
  [/^Payment methods section did not appear on checkout$/, 'Η ενότητα πληρωμής δεν εμφανίστηκε στο ταμείο'],
  [/^Expected payment method is missing: (.+) \(offered: (.*)\)$/, 'Λείπει ο τρόπος πληρωμής: $1 (διαθέσιμοι: $2)'],
  [/^No product is (?:in stock and purchasable|available for sale).*$/, 'Κανένα προϊόν δεν είναι διαθέσιμο για αγορά'],
  [/^No products found on (\S+)$/, 'Δεν βρέθηκαν προϊόντα στη σελίδα $1'],
  [/^The store has no published products$/, 'Το κατάστημα δεν έχει δημοσιευμένα προϊόντα'],
  [/^The store is password-protected.*$/, 'Το κατάστημα προστατεύεται με κωδικό, οπότε οι πελάτες δεν μπορούν να το δουν'],
  [/^Could not list products \(\/products\.json returned HTTP (\d+)\)$/, 'Δεν ήταν δυνατή η λίστα προϊόντων (το /products.json απάντησε HTTP $1)'],
  [/^Shopify showed a bot challenge on checkout.*$/, 'Το Shopify εμφάνισε έλεγχο κατά των ρομπότ στο ταμείο, οπότε ο έλεγχος δεν μπόρεσε να συνεχίσει'],
  [/^Expected the checkout, but landed on (\S+)$/, 'Αναμενόταν το ταμείο, αλλά άνοιξε η σελίδα $1'],
  [/^Payment section not detected.*$/, 'Δεν εντοπίστηκε η ενότητα πληρωμής· ελέγξτε τη με το χέρι'],
  [/^The form could not send the message: (.+)$/, 'Η φόρμα δεν μπόρεσε να στείλει το μήνυμα: $1'],
  [/^No confirmation message appeared after sending the form$/, 'Δεν εμφανίστηκε μήνυμα επιβεβαίωσης μετά την αποστολή της φόρμας'],
  [/^Confirmation text "(.*)" did not appear$/, 'Δεν εμφανίστηκε το κείμενο επιβεβαίωσης «$1»'],
  [/^No contact form found on (\S+)$/, 'Δεν βρέθηκε φόρμα επικοινωνίας στη σελίδα $1'],
  [/^No form matching (.+) on (\S+)$/, 'Δεν βρέθηκε φόρμα $1 στη σελίδα $2'],
  [/^SSL certificate expires in (\d+) day\(s\)$/, (_m, d) => `Το πιστοποιητικό SSL λήγει ${d === '0' ? 'σήμερα' : d === '1' ? 'αύριο' : `σε ${d} ημέρες`}`],
  [/^SSL certificate expired (\d+) day\(s\) ago$/, (_m, d) => `Το πιστοποιητικό SSL έληξε πριν από ${days(d)}`],
  [/^Site is not served over HTTPS$/, 'Η ιστοσελίδα δεν χρησιμοποιεί HTTPS'],
  [/^The form has a CAPTCHA.*$/, 'Η φόρμα έχει CAPTCHA, οπότε κανένα ρομπότ (ούτε το JourneyGuard) δεν μπορεί να την υποβάλει. Ορίστε submit: false για έλεγχο χωρίς αποστολή, ή χρησιμοποιήστε test key του CAPTCHA σε δοκιμαστικό αντίγραφο του site.'],
  [/^The form's anti-spam or anti-robot check rejected the test \("(.*)"\).*$/, 'Ο έλεγχος anti-spam/anti-robot της φόρμας απέρριψε τη δοκιμή («$1»), οπότε δεν στάλθηκε τίποτα. Επιτρέψτε τη διεύθυνση IP του JourneyGuard στις ρυθμίσεις anti-spam ή ορίστε submit: false, και στείλτε ένα μήνυμα με το χέρι για να βεβαιωθείτε ότι οι πραγματικοί επισκέπτες δεν μπλοκάρονται.'],
  [/^The form treated the test message as spam.*$/, 'Η φόρμα θεώρησε το δοκιμαστικό μήνυμα spam (το μπλόκαρε plugin anti-spam). Επιτρέψτε τη διεύθυνση IP του JourneyGuard στο plugin και βεβαιωθείτε ότι δεν απορρίπτονται πραγματικά μηνύματα.'],
  [/^The form rejected the test input(?:: "(.*)")?\..*$/, (_m, msg) => `Η φόρμα απέρριψε τα δοκιμαστικά στοιχεία${msg ? ` («${msg}»)` : ''}. Ορίστε τι να συμπληρώνεται με την επιλογή «fields».`],
  [/^(.+) blocked the monitor \(HTTP (\d+)\) on (\S+)\..*$/, (_m, who, status, url) =>
    `${who === 'Rate limiting' ? 'Ο περιορισμός αιτημάτων (rate limiting) του server' : `Το ${who}`} μπλόκαρε τον έλεγχο (HTTP ${status}) στη σελίδα ${url}. Επιτρέψτε τη διεύθυνση IP του server όπου τρέχει το JourneyGuard, ή ένα μυστικό header που ορίζετε για το site στο «headers».`],
  [/^Something on the page covers the (.+), so it could not be clicked \((.*)\)\..*$/, (_m, name, el) => `Κάτι στη σελίδα καλύπτει το ${label(name)} και δεν μπορεί να πατηθεί (${el}). Συνήθως είναι cookie banner ή pop-up που δεν έκλεισε.`],
  [/^The cart total is zero.*$/, 'Το σύνολο του καλαθιού είναι μηδέν, οπότε το ταμείο δεν ζητά πληρωμή. Ορίστε productUrl σε προϊόν με τιμή για να ελέγχονται οι τρόποι πληρωμής.'],
  [/^This product loads its options on demand.*$/, 'Το προϊόν φορτώνει τις επιλογές του δυναμικά, οπότε δεν φαίνεται ποιος συνδυασμός είναι διαθέσιμος. Ορίστε productUrl σε απλό προϊόν.'],
];

export function localizeError(text: string, lang: Language): string {
  if (lang !== 'el' || !text) return text;
  for (const [pattern, greek] of GREEK_ERRORS) {
    if (pattern.test(text)) return typeof greek === 'string' ? text.replace(pattern, greek) : text.replace(pattern, greek as (...a: string[]) => string);
  }
  return text;
}

const GREEK_REASONS: Record<string, string> = {
  'no answer within 20 seconds': 'δεν απάντησε μέσα σε 20 δευτερόλεπτα',
  'the address was not found (DNS)': 'η διεύθυνση δεν βρέθηκε (DNS)',
  'the server refused the connection': 'ο server αρνήθηκε τη σύνδεση',
  'the connection was reset': 'η σύνδεση διακόπηκε',
  'this is not a valid web address': 'δεν είναι έγκυρη διεύθυνση ιστοσελίδας',
  'no answer': 'καμία απάντηση',
};

/** Why a site could not be reached, in the reader's language. */
export function localizeReason(text: string, lang: Language): string {
  if (lang !== 'el') return text;
  if (/^SSL certificate problem/.test(text)) return text.replace('SSL certificate problem', 'πρόβλημα με το πιστοποιητικό SSL');
  return GREEK_REASONS[text] ?? text;
}
