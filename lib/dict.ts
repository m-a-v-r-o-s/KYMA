export type Lang = "en" | "el";

type Dict = Record<string, { en: string; el: string }>;

export const AMENITIES = [
  { en: "Private infinity pool", el: "Ιδιωτική πισίνα υπερχείλισης", icon: "pool" },
  { en: "Direct sea views", el: "Θέα στη θάλασσα", icon: "view" },
  { en: "4 en-suite bedrooms", el: "4 υπνοδωμάτια με μπάνιο", icon: "bed" },
  { en: "Fully equipped kitchen", el: "Πλήρως εξοπλισμένη κουζίνα", icon: "kitchen" },
  { en: "Air-conditioning & Wi-Fi", el: "Κλιματισμός & Wi-Fi", icon: "wifi" },
  { en: "Daily housekeeping option", el: "Καθημερινή καθαριότητα (κατ' επιλογή)", icon: "clean" },
  { en: "Private parking", el: "Ιδιωτικό πάρκινγκ", icon: "car" },
  { en: "Optional private chef", el: "Ιδιωτικός σεφ (κατ' επιλογή)", icon: "chef" },
];

export const AREA = [
  {
    en: "Kolymbithres beach, 6 min",
    el: "Παραλία Κολυμπήθρες, 6'",
    descEn: "Sculpted granite coves and shallow turquoise water, a short drive away.",
    descEl: "Γλυπτοί βράχοι και ρηχά τιρκουάζ νερά, λίγα λεπτά μακριά.",
  },
  {
    en: "Naoussa village, 10 min",
    el: "Νάουσα, 10'",
    descEn: "A picture-perfect fishing harbour with tavernas and boutique bars.",
    descEl: "Γραφικό ψαρολίμανο με ταβέρνες και μπαρ.",
  },
  {
    en: "Parikia & port, 15 min",
    el: "Παροικία & λιμάνι, 15'",
    descEn: "The island's capital and ferry gateway to the Cyclades.",
    descEl: "Η πρωτεύουσα του νησιού και η πύλη για τις Κυκλάδες.",
  },
];

export const EXPERIENCES = [
  {
    key: "boat",
    en: "Private boat cruise",
    el: "Ιδιωτική κρουαζιέρα",
    descEn: "Charter a private boat with skipper to hidden coves and beaches reachable only from the sea.",
    descEl: "Ιδιωτικό σκάφος με καπετάνιο σε κρυφούς όρμους και παραλίες προσβάσιμες μόνο από τη θάλασσα.",
    price: 600,
    unitEn: "day",
    unitEl: "ημέρα",
  },
  {
    key: "sailing",
    en: "Sunset sailing trip",
    el: "Ιστιοπλοΐα στο ηλιοβασίλεμα",
    descEn: "Half-day sail around the bay with swim stops, drinks and the Aegean sunset.",
    descEl: "Ημερήσιο ιστιοπλοϊκό ταξίδι με στάσεις για μπάνιο, ποτά και το ηλιοβασίλεμα του Αιγαίου.",
    price: 90,
    unitEn: "person",
    unitEl: "άτομο",
  },
  {
    key: "atv",
    en: "ATV & quad adventure",
    el: "Ενοικίαση ATV & γουρούνα",
    descEn: "Explore the island's backroads, ridge-top views and remote beaches on your own ATV.",
    descEl: "Εξερευνήστε τα μονοπάτια, τις θέες και τις απομακρυσμένες παραλίες με τη δική σας γουρούνα.",
    price: 45,
    unitEn: "day",
    unitEl: "ημέρα",
  },
  {
    key: "windsurf",
    en: "Windsurf & water sports",
    el: "Windsurf & θαλάσσια σπορ",
    descEn: "Paros is a windsurfing capital. Lessons and rentals for every level at Golden Beach.",
    descEl: "Η Πάρος είναι πρωτεύουσα του windsurf. Μαθήματα και ενοικιάσεις για κάθε επίπεδο στη Χρυσή Ακτή.",
    price: 40,
    unitEn: "hour",
    unitEl: "ώρα",
  },
  {
    key: "scuba",
    en: "Scuba & snorkeling",
    el: "Καταδύσεις & snorkeling",
    descEn: "Guided dives over reefs and a wreck, plus easy snorkeling trips for beginners.",
    descEl: "Καθοδηγούμενες καταδύσεις σε υφάλους και ναυάγιο, και εύκολες εξορμήσεις snorkeling.",
    price: 70,
    unitEn: "person",
    unitEl: "άτομο",
  },
  {
    key: "wine",
    en: "Wine & food tasting",
    el: "Γευσιγνωσία κρασιού",
    descEn: "Visit a family winery for local varietals paired with Cycladic cheeses and meze.",
    descEl: "Επίσκεψη σε οικογενειακό οινοποιείο με ντόπιες ποικιλίες, κυκλαδίτικα τυριά και μεζέδες.",
    price: 55,
    unitEn: "person",
    unitEl: "άτομο",
  },
];

