// addons.jsx — Nino's one-stop-shop add-ons.
//
// Built from live ninosbakeryeg.com pricing (May 2026) +
// Maison de Fete category model for party-supply SKUs.

const ADDONS = [
  // ────── Goodies (cakes & bakes, from Nino's Goodies collection) ──────
  { id: 'cake-pops',         cat: 'goodies',  name: 'Cake Pops · box',         ar: 'كيك بوب',         price: 250,  color: '#FFDC4A', icon: 'sparkles' },
  { id: 'cake-popsicles',    cat: 'goodies',  name: 'Cake Popsicles · box',    ar: 'كيك بوب ستيك',    price: 320,  color: '#FFE4E2', icon: 'sparkles' },
  { id: 'cake-pop-rose',     cat: 'goodies',  name: 'Cake Pop Roses · 1',      ar: 'كيك بوب روز',     price: 600,  color: '#FFBFBE', icon: 'sparkles', tag: 'Show-off' },
  { id: 'cupcakes',          cat: 'goodies',  name: 'Cupcakes · 6/12',         ar: 'كب كيك',          price: 280,  color: '#FFBFBE', icon: 'cake', tag: 'Most loved' },
  { id: 'cookies',           cat: 'goodies',  name: 'Cookies of Love · box',   ar: 'كوكيز',           price: 250,  color: '#E8C5A0', icon: 'star' },
  { id: 'brownies',          cat: 'goodies',  name: 'Brownies · box',          ar: 'براوني',          price: 280,  color: '#6B0F1A', icon: 'star' },
  { id: 'buttercream-bouquet', cat: 'goodies', name: 'Buttercream Floral Bouquet', ar: 'باتركريم فلور بوكيه', price: 480, color: '#A8D5BA', icon: 'sparkles' },
  { id: 'artistic-kit',      cat: 'goodies',  name: 'Artistic Decorating Kit', ar: 'كيت تزيين الكيكة', price: 650, color: '#FFE4E2', icon: 'sparkles', tag: 'New' },

  // ────── Mugnificent Cakes (cake-in-a-mug) ──────
  { id: 'mug-cloudy',        cat: 'mugs',     name: 'Cloudy & Cozy Mug Cake',  ar: 'موج كيك كلاودي',  price: 790,  color: '#FCF8EF', icon: 'cake' },
  { id: 'mug-coquette',      cat: 'mugs',     name: 'Birthday Coquette Mug',   ar: 'موج كيك كوكيت',   price: 790,  color: '#FFBFBE', icon: 'cake' },
  { id: 'mug-bride',         cat: 'mugs',     name: 'Bride To Be Mug Cake',    ar: 'موج كيك العروسة', price: 790,  color: '#FCF8EF', icon: 'cake' },
  { id: 'mug-lilly',         cat: 'mugs',     name: 'Lilly of My Life Mug',    ar: 'موج كيك ليلي',    price: 790,  color: '#A8D5BA', icon: 'cake' },

  // ────── Cards (Nino's Cards collection) ──────
  { id: 'card-3ash-sahby',   cat: 'cards',    name: "3ash ya Sahby",           ar: 'عاش يا صاحبي',    price: 40,   color: '#FFE4E2', icon: 'heart' },
  { id: 'card-million-sana', cat: 'cards',    name: "3o2bal Million Sana",     ar: 'عقبال مليون سنة', price: 70,   color: '#FFDC4A', icon: 'heart' },
  { id: 'card-alf-salama',   cat: 'cards',    name: 'Alf Salama (Get Well)',   ar: 'ألف سلامة',       price: 55,   color: '#FFBFBE', icon: 'heart' },
  { id: 'card-bahebek-mama', cat: 'cards',    name: 'Bahebek ya Mama',         ar: 'بحبك يا ماما',    price: 55,   color: '#FFBFBE', icon: 'heart' },
  { id: 'card-cake-walk',    cat: 'cards',    name: 'Cake Walk Birthday',      ar: 'بطاقة عيد ميلاد', price: 50,   color: '#FFE4E2', icon: 'heart' },
  { id: 'card-watermelon',   cat: 'cards',    name: 'Bahebek Watermelon',      ar: 'بحبك بطيخة',      price: 55,   color: '#E35F40', icon: 'heart' },

  // ────── Flowers (real bouquets) ──────
  { id: 'roses-bouquet',     cat: 'flowers',  name: 'Roses Bouquet',           ar: 'بوكيه ورد',       price: 850,  color: '#E35F40', icon: 'sparkles', tag: 'Bestseller' },
  { id: 'pastel-bouquet',    cat: 'flowers',  name: 'Pastel Pink Bouquet',     ar: 'بوكيه بنك',       price: 720,  color: '#FFBFBE', icon: 'sparkles' },
  { id: 'sunflower-bouquet', cat: 'flowers',  name: 'Sunflower Bouquet',       ar: 'بوكيه عبّاد',     price: 650,  color: '#FFDC4A', icon: 'sparkles' },

  // ────── Candles ──────
  { id: 'numbers-gold',      cat: 'candles',  name: 'Gold Number Candles',     ar: 'شمع أرقام ذهبي',  price: 90,   color: '#FFDC4A', icon: 'star' },
  { id: 'numbers-silver',    cat: 'candles',  name: 'Silver Number Candles',   ar: 'شمع أرقام فضي',   price: 90,   color: '#C9BFBC', icon: 'star' },
  { id: 'letter-candles',    cat: 'candles',  name: 'Letter Candles',          ar: 'شمع حروف',        price: 110,  color: '#FFE4E2', icon: 'star' },
  { id: 'mermaid-candles',   cat: 'candles',  name: 'Mermaid Candles',         ar: 'شمع ميرميد',      price: 95,   color: '#7FB0E7', icon: 'star' },
  { id: 'ombre-pink',        cat: 'candles',  name: 'Ombré Pink Candles',      ar: 'شمع أومبري بنك',  price: 75,   color: '#FFBFBE', icon: 'star' },
  { id: 'ombre-purple',      cat: 'candles',  name: 'Ombré Purple Candles',    ar: 'شمع أومبري بنفسجي', price: 75, color: '#9B7EDC', icon: 'star' },
  { id: 'ombre-blue',        cat: 'candles',  name: 'Ombré Baby Blue Candles', ar: 'شمع أومبري بلو',  price: 75,   color: '#7FB0E7', icon: 'star' },
  { id: 'sparkle-fountain',  cat: 'candles',  name: 'Sparkle Fountain',        ar: 'فوارة شمع',       price: 120,  color: '#FFDC4A', icon: 'sparkles', tag: 'Wow' },

  // ────── Toppers ──────
  { id: 'happy-bday-topper', cat: 'toppers',  name: 'Happy Birthday Topper',   ar: 'توبر هابي بيرثداي', price: 90,  color: '#FFDC4A', icon: 'sparkles' },
  { id: 'gold-ring-topper',  cat: 'toppers',  name: 'Gold Ring Topper',        ar: 'توبر خاتم ذهبي',  price: 110,  color: '#FFDC4A', icon: 'sparkles' },
  { id: 'number-topper',     cat: 'toppers',  name: 'Number Topper',           ar: 'توبر رقم',        price: 75,   color: '#E35F40', icon: 'sparkles' },
  { id: 'jungle-topper',     cat: 'toppers',  name: 'Jungle Topper',           ar: 'توبر جانجل',      price: 95,   color: '#A8D5BA', icon: 'sparkles' },
  { id: 'circle-topper',     cat: 'toppers',  name: 'Birthday Circle Topper',  ar: 'توبر دايرة',      price: 85,   color: '#FFBFBE', icon: 'sparkles' },

  // ────── Balloons ──────
  { id: 'balloon-bunch',     cat: 'balloons', name: 'Balloon Bunch · 5',       ar: 'بالونات ٥',       price: 180,  color: '#FFBFBE', icon: 'gift' },
  { id: 'balloon-bunch-big', cat: 'balloons', name: 'Balloon Bunch · 12',      ar: 'بالونات ١٢',      price: 420,  color: '#FFBFBE', icon: 'gift' },
  { id: 'balloon-helium',    cat: 'balloons', name: 'Helium Balloon · 1',      ar: 'بالون هيليوم',    price: 60,   color: '#7FB0E7', icon: 'gift' },
  { id: 'balloon-arch',      cat: 'balloons', name: 'Balloon Arch',            ar: 'قوس بالونات',     price: 850,  color: '#FFE4E2', icon: 'gift', tag: 'Show-off' },
  { id: 'balloon-foil',      cat: 'balloons', name: 'Foil Number Balloon',     ar: 'بالون رقم فويل',  price: 240,  color: '#FFDC4A', icon: 'gift' },

  // ────── Tableware (Maison de Fete-style) ──────
  { id: 'plates-10',         cat: 'tableware', name: 'Party Plates · 10',     ar: 'أطباق ١٠',         price: 95,   color: '#FFE4E2', icon: 'gift' },
  { id: 'plates-20',         cat: 'tableware', name: 'Party Plates · 20',     ar: 'أطباق ٢٠',         price: 170,  color: '#FFE4E2', icon: 'gift' },
  { id: 'cups-10',           cat: 'tableware', name: 'Party Cups · 10',       ar: 'أكواب ١٠',         price: 75,   color: '#FFBFBE', icon: 'gift' },
  { id: 'napkins-20',        cat: 'tableware', name: 'Napkins · 20',          ar: 'فوط ٢٠',           price: 45,   color: '#FFE4E2', icon: 'gift' },
  { id: 'cutlery-10',        cat: 'tableware', name: 'Cutlery Set · 10',      ar: 'أدوات مائدة ١٠',   price: 90,   color: '#C9BFBC', icon: 'gift' },
  { id: 'tablecloth',        cat: 'tableware', name: 'Tablecloth',            ar: 'مفرش',             price: 120,  color: '#FCF8EF', icon: 'gift' },
  { id: 'placemats-10',      cat: 'tableware', name: 'Printed Placemats · 10',ar: 'بليسمات مطبوعة',   price: 180,  color: '#FFBFBE', icon: 'gift' },
  { id: 'paper-favors-10',   cat: 'tableware', name: 'Paper Giveaway Bags · 10', ar: 'أكياس هدايا',  price: 220,  color: '#FFDC4A', icon: 'gift' },
  { id: 'candy-jars-6',      cat: 'tableware', name: 'Candy Containers · 6',  ar: 'علب حلويات ٦',    price: 280,  color: '#FFBFBE', icon: 'gift' },

  // ────── Custom-printed ──────
  { id: 'juice-bottles-10',  cat: 'printed',  name: 'Custom Juice Bottles · 10', ar: 'زجاجات عصير', price: 320,  color: '#A8D5BA', icon: 'gift', tag: 'Personalized' },
  { id: 'tissue-box',        cat: 'printed',  name: 'Custom Tissue Box',     ar: 'علبة مناديل',     price: 140,  color: '#FCF8EF', icon: 'gift' },
  { id: 'stickers-20',       cat: 'printed',  name: 'Custom Stickers · 20',  ar: 'استكرز مخصصة',    price: 90,   color: '#FFDC4A', icon: 'gift' },
  { id: 'garlands',          cat: 'printed',  name: 'Name Garland',           ar: 'جارلاند بالأسم', price: 280,  color: '#FFBFBE', icon: 'gift', tag: 'Personalized' },

  // ────── Cake Stands ──────
  { id: 'stand-marble',      cat: 'stands',   name: 'Marble Cake Stand',     ar: 'ستاند رخام',      price: 220,  color: '#FCF8EF', icon: 'cake' },
  { id: 'stand-gold',        cat: 'stands',   name: 'Gold Cake Stand',       ar: 'ستاند ذهبي',      price: 280,  color: '#FFDC4A', icon: 'cake' },
  { id: 'stand-acrylic',     cat: 'stands',   name: 'Acrylic Cake Stand',    ar: 'ستاند أكرليك',    price: 180,  color: '#DCE9F7', icon: 'cake' },

  // ────── Mini Bites (savory party food) ──────
  { id: 'mini-pizza-kg',     cat: 'savory',   name: 'Mini Pizzas · 1kg',     ar: 'مني بيتزا',        price: 360,  color: '#E35F40', icon: 'gift' },
  { id: 'mini-burgers-kg',   cat: 'savory',   name: 'Mini Burgers · 1kg',    ar: 'مني برجر',         price: 560,  color: '#E35F40', icon: 'gift' },
  { id: 'mini-sandwiches-kg',cat: 'savory',   name: 'Mini Sandwiches · 1kg', ar: 'مني ساندوش',       price: 460,  color: '#E35F40', icon: 'gift' },
  { id: 'sausage-rolls-kg',  cat: 'savory',   name: 'Mini Sausage Rolls · 1kg', ar: 'مني سوسيس',     price: 420,  color: '#E35F40', icon: 'gift' },

  // ────── Tea Biscuits (separate collection) ──────
  { id: 'kahk-aniseed',      cat: 'biscuits', name: 'Libyan Kahk · Aniseed', ar: 'كحك ليبي يانسون',  price: 220,  color: '#E8C5A0', icon: 'star' },
  { id: 'kahk-salted',       cat: 'biscuits', name: 'Libyan Kahk · Salted',  ar: 'كحك ليبي مالح',    price: 220,  color: '#E8C5A0', icon: 'star' },
];

