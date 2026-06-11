/**
 * The postcard catalog — single source of truth for both the DB seed
 * (src/db/seed.ts) and the illustration generator (scripts/gen-art.ts).
 *
 * Pure data, NO side effects, so it can be imported anywhere safely.
 * Every entry's `imageUrl` is derived as `/postcards/<slug>.svg`, matching the
 * cohesive generated artwork. ≥10 active postcards per category; ~2 featured
 * per category for the homepage row.
 */
import type { NewProduct, ProductCategory } from "./schema";

const A6 = { widthMm: 148, heightMm: 105 };

type Def = {
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  stock: number;
  featured?: boolean;
};

/** Postcards grouped by category. Keep slugs globally unique + kebab-case. */
export const CATALOG: Record<ProductCategory, Def[]> = {
  travel: [
    { slug: "kyoto-at-dusk", title: "Kyoto at Dusk", description: "Lantern light spills over the old quarter as the last of the sun slips behind the hills. A quiet, golden moment from a slow evening in Gion.", priceCents: 850, stock: 40, featured: true },
    { slug: "harbor-lights", title: "Harbor Lights", description: "Dusk over the working harbor, where amber lamps meet a deepening blue sea. Drawn dockside with cold hands.", priceCents: 900, stock: 30 },
    { slug: "santorini-blue", title: "Santorini Blue", description: "Whitewashed steps tumble toward an impossible blue. Sketched on a rooftop as the Aegean caught the last light.", priceCents: 950, stock: 34, featured: true },
    { slug: "marrakech-market", title: "Marrakech Market", description: "Spice-stacked stalls and lantern glow deep in the medina — a postcard that almost smells of saffron and dust.", priceCents: 880, stock: 28 },
    { slug: "lisbon-tram", title: "Lisbon Tram", description: "A yellow tram climbs a tiled hill past azulejo walls, its bell ringing out into the warm afternoon.", priceCents: 820, stock: 36 },
    { slug: "venice-canal", title: "Venice Canal", description: "Still water between leaning palazzi, a single gondola tracing the quiet of early morning.", priceCents: 980, stock: 22 },
    { slug: "sahara-dunes", title: "Sahara Dunes", description: "Wind-carved ridges in rose and ochre, running endlessly under a pale desert sky.", priceCents: 760, stock: 38 },
    { slug: "iceland-road", title: "Iceland Road", description: "A lone road threading black lava fields toward a far white glacier and low northern light.", priceCents: 1050, stock: 20 },
    { slug: "patagonia-peaks", title: "Patagonia Peaks", description: "Granite spires above a glass-still lake at the bottom of the world.", priceCents: 1150, stock: 18 },
    { slug: "amalfi-coast", title: "Amalfi Coast", description: "Lemon terraces spilling down cliffs to a sun-warmed, impossibly blue sea.", priceCents: 990, stock: 26 },
  ],
  nature: [
    { slug: "alpine-silence", title: "Alpine Silence", description: "Cold blue peaks under a paper-white sky. Painted on a still morning when the only sound was snow settling on the pines.", priceCents: 750, stock: 32 },
    { slug: "wildflower-field", title: "Wildflower Field", description: "High summer in the meadow — chartreuse grass and a scatter of golden blooms swaying in a warm breeze.", priceCents: 1200, stock: 24 },
    { slug: "autumn-birches", title: "Autumn Birches", description: "A stand of birches turning gold, leaves drifting loose on a cold, clear afternoon.", priceCents: 820, stock: 30 },
    { slug: "misty-pines", title: "Misty Pines", description: "Fog threading a hillside of dark pines at first light, everything hushed and grey-green.", priceCents: 790, stock: 28 },
    { slug: "desert-bloom", title: "Desert Bloom", description: "Cacti caught in sudden flower after a rare desert rain, pink against the dust.", priceCents: 740, stock: 34 },
    { slug: "river-bend", title: "River Bend", description: "A slow river curling through summer reeds, dragonflies stitching the warm air above it.", priceCents: 700, stock: 36 },
    { slug: "coral-reef", title: "Coral Reef", description: "A bright tangle of coral and small fish beneath a warm, shallow sea.", priceCents: 1100, stock: 20, featured: true },
    { slug: "thunderhead", title: "Thunderhead", description: "A towering storm cloud lit from within, drifting over open prairie.", priceCents: 860, stock: 24 },
    { slug: "mossy-falls", title: "Mossy Falls", description: "A small waterfall over green stone in a quiet northern wood.", priceCents: 880, stock: 26 },
    { slug: "lavender-rows", title: "Lavender Rows", description: "Purple rows running to the horizon under a buzzing Provençal sun.", priceCents: 1000, stock: 22, featured: true },
  ],
  city: [
    { slug: "neon-district", title: "Neon District", description: "Rain-slick streets and electric signage — the city after midnight, humming pink and indigo.", priceCents: 950, stock: 28, featured: true },
    { slug: "midnight-metro", title: "Midnight Metro", description: "Tiled platforms and the blur of a leaving train, late and almost empty.", priceCents: 780, stock: 30 },
    { slug: "rooftop-skyline", title: "Rooftop Skyline", description: "A jagged skyline at blue hour, windows flickering on one by one.", priceCents: 920, stock: 26, featured: true },
    { slug: "rainy-crossing", title: "Rainy Crossing", description: "Umbrellas pooling at a crosswalk, headlights smeared across wet asphalt.", priceCents: 840, stock: 32 },
    { slug: "old-town-square", title: "Old Town Square", description: "Cobbles, a clock tower, and café awnings in the long, slanting evening light.", priceCents: 800, stock: 34 },
    { slug: "bridge-at-dawn", title: "Bridge at Dawn", description: "A great steel bridge emerging from river mist as the city slowly wakes.", priceCents: 980, stock: 22 },
    { slug: "corner-cafe", title: "Corner Café", description: "Warm light from a corner café spilling out onto a quiet side street.", priceCents: 720, stock: 38 },
    { slug: "subway-stairs", title: "Subway Stairs", description: "Steam and signage at the mouth of a subway, the city humming somewhere above.", priceCents: 760, stock: 30 },
    { slug: "harbor-cranes", title: "Harbor Cranes", description: "Industrial cranes silhouetted against a sodium-orange dusk.", priceCents: 880, stock: 24 },
    { slug: "alley-lanterns", title: "Alley Lanterns", description: "A narrow lane strung with paper lanterns, steam rising from the food stalls.", priceCents: 900, stock: 28 },
  ],
  abstract: [
    { slug: "cobalt-drift", title: "Cobalt Drift", description: "An abstract study in cobalt and cyan — overlapping washes that drift like tide pools at dawn.", priceCents: 650, stock: 50 },
    { slug: "ember-fold", title: "Ember Fold", description: "Folded planes of ember and rust, warm geometry catching a low light.", priceCents: 680, stock: 44 },
    { slug: "tidal-static", title: "Tidal Static", description: "Bands of teal and grey shivering like a signal half-tuned.", priceCents: 620, stock: 48 },
    { slug: "gilded-fracture", title: "Gilded Fracture", description: "Gold leaf splitting a field of deep charcoal — kintsugi rendered for paper.", priceCents: 1150, stock: 18, featured: true },
    { slug: "soft-machine", title: "Soft Machine", description: "Rounded shapes interlocking in dusty pink and slate.", priceCents: 700, stock: 40 },
    { slug: "night-bloom", title: "Night Bloom", description: "Dark petals of overlapping ink opening slowly across the page.", priceCents: 730, stock: 36 },
    { slug: "paper-tide", title: "Paper Tide", description: "Translucent washes layered like sediment, pale and deep by turns.", priceCents: 690, stock: 42 },
    { slug: "magnetic-north", title: "Magnetic North", description: "Fine lines bending around an unseen pole, restless and precise.", priceCents: 660, stock: 46 },
    { slug: "warm-static", title: "Warm Static", description: "A grain of amber and oxblood, like firelight seen through closed eyes.", priceCents: 640, stock: 44, featured: true },
    { slug: "prism-shift", title: "Prism Shift", description: "Triangles refracting a single beam into quiet bands of colour.", priceCents: 710, stock: 38 },
  ],
  typography: [
    { slug: "hello-sunshine", title: "Hello Sunshine", description: "Hand-lettered warmth in marigold and coral. A little burst of optimism to send across the miles.", priceCents: 550, stock: 60, featured: true },
    { slug: "thinking-of-you", title: "Thinking of You", description: "Looping script in warm ink — three small words that still carry real weight.", priceCents: 560, stock: 58 },
    { slug: "wish-you-were-here", title: "Wish You Were Here", description: "The oldest postcard line there is, hand-lettered with a knowing wink.", priceCents: 580, stock: 54, featured: true },
    { slug: "good-news-soon", title: "Good News Soon", description: "A small promise in bold brush letters, sent on ahead of the story.", priceCents: 540, stock: 56 },
    { slug: "be-kind", title: "Be Kind", description: "Two quiet words in a generous serif, with plenty of room to breathe.", priceCents: 500, stock: 64 },
    { slug: "safe-travels", title: "Safe Travels", description: "A send-off in confident strokes, for someone already halfway out the door.", priceCents: 540, stock: 52 },
    { slug: "happy-mail", title: "Happy Mail", description: "Bouncing letters and a tiny envelope — joy you can actually put in the post.", priceCents: 560, stock: 50 },
    { slug: "take-it-slow", title: "Take It Slow", description: "Unhurried lettering in soft clay, a gentle reminder to exhale.", priceCents: 520, stock: 58 },
    { slug: "big-love", title: "Big Love", description: "Oversized affection in a fat, friendly hand.", priceCents: 530, stock: 60 },
    { slug: "adventure-awaits", title: "Adventure Awaits", description: "Letters marching uphill toward a small, rising sun.", priceCents: 570, stock: 48 },
  ],
  seasonal: [
    { slug: "first-snow", title: "First Snow", description: "The hush of the season's first fall — soft blues and untouched white over a sleeping village.", priceCents: 700, stock: 36 },
    { slug: "spring-thaw", title: "Spring Thaw", description: "Snowmelt and the first green spears, light slowly coming back to the garden.", priceCents: 680, stock: 38 },
    { slug: "summer-solstice", title: "Summer Solstice", description: "The longest day at golden hour, shadows stretched long and warm.", priceCents: 720, stock: 34 },
    { slug: "harvest-moon", title: "Harvest Moon", description: "A fat amber moon hung low over cut fields and a cooling night.", priceCents: 760, stock: 30 },
    { slug: "frost-window", title: "Frost Window", description: "Ice ferns spreading across a cold pane, lamplight glowing somewhere behind.", priceCents: 700, stock: 32 },
    { slug: "cherry-blossom", title: "Cherry Blossom", description: "Pink boughs against a soft grey sky, petals already beginning to let go.", priceCents: 820, stock: 28, featured: true },
    { slug: "autumn-hearth", title: "Autumn Hearth", description: "Falling leaves and the first fire of the season, woodsmoke on the air.", priceCents: 740, stock: 30 },
    { slug: "midwinter-lights", title: "Midwinter Lights", description: "Strings of warm bulbs against the deep blue of the shortest days.", priceCents: 780, stock: 34, featured: true },
    { slug: "equinox-tide", title: "Equinox Tide", description: "Balanced light over a turning sea — day and night in even measure.", priceCents: 700, stock: 32 },
    { slug: "new-year-sky", title: "New Year Sky", description: "A quiet burst of gold over rooftops at the very turn of the year.", priceCents: 760, stock: 28 },
  ],
  animals: [
    { slug: "the-red-fox", title: "The Red Fox", description: "A curious visitor at the edge of the wood, caught mid-step in rust and amber. Drawn from a single lucky sighting.", priceCents: 800, stock: 44, featured: true },
    { slug: "snowy-owl", title: "Snowy Owl", description: "A white owl mid-glide over a hushed winter field, eyes like two small lamps.", priceCents: 860, stock: 30, featured: true },
    { slug: "harbor-seal", title: "Harbor Seal", description: "A curious seal surfacing in cold green water, whiskers beaded with sea.", priceCents: 780, stock: 34 },
    { slug: "garden-hare", title: "Garden Hare", description: "A long-eared hare frozen alert among the dewy morning cabbages.", priceCents: 760, stock: 36 },
    { slug: "paper-crane", title: "Paper Crane", description: "A single origami crane, wings caught somewhere between fold and flight.", priceCents: 720, stock: 40 },
    { slug: "humpback-breach", title: "Humpback Breach", description: "A whale rising from deep blue, the sea sheeting off its back.", priceCents: 980, stock: 22 },
    { slug: "hummingbird", title: "Hummingbird", description: "A blur of emerald at a trumpet flower, wings beyond counting.", priceCents: 740, stock: 38 },
    { slug: "sleeping-cat", title: "Sleeping Cat", description: "A tabby curled into a perfect comma in a warm square of afternoon sun.", priceCents: 700, stock: 42 },
    { slug: "mountain-goat", title: "Mountain Goat", description: "A sure-footed goat on an impossible ledge, perfectly calm above the drop.", priceCents: 820, stock: 28 },
    { slug: "koi-pond", title: "Koi Pond", description: "Slow orange koi turning beneath lily pads and a paper-pale sky.", priceCents: 880, stock: 26 },
  ],
  vintage: [
    { slug: "postal-nostalgia", title: "Postal Nostalgia", description: "An ode to the airmail era — warm sepia, deckled edges, and the romance of a stamp from somewhere far away.", priceCents: 600, stock: 48, featured: true },
    { slug: "airmail-par-avion", title: "Par Avion", description: "Striped borders and a faded par-avion mark — all the romance of the long way round.", priceCents: 620, stock: 44, featured: true },
    { slug: "grand-hotel", title: "Grand Hotel", description: "A travel-label collage from a grand hotel that may never quite have existed.", priceCents: 680, stock: 36 },
    { slug: "botanical-plate", title: "Botanical Plate", description: "A hand-tinted botanical plate, the kind once pressed into an old field guide.", priceCents: 720, stock: 34 },
    { slug: "steamliner", title: "Steamliner", description: "An ocean liner on a deco poster, smoke trailing in two clean, confident lines.", priceCents: 760, stock: 30 },
    { slug: "typewriter-keys", title: "Typewriter Keys", description: "Round glass keys and inked ribbon — the clatter of letters once written by hand.", priceCents: 640, stock: 40 },
    { slug: "vintage-globe", title: "Vintage Globe", description: "A patinated desk globe, its trade routes drawn in slowly fading gold.", priceCents: 700, stock: 32 },
    { slug: "pressed-ticket", title: "Pressed Ticket", description: "A frayed train ticket and a coffee ring — a journey kept entirely by accident.", priceCents: 600, stock: 38 },
    { slug: "old-camera", title: "Old Camera", description: "A folding bellows camera in worn leather, light leaks and all.", priceCents: 660, stock: 34 },
    { slug: "library-card", title: "Library Card", description: "A due-date card and a column of rubber stamps — the quiet life of a borrowed book.", priceCents: 580, stock: 42 },
  ],
};

/** Flattened seed rows. imageUrl derives from the slug's generated SVG. */
export const SEED: NewProduct[] = (
  Object.entries(CATALOG) as [ProductCategory, Def[]][]
).flatMap(([category, defs]) =>
  defs.map((d) => ({
    slug: d.slug,
    title: d.title,
    description: d.description,
    priceCents: d.priceCents,
    category,
    imageUrl: `/postcards/${d.slug}.jpg`,
    stock: d.stock,
    featured: d.featured ?? false,
    status: "active" as const,
    ...A6,
  })),
);
