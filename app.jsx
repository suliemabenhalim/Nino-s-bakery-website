// app.jsx — the orchestrator. Header, step nav, layout switching,
// summary/cart/confirmation, achievement moment, tweaks.

const { useState, useEffect, useMemo, useRef } = React;

// === Tweak defaults ===
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#E35F40",
  "layout": "render-left",
  "background": "cream",
  "renderStyle": "illustrated",
  "language": "en",
  "stepUI": "wizard",
  "showAllTiers": false
}/*EDITMODE-END*/;

// Apply primary color override to CSS var
function applyPrimary(color) {
  const root = document.documentElement;
  root.style.setProperty('--ninos-salmon', color);
  // Also relate the glow
  const rgb = hexToRgb(color);
  root.style.setProperty('--shadow-glow-salmon',
    `0 12px 36px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.32)`);
}
function hexToRgb(hex) {
  const num = parseInt(hex.slice(1), 16);
  return { r: (num>>16)&255, g: (num>>8)&255, b: num&255 };
}

// Initial cake state
function makeInitialCake() {
  return {
    occasion: 'birthday-adults',
    theme: 'aesthetic',
    shape: 'round',
    sizeIdx: 2,
    tiers: 2,
    frostColor: '#FFE4E2',
    toppings: [
      { kind: 'hearts',   color: '#E35F40', x: 0.30, y: 0.40 },
      { kind: 'hearts',   color: '#E35F40', x: 0.50, y: 0.30 },
      { kind: 'hearts',   color: '#E35F40', x: 0.70, y: 0.45 },
      { kind: 'flowers',  color: '#FFDC4A', x: 0.40, y: 0.65 },
      { kind: 'flowers',  color: '#FFDC4A', x: 0.62, y: 0.62 },
    ],
    toppingColor: '#E35F40',
    message: '',
    boardMessage: '',
    flavor: 'vanilla-strawberry',
    inspoUrl: null, inspoName: null,
    deliveryDate: null,
    deliveryTime: null,
  };
}

// Fork a preset into a fresh cake state — keep size/delivery from the preset
// but allow customization. Used when user picks from catalog or inspo flow.
function forkPreset(preset, opts = {}) {
  const base = makeInitialCake();
  return {
    ...base,
    occasion: preset.occasion || base.occasion,
    theme: preset.theme || base.theme,
    shape: preset.shape || base.shape,
    tiers: preset.tiers || base.tiers,
    sizeIdx: preset.sizeIdx != null ? preset.sizeIdx : base.sizeIdx,
    frostColor: preset.frostColor || base.frostColor,
    toppings: preset.toppings ? preset.toppings.map(t => ({ ...t })) : base.toppings,
    toppingColor: preset.toppingColor || base.toppingColor,
    message: preset.message || base.message,
    flavor: preset.flavor || base.flavor,
    inspoUrl: opts.inspoUrl || null,
    inspoName: opts.inspoName || null,
  };
}

// Pricing equation — transparent, modular, real Nino's prices
function computePrice(cake) {
  const sizes = window.SIZES || [];
  const size = sizes.find(s => s.idx === cake.sizeIdx);
  let base = size ? size.price : 1350;
  // Tier add-ons (Cake 2-layer / 3-layer pricing from Nino's menu)
  if (cake.tiers === 2) base += 580;
  if (cake.tiers === 3) base += 1100;
  // Shape add-ons
  if (cake.shape === 'heart')   base += 80;
  if (cake.shape === 'number')  base += 200;
  if (cake.shape === 'picture') base += 150;
  // Cover add-on
  if (cake.cover === 'fondant') base += 250;
  // Toppings overage
  if (cake.toppings && cake.toppings.length > 8) base += 60;
  // Board message
  if (cake.boardMessage && cake.boardMessage.length > 0) base += 40;
  // Inspo custom-design fee
  if (cake.inspoUrl) base += 120;
  // Add-ons subtotal
  if (cake.addons) {
    const ADDONS = window.ADDONS || [];
    Object.entries(cake.addons).forEach(([id, qty]) => {
      const a = ADDONS.find(x => x.id === id);
      if (a) base += a.price * qty;
    });
  }
  return base;
}

