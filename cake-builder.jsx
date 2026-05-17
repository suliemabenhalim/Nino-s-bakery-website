// cake-builder.jsx — the 10-step wizard panels.
// Pure UI; state lives in parent (app.jsx) and is passed in.

const { useState: useStateB, useEffect: useEffectB, useRef: useRefB } = React;

// === Step constants ===
// Order rationale: hard constraints first (occasion -> size -> flavor) before
// design choices (shape/color/toppings/message). Inspo is its own entry path,
// not in the chain. Add-ons sit after delivery (one-stop shop upsell).
const STEPS = [
  { key: 'occasion', label: 'Occasion',  caption: 'What are you celebrating?' },
  { key: 'size',     label: 'Size',      caption: 'How many guests?' },
  { key: 'flavor',   label: 'Flavor',    caption: 'How should it taste?' },
  { key: 'shape',    label: 'Shape',     caption: 'Silhouette, tiers & cover' },
  { key: 'frosting', label: 'Frosting',  caption: 'The base color' },
  { key: 'toppings', label: 'Toppings',  caption: 'Drop them on the cake' },
  { key: 'topcolor', label: 'Accent',    caption: 'Color the details' },
  { key: 'message',  label: 'Message',   caption: 'Cake & board text' },
  { key: 'delivery', label: 'Delivery',  caption: 'Pick a date — we need 24 hours' },
  { key: 'addons',   label: 'Add-ons',   caption: 'Complete the celebration' },
];

// Each occasion carries sub-themes that pre-fill defaults when picked.
// Theme defaults: frostColor, toppingColor, suggested toppings.
const OCCASIONS = [
  { id: 'birthday-kids', label: "Kid's Birthday", emoji: '🎈', tone: 'pink',   desc: 'Princess, dinos, heroes',
    themes: [
      { id: 'princess',    label: 'Princess',     frost: '#FFBFBE', accent: '#FFDC4A' },
      { id: 'unicorn',     label: 'Unicorn',      frost: '#FFE4E2', accent: '#7FB0E7' },
      { id: 'dinosaur',    label: 'Dinosaur',     frost: '#A8D5BA', accent: '#6B0F1A' },
      { id: 'superhero',   label: 'Superhero',    frost: '#3D5A99', accent: '#FFDC4A' },
      { id: 'barbie',      label: 'Barbie',       frost: '#FFBFBE', accent: '#6B0F1A' },
      { id: 'cars',        label: 'Cars',         frost: '#7FB0E7', accent: '#E35F40' },
  ] },
  { id: 'birthday-adults', label: 'Birthday', emoji: '✨', tone: 'butter', desc: 'Aesthetic, minimal, garden',
    themes: [
      { id: 'aesthetic',   label: 'Aesthetic',    frost: '#FCF8EF', accent: '#E35F40' },
      { id: 'minimal',     label: 'Minimal',      frost: '#FCF8EF', accent: '#2A1A18' },
      { id: 'garden',      label: 'Garden party', frost: '#A8D5BA', accent: '#FFBFBE' },
      { id: 'neon',        label: 'Neon',         frost: '#2A1A18', accent: '#FFDC4A' },
      { id: 'velvet',      label: 'Velvet',       frost: '#6B0F1A', accent: '#FFDC4A' },
  ] },
  { id: 'baby-shower', label: 'Baby Shower', emoji: '🍼', tone: 'sky', desc: 'Blue, pink, neutral',
    themes: [
      { id: 'baby-blue',   label: 'It’s a boy',    frost: '#7FB0E7', accent: '#FCF8EF' },
      { id: 'baby-pink',   label: 'It’s a girl',   frost: '#FFBFBE', accent: '#FCF8EF' },
      { id: 'neutral',     label: 'Surprise',     frost: '#F3ECDE', accent: '#E8C5A0' },
  ] },
  { id: 'graduation', label: 'Graduation', emoji: '🎓', tone: 'butter', desc: 'Gold, confetti, milestones',
    themes: [
      { id: 'gold',        label: 'Gold',         frost: '#FCF8EF', accent: '#FFDC4A' },
      { id: 'confetti',    label: 'Confetti',     frost: '#FFE4E2', accent: '#6B0F1A' },
  ] },
  { id: 'eid', label: 'Eid', emoji: '🌙', tone: 'pink', desc: 'Seasonal',
    themes: [
      { id: 'classic',     label: 'Classic',      frost: '#E8C5A0', accent: '#6B0F1A' },
      { id: 'modern',      label: 'Modern',       frost: '#FCF8EF', accent: '#FFDC4A' },
  ] },
  { id: 'valentines', label: "Valentine's", emoji: '💌', tone: 'salmon', desc: 'For the one',
    themes: [
      { id: 'heart',       label: 'All hearts',   frost: '#FFBFBE', accent: '#E35F40' },
      { id: 'red-velvet',  label: 'Red velvet',   frost: '#6B0F1A', accent: '#FFBFBE' },
  ] },
  { id: 'wedding', label: 'Wedding', emoji: '💍', tone: 'cream', desc: 'Engagement, anniversaries',
    themes: [
      { id: 'classic-w',   label: 'Classic white', frost: '#FCF8EF', accent: '#FCF8EF' },
      { id: 'romantic',    label: 'Romantic',     frost: '#FFE4E2', accent: '#E35F40' },
  ] },
  { id: 'just-because', label: 'Just Because', emoji: '🤍', tone: 'cream', desc: 'No reason needed',
    themes: [
      { id: 'sweet',       label: 'Sweet little thing', frost: '#FFE4E2', accent: '#E35F40' },
      { id: 'sorry',       label: 'I’m sorry',          frost: '#FCF8EF', accent: '#6B0F1A' },
      { id: 'thank-you',   label: 'Thank you',          frost: '#A8D5BA', accent: '#FCF8EF' },
  ] },
];

const SHAPES = [
  { id: 'round',    label: 'Round',     hint: 'Classic, timeless',  addOn: 0 },
  { id: 'heart',    label: 'Heart',     hint: 'For the soft moments', addOn: 80 },
  { id: 'square',   label: 'Square',    hint: 'Modern, geometric',  addOn: 0 },
  { id: 'bento',    label: 'Bento',     hint: 'Tiny, intimate',     addOn: 0 },
  { id: 'number',   label: 'Number',    hint: 'Milestones',         addOn: 200 },
  { id: 'picture',  label: 'Photo cake',hint: 'A printed picture',  addOn: 150 },
];

