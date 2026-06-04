
export interface Article {
  id: string;
  slug: string;
  title: string;
  category: 'Spotlight' | 'Business' | 'Compliance' | 'Nightlife';
  author: string;
  readTime: string;
  imageUrl: string;
  region?: string;
  content: string;
  excerpt: string;
  performerVanity?: string;
  isGold?: boolean;
}

export const ARTICLES: Article[] = [
  {
    id: "london-liberty",
    slug: "london-liberty-corporate-chameleon",
    title: "The Corporate Chameleon: London Liberty",
    category: "Spotlight",
    author: "Editorial Team",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    region: "UK",
    performerVanity: "london-liberty",
    isGold: true,
    excerpt: "London Liberty doesn't just perform; she orchestrates. Master the art of the Corporate Chameleon.",
    content: `
      ### High-Octane Performance Meets Down-Under Discipline
      London Liberty doesn't just perform; she orchestrates. With a career that spans from the gritty basements of East London to the gilded ballrooms of Park Lane, she has mastered the art of the "Corporate Chameleon." She is the go-to host for Fortune 500 galas, high-stakes brand launches, and the city's most exclusive drag brunches.

      For Liberty, drag is a business of absolute precision.

      > "In the UK market, talent gets you in the door. Professionalism keeps you in the room. If you can’t provide a PLI certificate or a VAT-compliant invoice within ten minutes, you aren’t a headliner—you’re a hobbyist."
      > — **London Liberty**

      ### The Business of Brunch and Bingo
      London has seen an explosion in the "Elevated Entertainment" sector. Drag Brunch and Drag Bingo are no longer niche club nights; they are high-volume, B2B-friendly events that demand a specific type of excellence.

      "The venues we work with, like **The Grand** or the **Stonegate** hospitality group, expect more than just a show," Liberty explains. "They expect a partner. When I host a brunch for 300 corporate clients on a Tuesday afternoon, I’m managing the energy of the room, the timing of the kitchen, and the technical cues of the DJ. It’s a logistical ballet."

      ### 🛡️ Verified for the Big Leagues: The PLI Advantage
      What sets London Liberty apart in the DRAGDEM ecosystem is her **'PLI Verified' Badge**. In the United Kingdom, Public Liability Insurance is the "Golden Ticket" to the pro-circuit. Without it, the doors of the City’s most prestigious venues remain firmly shut.

      "DRAGDEM has made the compliance side of my business invisible," says Liberty. "By having my insurance verified and my 'Verified PLI' badge visible on my profile, seekers know immediately that I am low-risk and high-reward. It’s the difference between a £200 club gig and a £2,000 corporate booking."
    `
  },
  {
    id: "art-simone",
    slug: "art-simone-pride-pacific",
    title: "The Pride of the Pacific: Art Simone",
    category: "Spotlight",
    author: "Editorial Team",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1514525253361-bee8718a74a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    region: "AU",
    performerVanity: "art-simone",
    excerpt: "From Drag Race Down Under to international stardom, Art Simone is Australia’s ultimate drag export.",
    content: `
      ### High-Octane Performance Meets Down-Under Discipline
      From the "Drag Race Down Under" mainstage to the international festival circuit, **Art Simone** has solidified her status as Australia’s ultimate drag export. Based in Melbourne but a constant presence on Sydney's Oxford Street, Art represents the bridge between the irreverent humor of classic Australian drag and the high-production values of the global professional scene.

      > "The Australian drag scene is built on grit and heart, but to scale globally, you need a digital backbone. You can’t run an international career out of your Instagram DMs. You need structure, you need compliance, and you need to be easy to book."
      > — **Art Simone**

      ### The Sydney-Melbourne Pipeline
      Australia’s "East Coast Circuit" is one of the most demanding in the world. Performers like Art often fly between Sydney and Melbourne multiple times a week, managing a rotating cast of shows, corporate appearances, and brand activations.

      "Managing the logistics of an interstate tour is where most performers stumble," Art says. "With DRAGDEM, I use the **Travel Ticker** to let venues know exactly where I am. If I’m in Sydney for a gala on a Friday, local seekers can see my availability for a brunch on Saturday. It maximizes every trip."

      ### 🇦🇺 The ABN Advantage: Doing Business Down Under
      For Art, the professionalization of drag in Australia means mastering the financial side of the house. In the Australian market, having a verified **ABN (Australian Business Number)** is the difference between a professional career and a logistical nightmare.

      "Before DRAGDEM, the biggest headache was the 'No-ABN' withholding tax. Venues would have to hold back 47% of your fee if your paperwork wasn't in order," Art explains. "Having my ABN verified on my DRAGDEM profile ensures that I get paid in full, on time, and without the administrative back-and-forth. It’s about building trust with major hospitality groups like **Merivale**."
    `
  },
  {
    id: "durian-lollobrigida",
    slug: "durian-lollobrigida-voice-tokyo",
    title: "The Voice of Tokyo: Durian Lollobrigida",
    category: "Spotlight",
    author: "Editorial Team",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    region: "JP",
    performerVanity: "durian-lollobrigida",
    excerpt: "Durian Lollobrigida is a cultural phenomenon in Shinjuku Ni-chome and beyond.",
    content: `
      ### A Symphony of Style and Tradition
      In the neon-soaked streets of Shinjuku Ni-chome, one voice rises above the rest. **Durian Lollobrigida** is not just a drag queen; she is a cultural phenomenon. Known for her towering height, incredible vocal range, and impeccable fashion sense, Durian has bridged the gap between the underground drag scene and mainstream Japanese entertainment.

      > "Drag in Tokyo is a beautiful, complex tapestry. To succeed, you must honor the tradition while embracing the future. Professionalism is the thread that holds it all together. If you want the world to take your art seriously, you must treat your art as a business."
      > — **Durian Lollobrigida**

      ### 🇯🇵 The T-Number: Standardizing Success
      With the introduction of the **Qualified Invoice System** in Japan, the administrative side of drag has become more critical than ever. For a top-tier performer like Durian, staying ahead of compliance is a competitive advantage.

      "The **T-Number** is the new professional handshake in Japan," Durian says. "By having my T-Number verified on my DRAGDEM profile, I am telling corporate seekers and luxury venues that I am ready for business. It removes the friction from the invoicing process and ensures that we can focus on the performance, not the paperwork."
    `
  },
  {
    id: "adam-all",
    slug: "adam-all-kings-reign",
    title: "The King’s Reign: Adam All",
    category: "Spotlight",
    author: "Editorial Team",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    region: "UK",
    performerVanity: "adam-all",
    excerpt: "A pioneer of the Drag King movement, Adam All is redefining the crown in the UK scene.",
    content: `
      ### Redefining the Crown in the UK Scene
      In the world of drag, where queens often dominate the conversation, **Adam All** stands as a formidable pioneer and a global icon of the Drag King movement. Based in London, Adam has spent over a decade proving that drag is a vast, inclusive spectrum of gender expression.

      > "Visibility is a political act, but professionalism is a sustainable one. As Kings, we are often working twice as hard to secure the same stages. That’s why your business package—your rider, your tech, your invoices—must be bulletproof."
      > — **Adam All**

      ### 🎤 The Live Vocal Rider: Precision in Every Note
      For Adam, a live vocal performance is only as good as the sound system it’s on. One of his most used features in the **DRAGDEM Vault** is his **Detailed Technical Rider**.

      "If you’re a live vocalist, you can’t leave your sound to chance," Adam explains. "I have my specific mic preferences and lighting cues saved as a 'Vocal Pack' in the Vault. When a venue books me through DRAGDEM, they get those specs instantly."
    `
  },
  {
    id: "japan-t-number",
    slug: "japan-t-number-guide",
    title: "Understanding T-Numbers & Qualified Invoices in Japan",
    category: "Business",
    author: "Compliance Team",
    readTime: "12 min read",
    imageUrl: "https://images.unsplash.com/photo-1518173946687-a4c8a9b746f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    region: "JP",
    excerpt: "The Qualified Invoice System is the new standard for business in Japan. Are you ready?",
    content: `
      ### The New Standard: Navigating Japan’s Qualified Invoice System
      For performers operating in the Japanese market, the landscape of business compliance changed significantly in late 2023 with the introduction of the **Qualified Invoice System**.

      ### 1. What is a T-Number?
      A **T-Number** (Registered Number) is a 13-digit identifier issued by the National Tax Agency of Japan. It signifies that a business is a "Registered Invoice Issuer."

      ### 2. The DRAGDEM Advantage: Automated Compliance
      Through your **Performer Dashboard**, you can enter your T-Number in your tax settings. DRAGDEM’s automated invoicing system then generates "Qualified Invoices" that meet all Japanese tax requirements.

      ### 3. The 'Anti-Social Forces' Clause
      DRAGDEM has localized its Terms of Service for the Japanese market to include the mandatory **'Anti-Social Forces' (Yakuza) exclusion clause**, a standard requirement for all business contracts in Japan.
    `
  },
  {
    id: "uk-pli",
    slug: "uk-pli-guide",
    title: "The Insured Performer: A Guide to UK PLI",
    category: "Compliance",
    author: "Editorial Team",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    region: "UK",
    excerpt: "Public Liability Insurance is the 'Golden Ticket' to the UK pro-circuit.",
    content: `
      ### Understanding Public Liability Insurance (PLI)
      At its core, PLI protects you (the performer) against the financial consequences of accidental injury to a member of the public or damage to property during your act.

      **The UK Standard:** Most professional venues and corporate planners require a minimum of **£5 Million** in cover, with many high-end ballrooms and festivals requesting **£10 Million**.

      ### The DRAGDEM Advantage: The 'Verified PLI' Badge
      Through your **Performer Dashboard**, you can upload your PLI certificate. Once approved, a **'Verified PLI' Badge** is displayed on your profile, signaling to B2B seekers that you are low-risk and high-reward.
    `
  },
  {
    id: "australia-abn",
    slug: "australia-abn-guide",
    title: "The ABN & Super Guide: Doing Business in Australia",
    category: "Business",
    author: "Tax Team",
    readTime: "10 min read",
    imageUrl: "https://images.unsplash.com/photo-1518173946687-a4c8a9b746f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    region: "AU",
    excerpt: "Navigate the 'Lucky Country' with total financial confidence using our ABN and Super guide.",
    content: `
      ### 1. The ABN: Your Professional ID Card
      An **ABN (Australian Business Number)** is a unique 11-digit identifier. If you do not provide a valid ABN to a venue, they are legally required to withhold **47%** of your payment.

      ### 2. GST: Managing the Threshold
      If your annual turnover in Australia reaches **$75,000 AUD**, you are legally required to register for **Goods and Services Tax (GST)**.

      ### 3. Superannuation: Protecting Your Future
      Australian law now requires that many contractors be paid **Superannuation** (currently 11.5%) if they are performing "labor-only" contracts. DRAGDEM helps clarify your status as an independent professional to mitigate this risk.
    `
  },
  {
    id: "m-stranger",
    slug: "m-stranger-dragon-silom",
    title: "The Dragon of Silom: M Stranger",
    category: "Spotlight",
    author: "Editorial Team",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    region: "TH",
    performerVanity: "m-stranger",
    excerpt: "From the stage to the boardroom, M Stranger is the formidable entrepreneur at the heart of Thai drag.",
    content: `
      ### The Rise of an Empire
      In the neon-soaked corridors of Bangkok’s Silom district, one name carries the weight of a legend and the sharp edge of a CEO: **M Stranger**. 

      > "To survive in this industry, you must be an artist. To thrive, you must be a shark." 
      > — **M Stranger**

      ### Building the Silicon Valley of Drag
      M Stranger’s impact isn't just measured in standing ovations, but in square footage and staff payrolls. As the driving force behind **Stranger Bar**, she created a sanctuary for local talent and a "must-visit" destination for international tourists. 

      ### 💼 B2B Excellence
      By utilizing the **DRAGDEM B2B Venue Management Dashboard**, M has successfully optimized booking cycles and inventory tracking across multiple locations.
    `
  },
  {
    id: "global-rider",
    slug: "global-rider-technical-specs",
    title: "The Global Rider: Technical Specs for Touring",
    category: "Compliance",
    author: "Technical Team",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    excerpt: "Master the art of the international stage with technical normalization.",
    content: `
      ### The Art of the International Stage
      The most dangerous part of a global tour isn't the customs line—it’s the stage you haven’t seen yet. To thrive globally, you need **Technical Normalization.**

      ### Regional Realities
      *   **Bangkok:** High-impact, close-proximity performance.
      *   **Berlin:** Alternative and political storytelling in non-traditional spaces.
      *   **New York:** Cabaret legacy with space-constrained backstage footprints.

      ### The DRAGDEM Advantage
      DRAGDEM eliminates the information gap with the **'Stage Hand' PDF**, automatically generating standardized tech sheets for every booking.
    `
  },
  {
    id: "pandora-nox",
    slug: "pandora-nox-disrupting-dynasty",
    title: "Disrupting the Dynasty: Pandora Nox",
    category: "Spotlight",
    author: "Editorial Team",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    region: "EU",
    performerVanity: "pandora-nox",
    excerpt: "The first AFAB winner of Drag Race Germany, Pandora Nox is disrupting the dynasty of European drag.",
    content: `
      ### A New Era of European Drag
      **Pandora Nox** has not just broken the glass ceiling of European drag; she has shattered it. As a world-class contortionist and the first AFAB winner in the global Drag Race franchise, she represents the technical and artistic peak of the modern scene.

      > "Art has no gender, and neither does professional success. My vault is my inventory, and my acts are my products. If you treat yourself as a business, the world responds accordingly."
      > — **Pandora Nox**

      ### 💎 Vault Highlight: Technical Excellence
      Pandora utilizes the **DRAGDEM Vault** to store her high-fidelity performance tracks and detailed safety riders for her contortion acts.
    `
  },
  {
    id: "silvetty-montilla",
    slug: "silvetty-montilla-matriarch-south",
    title: "The Matriarch of the South: Silvetty Montilla",
    category: "Spotlight",
    author: "Editorial Team",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    region: "BR",
    performerVanity: "silvetty-montilla",
    excerpt: "With a career spanning decades, Silvetty Montilla is the undisputed queen of São Paulo and a global drag icon.",
    content: `
      ### The Undisputed Matriarch of the South
      In the heart of São Paulo, **Silvetty Montilla** reigns supreme. With a career that has defined Brazilian drag for over 30 years, she is a master of comedy, hosting, and the "Bate-Cabelo" (Hair-Flip) tradition.

      ### From the Streets of SP to Global Recognition
      Silvetty has mentored generations of performers. Her approach to drag is one of absolute commitment to the audience.

      > "The stage is a sacred space. Whether you are in a club in SP or a festival in Berlin, you bring the same fire. But behind the fire, you must have the ice of a businesswoman to survive."
      > — **Silvetty Montilla**
    `
  },
  {
    id: "high-volume-bookings",
    slug: "high-volume-booking-strategies",
    title: "Scaling the Spotlight: High-Volume Booking Strategies",
    category: "Business",
    author: "Strategy Team",
    readTime: "10 min read",
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    excerpt: "Seprate local acts from global headliners by mastering the art of high-volume triage.",
    content: `
      ### Scaling the Spotlight
      For the professional performer, "too much work" is a luxury problem that can quickly become a logistical nightmare. Success separates those who triage from those who drown.

      ### 1. Triaging the Inbox
      High-volume success starts with effective triaging. Use your **'Pro' Performer Dashboard** to monitor conversion metrics and prioritize responses.

      ### 2. Asset Velocity
      In a high-volume environment, speed is currency. Organize your **Drag Vault** for velocity by creating "Quick-Packs" for different booking tiers.

      ### 3. Logistical Normalization
      Don't negotiate tech for every gig. Establish a "Standard Minimum" that works across 90% of venues.
    `
  },
  {
    id: "corporate-pricing",
    slug: "pricing-for-corporate-seekers",
    title: "The Business of Being a Queen: Corporate Pricing",
    category: "Business",
    author: "Finance Team",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    excerpt: "Transitioning to the corporate market requires a fundamental shift in how you value your labor.",
    content: `
      ### Beyond the Bar
      As the global demand for drag expands into brand activations and luxury hotel residencies, the "Club Rate" no longer applies.

      ### 1. The Value Shift
      Corporate seekers aren't just buying a performance; they are buying an experience and brand alignment. Account for preparation, time commitment, and usage rights.

      ### 2. Professionalizing the Ask
      High-level seekers require formal documentation. DRAGDEM automatically generates professional, industry-standard invoices and handles automated deposits.

      ### 3. Tiered Pricing
      Don't have just one price. Use your **Drag Vault** to showcase different "Packages" from atmospheric hosting to high-production sets.
    `
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug);
}