// === Header ===
function AppHeader({ language, t, onLanguageToggle, cartCount, onHome, view }) {
  const navItems = [
    { key: 'catalog',   label: t.shop,    onClick: () => onHome('catalog') },
    { key: 'builder',   label: t.builder, onClick: () => onHome('builder') },
    { key: 'studio',    label: t.studio,  onClick: () => onHome('studio')  },
    { key: 'inspo',     label: t.inspo,   onClick: () => onHome('inspo')   },
    { key: 'about',     label: t.about,   onClick: () => {} },
  ];
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 32px',
      borderBottom: '1px solid var(--border-soft)',
      background: 'rgba(252,248,239,0.86)',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <button onClick={() => onHome('landing')} style={{
          background: 'transparent', border: 0, cursor: 'pointer', padding: 0,
        }}>
          <HeartIWordmark size={28} color="var(--ninos-ink)"/>
        </button>
        <nav style={{ display: 'flex', gap: 6 }}>
          {navItems.map((n) => (
            <button key={n.key} onClick={n.onClick} style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 13, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase',
              color: view === n.key ? 'var(--ninos-burgundy)' : 'var(--ninos-graphite)',
              border: 0, cursor: 'pointer',
              padding: '8px 12px', borderRadius: 999,
              background: view === n.key ? 'var(--ninos-butter)' : 'transparent',
              transition: 'all 220ms', whiteSpace: 'nowrap',
            }}>{n.label}</button>
          ))}
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onLanguageToggle} style={{
          background: 'transparent', border: '1px solid var(--border-soft)',
          borderRadius: 999, padding: '8px 14px',
          fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 600,
          letterSpacing: '0.06em', cursor: 'pointer',
          color: 'var(--ninos-ink)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="globe" size={13}/>
          {language === 'en' ? 'العربية' : 'English'}
        </button>
        <button style={{
          background: 'transparent', border: '1px solid var(--border-soft)',
          borderRadius: 999, width: 38, height: 38, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ninos-ink)',
        }}>
          <Icon name="user" size={16}/>
        </button>
        <button style={{
          background: 'var(--ninos-ink)', color: 'var(--ninos-cream)',
          border: 0, borderRadius: 999, padding: '8px 16px 8px 12px',
          fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 500,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 8, position: 'relative',
        }}>
          <Icon name="shopping-bag" size={15}/>
          {t.cart} · {cartCount}
        </button>
      </div>
    </header>
  );
}

// === Step header (above panel) ===
function StepHeader({ step, total, stepName, t }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
        <Caption style={{ minWidth: 0 }}>
          {t.step} {step+1} {t.of} {total} <span style={{ color: 'var(--ninos-ink)', marginLeft: 8 }}>· {stepName}</span>
        </Caption>
        <button style={{
          background: 'transparent', border: 0, cursor: 'pointer',
          fontFamily: 'var(--font-italic)', fontStyle: 'italic',
          fontSize: 13, color: 'var(--ninos-graphite)', textDecoration: 'underline',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>{t.save}</button>
      </div>
      <div style={{ display: 'flex', gap: 3, height: 5 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, borderRadius: 2,
            background: i <= step ? 'var(--ninos-salmon)' : 'rgba(42,26,24,.08)',
            transition: 'background 320ms var(--ease-frosting)',
          }}/>
        ))}
      </div>
    </div>
  );
}