// Real Nino's serving sizes & prices — verified against ninosbakeryeg.com live store
// May 2026 prices.
const SIZES = [
  { idx: 0,  label: 'Bento',    guests: '2–3',   dims: '10×8cm',      price: 550,   tag: '' },
  { idx: 1,  label: 'XS',       guests: '4–6',   dims: '14×12cm',     price: 1200,  tag: '' },
  { idx: 2,  label: 'Small',    guests: '6–10',  dims: '16×12cm',     price: 1400,  tag: 'Most loved' },
  { idx: 3,  label: 'Medium',   guests: '10–15', dims: '18×12cm',     price: 1850,  tag: '' },
  { idx: 4,  label: 'M+',       guests: '15–20', dims: '20×12cm',     price: 2300,  tag: '' },
  { idx: 5,  label: 'Large',    guests: '20–25', dims: '22×12cm',     price: 2800,  tag: 'Party' },
  { idx: 6,  label: 'L+',       guests: '25–30', dims: '24×12cm',     price: 3250,  tag: '' },
  { idx: 7,  label: 'XL',       guests: '30–35', dims: '26×12cm',     price: 3800,  tag: '' },
  { idx: 8,  label: 'XL+',      guests: '35–40', dims: '28×12cm',     price: 4300,  tag: '' },
  { idx: 9,  label: 'XXL',      guests: '40–45', dims: '30×12cm',     price: 4850,  tag: '' },
  { idx: 10, label: 'Grand',    guests: '50–55', dims: '32×12cm',     price: 5400,  tag: 'Showstopper' },
  { idx: 11, label: 'Massive',  guests: '60–70', dims: '34×12cm',     price: 6450,  tag: '' },
];

// Real Nino's flavors, bilingual, grouped by base.
const FLAVORS = [
  // — Vanilla —
  { id: 'vanilla-caramel',    sponge: 'Vanilla', filling: 'Caramel',           ar: 'فانيليا كاراميل',     base: 'Vanilla',   tag: '' },
  { id: 'vanilla-strawberry', sponge: 'Vanilla', filling: 'Strawberry',        ar: 'فانيليا ستروبيري',     base: 'Vanilla',   tag: 'Bestseller' },
  { id: 'vanilla-strawberry-fresh', sponge: 'Vanilla', filling: 'Strawberry (fresh)', ar: 'فانيليا ستروبيري (فرش)', base: 'Vanilla', tag: 'Seasonal' },
  { id: 'vanilla-raspberry',  sponge: 'Vanilla', filling: 'Raspberry',         ar: 'فانيليا راسبيري',    base: 'Vanilla',   tag: '' },
  { id: 'vanilla-blueberry',  sponge: 'Vanilla', filling: 'Blueberry',         ar: 'فانيليا بلوبيري',     base: 'Vanilla',   tag: '' },
  { id: 'lotus',              sponge: 'Vanilla', filling: 'Lotus crumb',       ar: 'لوتس',                  base: 'Vanilla',   tag: 'Cairo favorite' },
  { id: 'lemon-buttercream',  sponge: 'Lemon',   filling: 'Buttercream',       ar: 'ليمون',                 base: 'Vanilla',   tag: '' },
  { id: 'cookies-and-cream',  sponge: 'Vanilla', filling: 'Cookies & cream',   ar: 'كوكيس اند كريم',      base: 'Vanilla',   tag: '' },
  // — Chocolate —
  { id: 'chocolate-ganache',  sponge: 'Chocolate', filling: 'Ganache',         ar: 'شوكلاتة جناش',          base: 'Chocolate', tag: 'Bestseller' },
  { id: 'chocolate-caramel',  sponge: 'Chocolate', filling: 'Caramel croquant',ar: 'شوكلاتة كاراميل كروكانت', base: 'Chocolate', tag: '' },
  { id: 'chocolate-nutella',  sponge: 'Chocolate', filling: 'Nutella',         ar: 'شوكلاتة نوتلا',         base: 'Chocolate', tag: '' },
  { id: 'chocolate-peanut',   sponge: 'Chocolate', filling: 'Peanut butter',   ar: 'شوكلاتة بينت بتر',     base: 'Chocolate', tag: '' },
  { id: 'chocolate-crispy',   sponge: 'Chocolate', filling: 'Crispy',          ar: 'شوكلاتة كرسبي',          base: 'Chocolate', tag: '' },
  { id: 'oreo',               sponge: 'Chocolate', filling: 'Oreo cream',      ar: 'أوريو',                 base: 'Chocolate', tag: '' },
  // — Carrot —
  { id: 'carrot',             sponge: 'Carrot',  filling: 'Cream cheese',      ar: 'كيك كاروت',            base: 'Carrot',    tag: '' },
  // — Vegan —
  { id: 'vegan-chocolate',    sponge: 'Vegan chocolate', filling: 'Ganache',   ar: 'شوكلاتة جناش صيامي',  base: 'Vegan',     tag: 'V' },
  { id: 'vegan-chocolate-pb', sponge: 'Vegan chocolate', filling: 'Peanut butter', ar: 'شوكلاتة بينت بتر صيامي', base: 'Vegan', tag: 'V' },
  { id: 'vegan-vanilla',      sponge: 'Vegan vanilla',   filling: 'Buttercream',ar: 'فانيليا صيامي',     base: 'Vegan',     tag: 'V' },
];

// Cake decoration cover — buttercream or fondant
const CAKE_COVERS = [
  { id: 'buttercream', label: 'Buttercream', hint: 'Soft, piped, classic',    addOn: 0   },
  { id: 'fondant',     label: 'Fondant',     hint: 'Smooth, sculptural',      addOn: 250 },
];

const FROSTINGS = [
  { c: '#FFE4E2', name: 'Soft pink' },
  { c: '#FFBFBE', name: 'Rose' },
  { c: '#FBD8CF', name: 'Peach' },
  { c: '#FFDC4A', name: 'Butter' },
  { c: '#7FB0E7', name: 'Sky' },
  { c: '#A8D5BA', name: 'Pistachio' },
  { c: '#FCF8EF', name: 'Cream' },
  { c: '#6B0F1A', name: 'Burgundy' },
  { c: '#2A1A18', name: 'Cocoa' },
  { c: '#E8C5A0', name: 'Caramel' },
];

