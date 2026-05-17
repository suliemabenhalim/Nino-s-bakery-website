// brand.jsx — Nino's shared atoms

function BrandHeart({ size = 16, color = 'var(--ninos-salmon)', stroke = false, strokeWidth = 2.2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32"
      fill={stroke ? 'none' : color} stroke={stroke ? color : 'none'}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M16 27.5s-9.5-5.9-12-11.4C2 11.5 5 6.5 10 6.5c2.5 0 4.4 1.2 6 3.3 1.6-2.1 3.5-3.3 6-3.3 5 0 8 5 6 9.6-2.5 5.5-12 11.4-12 11.4z"/>
    </svg>
  );
}

// "nino's" wordmark — typographic, with heart-dotted i
function HeartIWordmark({ size = 40, color = 'var(--ninos-ink)' }) {
  return (
    <div style={{
      fontFamily: 'Abril Fatface, serif',
      fontSize: size, lineHeight: 0.95, color,
      letterSpacing: '-0.02em', display: 'inline-flex',
      alignItems: 'flex-end', position: 'relative',
      fontWeight: 400,
    }}>
      <span>n</span>
      <span style={{ position: 'relative', display: 'inline-block', width: size * 0.28 }}>
        <span style={{ position: 'absolute', left: '50%', top: -size * 0.55, transform: 'translateX(-50%)' }}>
          <BrandHeart size={size * 0.32} color={color} />
        </span>
        <span style={{ visibility: 'hidden' }}>i</span>
      </span>
      <span>no's</span>
    </div>
  );
}

function PrimaryButton({ children, onClick, full, glow = true, disabled, style = {}, color }) {
  const bg = color || 'var(--ninos-salmon)';
  return (
    <button onClick={onClick} disabled={disabled} className="primary-btn" style={{
      background: disabled ? 'var(--ninos-mist)' : bg,
      color: 'var(--ninos-cream)', border: 0,
      padding: '16px 28px', borderRadius: 20,
      fontFamily: 'var(--font-heading)',
      fontWeight: 600, fontSize: 15, letterSpacing: '0.02em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center',
      justifyContent: 'center', gap: 10,
      boxShadow: glow && !disabled ? 'var(--shadow-glow-salmon)' : 'none',
      width: full ? '100%' : 'auto',
      transition: 'transform 160ms var(--ease-frosting), background 220ms',
      ...style,
    }}>{children}</button>
  );
}

function SecondaryButton({ children, onClick, full, style = {} }) {
  return (
    <button onClick={onClick} className="secondary-btn" style={{
      background: 'var(--ninos-pink-100)', color: 'var(--ninos-burgundy)', border: 0,
      padding: '14px 24px', borderRadius: 18,
      fontFamily: 'var(--font-heading)',
      fontWeight: 600, fontSize: 14, letterSpacing: '0.02em',
      cursor: 'pointer', width: full ? '100%' : 'auto',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'transform 160ms var(--ease-frosting), background 220ms',
      ...style,
    }}>{children}</button>
  );
}

function GhostButton({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', color: 'var(--ninos-ink)', border: 0,
      padding: '12px 16px', borderRadius: 14,
      fontFamily: 'var(--font-heading)',
      fontWeight: 500, fontSize: 14, letterSpacing: '0.02em',
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      ...style,
    }}>{children}</button>
  );
}

function Caption({ children, style = {} }) {
  return (
    <div style={{
      fontFamily: 'var(--font-heading)',
      fontSize: 11, fontWeight: 600,
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--ninos-stone)',
      ...style,
    }}>{children}</div>
  );
}

function ScriptAccent({ children, style = {} }) {
  return (
    <span style={{
      fontFamily: 'var(--font-script)',
      fontWeight: 500,
      textTransform: 'lowercase',
      color: 'var(--ninos-burgundy)',
      ...style,
    }}>{children}</span>
  );
}

// A live indicator chip — used on the render
function LiveChip() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(252,248,239,.86)',
      backdropFilter: 'blur(10px)',
      padding: '5px 10px', borderRadius: 999,
      fontSize: 10, fontWeight: 700,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: 'var(--ninos-teal)',
      fontFamily: 'var(--font-heading)',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--ninos-teal)',
        animation: 'pulse 1.6s infinite' }}/>
      Live preview
    </div>
  );
}

// Small icon helpers — Lucide SVG paths, inline so we don't need a script
function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.75 }) {
  const paths = {
    'chevron-left':  <path d="M15 18l-6-6 6-6"/>,
    'chevron-right': <path d="M9 6l6 6-6 6"/>,
    'chevron-down':  <path d="M6 9l6 6 6-6"/>,
    'x':             <path d="M18 6L6 18M6 6l12 12"/>,
    'check':         <path d="M20 6L9 17l-5-5"/>,
    'plus':          <path d="M12 5v14M5 12h14"/>,
    'minus':         <path d="M5 12h14"/>,
    'shopping-bag':  <g><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></g>,
    'image':         <g><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></g>,
    'upload':        <g><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></g>,
    'calendar':      <g><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></g>,
    'sparkles':      <g><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 14l.5 1.5L21 16l-1.5.5L19 18l-.5-1.5L17 16l1.5-.5z"/></g>,
    'globe':         <g><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></g>,
    'rotate':        <g><path d="M3 12a9 9 0 109-9"/><path d="M3 4v6h6"/></g>,
    'zoom-in':       <g><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></g>,
    'trash':         <g><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></g>,
    'edit':          <g><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></g>,
    'heart':         <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>,
    'cake':          <g><path d="M20 21V8a2 2 0 00-2-2H6a2 2 0 00-2 2v13M2 21h20M6 13h12"/><path d="M12 6V3M9 3h6"/></g>,
    'truck':         <g><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></g>,
    'arrow-left':    <path d="M19 12H5M12 19l-7-7 7-7"/>,
    'arrow-right':   <path d="M5 12h14M12 5l7 7-7 7"/>,
    'menu':          <path d="M3 12h18M3 6h18M3 18h18"/>,
    'user':          <g><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></g>,
    'search':        <g><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></g>,
    'star':          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>,
    'gift':          <g><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', flexShrink: 0 }}>
      {paths[name] || null}
    </svg>
  );
}

// Pulse animation keyframes (injected once)
if (typeof document !== 'undefined' && !document.getElementById('brand-keyframes')) {
  const s = document.createElement('style');
  s.id = 'brand-keyframes';
  s.textContent = `
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
    @keyframes float-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scale-in { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
    @keyframes drift { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-100vh) rotate(360deg); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    .primary-btn:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.05); }
    .primary-btn:active:not(:disabled) { transform: scale(0.97); }
    .secondary-btn:hover { background: var(--ninos-pink-200) !important; }
    .secondary-btn:active { transform: scale(0.97); }
    .chip:hover { transform: translateY(-2px); }
    .chip:active { transform: scale(0.96); }
  `;
  document.head.appendChild(s);
}

Object.assign(window, {
  BrandHeart, HeartIWordmark, PrimaryButton, SecondaryButton, GhostButton,
  Caption, ScriptAccent, LiveChip, Icon,
});