// === Summary / review screen ===
function SummaryScreen({ cake, t, onBack, onAdd }) {
  const price = computePrice(cake);
  const occ = (window.OCCASIONS || []).find(o => o.id === cake.occasion);
  const sz = (window.SIZES || []).find(s => s.idx === cake.sizeIdx);
  const fl = (window.FLAVORS || []).find(f => f.id === cake.flavor);
  return (
    <div style={{ animation: 'float-up 480ms var(--ease-frosting)' }}>
      <Caption style={{ marginBottom: 8 }}>{t.almost}</Caption>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 1.05,
        color: 'var(--ninos-ink)', margin: 0, fontWeight: 400, textTransform: 'none',
        letterSpacing: '-0.01em',
      }}>
        {t.yourCake}, <ScriptAccent style={{ fontSize: 44 }}>ready to bake</ScriptAccent>
      </h2>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SummaryRow label={t.occasion} value={occ ? occ.label : '—'}/>
        <SummaryRow label={t.shape} value={`${cake.shape} · ${cake.tiers} tier${cake.tiers > 1 ? 's' : ''}`}/>
        <SummaryRow label={t.size} value={sz ? `${sz.label} · ${sz.guests} guests` : '—'}/>
        <SummaryRow label={t.frosting} value={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 18, height: 18, borderRadius: 6, background: cake.frostColor,
            border: '1px solid rgba(42,26,24,0.1)' }}/>
          {(window.FROSTINGS || []).find(f => f.c === cake.frostColor)?.name || cake.frostColor}
        </span>}/>
        <SummaryRow label={t.toppings} value={`${cake.toppings.length} placed`}/>
        <SummaryRow label={t.message} value={cake.message
          ? <ScriptAccent style={{ fontSize: 20 }}>"{cake.message}"</ScriptAccent>
          : <span style={{ color: 'var(--ninos-stone)', fontStyle: 'italic' }}>none</span>}/>
        {cake.boardMessage && (
          <SummaryRow label={t.boardMessage} value={
            <ScriptAccent style={{ fontSize: 16, textAlign: 'right', display: 'inline-block', maxWidth: 280 }}>
              "{cake.boardMessage}"
            </ScriptAccent>
          }/>
        )}
        <SummaryRow label={t.flavor} value={fl ? fl.sponge : '—'}/>
        <SummaryRow label={t.delivery} value={cake.deliveryDate
          ? `${cake.deliveryDate}${cake.deliveryTime ? ', ' + cake.deliveryTime : ''}`
          : <span style={{ color: 'var(--ninos-stone)', fontStyle: 'italic' }}>not set</span>}/>
      </div>

      <div style={{
        marginTop: 28, padding: '18px 20px',
        background: 'var(--bg-card-warm)', borderRadius: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <Caption>{t.total}</Caption>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: 'var(--ninos-ink)',
            lineHeight: 1, marginTop: 4 }}>EGP {price}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <SecondaryButton onClick={onBack}><Icon name="chevron-left" size={14}/> {t.back}</SecondaryButton>
          <PrimaryButton onClick={onAdd}>
            {t.addCart}
            <Icon name="arrow-right" size={16}/>
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px dashed var(--border-soft)',
    }}>
      <Caption>{label}</Caption>
      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 14,
        color: 'var(--ninos-ink)', textAlign: 'right', textTransform: 'capitalize' }}>{value}</div>
    </div>
  );
}

// === Confirmation / achievement moment ===
function ConfirmationScreen({ cake, t, onAgain }) {
  const orderNumber = useMemo(() => 1042 + Math.floor(Math.random() * 30), []);

  // Heart confetti
  const confetti = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 4 + Math.random() * 4,
      size: 12 + Math.random() * 16,
      color: ['#E35F40', '#FFDC4A', '#FFBFBE', '#6B0F1A', '#7FB0E7'][i % 5],
      rotate: Math.random() * 360,
    }));
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--ninos-cream)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', zIndex: 200,
      backgroundImage: 'url(assets/patterns/pattern-pink-hearts.png)',
      backgroundSize: '240px 240px',
      backgroundBlendMode: 'multiply',
      overflow: 'hidden',
      padding: '40px 20px',
    }}>
      {/* Cream overlay so pattern is subtle */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(252,248,239,0.78)' }}/>

      {/* Heart confetti rain */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {confetti.map(c => (
          <div key={c.id} style={{
            position: 'absolute', left: `${c.left}%`, bottom: '-40px',
            animation: `drift ${c.duration}s linear ${c.delay}s infinite`,
            transform: `rotate(${c.rotate}deg)`,
          }}>
            <BrandHeart size={c.size} color={c.color}/>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 600,
        animation: 'scale-in 700ms var(--ease-bounce)' }}>
        <Caption style={{ color: 'var(--ninos-teal)', marginBottom: 16,
          display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--ninos-teal)',
            animation: 'pulse 1.6s infinite' }}/>
          {t.confirmed}
        </Caption>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 64, color: 'var(--ninos-ink)',
          margin: 0, lineHeight: 1.05, letterSpacing: '-0.02em',
          textTransform: 'none', fontWeight: 400,
        }}>
          the party's<br/>
          <ScriptAccent style={{ fontSize: 84, color: 'var(--ninos-salmon)' }}>started.</ScriptAccent>
        </h1>
        <p style={{
          fontFamily: 'var(--font-italic)', fontStyle: 'italic',
          fontSize: 18, color: 'var(--ninos-graphite)',
          marginTop: 16, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto',
        }}>
          {t.confirmCopy.replace('#1042', '#' + orderNumber)}
        </p>

        {/* Achievement chip */}
        <div style={{
          margin: '32px auto 0', maxWidth: 360,
          padding: '20px 24px',
          background: '#fff',
          border: '1.5px solid var(--ninos-butter)',
          borderRadius: 24,
          boxShadow: 'var(--shadow-md)',
          display: 'flex', alignItems: 'center', gap: 14,
          animation: 'float-up 700ms var(--ease-frosting) 0.4s both',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'var(--ninos-butter)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon name="star" size={24} color="var(--ninos-burgundy)"/>
          </div>
          <div style={{ textAlign: 'left' }}>
            <Caption style={{ color: 'var(--ninos-burgundy)' }}>{t.unlocked}</Caption>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 15,
              color: 'var(--ninos-ink)', marginTop: 2 }}>{t.firstMasterpiece}</div>
            <div style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic',
              fontSize: 12, color: 'var(--ninos-stone)', marginTop: 2 }}>{t.firstMasterpieceCopy}</div>
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 10, justifyContent: 'center' }}>
          <SecondaryButton onClick={onAgain}><Icon name="rotate" size={14}/> {t.designAnother}</SecondaryButton>
          <PrimaryButton>
            {t.trackOrder}
            <Icon name="arrow-right" size={16}/>
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// === Right-rail mini summary (always-visible) ===
function MiniSummary({ cake, t }) {
  const price = computePrice(cake);
  const occ = (window.OCCASIONS || []).find(o => o.id === cake.occasion);
  const sz = (window.SIZES || []).find(s => s.idx === cake.sizeIdx);
  return (
    <div style={{
      padding: '16px 18px', background: 'var(--bg-card-warm)',
      borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16,
    }}>
      <div>
        <Caption>{occ ? occ.label : '—'}</Caption>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 13,
          color: 'var(--ninos-ink)', marginTop: 2 }}>
          {sz ? `${sz.label} · ${sz.guests} guests` : '—'} · {cake.tiers} tier{cake.tiers > 1 ? 's' : ''}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <Caption>{t.runningTotal}</Caption>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ninos-ink)',
          lineHeight: 1, marginTop: 2 }}>EGP {price}</div>
      </div>
    </div>
  );
}