export const REVIEWS = [
  {
    name: "Sophie & Marc",
    from: "Paris, France",
    stars: 5,
    en: "An unforgettable week. The infinity pool at sunset is something we still talk about, and booking direct could not have been simpler.",
    el: "Μια αξέχαστη εβδομάδα. Η πισίνα υπερχείλισης στο ηλιοβασίλεμα ήταν μαγική, και η απευθείας κράτηση ήταν πανεύκολη.",
  },
  {
    name: "James W.",
    from: "London, United Kingdom",
    stars: 5,
    en: "Spotless, stylish, and the views are even better than the photos. The private chef evening was the highlight of our trip.",
    el: "Άψογο, κομψό, και η θέα ακόμα καλύτερη από τις φωτογραφίες. Το δείπνο με τον ιδιωτικό σεφ ήταν η κορυφαία στιγμή μας.",
  },
  {
    name: "The Bauer family",
    from: "Vienna, Austria",
    stars: 5,
    en: "Kyma feels like a real home, steps from the water. The owner arranged a boat trip and ATVs — the kids never wanted to leave.",
    el: "Η Kyma μοιάζει με αληθινό σπίτι, δίπλα στο νερό. Ο ιδιοκτήτης κανόνισε βαρκάδα και γουρούνες — τα παιδιά δεν ήθελαν να φύγουν.",
  },
];