const TOPPING_PALETTE = [
  { kind: 'hearts',    label: 'Hearts'    },
  { kind: 'flowers',   label: 'Flowers'   },
  { kind: 'macarons',  label: 'Macarons'  },
  { kind: 'berries',   label: 'Berries'   },
  { kind: 'sprinkles', label: 'Sprinkles' },
  { kind: 'pearls',    label: 'Pearls'    },
];

const TOPPING_COLORS = [
  '#E35F40', '#6B0F1A', '#FFDC4A', '#FFBFBE', '#FFFFFF',
  '#2E9E82', '#7FB0E7', '#3D5A99', '#F39580', '#2A1A18',
];

const FLAVORS_DEPRECATED = [];

// === Reusable bits ===
function PanelTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 32,
        color: 'var(--ninos-ink)', lineHeight: 1.1,
        fontWeight: 400, textTransform: 'none', letterSpacing: '-0.01em',
        margin: 0,
      }}>{children}</h2>
      {sub && <p style={{
        fontFamily: 'var(--font-italic)', fontStyle: 'italic',
        fontSize: 15, color: 'var(--ninos-graphite)',
        marginTop: 6,
      }}>{sub}</p>}
    </div>
  );
}

// Pickable card — used for occasion / shape / size / flavor
function PickCard({ active, onClick, children, style = {}, glow = false }) {
  return (
    <button onClick={onClick} className="chip" style={{
      background: active ? 'var(--ninos-cream)' : '#fff',
      border: active ? '2px solid var(--ninos-salmon)' : '1.5px solid var(--border-soft)',
      borderRadius: 'var(--radius-md)',
      padding: 0, cursor: 'pointer', textAlign: 'left',
      transition: 'all 220ms var(--ease-frosting)',
      boxShadow: active ? 'var(--shadow-md)' : (glow ? 'var(--shadow-sm)' : 'var(--shadow-xs)'),
      position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      {children}
      {active && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          width: 24, height: 24, borderRadius: 999,
          background: 'var(--ninos-salmon)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'scale-in 220ms var(--ease-bounce)',
        }}>
          <Icon name="check" size={14}/>
        </div>
      )}
    </button>
  );
}

// === STEP PANELS ===