// === Localization ===
const STRINGS = {
  en: {
    shop: 'Shop', builder: 'Build', studio: 'Studio', inspo: 'From a photo', about: 'About',
    cart: 'Cart',
    step: 'Step', of: 'of', save: 'Save for later',
    back: 'Back', continue: 'Continue', review: 'Review', addCart: 'Add to cart',
    almost: 'Almost there', yourCake: 'your cake',
    occasion: 'Occasion', shape: 'Shape', size: 'Size', frosting: 'Frosting',
    toppings: 'Toppings', message: 'Message', flavor: 'Flavor', delivery: 'Delivery',
    boardMessage: 'Board note',
    total: 'Estimated total',
    runningTotal: 'Running total',
    confirmed: 'Order confirmed',
    confirmCopy: "Order #1042 is on its way. We'll text you when it's in the oven.",
    unlocked: 'Achievement unlocked',
    firstMasterpiece: 'Your first masterpiece',
    firstMasterpieceCopy: 'You designed a cake from scratch.',
    designAnother: 'Design another', trackOrder: 'Track order',
  },
  ar: {
    shop: 'تسوق', builder: 'صمم', studio: 'استوديو', inspo: 'من صورة', about: 'عننا',
    cart: 'السلة',
    step: 'خطوة', of: 'من', save: 'احفظ للاحقاً',
    back: 'رجوع', continue: 'متابعة', review: 'مراجعة', addCart: 'أضف للسلة',
    almost: 'كدا قربتي', yourCake: 'كيكتك',
    occasion: 'المناسبة', shape: 'الشكل', size: 'الحجم', frosting: 'الكسوة',
    toppings: 'التزيين', message: 'الرسالة', flavor: 'الطعم', delivery: 'التوصيل',
    boardMessage: 'رسالة اللوحة',
    total: 'المجموع التقديري',
    runningTotal: 'المجموع',
    confirmed: 'تم تأكيد الطلب',
    confirmCopy: 'طلبك #1042 في الطريق. هنبعتلك رسالة لما يدخل الفرن.',
    unlocked: 'إنجاز جديد',
    firstMasterpiece: 'تحفتك الأولى',
    firstMasterpieceCopy: 'صممتي كيكة من الصفر.',
    designAnother: 'صممي تانية', trackOrder: 'تتبع الطلب',
  },
};