export const t: Dict = {
  nav_villa: { en: "The villa", el: "Η βίλα" },
  nav_amenities: { en: "Amenities", el: "Παροχές" },
  nav_area: { en: "The island", el: "Το νησί" },
  nav_experiences: { en: "Experiences", el: "Εμπειρίες" },
  nav_reviews: { en: "Reviews", el: "Κριτικές" },
  nav_book: { en: "Check availability", el: "Διαθεσιμότητα" },

  hero_eyebrow: { en: "Private seafront villa · Paros", el: "Ιδιωτική παραθαλάσσια βίλα · Πάρος" },
  hero_title: { en: "Villa Kyma", el: "Villa Kyma" },
  hero_sub: {
    en: "Wake to the hush of the Aegean. A four-bedroom villa above the sea, with an infinity pool that meets the horizon.",
    el: "Ξυπνήστε με τον ήχο του Αιγαίου. Μια βίλα τεσσάρων δωματίων πάνω από τη θάλασσα, με πισίνα που αγγίζει τον ορίζοντα.",
  },
  hero_cta: { en: "Check dates & book direct", el: "Δείτε διαθεσιμότητα" },
  hero_view: { en: "View the property", el: "Δείτε τη βίλα" },
  hero_from: { en: "from", el: "από" },
  hero_night: { en: "/ night", el: "/ διανυκτέρευση" },

  direct_title: { en: "Book direct, skip the fees", el: "Κράτηση απευθείας, χωρίς προμήθειες" },
  direct_body: {
    en: "Booking here instead of through Airbnb or Booking.com means no service fees, roughly 10 to 15% saved and paid back to you in a better stay.",
    el: "Η κράτηση εδώ αντί για Airbnb ή Booking.com σημαίνει μηδενικές προμήθειες, περίπου 10 έως 15% οικονομία.",
  },

  gallery_more: { en: "View more photos", el: "Περισσότερες φωτογραφίες" },
  gallery_less: { en: "Show fewer", el: "Λιγότερες" },
  gallery_soon: { en: "Photo coming soon", el: "Φωτογραφία σύντομα" },

  villa_eyebrow: { en: "The villa", el: "Η βίλα" },
  villa_title: { en: "Room to breathe, steps from the water", el: "Χώρος να ανασάνετε, δίπλα στο νερό" },
  villa_body: {
    en: "Villa Kyma blends whitewashed Cycladic architecture with calm, contemporary interiors. Indoor and outdoor living flow into one another, framed by uninterrupted views of the Aegean.",
    el: "Η Villa Kyma συνδυάζει την κυκλαδίτικη αρχιτεκτονική με ήρεμα, σύγχρονα εσωτερικά. Ο εσωτερικός και ο εξωτερικός χώρος ενώνονται, με αδιάκοπη θέα στο Αιγαίο.",
  },

  amenities_eyebrow: { en: "What's included", el: "Τι περιλαμβάνεται" },
  amenities_title: { en: "Amenities", el: "Παροχές" },

  area_eyebrow: { en: "Around the villa", el: "Γύρω από τη βίλα" },
  area_title: { en: "The best of Paros, on your doorstep", el: "Ό,τι καλύτερο της Πάρου, δίπλα σας" },

  exp_eyebrow: { en: "Out and about", el: "Δραστηριότητες" },
  exp_title: { en: "Experiences on Paros", el: "Εμπειρίες στην Πάρο" },
  exp_sub: {
    en: "Hand-picked activities we can arrange for your stay. Tell us what you fancy and we'll set it up.",
    el: "Επιλεγμένες δραστηριότητες που οργανώνουμε για τη διαμονή σας. Πείτε μας τι σας ενδιαφέρει και το κανονίζουμε.",
  },
  exp_book: { en: "Enquire", el: "Ενδιαφέρομαι" },

  reviews_eyebrow: { en: "Guest reviews", el: "Κριτικές επισκεπτών" },
  reviews_title: { en: "Loved by our guests", el: "Αγαπημένο από τους επισκέπτες μας" },
  reviews_sub: {
    en: "Rated 4.9 / 5 by guests who booked Villa Kyma direct.",
    el: "Βαθμολογία 4.9 / 5 από επισκέπτες που έκαναν απευθείας κράτηση.",
  },

  book_eyebrow: { en: "Availability", el: "Διαθεσιμότητα" },
  book_title: { en: "Choose your dates", el: "Επιλέξτε ημερομηνίες" },
  book_sub: {
    en: "Self check-in and check-out. We'll confirm your request by Viber or email within hours, or pay online to confirm your stay immediately.",
    el: "Αυτόνομο check-in και check-out. Θα επιβεβαιώσουμε μέσω Viber ή email μέσα σε λίγες ώρες, ή πληρώστε online για άμεση επιβεβαίωση της κράτησής σας.",
  },
  cal_checkin: { en: "Check-in", el: "Άφιξη" },
  cal_checkout: { en: "Check-out", el: "Αναχώρηση" },
  cal_pick: { en: "Pick a date", el: "Επιλογή" },
  cal_reset: { en: "Reset dates", el: "Καθαρισμός" },
  cal_guests: { en: "Guests", el: "Επισκέπτες" },
  cal_nights: { en: "nights", el: "διανυκτερεύσεις" },
  cal_cleaning: { en: "Cleaning fee", el: "Έξοδα καθαρισμού" },
  cal_total: { en: "Total", el: "Σύνολο" },

  ex_title: { en: "Add extras", el: "Πρόσθετες υπηρεσίες" },
  ex_housekeeping: { en: "Daily housekeeping", el: "Καθημερινή καθαριότητα" },
  ex_chef: { en: "Private chef (dinner)", el: "Ιδιωτικός σεφ (δείπνο)" },
  ex_none: { en: "No, thanks", el: "Όχι, ευχαριστώ" },
  ex_daily: { en: "Every day", el: "Κάθε μέρα" },
  ex_alt: { en: "Every other day", el: "Κάθε δεύτερη μέρα" },
  ex_specific: { en: "Specific days", el: "Συγκεκριμένες μέρες" },
  ex_pick_days: { en: "Pick the evenings you'd like the chef", el: "Επιλέξτε τα βράδια που θέλετε τον σεφ" },
  ex_per_guest: { en: "/ guest per dinner", el: "/ άτομο ανά δείπνο" },
  ex_min: { en: "min", el: "ελάχ." },
  ex_guests: { en: "guests", el: "άτομα" },
  ex_visits: { en: "visits", el: "επισκέψεις" },
  ex_dinners: { en: "dinners", el: "δείπνα" },
  cal_unavailable: { en: "Some selected nights are unavailable.", el: "Κάποιες ημερομηνίες δεν είναι διαθέσιμες." },

  f_name: { en: "Full name", el: "Ονοματεπώνυμο" },
  f_email: { en: "Email", el: "Email" },
  f_phone: { en: "Phone", el: "Τηλέφωνο" },
  f_message: { en: "Message (optional)", el: "Μήνυμα (προαιρετικά)" },
  f_submit: { en: "Request to book", el: "Αίτημα κράτησης" },
  f_pay: { en: "Book instantly & pay", el: "Άμεση κράτηση & πληρωμή" },
  f_or: { en: "or", el: "ή" },
  f_pay_hint: { en: "Secure card payment via Stripe. Your dates are confirmed at once.", el: "Ασφαλής πληρωμή με κάρτα μέσω Stripe. Οι ημερομηνίες επιβεβαιώνονται αμέσως." },
  f_required: { en: "Please choose dates and fill in your name, email and phone.", el: "Επιλέξτε ημερομηνίες και συμπληρώστε όνομα, email και τηλέφωνο." },
  f_success_title: { en: "Request sent!", el: "Το αίτημα στάλθηκε!" },
  f_success_body: {
    en: "We'll confirm shortly by Viber or email. (Demo: the request is stored temporarily and appears in /admin.)",
    el: "Θα επιβεβαιώσουμε σύντομα. (Demo: το αίτημα αποθηκεύεται προσωρινά και εμφανίζεται στο /admin.)",
  },
  f_another: { en: "New request", el: "Νέο αίτημα" },

  contact_call: { en: "Call", el: "Κλήση" },
  footer_rights: { en: "All rights reserved.", el: "Με επιφύλαξη παντός δικαιώματος." },
  footer_ama: { en: "Greek STR registration no. (ΑΜΑ)", el: "Αρ. Μητρώου Ακινήτου (ΑΜΑ)" },
  footer_demo: {
    en: "Akos Digital Sample Website. Images & text are placeholders.",
    el: "Akos Digital Sample Website. Οι εικόνες & τα κείμενα είναι ενδεικτικά.",
  },

  cookie_text: {
    en: "We use cookies to improve your experience and analyse traffic.",
    el: "Χρησιμοποιούμε cookies για καλύτερη εμπειρία και ανάλυση επισκεψιμότητας.",
  },
  cookie_accept: { en: "Accept", el: "Αποδοχή" },
  cookie_deny: { en: "Decline", el: "Άρνηση" },
};

export function tr(key: keyof typeof t, lang: Lang): string {
  return t[key]?.[lang] ?? (key as string);
}

// Greek typography: in all-caps text the tonos is dropped (but the dialytika is
// kept). CSS text-transform:uppercase doesn't do this, so call this for any text
// rendered uppercase. Harmless on Latin text (no combining accents to remove).
export function noTonos(s: string): string {
  return s
    .normalize("NFD")
    .replace(/̈́/g, "̈") // dialytika+tonos -> keep dialytika only
    .replace(/[̀́͂]/g, "") // varia, tonos/oxia, perispomeni
    .normalize("NFC");
}