const ADDON_CATS = [
  { id: 'all',       label: 'All' },
  { id: 'goodies',   label: 'Goodies' },
  { id: 'mugs',      label: 'Mug Cakes' },
  { id: 'cards',     label: 'Cards' },
  { id: 'flowers',   label: 'Flowers' },
  { id: 'candles',   label: 'Candles' },
  { id: 'toppers',   label: 'Toppers' },
  { id: 'balloons',  label: 'Balloons' },
  { id: 'tableware', label: 'Tableware' },
  { id: 'printed',   label: 'Personalized' },
  { id: 'stands',    label: 'Cake Stands' },
  { id: 'savory',    label: 'Mini Bites' },
  { id: 'biscuits',  label: 'Tea Biscuits' },
];

// Used as builder step
function StepAddons({ cake, setCake }) {
  const [cat, setCat] = React.useState('all');
  const filtered = cat === 'all' ? ADDONS : ADDONS.filter(a => a.cat === cat);
  const selected = cake.addons || {};
  function getQty(id) { return selected[id] || 0; }
  function setQty(id, q) {
    const next = { ...selected };
    if (q <= 0) delete next[id]; else next[id] = q;
    setCake({ ...cake, addons: next });
  }
  const totalAddons = Object.entries(selected).reduce((sum, [id, q]) => {
    const a = ADDONS.find(x => x.id === id);
    return sum + (a ? a.price * q : 0);
  }, 0);
  const totalItems = Object.values(selected).reduce((a, b) => a + b, 0);

  return (
    <div>
      <PanelTitle sub="cake + everything else. one delivery, one order.">
        complete the <ScriptAccent style={{ fontSize: 36 }}>celebration</ScriptAccent>
      </PanelTitle>

      {/* Category pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {ADDON_CATS.map(c => {
          const active = cat === c.id;
          const count = c.id === 'all' ? ADDONS.length : ADDONS.filter(a => a.cat === c.id).length;
          return (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              padding: '7px 14px', borderRadius: 999,
              background: active ? 'var(--ninos-ink)' : '#fff',
              color: active ? 'var(--ninos-cream)' : 'var(--ninos-ink)',
              border: active ? 0 : '1px solid var(--border-soft)',
              fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {c.label}
              <span style={{ fontSize: 9, opacity: 0.55 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of add-ons */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
        maxHeight: 420, overflowY: 'auto', paddingRight: 4, marginBottom: 4,
      }}>
        {filtered.map(a => (
          <AddonCard key={a.id} addon={a}
            qty={getQty(a.id)}
            onAdd={() => setQty(a.id, getQty(a.id) + 1)}
            onSub={() => setQty(a.id, getQty(a.id) - 1)}/>
        ))}
      </div>

      {/* Running add-on total */}
      {totalAddons > 0 && (
        <div style={{
          marginTop: 14, padding: '14px 16px',
          background: 'var(--bg-card-warm)', borderRadius: 14,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          animation: 'float-up 220ms var(--ease-frosting)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="gift" size={16} color="var(--ninos-burgundy)"/>
            <Caption>{totalItems} item{totalItems !== 1 ? 's' : ''} added</Caption>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16,
            color: 'var(--ninos-ink)' }}>+EGP {totalAddons}</div>
        </div>
      )}
      <div style={{ marginTop: 12, fontFamily: 'var(--font-italic)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--ninos-stone)' }}>
        skip if you don't need anything — your cake is enough on its own.
      </div>
    </div>
  );
}