// === The full app ===
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [step, setStep] = useState(0);
  const [cake, setCake] = useState(makeInitialCake());
  // view: 'landing' | 'catalog' | 'inspo' | 'studio' | 'builder' | 'summary' | 'confirmed'
  const [view, setView] = useState('landing');
  const [draggingKind, setDraggingKind] = useState(null);

  const language = tweaks.language || 'en';
  const t = STRINGS[language];
  const isRtl = language === 'ar';

  // Apply primary color tweak
  useEffect(() => { applyPrimary(tweaks.primaryColor); }, [tweaks.primaryColor]);

  // dir attribute
  useEffect(() => {
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [isRtl, language]);

  // Topping drop handler
  function dropTopping(x, y) {
    if (!draggingKind) return;
    setCake({
      ...cake,
      toppings: [...cake.toppings, { kind: draggingKind, color: cake.toppingColor, x, y, fresh: true }],
    });
    setTimeout(() => {
      setCake(c => ({ ...c, toppings: c.toppings.map(t => ({ ...t, fresh: false })) }));
    }, 400);
  }
  function removeTopping(i) {
    setCake({ ...cake, toppings: cake.toppings.filter((_, idx) => idx !== i) });
  }

  // Step nav guards
  function canContinue() {
    if (step === 0) return !!cake.occasion;
    if (step === STEPS.length - 1) return !!cake.deliveryDate;
    return true;
  }
  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setView('summary');
  }
  function prev() {
    if (step > 0) setStep(step - 1);
    else setView('landing');
  }

  // Entry-point handlers
  function startFromScratch() {
    setCake(makeInitialCake());
    setStep(0);
    setView('builder');
  }
  function startFromPreset(preset) {
    setCake(forkPreset(preset));
    setStep(0);
    setView('builder');
  }
  function startFromInspo(approximation, file) {
    setCake(forkPreset(approximation, { inspoUrl: file.url, inspoName: file.name }));
    setStep(0);
    setView('builder');
  }
  function goHome(target) {
    if (target === 'landing') setView('landing');
    else if (target === 'catalog') setView('catalog');
    else if (target === 'inspo') setView('inspo');
    else if (target === 'studio') setView('studio');
    else if (target === 'builder') { setView('builder'); }
  }

  // Reset for "design another"
  function reset() {
    setCake(makeInitialCake());
    setStep(0);
    setView('landing');
  }

  // Map app views to header active tab
  const headerView = view === 'catalog' ? 'catalog'
    : view === 'inspo' ? 'inspo'
    : view === 'studio' ? 'studio'
    : (view === 'builder' || view === 'summary') ? 'builder'
    : null;

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--ninos-cream)',
      fontFamily: 'var(--font-body)',
      direction: isRtl ? 'rtl' : 'ltr',
    }}>
      <AppHeader language={language} t={t}
        onLanguageToggle={() => setTweak('language', language === 'en' ? 'ar' : 'en')}
        cartCount={view === 'confirmed' ? 1 : 0}
        onHome={goHome} view={headerView}/>

      {view === 'landing' && (
        <Landing
          onShop={() => setView('catalog')}
          onBuild={startFromScratch}
          onInspo={() => setView('inspo')}
          onStudio={() => setView('studio')}
        />
      )}

      {view === 'catalog' && (
        <CatalogView
          onPick={startFromPreset}
          onBack={() => setView('landing')}
        />
      )}

      {view === 'inspo' && (
        <InspoFlow
          onContinue={startFromInspo}
          onBack={() => setView('landing')}
        />
      )}

      {view === 'studio' && (
        <Studio
          initialCake={cake}
          language={language}
          onBack={() => setView('landing')}
          onSave={(c, action) => {
            setCake(c);
            if (action === 'order') setView('summary');
            else setView('landing');
          }}
        />
      )}

      {view === 'builder' && (
        <BuilderView
          step={step} setStep={setStep}
          cake={cake} setCake={setCake}
          tweaks={tweaks}
          t={t}
          language={language}
          draggingKind={draggingKind}
          setDraggingKind={setDraggingKind}
          dropTopping={dropTopping}
          removeTopping={removeTopping}
          onNext={next} onPrev={prev}
          canContinue={canContinue()}
        />
      )}

      {view === 'summary' && (
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '40px 32px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
          alignItems: 'start',
        }}>
          <div style={{ position: 'sticky', top: 100 }}>
            <CakeStage
              cake={cake}
              background={tweaks.background}
              renderStyle={tweaks.renderStyle}
              draggingKind={null}
              onRemoveTopping={null}
              height={520}
              scale={1.1}
            />
          </div>
          <SummaryScreen cake={cake} t={t}
            onBack={() => setView('builder')}
            onAdd={() => setView('confirmed')}/>
        </div>
      )}

      {view === 'confirmed' && (
        <ConfirmationScreen cake={cake} t={t} onAgain={reset}/>
      )}

      {/* Tweaks */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Visual style"/>
        <TweakRadio label="Render style" value={tweaks.renderStyle}
          options={['illustrated', 'editorial']}
          onChange={(v) => setTweak('renderStyle', v)}/>
        <TweakColor label="Primary color" value={tweaks.primaryColor}
          options={['#E35F40', '#6B0F1A', '#FFDC4A', '#F39580']}
          onChange={(v) => setTweak('primaryColor', v)}/>
        <TweakRadio label="Background" value={tweaks.background}
          options={['cream', 'pattern', 'warm']}
          onChange={(v) => setTweak('background', v)}/>

        <TweakSection label="Layout"/>
        <TweakSelect label="Render position" value={tweaks.layout}
          options={['render-left', 'render-right', 'render-top']}
          onChange={(v) => setTweak('layout', v)}/>
        <TweakRadio label="Step UI" value={tweaks.stepUI}
          options={['wizard', 'canvas']}
          onChange={(v) => setTweak('stepUI', v)}/>

        <TweakSection label="Language"/>
        <TweakRadio label="Language" value={tweaks.language}
          options={['en', 'ar']}
          onChange={(v) => setTweak('language', v)}/>
      </TweaksPanel>
    </div>
  );
}

