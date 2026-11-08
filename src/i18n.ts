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
  es: {
    passed: 'Correcto',
    failed: 'Fallido',
    warning: 'Advertencia',
    not_tested: 'No comprobado',
    journeyFailed: 'El recorrido de {journey} ha fallado',
    journeyRecovered: '{journey} vuelve a funcionar',
    failedAt: 'Falló en',
    error: 'Error',
    likelyCause: 'Causa probable',
    checkedAt: 'Comprobado el',
    report: 'Informe de estado',
    site: 'Sitio',
    journey: 'Recorrido',
    duration: 'Duración',
    details: 'Detalles',
    evidence: 'Pruebas',
    screenshot: 'Captura en el momento del fallo',
    consoleErrors: 'Errores del navegador',
    failedRequests: 'Solicitudes fallidas',
    noProblems: 'Todos los recorridos funcionan.',
    problemFound: 'problema necesita atención.',
    problemsFound: 'problemas necesitan atención.',
    generated: 'Generado',
    poweredBy: 'Monitorizado con JourneyGuard',
    discovered: 'Observaciones',
    lastRun: 'Última comprobación',
    history: 'Historial',
    noRuns: 'Aún no hay comprobaciones. Ejecuta "journeyguard run" o espera al programador.',
    runNow: 'Comprobar ahora',
    monitorDown: 'JourneyGuard no puede realizar comprobaciones',
    monitorDownDetail: 'Las últimas comprobaciones no se pudieron ejecutar, así que los problemas de tus sitios pasarían desapercibidos. Revisa el servidor: el navegador podría no iniciar, el disco estar lleno o no haber suficiente memoria.',
    monitorUp: 'JourneyGuard vuelve a comprobar',
    monitorUpDetail: 'Las comprobaciones vuelven a ejecutarse con normalidad.',
    running: 'Ejecutando…',
    queued: 'Ya está en cola…',
    downloadReport: 'Descargar informe',
    downtime: 'Tiempo sin funcionar',
    openDashboard: 'Abrir el panel',
    dashboard: 'Panel',
    testAlert: 'Mensaje de prueba: aquí recibirás un aviso cuando un recorrido falle o se recupere',
    alertTest: 'Prueba de alertas',
    alertChannel: 'Canal de alertas',
    justNow: 'ahora mismo',
    untested: '«{journey}» lleva tiempo sin poder comprobarse',
    untestedDetail: 'Desde entonces, cada comprobación de este recorrido se detiene antes de terminar, así que un problema real aquí pasaría desapercibido. Deja pasar la comprobación o ajusta el recorrido, y volverá a comprobarse con normalidad.',
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
 * Step errors are written in English because the diagnosis rules read them. For Greek and Spanish
 * reports and alerts the most common ones are translated when shown; anything else stays as written.
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
  [/^No product can be added to the cart directly.*$/, 'Κανένα προϊόν δεν μπαίνει απευθείας στο καλάθι (μόνο εξωτερικά ή ομαδοποιημένα προϊόντα). Ορίστε στο productUrl ένα προϊόν που αγοράζουν οι πελάτες από εδώ.'],
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

const SPANISH_ERRORS: [RegExp, Replacement][] = [
  [/^HTTP (\d+) on (\S+)$/, 'HTTP $1 en la página $2'],
  [/^Page did not load within (.+?): (\S+)$/, 'La página no cargó en $1: $2'],
  [/^Could not open (\S+): (.*)$/, 'No se pudo abrir la página $1: $2'],
  [/^Element not visible after (.+?): (.+)$/, 'El elemento no apareció en $1: $2'],
  [/^Element is still visible: (.+)$/, 'El elemento sigue visible: $1'],
  [/^Text "(.*)" did not appear within (.+)$/, 'El texto «$1» no apareció en $2'],
  [/^Text "(.*)" did not appear in (.+)$/, 'El texto «$1» no apareció en $2'],
  [/^Unexpected text on page: "(.*)"$/, 'Apareció un texto que no debía: «$1»'],
  [/^URL (\S+) does not match (.+)$/, 'La dirección $1 no coincide con $2'],
  [/^The page stopped responding during this step \(no result after (\d+)s\)$/, 'La página dejó de responder en este paso (sin resultado tras $1 segundos)'],
  [/^Page shows an error: (.+)$/, 'La página muestra un error: $1'],
  [/^(\d+) script\/style file\(s\) failed to load, e\.g\. (\S+) \((.*)\)$/, (_m, n, url, why) => `No ${n === '1' ? 'cargó 1 archivo' : `cargaron ${n} archivos`} de script/estilo, por ejemplo ${url} (${why})`],
  [/^Clicked "add to cart" but the cart is still empty$/, 'Se pulsó «añadir al carrito», pero el carrito sigue vacío'],
  [/^No confirmation that the product was added to the cart$/, 'No apareció confirmación de que el producto se añadiera al carrito'],
  [/^The product options could not be selected.*$/, 'No se pudieron elegir las opciones del producto: el botón «añadir al carrito» siguió desactivado'],
  [/^Checkout sent us back to an empty cart.*$/, 'El proceso de compra volvió a un carrito vacío: se perdió el carrito (normalmente por la caché de las páginas de carrito y pago o por las cookies)'],
  [/^Checkout says there are no available payment methods$/, 'El proceso de compra indica que no hay métodos de pago disponibles'],
  [/^Checkout shows no payment method to choose$/, 'El proceso de compra no muestra ningún método de pago'],
  [/^Payment methods section did not appear on checkout$/, 'La sección de métodos de pago no apareció en el proceso de compra'],
  [/^Expected payment method is missing: (.+) \(offered: (.*)\)$/, 'Falta el método de pago: $1 (disponibles: $2)'],
  [/^No product is (?:in stock and purchasable|available for sale).*$/, 'No hay ningún producto disponible para comprar'],
  [/^No products found on (\S+)$/, 'No se encontraron productos en $1'],
  [/^The store has no published products$/, 'La tienda no tiene productos publicados'],
  [/^The store is password-protected.*$/, 'La tienda está protegida con contraseña, así que los clientes no pueden verla'],
  [/^Shopify showed a bot challenge on checkout.*$/, 'Shopify mostró una comprobación contra robots en el pago, así que la comprobación no pudo continuar'],
  [/^Expected the checkout, but landed on (\S+)$/, 'Se esperaba el proceso de compra, pero se abrió $1'],
  [/^The form could not send the message: (.+)$/, 'El formulario no pudo enviar el mensaje: $1'],
  [/^No confirmation message appeared after sending the form$/, 'No apareció un mensaje de confirmación después de enviar el formulario'],
  [/^Confirmation text "(.*)" did not appear$/, 'No apareció el texto de confirmación «$1»'],
  [/^No contact form found on (\S+)$/, 'No se encontró ningún formulario de contacto en $1'],
  [/^No form matching (.+) on (\S+)$/, 'No se encontró el formulario $1 en $2'],
  [/^SSL certificate expires in (\d+) day\(s\)$/, (_m, d) => `El certificado SSL caduca ${d === '0' ? 'hoy' : d === '1' ? 'mañana' : `en ${d} días`}`],
  [/^SSL certificate expired (\d+) day\(s\) ago$/, (_m, d) => `El certificado SSL caducó hace ${d === '1' ? '1 día' : `${d} días`}`],
  [/^Site is not served over HTTPS$/, 'El sitio no se sirve mediante HTTPS'],
  [/^The form has a CAPTCHA.*$/, 'El formulario tiene un CAPTCHA, así que ningún robot (tampoco JourneyGuard) puede enviarlo. Usa submit: false para comprobarlo sin enviar, o una clave de prueba del CAPTCHA en una copia de pruebas del sitio.'],
  [/^The form's anti-spam or anti-robot check rejected the test \("(.*)"\).*$/, 'La protección antispam o antirrobots del formulario rechazó la prueba («$1»), así que no se envió nada. Permite la dirección IP de JourneyGuard en los ajustes antispam o usa submit: false, y envía un mensaje manualmente para comprobar que no se bloquea a los visitantes reales.'],
  [/^The form treated the test message as spam.*$/, 'El formulario consideró spam el mensaje de prueba (lo bloqueó un plugin antispam). Permite la dirección IP de JourneyGuard en el plugin y comprueba que no se rechacen mensajes reales.'],
  [/^The form rejected the test input(?:: "(.*)")?\..*$/, (_m, msg) => `El formulario rechazó los datos de prueba${msg ? ` («${msg}»)` : ''}. Indica qué rellenar con la opción «fields».`],
  [/^(.+) blocked the monitor \(HTTP (\d+)\) on (\S+)\..*$/, (_m, who, status, url) =>
    `${who === 'Rate limiting' ? 'La limitación de solicitudes (rate limiting) del servidor' : who} bloqueó la comprobación (HTTP ${status}) en ${url}. Permite la dirección IP del servidor donde funciona JourneyGuard, o un encabezado secreto que configures para el sitio en «headers».`],
  [/^Something on the page covers the (.+), so it could not be clicked \((.*)\)\..*$/, (_m, name, el) => `Algo en la página cubre ${name === 'add to cart button' ? 'el botón «añadir al carrito»' : name === 'submit button' ? 'el botón de envío del formulario' : `«${name}»`} y no se puede pulsar (${el}). Normalmente es un banner de cookies o una ventana emergente que no se cerró.`],
  [/^The cart total is zero.*$/, 'El total del carrito es cero, así que el proceso de compra no solicita el pago. Indica productUrl con un producto que tenga precio para comprobar los métodos de pago.'],
  [/^This product loads its options on demand.*$/, 'El producto carga sus opciones dinámicamente, así que no se puede saber qué combinación está disponible. Indica productUrl con un producto sencillo.'],
  [/^Could not list products \(\/products\.json returned HTTP (\d+)\)$/, 'No se pudo obtener la lista de productos (/products.json respondió HTTP $1)'],
  [/^Payment section not detected.*$/, 'No se detectó la sección de pago; compruébala manualmente'],
  [/^No product can be added to the cart directly.*$/, 'Ningún producto se puede añadir directamente al carrito (solo productos externos o agrupados). Indica productUrl con un producto que se compre aquí.'],
];

export function localizeError(text: string, lang: Language): string {
  if (!text) return text;
  const table = lang === 'el' ? GREEK_ERRORS : lang === 'es' ? SPANISH_ERRORS : undefined;
  if (!table) return text;
  for (const [pattern, translation] of table) {
    if (pattern.test(text)) return typeof translation === 'string' ? text.replace(pattern, translation) : text.replace(pattern, translation as (...a: string[]) => string);
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

const SPANISH_REASONS: Record<string, string> = {
  'no answer within 20 seconds': 'no respondió en 20 segundos',
  'the address was not found (DNS)': 'no se encontró la dirección (DNS)',
  'the server refused the connection': 'el servidor rechazó la conexión',
  'the connection was reset': 'se cortó la conexión',
  'this is not a valid web address': 'no es una dirección web válida',
  'no answer': 'sin respuesta',
};

/** Why a site could not be reached, in the reader's language. */
export function localizeReason(text: string, lang: Language): string {
  if (lang === 'es') return /^SSL certificate problem/.test(text) ? text.replace('SSL certificate problem', 'problema con el certificado SSL') : (SPANISH_REASONS[text] ?? text);
  if (lang !== 'el') return text;
  if (/^SSL certificate problem/.test(text)) return text.replace('SSL certificate problem', 'πρόβλημα με το πιστοποιητικό SSL');
  return GREEK_REASONS[text] ?? text;
}