function StepOccasion({ cake, setCake }) {
  const selectedOcc = OCCASIONS.find(o => o.id === cake.occasion);
  function selectOccasion(o) {
    // pick first theme as default
    const theme = o.themes[0];
    setCake({
      ...cake, occasion: o.id, theme: theme.id,
      frostColor: theme.frost, toppingColor: theme.accent,
    });
  }
  function selectTheme(t) {
    setCake({ ...cake, theme: t.id, frostColor: t.frost, toppingColor: t.accent });
  }
  return (
    <div>
      <PanelTitle sub="every cake starts with a moment.">
        what are you <ScriptAccent style={{ fontSize: 36 }}>celebrating?</ScriptAccent>
      </PanelTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {OCCASIONS.map(o => (
          <PickCard key={o.id}
            active={cake.occasion === o.id}
            onClick={() => selectOccasion(o)}>
            <div style={{ padding: '14px 14px 14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 16,
                background: o.tone === 'pink' ? 'var(--ninos-pink-100)'
                  : o.tone === 'butter' ? 'var(--ninos-butter)'
                  : o.tone === 'sky' ? '#DCE9F7'
                  : o.tone === 'salmon' ? 'var(--ninos-salmon-100)'
                  : 'var(--ninos-paper)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, flexShrink: 0,
              }}>{o.emoji}</div>
              <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14,
                  color: 'var(--ninos-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.label}</div>
                <div style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic',
                  fontSize: 12, color: 'var(--ninos-stone)', marginTop: 2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.desc}</div>
              </div>
            </div>
          </PickCard>
        ))}
      </div>

      {/* Sub-theme picker */}
      {selectedOcc && (
        <div style={{ marginTop: 22, animation: 'float-up 320ms var(--ease-frosting)' }}>
          <Caption style={{ marginBottom: 10 }}>Pick a theme</Caption>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selectedOcc.themes.map(th => {
              const active = cake.theme === th.id;
              return (
                <button key={th.id} onClick={() => selectTheme(th)} className="chip" style={{
                  border: 0, padding: '8px 14px 8px 8px', borderRadius: 999,
                  background: active ? 'var(--ninos-ink)' : '#fff',
                  color: active ? 'var(--ninos-cream)' : 'var(--ninos-ink)',
                  fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.02em', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  boxShadow: active ? 'var(--shadow-md)' : 'var(--shadow-xs)',
                  transition: 'all 220ms var(--ease-frosting)',
                }}>
                  <span style={{
                    display: 'inline-flex', gap: 2, padding: 3, borderRadius: 999,
                    background: active ? 'rgba(255,255,255,0.14)' : 'var(--ninos-cream)',
                  }}>
                    <span style={{ width: 14, height: 14, borderRadius: 999, background: th.frost,
                      border: '1px solid rgba(0,0,0,0.08)' }}/>
                    <span style={{ width: 14, height: 14, borderRadius: 999, background: th.accent,
                      border: '1px solid rgba(0,0,0,0.08)' }}/>
                  </span>
                  {th.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StepShape({ cake, setCake }) {
  return (
    <div>
      <PanelTitle sub="silhouette, tiers, and the cover.">shape & <ScriptAccent style={{ fontSize: 36 }}>cover</ScriptAccent></PanelTitle>
      <Caption style={{ marginBottom: 10 }}>Silhouette</Caption>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {SHAPES.map(s => (
          <PickCard key={s.id}
            active={cake.shape === s.id}
            onClick={() => setCake({ ...cake, shape: s.id })}>
            <div style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8 }}>
              <ShapePreview shape={s.id} color={cake.frostColor}/>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 12,
                color: 'var(--ninos-ink)', textAlign: 'center' }}>{s.label}</div>
              {s.addOn > 0 && (
                <div style={{ fontSize: 10, color: 'var(--ninos-burgundy)',
                  fontFamily: 'var(--font-heading)', fontWeight: 600 }}>+EGP {s.addOn}</div>
              )}
            </div>
          </PickCard>
        ))}
      </div>
      <Caption style={{ marginTop: 18, marginBottom: 10 }}>Tiers</Caption>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { n: 1, label: 'Single', addOn: 0 },
          { n: 2, label: 'Two-tier', addOn: 580 },
          { n: 3, label: 'Three-tier', addOn: 1100 },
        ].map(t => {
          const active = cake.tiers === t.n;
          return (
            <button key={t.n} onClick={() => setCake({ ...cake, tiers: t.n })} style={{
              padding: '14px 10px',
              background: active ? 'var(--ninos-cream)' : '#fff',
              border: active ? '1.5px solid var(--ninos-salmon)' : '1px solid var(--border-soft)',
              borderRadius: 16, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              transition: 'all 220ms var(--ease-frosting)',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, marginBottom: 4 }}>
                {Array.from({length: t.n}).map((_, i) => (
                  <div key={i} style={{
                    width: 28 - i*5, height: 8,
                    background: cake.frostColor,
                    borderRadius: '50% / 30%',
                    border: '1px solid rgba(42,26,24,0.1)',
                  }}/>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 12,
                color: 'var(--ninos-ink)' }}>{t.label}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 10,
                color: 'var(--ninos-stone)', fontWeight: 500 }}>
                {t.addOn ? `+EGP ${t.addOn}` : 'included'}
              </div>
            </button>
          );
        })}
      </div>
      <Caption style={{ marginTop: 18, marginBottom: 10 }}>Cover</Caption>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {CAKE_COVERS.map(c => {
          const active = cake.cover === c.id;
          return (
            <button key={c.id} onClick={() => setCake({ ...cake, cover: c.id })} style={{
              padding: '14px 14px',
              background: active ? 'var(--ninos-cream)' : '#fff',
              border: active ? '1.5px solid var(--ninos-salmon)' : '1px solid var(--border-soft)',
              borderRadius: 16, cursor: 'pointer', textAlign: 'left',
              transition: 'all 220ms var(--ease-frosting)',
            }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 13,
                color: 'var(--ninos-ink)' }}>{c.label}</div>
              <div style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic',
                fontSize: 12, color: 'var(--ninos-stone)', marginTop: 2 }}>{c.hint}</div>
              {c.addOn > 0 && (
                <div style={{ fontSize: 10, color: 'var(--ninos-burgundy)',
                  fontFamily: 'var(--font-heading)', fontWeight: 600, marginTop: 4 }}>+EGP {c.addOn}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ShapePreview({ shape, color }) {
  const sz = 44;
  const c = color || '#FFE4E2';
  if (shape === 'heart') {
    return (
      <svg width={sz} height={sz} viewBox="0 0 32 32" fill={c}
        stroke="rgba(42,26,24,.18)" strokeWidth="1">
        <path d="M16 27.5s-9.5-5.9-12-11.4C2 11.5 5 6.5 10 6.5c2.5 0 4.4 1.2 6 3.3 1.6-2.1 3.5-3.3 6-3.3 5 0 8 5 6 9.6-2.5 5.5-12 11.4-12 11.4z"/>
      </svg>
    );
  }
  if (shape === 'square') {
    return <div style={{ width: sz, height: sz, borderRadius: 10, background: c, border: '1px solid rgba(42,26,24,.1)' }}/>;
  }
  if (shape === 'number') {
    return (
      <div style={{
        width: sz, height: sz, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--ninos-ink)',
        background: c, borderRadius: 10, border: '1px solid rgba(42,26,24,.1)', lineHeight: 1,
      }}>3</div>
    );
  }
  if (shape === 'bento') {
    return <div style={{ width: sz*0.7, height: sz*0.7, borderRadius: 8, background: c,
      border: '1px solid rgba(42,26,24,.1)', alignSelf: 'center' }}/>;
  }
  if (shape === 'picture') {
    return (
      <div style={{ width: sz, height: sz, borderRadius: '50%', background: c,
        border: '1px solid rgba(42,26,24,.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ width: sz*0.55, height: sz*0.55, borderRadius: '50%',
          background: 'var(--ninos-paper)', border: '1.5px solid var(--ninos-burgundy)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="image" size={14} color="var(--ninos-burgundy)"/>
        </div>
      </div>
    );
  }
  return <div style={{ width: sz, height: sz, borderRadius: '50%', background: c, border: '1px solid rgba(42,26,24,.1)' }}/>;
}

function Toggle({ label, value, onChange, disabled }) {
  return (
    <button onClick={() => !disabled && onChange(!value)} disabled={disabled} style={{
      width: '100%', marginTop: 14, padding: '14px 16px',
      background: value ? 'var(--ninos-cream)' : '#fff',
      border: value ? '1.5px solid var(--ninos-salmon)' : '1px solid var(--border-soft)',
      borderRadius: 14, cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 500,
      color: disabled ? 'var(--ninos-mist)' : 'var(--ninos-ink)',
      transition: 'all 220ms var(--ease-frosting)',
      opacity: disabled ? 0.5 : 1,
    }}>
      {label}
      <div style={{
        width: 36, height: 22, borderRadius: 999,
        background: value ? 'var(--ninos-salmon)' : 'var(--ninos-mist)',
        position: 'relative', transition: 'background 220ms',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: value ? 16 : 2,
          width: 18, height: 18, borderRadius: 999, background: '#fff',
          transition: 'left 220ms var(--ease-frosting)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
        }}/>
      </div>
    </button>
  );
}

function StepSize({ cake, setCake }) {
  return (
    <div>
      <PanelTitle sub="we bake to fit your table.">how big should it <ScriptAccent style={{ fontSize: 36 }}>be?</ScriptAccent></PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SIZES.map(s => (
          <PickCard key={s.idx}
            active={cake.sizeIdx === s.idx}
            onClick={() => setCake({ ...cake, sizeIdx: s.idx })}>
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Visual size dot — capped to avoid overflow */}
              <div style={{
                width: 28 + Math.min(s.idx, 6) * 3, height: 28 + Math.min(s.idx, 6) * 3,
                borderRadius: '50%', background: cake.frostColor || 'var(--ninos-pink-100)',
                border: '1.5px solid rgba(42,26,24,.1)',
                flexShrink: 0,
                boxShadow: 'inset -3px -2px 6px rgba(0,0,0,0.08)',
              }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14,
                    color: 'var(--ninos-ink)' }}>{s.label}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: 'var(--ninos-stone)' }}>
                    {s.guests} guests
                  </div>
                  {s.tag && (
                    <span style={{
                      background: s.tag === 'Most loved' ? 'var(--ninos-butter)'
                        : s.tag === 'Showstopper' ? 'var(--ninos-salmon)'
                        : 'var(--ninos-pink-100)',
                      color: s.tag === 'Most loved' ? '#3d2400'
                        : s.tag === 'Showstopper' ? '#fff'
                        : 'var(--ninos-burgundy)',
                      padding: '2px 8px', borderRadius: 999,
                      fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>{s.tag}</span>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic',
                  fontSize: 12, color: 'var(--ninos-stone)', marginTop: 4 }}>
                  {s.dims}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 15,
                color: 'var(--ninos-ink)', paddingRight: cake.sizeIdx === s.idx ? 30 : 0, flexShrink: 0 }}>
                EGP {s.price}
              </div>
            </div>
          </PickCard>
        ))}
      </div>
    </div>
  );
}

function StepFrosting({ cake, setCake }) {
  return (
    <div>
      <PanelTitle sub="the watcher's first impression.">a <ScriptAccent style={{ fontSize: 36 }}>color</ScriptAccent> for the frosting</PanelTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {FROSTINGS.map(f => {
          const active = cake.frostColor === f.c;
          return (
            <button key={f.c} className="chip" onClick={() => setCake({ ...cake, frostColor: f.c })} style={{
              border: 0, background: 'transparent', cursor: 'pointer', padding: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              transition: 'transform 220ms var(--ease-frosting)',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 18, background: f.c,
                boxShadow: active
                  ? '0 0 0 3px var(--ninos-cream), 0 0 0 6px var(--ninos-salmon), var(--shadow-md)'
                  : 'inset -4px -3px 8px rgba(0,0,0,0.08), var(--shadow-xs)',
                transform: active ? 'scale(1.08)' : 'scale(1)',
                border: f.c === '#FCF8EF' ? '1px solid rgba(42,26,24,.1)' : 'none',
                transition: 'all 220ms var(--ease-frosting)',
              }}/>
              <span style={{
                fontFamily: 'var(--font-heading)', fontSize: 10,
                color: active ? 'var(--ninos-burgundy)' : 'var(--ninos-graphite)',
                fontWeight: active ? 600 : 500, letterSpacing: '0.04em',
                textTransform: 'uppercase', textAlign: 'center',
              }}>{f.name}</span>
            </button>
          );
        })}
      </div>
      <div style={{
        marginTop: 18, padding: 14, borderRadius: 14,
        background: 'var(--bg-card-warm)',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <Icon name="sparkles" size={18} color="var(--ninos-salmon)"/>
        <div style={{ fontSize: 13, color: 'var(--ninos-graphite)', fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}>
          watch the cake update live — every choice shows up on the render to the side.
        </div>
      </div>
    </div>
  );
}

function StepToppings({ cake, setCake, onDragKind, draggingKind }) {
  function removeTopping(i) {
    setCake({ ...cake, toppings: cake.toppings.filter((_, idx) => idx !== i) });
  }
  function clearAll() {
    setCake({ ...cake, toppings: [] });
  }
  return (
    <div>
      <PanelTitle sub="drag any onto the cake. click a placed topping to remove.">
        sweet <ScriptAccent style={{ fontSize: 36 }}>toppings</ScriptAccent>
      </PanelTitle>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
      }}>
        {TOPPING_PALETTE.map(t => (
          <button
            key={t.kind}
            draggable
            onDragStart={() => onDragKind(t.kind)}
            onDragEnd={() => onDragKind(null)}
            onClick={() => onDragKind(draggingKind === t.kind ? null : t.kind)}
            style={{
              padding: '14px 12px',
              background: draggingKind === t.kind ? 'var(--ninos-pink-100)' : '#fff',
              border: draggingKind === t.kind ? '1.5px solid var(--ninos-salmon)' : '1px solid var(--border-soft)',
              borderRadius: 16, cursor: 'grab',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8,
              transition: 'all 220ms var(--ease-frosting)',
              fontFamily: 'var(--font-heading)', fontSize: 11,
              color: 'var(--ninos-ink)',
              fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'var(--ninos-paper)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ToppingPiece kind={t.kind} color={cake.toppingColor} size={26}/>
            </div>
            {t.label}
          </button>
        ))}
      </div>

      {draggingKind && (
        <div style={{
          marginTop: 14, padding: '10px 14px',
          background: 'var(--ninos-salmon)', color: '#fff', borderRadius: 999,
          fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 600,
          letterSpacing: '0.04em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 8,
          animation: 'scale-in 220ms var(--ease-bounce)',
        }}>
          <Icon name="sparkles" size={14}/>
          Placing {draggingKind} · click cake to drop · <button
            onClick={() => onDragKind(null)}
            style={{ background: 'transparent', border: 0, color: '#fff', textDecoration: 'underline',
              cursor: 'pointer', fontSize: 12, padding: 0, fontFamily: 'inherit' }}>cancel</button>
        </div>
      )}

      <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Caption>{cake.toppings.length} placed</Caption>
        {cake.toppings.length > 0 && (
          <button onClick={clearAll} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 500,
            color: 'var(--ninos-burgundy)', textDecoration: 'underline',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}><Icon name="trash" size={12}/> clear all</button>
        )}
      </div>
    </div>
  );
}

function StepTopColor({ cake, setCake }) {
  function applyToAll() {
    setCake({ ...cake, toppings: cake.toppings.map(t => ({ ...t, color: cake.toppingColor })) });
  }
  return (
    <div>
      <PanelTitle sub="changes the hearts, flowers, drips and signature.">
        the <ScriptAccent style={{ fontSize: 36 }}>accent</ScriptAccent> color
      </PanelTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {TOPPING_COLORS.map(c => {
          const active = cake.toppingColor === c;
          return (
            <button key={c} className="chip" onClick={() => setCake({ ...cake, toppingColor: c })} style={{
              border: 0, background: 'transparent', cursor: 'pointer', padding: 0,
              display: 'flex', justifyContent: 'center',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14, background: c,
                boxShadow: active
                  ? '0 0 0 3px var(--ninos-cream), 0 0 0 6px var(--ninos-salmon)'
                  : 'inset -3px -2px 6px rgba(0,0,0,0.1), var(--shadow-xs)',
                transform: active ? 'scale(1.08)' : 'scale(1)',
                border: c === '#FFFFFF' ? '1px solid rgba(42,26,24,.1)' : 'none',
                transition: 'all 220ms var(--ease-frosting)',
              }}/>
            </button>
          );
        })}
      </div>
      {cake.toppings.length > 0 && (
        <button onClick={applyToAll} style={{
          marginTop: 16, width: '100%', padding: '12px 16px',
          background: 'var(--ninos-pink-100)', color: 'var(--ninos-burgundy)',
          border: 0, borderRadius: 14, cursor: 'pointer',
          fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 600,
          letterSpacing: '0.02em',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="sparkles" size={14}/> Apply to all placed toppings
        </button>
      )}
    </div>
  );
}

function StepMessage({ cake, setCake }) {
  return (
    <div>
      <PanelTitle sub="two places to write — on the cake itself and on the board around it.">
        write a <ScriptAccent style={{ fontSize: 36 }}>message</ScriptAccent>
      </PanelTitle>

      <Caption style={{ marginBottom: 8 }}>On the cake · short</Caption>
      <MessageInput
        value={cake.message} max={32}
        placeholder="happy birthday"
        onChange={(v) => setCake({ ...cake, message: v })}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {['happy birthday', 'congrats!', 'eid mubarak', 'i love you', 'mabrouk'].map(p => (
          <ChipBtn key={p} onClick={() => setCake({ ...cake, message: p })}>{p}</ChipBtn>
        ))}
      </div>

      <Caption style={{ marginTop: 22, marginBottom: 8 }}>On the board · longer note</Caption>
      <MessageInput
        value={cake.boardMessage || ''} max={80}
        placeholder="lina, may year 28 be the loudest one yet — with love, mama"
        onChange={(v) => setCake({ ...cake, boardMessage: v })}
        multiline
      />
      <div style={{
        marginTop: 14, padding: 12, borderRadius: 14,
        background: 'var(--ninos-pink-50)',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <Icon name="sparkles" size={16} color="var(--ninos-burgundy)"/>
        <div style={{ fontSize: 12, color: 'var(--ninos-graphite)',
          fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}>
          the board sits underneath the cake — a wooden plate hand-lettered with your note.
          included free with all sizes from medium up.
        </div>
      </div>
    </div>
  );
}

function MessageInput({ value, onChange, max, placeholder, multiline }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div style={{ position: 'relative' }}>
      <Tag
        {...(multiline ? { rows: 2 } : { type: 'text' })}
        maxLength={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '16px 60px 16px 18px',
          background: '#fff', border: '1.5px solid var(--border-soft)',
          borderRadius: 18,
          fontFamily: 'var(--font-script)',
          fontSize: multiline ? 17 : 20,
          color: 'var(--ninos-burgundy)',
          outline: 'none', boxSizing: 'border-box',
          transition: 'border 220ms',
          resize: 'none',
          lineHeight: multiline ? 1.3 : 1.2,
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--ninos-salmon)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border-soft)'}
      />
      <div style={{
        position: 'absolute', right: 14, top: multiline ? 14 : '50%',
        transform: multiline ? 'none' : 'translateY(-50%)',
        fontSize: 11, color: 'var(--ninos-stone)',
        fontFamily: 'var(--font-heading)', fontWeight: 500,
      }}>{(value || '').length}/{max}</div>
    </div>
  );
}

function ChipBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'var(--ninos-paper)', color: 'var(--ninos-burgundy)',
      border: 0, padding: '8px 14px', borderRadius: 999,
      fontFamily: 'var(--font-script)', fontSize: 16,
      cursor: 'pointer', transition: 'all 220ms',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--ninos-pink-100)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--ninos-paper)'}>
      {children}
    </button>
  );
}

function StepFlavor({ cake, setCake }) {
  const [base, setBase] = useStateB('Vanilla');
  const bases = ['Vanilla', 'Chocolate', 'Carrot', 'Vegan'];
  const filtered = FLAVORS.filter(f => f.base === base);
  return (
    <div>
      <PanelTitle sub="sponge & filling. layers come with the size.">
        how should it <ScriptAccent style={{ fontSize: 36 }}>taste?</ScriptAccent>
      </PanelTitle>
      {/* Base filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {bases.map(b => {
          const active = base === b;
          return (
            <button key={b} onClick={() => setBase(b)} style={{
              padding: '7px 14px', borderRadius: 999,
              background: active ? 'var(--ninos-ink)' : '#fff',
              color: active ? 'var(--ninos-cream)' : 'var(--ninos-ink)',
              border: active ? 0 : '1px solid var(--border-soft)',
              fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              cursor: 'pointer',
            }}>{b}</button>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(f => (
          <PickCard key={f.id}
            active={cake.flavor === f.id}
            onClick={() => setCake({ ...cake, flavor: f.id })}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14,
                  color: 'var(--ninos-ink)' }}>{f.sponge}</div>
                <div style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic',
                  fontSize: 13, color: 'var(--ninos-graphite)' }}>with {f.filling.toLowerCase()}</div>
                {f.tag && f.tag !== 'V' && (
                  <span style={{
                    background: f.tag === 'Bestseller' ? 'var(--ninos-butter)' : 'var(--ninos-pink-100)',
                    color: f.tag === 'Bestseller' ? '#3d2400' : 'var(--ninos-burgundy)',
                    padding: '2px 8px', borderRadius: 999,
                    fontSize: 9, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>{f.tag}</span>
                )}
                {f.tag === 'V' && (
                  <span style={{
                    background: 'var(--ninos-teal)', color: '#fff',
                    width: 18, height: 18, borderRadius: 999,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-heading)',
                  }} title="Vegan">V</span>
                )}
              </div>
              <div style={{ fontFamily: 'var(--font-arabic)', fontSize: 13,
                color: 'var(--ninos-stone)', marginTop: 4, direction: 'rtl' }}>
                {f.ar}
              </div>
            </div>
          </PickCard>
        ))}
      </div>
    </div>
  );
}

function StepInspo({ cake, setCake }) {
  const inputRef = useRefB(null);
  function handleFile(e) {
    const f = e.target.files && e.target.files[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setCake({ ...cake, inspoUrl: url, inspoName: f.name });
    }
  }
  return (
    <div>
      <PanelTitle sub="optional. show us a photo, a screenshot, anything.">
        show us your <ScriptAccent style={{ fontSize: 36 }}>inspo</ScriptAccent>
      </PanelTitle>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile}/>
      {cake.inspoUrl ? (
        <div style={{
          position: 'relative', borderRadius: 18, overflow: 'hidden',
          border: '1px solid var(--border-soft)', background: '#fff',
        }}>
          <img src={cake.inspoUrl} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}/>
          <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic',
              fontSize: 13, color: 'var(--ninos-graphite)' }}>{cake.inspoName}</div>
            <button onClick={() => setCake({ ...cake, inspoUrl: null, inspoName: null })} style={{
              background: 'transparent', border: 0, cursor: 'pointer',
              color: 'var(--ninos-burgundy)', fontFamily: 'var(--font-heading)',
              fontSize: 12, fontWeight: 600, display: 'inline-flex', gap: 4, alignItems: 'center',
            }}><Icon name="trash" size={12}/> remove</button>
          </div>
        </div>
      ) : (
        <button onClick={() => inputRef.current.click()} style={{
          width: '100%', padding: '40px 24px',
          background: 'var(--ninos-paper)',
          border: '2px dashed var(--ninos-mist)',
          borderRadius: 20, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          transition: 'all 220ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ninos-salmon)';
          e.currentTarget.style.background = 'var(--ninos-pink-50)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--ninos-mist)';
          e.currentTarget.style.background = 'var(--ninos-paper)'; }}>
          <Icon name="upload" size={24} color="var(--ninos-salmon)"/>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14,
            color: 'var(--ninos-ink)' }}>Upload a reference</div>
          <div style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic',
            fontSize: 12, color: 'var(--ninos-stone)' }}>JPG, PNG, HEIC — we'll match the vibe</div>
        </button>
      )}
      <div style={{ marginTop: 14, fontFamily: 'var(--font-italic)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--ninos-stone)' }}>
        no inspo? that's fine — your cake is already a good idea.
      </div>
    </div>
  );
}

// Real Cairo delivery zones — from Nino's logistics
const DELIVERY_ZONES = [
  // 95 EGP zones (Cairo central + close suburbs)
  { en: 'New Cairo (1st)',    ar: 'التجمع الأول',         price: 95  },
  { en: 'New Cairo (3rd)',    ar: 'التجمع الثالث',         price: 95  },
  { en: '5th Settlement',     ar: 'التجمع الخامس',         price: 95  },
  { en: 'Maadi',              ar: 'المعادي',                 price: 95  },
  { en: 'Al Rehab',           ar: 'الرحاب',                  price: 95  },
  { en: 'Nasr City',          ar: 'مدينة نصر',              price: 95  },
  { en: 'Heliopolis',         ar: 'مصر الجديدة',            price: 95  },
  { en: 'Zamalek',            ar: 'الزمالك',                 price: 95  },
  { en: 'Mohandessin',        ar: 'المهندسين',              price: 95  },
  { en: 'Dokki',              ar: 'الدقي',                   price: 95  },
  { en: 'Sheikh Zayed',       ar: 'الشيخ زايد',            price: 95  },
  { en: '6th of October',     ar: 'مدينة ٦ أكتوبر',          price: 95  },
  { en: 'Giza',               ar: 'الجيزة',                  price: 95  },
  { en: 'Mokattam',           ar: 'المقطم',                  price: 95  },
  // 115 EGP zones (further)
  { en: 'Madinaty',           ar: 'مدينتي',                 price: 115 },
  { en: 'El Obour',           ar: 'العبور',                  price: 115 },
  { en: 'El Shorouk',         ar: 'الشروق',                  price: 115 },
  { en: 'Cairo–Alex Desert',  ar: 'الصحراوي',                price: 115 },
];

function StepDelivery({ cake, setCake }) {
  // Build 14-day calendar from earliest available (today + 1 day)
  const today = new Date(2026, 4, 15); // May 15, 2026
  const minDate = new Date(today); minDate.setDate(today.getDate() + 1);
  const days = [];
  for (let i = 0; i < 21; i++) {
    const d = new Date(minDate); d.setDate(minDate.getDate() + i);
    days.push(d);
  }
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAYS = ['S','M','T','W','T','F','S'];
  function isSelected(d) { return cake.deliveryDate === d.toISOString().slice(0,10); }
  function selectDay(d) { setCake({ ...cake, deliveryDate: d.toISOString().slice(0,10) }); }

  const timeSlots = ['10:00 – 12:00', '12:00 – 14:00', '14:00 – 16:00', '16:00 – 18:00', '18:00 – 20:00'];

  return (
    <div>
      <PanelTitle sub="we need 24 hours to bake it just right.">pick a <ScriptAccent style={{ fontSize: 36 }}>date</ScriptAccent></PanelTitle>
      <div style={{
        padding: 16, background: '#fff', borderRadius: 20,
        border: '1px solid var(--border-soft)',
      }}>
        <Caption style={{ marginBottom: 10 }}>{MONTHS[minDate.getMonth()]} – {MONTHS[days[days.length-1].getMonth()]} 2026</Caption>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {days.map((d, i) => {
            const active = isSelected(d);
            return (
              <button key={i} onClick={() => selectDay(d)} style={{
                aspectRatio: '1 / 1', border: 0,
                background: active ? 'var(--ninos-salmon)' : 'transparent',
                borderRadius: 12, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0,
                fontFamily: 'var(--font-heading)',
                transition: 'all 220ms var(--ease-frosting)',
                color: active ? '#fff' : 'var(--ninos-ink)',
              }}
              onMouseEnter={(e) => !active && (e.currentTarget.style.background = 'var(--ninos-pink-50)')}
              onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'transparent')}>
                <span style={{ fontSize: 9, opacity: 0.6, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{DAYS[d.getDay()]}</span>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>
      {cake.deliveryDate && (
        <div style={{ marginTop: 16, animation: 'float-up 280ms var(--ease-frosting)' }}>
          <Caption style={{ marginBottom: 8 }}>Delivery window</Caption>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {timeSlots.map(t => (
              <button key={t} onClick={() => setCake({ ...cake, deliveryTime: t })} style={{
                padding: '12px 14px',
                background: cake.deliveryTime === t ? 'var(--ninos-salmon)' : '#fff',
                color: cake.deliveryTime === t ? '#fff' : 'var(--ninos-ink)',
                border: cake.deliveryTime === t ? 0 : '1px solid var(--border-soft)',
                borderRadius: 12, cursor: 'pointer',
                fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 13,
                transition: 'all 220ms',
              }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Real Cairo delivery zones */}
      <Caption style={{ marginTop: 18, marginBottom: 8 }}>Delivery zone</Caption>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6,
        maxHeight: 200, overflowY: 'auto', padding: 6,
        background: '#fff', borderRadius: 14, border: '1px solid var(--border-soft)',
      }}>
        {DELIVERY_ZONES.map(z => {
          const active = cake.deliveryZone === z.en;
          return (
            <button key={z.en} onClick={() => setCake({ ...cake, deliveryZone: z.en, deliveryFee: z.price })} style={{
              padding: '8px 10px',
              background: active ? 'var(--ninos-cream)' : 'transparent',
              border: active ? '1px solid var(--ninos-salmon)' : '1px solid transparent',
              borderRadius: 10, cursor: 'pointer',
              fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 500,
              color: 'var(--ninos-ink)', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 220ms',
            }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{z.en}</span>
              <span style={{ color: 'var(--ninos-stone)', fontSize: 11, fontWeight: 500, flexShrink: 0, marginLeft: 6 }}>· {z.price}</span>
            </button>
          );
        })}
      </div>
      <div style={{
        marginTop: 14, padding: 12, borderRadius: 14,
        background: 'var(--ninos-pink-50)',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <Icon name="truck" size={18} color="var(--ninos-burgundy)"/>
        <div style={{ fontSize: 12, color: 'var(--ninos-graphite)',
          fontFamily: 'var(--font-italic)', fontStyle: 'italic' }}>
          most cairo zones EGP 95. madinaty / obour / shorouk / desert road EGP 115. need it sooner? <span style={{ color: 'var(--ninos-burgundy)', fontWeight: 600, fontStyle: 'normal' }}>whatsapp us</span>.
        </div>
      </div>
    </div>
  );
}

// === The wizard shell — routes step => panel ===
// Order matches STEPS: occasion, size, flavor, shape, frosting, toppings, accent, message, delivery, addons
function BuilderPanels({ step, cake, setCake, onDragKind, draggingKind }) {
  const panels = [
    <StepOccasion cake={cake} setCake={setCake}/>,
    <StepSize cake={cake} setCake={setCake}/>,
    <StepFlavor cake={cake} setCake={setCake}/>,
    <StepShape cake={cake} setCake={setCake}/>,
    <StepFrosting cake={cake} setCake={setCake}/>,
    <StepToppings cake={cake} setCake={setCake} onDragKind={onDragKind} draggingKind={draggingKind}/>,
    <StepTopColor cake={cake} setCake={setCake}/>,
    <StepMessage cake={cake} setCake={setCake}/>,
    <StepDelivery cake={cake} setCake={setCake}/>,
    <StepAddons cake={cake} setCake={setCake}/>,
  ];
  return (
    <div key={step} style={{ animation: 'float-up 320ms var(--ease-frosting)' }}>
      {panels[step]}
    </div>
  );
}

// Single-page canvas variant — all controls collapsed in accordions
function BuilderCanvas({ cake, setCake, onDragKind, draggingKind }) {
  const [open, setOpen] = useStateB(0);
  const panels = [
    { title: 'Occasion', body: <StepOccasion cake={cake} setCake={setCake}/> },
    { title: 'Size',     body: <StepSize cake={cake} setCake={setCake}/> },
    { title: 'Flavor',   body: <StepFlavor cake={cake} setCake={setCake}/> },
    { title: 'Shape',    body: <StepShape cake={cake} setCake={setCake}/> },
    { title: 'Frosting', body: <StepFrosting cake={cake} setCake={setCake}/> },
    { title: 'Toppings', body: <StepToppings cake={cake} setCake={setCake} onDragKind={onDragKind} draggingKind={draggingKind}/> },
    { title: 'Accent',   body: <StepTopColor cake={cake} setCake={setCake}/> },
    { title: 'Message',  body: <StepMessage cake={cake} setCake={setCake}/> },
    { title: 'Delivery', body: <StepDelivery cake={cake} setCake={setCake}/> },
    { title: 'Add-ons',  body: <StepAddons cake={cake} setCake={setCake}/> },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {panels.map((p, i) => (
        <div key={i} style={{
          background: '#fff', border: '1px solid var(--border-soft)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          <button onClick={() => setOpen(open === i ? -1 : i)} style={{
            width: '100%', padding: '14px 18px', background: 'transparent', border: 0,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'var(--font-heading)', fontWeight: 600,
            fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase',
            color: 'var(--ninos-ink)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 22, height: 22, borderRadius: 999,
                background: 'var(--ninos-cream)',
                fontSize: 11, fontWeight: 600, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'var(--ninos-burgundy)',
              }}>{i+1}</span>
              {p.title}
            </span>
            <Icon name="chevron-down" size={16}/>
          </button>
          {open === i && (
            <div style={{ padding: '4px 18px 20px', borderTop: '1px solid var(--border-soft)' }}>
              {p.body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  STEPS, OCCASIONS, SHAPES, SIZES, FLAVORS, CAKE_COVERS, TOPPING_PALETTE, TOPPING_COLORS,
  BuilderPanels, BuilderCanvas, PanelTitle, PickCard, ChipBtn,
});