// === Builder view — layout-aware ===
function BuilderView({ step, setStep, cake, setCake, tweaks, t, language,
  draggingKind, setDraggingKind, dropTopping, removeTopping, onNext, onPrev, canContinue }) {
  const isCanvas = tweaks.stepUI === 'canvas';
  const layout = tweaks.layout;
  const stage = (height) => (
    <CakeStage
      cake={cake}
      background={tweaks.background}
      renderStyle={tweaks.renderStyle}
      draggingKind={draggingKind}
      onDropTopping={dropTopping}
      onRemoveTopping={removeTopping}
      height={height}
      scale={1}
    />
  );

  // Topping drag context
  const onDragKind = (k) => setDraggingKind(k);

  // Sidebar (controls + nav)
  const sidebar = (
    <aside style={{
      display: 'flex', flexDirection: 'column', gap: 24,
      maxWidth: 540, padding: '32px 36px',
    }}>
      {!isCanvas && (
        <StepHeader step={step} total={STEPS.length}
          stepName={STEPS[step].label} t={t}/>
      )}
      {isCanvas
        ? <BuilderCanvas cake={cake} setCake={setCake}
            onDragKind={onDragKind} draggingKind={draggingKind}/>
        : <BuilderPanels step={step} cake={cake} setCake={setCake}
            onDragKind={onDragKind} draggingKind={draggingKind}/>}
      <MiniSummary cake={cake} t={t}/>
      {!isCanvas && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <SecondaryButton onClick={onPrev} style={{ opacity: step === 0 ? 0.5 : 1 }}>
            <Icon name="chevron-left" size={14}/> {t.back}
          </SecondaryButton>
          <PrimaryButton full disabled={!canContinue} onClick={onNext} style={{ flex: 1 }}>
            {step === STEPS.length - 1 ? t.review : t.continue}
            <Icon name="arrow-right" size={16}/>
          </PrimaryButton>
        </div>
      )}
      {isCanvas && (
        <PrimaryButton full onClick={onNext}>
          {t.review} <Icon name="arrow-right" size={16}/>
        </PrimaryButton>
      )}
    </aside>
  );

  // Layouts
  if (layout === 'render-top') {
    return (
      <div style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div style={{ height: 480, padding: '0 24px 24px', paddingTop: 24 }}>
          <div style={{ height: '100%', borderRadius: 28, overflow: 'hidden',
            boxShadow: 'var(--shadow-md)' }}>
            {stage(480)}
          </div>
        </div>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 60px' }}>
          {sidebar}
        </div>
      </div>
    );
  }

  // render-left or render-right
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: layout === 'render-right' ? '1fr 1.05fr' : '1.05fr 1fr',
      minHeight: 'calc(100vh - 73px)',
    }}>
      <div style={{
        position: 'sticky', top: 73, height: 'calc(100vh - 73px)',
        order: layout === 'render-right' ? 2 : 1,
      }}>
        {stage('100%')}
      </div>
      <div style={{
        order: layout === 'render-right' ? 1 : 2,
        background: 'var(--ninos-cream)',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 73px)',
      }}>
        {sidebar}
      </div>
    </div>
  );
}

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

// Expose helpers globally so Studio etc. can use them
Object.assign(window, { makeInitialCake, computePrice, forkPreset });