function AddonCard({ addon, qty, onAdd, onSub }) {
  const active = qty > 0;
  return (
    <div style={{
      background: '#fff',
      border: active ? '1.5px solid var(--ninos-salmon)' : '1px solid var(--border-soft)',
      borderRadius: 14, padding: 12,
      display: 'flex', flexDirection: 'column', gap: 8,
      boxShadow: active ? 'var(--shadow-sm)' : 'var(--shadow-xs)',
      transition: 'all 220ms var(--ease-frosting)',
      position: 'relative',
    }}>
      <div style={{
        width: '100%', height: 70, borderRadius: 10,
        background: addon.color, position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={addon.icon} size={32} color="rgba(42,26,24,0.5)" strokeWidth={1.5}/>
        {addon.tag && (
          <div style={{
            position: 'absolute', top: 6, left: 6,
            background: 'rgba(252,248,239,0.9)', color: 'var(--ninos-burgundy)',
            padding: '2px 7px', borderRadius: 999,
            fontFamily: 'var(--font-heading)', fontSize: 8, fontWeight: 600,
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>{addon.tag}</div>
        )}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 12,
          color: 'var(--ninos-ink)', lineHeight: 1.2 }}>{addon.name}</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600,
          color: 'var(--ninos-burgundy)', marginTop: 2 }}>EGP {addon.price}</div>
      </div>
      {qty === 0 ? (
        <button onClick={onAdd} style={{
          width: '100%', padding: '8px 10px', borderRadius: 10, border: 0,
          background: 'var(--ninos-cream)', color: 'var(--ninos-ink)',
          fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 11,
          letterSpacing: '0.04em', textTransform: 'uppercase',
          cursor: 'pointer', display: 'inline-flex', justifyContent: 'center',
          alignItems: 'center', gap: 6, transition: 'all 220ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ninos-salmon)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ninos-cream)'; e.currentTarget.style.color = 'var(--ninos-ink)'; }}>
          <Icon name="plus" size={12}/> Add
        </button>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--ninos-salmon)', borderRadius: 10, padding: 4,
        }}>
          <button onClick={onSub} style={{
            background: 'transparent', border: 0, color: '#fff',
            width: 26, height: 26, borderRadius: 7, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="minus" size={12}/></button>
          <div style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13 }}>{qty}</div>
          <button onClick={onAdd} style={{
            background: 'rgba(255,255,255,0.18)', border: 0, color: '#fff',
            width: 26, height: 26, borderRadius: 7, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="plus" size={12}/></button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ADDONS, ADDON_CATS, StepAddons, AddonCard });
