// studio.jsx — Bakely-style 3D Designer. The pro mode.
// Full-canvas cake with rich element library + tier ± + per-tier color picker.
// This is a *separate entry path* from the wizard.

const { useState: useStateS, useMemo: useMemoS, useRef: useRefS } = React;

// Studio-only "fancy" elements. Drawn inline as SVG/divs so we don't need assets.
function StudioElement({ kind, color = 'currentColor', size = 22 }) {
  if (kind === 'candle') {
    return (
      <div style={{ width: size*0.4, height: size*1.3, position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '85%',
          background: `linear-gradient(to right, ${color} 0%, ${shade(color, 25)} 50%, ${color} 100%)`,
          borderRadius: '20% 20% 4px 4px' }}/>
        <div style={{ position: 'absolute', top: -size*0.05, left: '50%',
          transform: 'translateX(-50%)',
          width: size*0.18, height: size*0.28, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          background: 'linear-gradient(to top, #FFDC4A, #FF6B00)',
          boxShadow: '0 0 6px rgba(255,180,0,0.6)' }}/>
      </div>
    );
  }
  if (kind === 'cherry') {
    return (
      <div style={{ width: size, height: size, position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: 0, width: size*0.7, height: size*0.7,
          background: `radial-gradient(circle at 35% 30%, ${shade(color, 35)}, ${color} 50%, ${shade(color, -30)})`,
          borderRadius: '50%', boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.2)' }}/>
        <div style={{ position: 'absolute', top: 0, left: '50%',
          width: 1.5, height: size*0.4, background: '#5C4A47', transform: 'translateX(-50%) rotate(-12deg)' }}/>
      </div>
    );
  }
  if (kind === 'ribbon') {
    return (
      <svg width={size*1.4} height={size} viewBox="0 0 28 20" fill={color}>
        <path d="M2 10 Q6 4 14 10 Q22 16 26 10 L26 14 Q22 20 14 14 Q6 8 2 14 Z"/>
        <ellipse cx="14" cy="10" rx="3" ry="4" fill={shade(color, -20)}/>
      </svg>
    );
  }
  if (kind === 'oreo') {
    return (
      <div style={{ width: size*0.9, height: size*0.4, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
          background: '#2A1A18', borderRadius: '50% 50% 20% 20%' }}/>
        <div style={{ position: 'absolute', top: '32%', left: '6%', right: '6%', height: '36%',
          background: '#FCF8EF' }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
          background: '#2A1A18', borderRadius: '20% 20% 50% 50%' }}/>
      </div>
    );
  }
  if (kind === 'donut') {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle, transparent 25%, ${color} 27%, ${shade(color, -10)} 60%, ${color} 100%)`,
        position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15%', left: '20%', width: 2, height: 4,
          background: 'rgba(255,255,255,0.5)' }}/>
      </div>
    );
  }
  if (kind === 'candycane') {
    return (
      <svg width={size*0.6} height={size*1.2} viewBox="0 0 12 24">
        <defs>
          <pattern id={`stripe-${color.replace('#','')}`} x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect x="0" y="0" width="3" height="3" fill="#fff"/>
            <rect x="0" y="0" width="1.5" height="3" fill={color}/>
          </pattern>
        </defs>
        <path d="M 6 24 L 6 4 Q 6 1 9 1 Q 12 1 12 4" stroke={`url(#stripe-${color.replace('#','')})`}
          strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      </svg>
    );
  }
  if (kind === 'butterfly') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <ellipse cx="7" cy="9" rx="5.5" ry="6" opacity="0.86"/>
        <ellipse cx="17" cy="9" rx="5.5" ry="6" opacity="0.86"/>
        <ellipse cx="7" cy="16" rx="4" ry="4.5" opacity="0.7"/>
        <ellipse cx="17" cy="16" rx="4" ry="4.5" opacity="0.7"/>
        <ellipse cx="12" cy="12" rx="0.9" ry="6" fill={shade(color, -30)}/>
      </svg>
    );
  }
  if (kind === 'star') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
      </svg>
    );
  }
  if (kind === 'ring') {
    // Tiara/crown-like topper
    return (
      <svg width={size*1.4} height={size} viewBox="0 0 28 20" fill={color}>
        <path d="M2 16 L6 6 L10 14 L14 4 L18 14 L22 6 L26 16 Z" stroke={shade(color,-15)} strokeWidth="0.5"/>
        <circle cx="6" cy="6" r="1.4" fill="#FFDC4A"/>
        <circle cx="14" cy="4" r="1.6" fill="#FFDC4A"/>
        <circle cx="22" cy="6" r="1.4" fill="#FFDC4A"/>
      </svg>
    );
  }
  if (kind === 'numbertop') {
    return (
      <div style={{ fontFamily: 'var(--font-display)', fontSize: size, lineHeight: 1,
        color, fontWeight: 400, textShadow: '1px 1px 0 rgba(0,0,0,0.18)' }}>3</div>
    );
  }
  if (kind === 'rose') {
    // Stylized buttercream rosette
    return (
      <div style={{ width: size, height: size, position: 'relative' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: size*0.55, height: size*0.55,
            background: `radial-gradient(circle at 30% 30%, ${shade(color, 20)}, ${color})`,
            borderRadius: '60% 40% 60% 40%',
            transformOrigin: '0 0',
            transform: `translate(-50%, -100%) rotate(${i*72}deg)`,
            opacity: 0.92,
          }}/>
        ))}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: size*0.3, height: size*0.3, borderRadius: '50%',
          background: shade(color, 25), boxShadow: 'inset -1px -1px 2px rgba(0,0,0,0.15)',
        }}/>
      </div>
    );
  }
  // Fallback to standard ToppingPiece
  return <ToppingPiece kind={kind} color={color} size={size}/>;
}

// Studio element library — grouped
const STUDIO_LIBRARY = [
  { group: 'Toppers',  items: [
    { kind: 'candle',    label: 'Candle' },
    { kind: 'numbertop', label: 'Number' },
    { kind: 'ring',      label: 'Tiara' },
    { kind: 'star',      label: 'Star' },
    { kind: 'butterfly', label: 'Butterfly' },
  ]},
  { group: 'Florals',  items: [
    { kind: 'rose',     label: 'Rosette' },
    { kind: 'flowers',  label: 'Flowers' },
    { kind: 'hearts',   label: 'Hearts' },
  ]},
  { group: 'Treats',   items: [
    { kind: 'cherry',     label: 'Cherry' },
    { kind: 'macarons',   label: 'Macaron' },
    { kind: 'berries',    label: 'Berry' },
    { kind: 'oreo',       label: 'Oreo' },
    { kind: 'donut',      label: 'Donut' },
    { kind: 'candycane',  label: 'Candy cane' },
  ]},
  { group: 'Texture',  items: [
    { kind: 'pearls',    label: 'Pearls' },
    { kind: 'sprinkles', label: 'Sprinkles' },
    { kind: 'ribbon',    label: 'Ribbon' },
  ]},
];

const STUDIO_COLORS = [
  '#E35F40', '#6B0F1A', '#FFDC4A', '#FFBFBE', '#FFFFFF',
  '#2E9E82', '#7FB0E7', '#3D5A99', '#FFE4E2', '#A8D5BA',
  '#FCF8EF', '#2A1A18', '#F39580', '#9B7EDC', '#FFB347',
];

// Tier palette colors
const TIER_PALETTE = [
  '#FCF8EF', '#FFE4E2', '#FFBFBE', '#FFDC4A', '#A8D5BA',
  '#7FB0E7', '#9B7EDC', '#FFB347', '#E35F40', '#6B0F1A',
  '#2A1A18', '#E8C5A0',
];

function Studio({ initialCake, onSave, onBack, language }) {
  // Init cake state — per-tier color stored as cake.tierColors[]
  const [cake, setCake] = useStateS(() => {
    const base = initialCake || (window.makeInitialCake && window.makeInitialCake()) || {};
    return {
      ...base,
      tiers: base.tiers || 3,
      tierColors: base.tierColors || [base.frostColor || '#FFE4E2', '#7FB0E7', '#FCF8EF'],
      toppings: base.toppings || [],
      shape: base.shape || 'round',
      sizeIdx: base.sizeIdx != null ? base.sizeIdx : 5,
      frostColor: base.frostColor || '#FFE4E2',
      toppingColor: '#E35F40',
    };
  });
  const [draggingKind, setDraggingKind] = useStateS(null);
  const [activeTierIdx, setActiveTierIdx] = useStateS(0); // 0 = bottom
  const [draggingColor, setDraggingColor] = useStateS('#E35F40');
  const [rotation, setRotation] = useStateS(0);

  function dropTopping(x, y) {
    if (!draggingKind) return;
    setCake({
      ...cake,
      toppings: [...cake.toppings, {
        kind: draggingKind, color: draggingColor, x, y, fresh: true,
        size: ['candle','numbertop','ring','candycane','butterfly'].includes(draggingKind) ? 32 : 18,
      }],
    });
    setTimeout(() => setCake(c => ({ ...c, toppings: c.toppings.map(t => ({ ...t, fresh: false })) })), 400);
  }
  function removeTopping(i) {
    setCake({ ...cake, toppings: cake.toppings.filter((_, idx) => idx !== i) });
  }
  function clearAll() {
    setCake({ ...cake, toppings: [] });
  }

  function addTier() {
    if (cake.tiers >= 4) return;
    const newColors = [...cake.tierColors, '#FCF8EF'];
    setCake({ ...cake, tiers: cake.tiers + 1, tierColors: newColors });
  }
  function removeTier() {
    if (cake.tiers <= 1) return;
    const newColors = cake.tierColors.slice(0, cake.tiers - 1);
    setCake({ ...cake, tiers: cake.tiers - 1, tierColors: newColors });
  }
  function setTierColor(idx, color) {
    const newColors = [...cake.tierColors];
    newColors[idx] = color;
    // For now CakeRender uses single frostColor for all tiers — use top tier color as base.
    // The studio version visualizes the active tier color across the cake.
    setCake({ ...cake, tierColors: newColors, frostColor: newColors[activeTierIdx] || newColors[0] });
  }

  // For CakeStage, set frostColor to active tier's color
  const renderCake = { ...cake, frostColor: cake.tierColors[activeTierIdx] || cake.tierColors[0] };

  const placedCount = cake.toppings.length;
  const price = (window.computePrice ? window.computePrice(cake) : 1800) + placedCount * 12;

  return (
    <div style={{ minHeight: 'calc(100vh - 73px)', display: 'flex', background: 'var(--ninos-cream)' }}>
      {/* LEFT — Element Library */}
      <div style={{
        width: 260, flexShrink: 0, padding: '24px 18px',
        background: '#fff', borderRight: '1px solid var(--border-soft)',
        overflowY: 'auto', maxHeight: 'calc(100vh - 73px)',
      }}>
        <Caption style={{ marginBottom: 14 }}>Element library</Caption>
        {STUDIO_LIBRARY.map(grp => (
          <div key={grp.group} style={{ marginBottom: 18 }}>
            <div style={{
              fontFamily: 'var(--font-italic)', fontStyle: 'italic',
              fontSize: 13, color: 'var(--ninos-burgundy)', marginBottom: 8,
            }}>{grp.group}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {grp.items.map(it => {
                const active = draggingKind === it.kind;
                return (
                  <button
                    key={it.kind}
                    draggable
                    onDragStart={() => setDraggingKind(it.kind)}
                    onDragEnd={() => setDraggingKind(null)}
                    onClick={() => setDraggingKind(active ? null : it.kind)}
                    title={it.label}
                    style={{
                      aspectRatio: '1 / 1', border: 0,
                      background: active ? 'var(--ninos-cream)' : 'var(--ninos-paper)',
                      borderRadius: 10, cursor: 'grab',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 220ms var(--ease-frosting)',
                      boxShadow: active ? '0 0 0 2px var(--ninos-salmon)' : 'none',
                      transform: active ? 'scale(0.95)' : 'scale(1)',
                    }}>
                    <StudioElement kind={it.kind} color={draggingColor} size={28}/>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {/* Color for the element */}
        <Caption style={{ marginTop: 8, marginBottom: 10 }}>Element color</Caption>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
          {STUDIO_COLORS.map(c => (
            <button key={c} onClick={() => setDraggingColor(c)} style={{
              aspectRatio: '1/1', border: 0, padding: 0, borderRadius: 8,
              background: c, cursor: 'pointer',
              boxShadow: draggingColor === c
                ? '0 0 0 2px var(--ninos-cream), 0 0 0 4px var(--ninos-salmon)'
                : 'inset -2px -1px 4px rgba(0,0,0,0.08)',
              border: c === '#FFFFFF' ? '1px solid var(--border-soft)' : 0,
            }}/>
          ))}
        </div>
      </div>

      {/* CENTER — Canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <CakeStage
          cake={renderCake}
          background="warm"
          renderStyle="editorial"
          draggingKind={draggingKind}
          onDropTopping={dropTopping}
          onRemoveTopping={removeTopping}
          rotation={rotation}
          onRotateChange={setRotation}
          height="100%"
          scale={1.4}
          showHints={false}
        />
        {/* Top toolbar */}
        <div style={{
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 6, alignItems: 'center',
          background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(12px)',
          padding: '6px 8px', borderRadius: 999, boxShadow: 'var(--shadow-md)',
        }}>
          <SecondaryButton onClick={onBack} style={{ padding: '8px 14px', fontSize: 12 }}>
            <Icon name="chevron-left" size={12}/> Exit
          </SecondaryButton>
          <div style={{ width: 1, height: 18, background: 'var(--border-soft)' }}/>
          <button onClick={clearAll} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            padding: '8px 14px', borderRadius: 999,
            fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            color: 'var(--ninos-graphite)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}><Icon name="trash" size={12}/> Clear</button>
          <div style={{ width: 1, height: 18, background: 'var(--border-soft)' }}/>
          <div style={{
            padding: '8px 14px',
            fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            color: 'var(--ninos-stone)',
          }}>{placedCount} placed</div>
        </div>

        {/* Drag indicator */}
        {draggingKind && (
          <div style={{
            position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--ninos-salmon)', color: '#fff',
            padding: '10px 18px', borderRadius: 999,
            fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: 'var(--shadow-glow-salmon)',
            animation: 'scale-in 220ms var(--ease-bounce)',
          }}>
            <Icon name="sparkles" size={12}/>
            Click on the cake to place {draggingKind}
            <button onClick={() => setDraggingKind(null)} style={{
              background: 'rgba(255,255,255,0.2)', border: 0, color: '#fff',
              width: 20, height: 20, borderRadius: 999, cursor: 'pointer', marginLeft: 6,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name="x" size={10}/></button>
          </div>
        )}

        {/* Bottom action bar */}
        <div style={{
          position: 'absolute', bottom: 24, left: 24, right: 24,
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
          padding: '14px 20px', borderRadius: 18,
          boxShadow: 'var(--shadow-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <Caption>Your design</Caption>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26,
              color: 'var(--ninos-ink)', lineHeight: 1, marginTop: 2,
              fontWeight: 400, textTransform: 'none' }}>EGP {price}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <SecondaryButton onClick={() => onSave(cake, 'save')}>
              <Icon name="heart" size={14}/> Save
            </SecondaryButton>
            <PrimaryButton onClick={() => onSave(cake, 'order')}>
              Order this design
              <Icon name="arrow-right" size={16}/>
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* RIGHT — Tier controls + per-tier color */}
      <div style={{
        width: 260, flexShrink: 0, padding: '24px 18px',
        background: '#fff', borderLeft: '1px solid var(--border-soft)',
        overflowY: 'auto', maxHeight: 'calc(100vh - 73px)',
      }}>
        <Caption style={{ marginBottom: 14 }}>Tiers</Caption>
        {/* Tier stack visual + select */}
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 4,
          alignItems: 'center', marginBottom: 14 }}>
          {cake.tierColors.slice(0, cake.tiers).map((c, idx) => {
            const active = activeTierIdx === idx;
            const w = 110 - idx * 16;
            return (
              <button key={idx}
                onClick={() => setActiveTierIdx(idx)}
                style={{
                  width: w, height: 28, borderRadius: '50% / 30%',
                  background: c, cursor: 'pointer', padding: 0,
                  border: active ? '2px solid var(--ninos-salmon)' : '1px solid rgba(42,26,24,0.12)',
                  boxShadow: active ? 'var(--shadow-md)' : 'inset 0 -3px 6px rgba(0,0,0,0.08)',
                  fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 600,
                  color: 'rgba(42,26,24,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 220ms var(--ease-frosting)',
                }}>
                Tier {idx + 1}
              </button>
            );
          })}
        </div>
        {/* +/- buttons */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
          <button onClick={removeTier} disabled={cake.tiers <= 1} style={{
            flex: 1, padding: '12px', borderRadius: 12, border: 0,
            background: cake.tiers <= 1 ? 'var(--ninos-mist)' : 'var(--ninos-paper)',
            color: cake.tiers <= 1 ? 'var(--ninos-stone)' : 'var(--ninos-ink)',
            cursor: cake.tiers <= 1 ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Icon name="minus" size={12}/> Remove
          </button>
          <button onClick={addTier} disabled={cake.tiers >= 4} style={{
            flex: 1, padding: '12px', borderRadius: 12, border: 0,
            background: cake.tiers >= 4 ? 'var(--ninos-mist)' : 'var(--ninos-salmon)',
            color: cake.tiers >= 4 ? 'var(--ninos-stone)' : '#fff',
            cursor: cake.tiers >= 4 ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Icon name="plus" size={12}/> Add tier
          </button>
        </div>

        <Caption style={{ marginBottom: 10 }}>Tier {activeTierIdx + 1} color</Caption>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {TIER_PALETTE.map(c => {
            const active = cake.tierColors[activeTierIdx] === c;
            return (
              <button key={c} onClick={() => setTierColor(activeTierIdx, c)} style={{
                aspectRatio: '1/1', border: 0, padding: 0, borderRadius: 10,
                background: c, cursor: 'pointer',
                boxShadow: active
                  ? '0 0 0 2px var(--ninos-cream), 0 0 0 4px var(--ninos-salmon)'
                  : 'inset -2px -1px 4px rgba(0,0,0,0.1), var(--shadow-xs)',
                border: c === '#FFFFFF' || c === '#FCF8EF' ? '1px solid var(--border-soft)' : 0,
              }}/>
            );
          })}
        </div>

        {/* Shape switcher */}
        <Caption style={{ marginTop: 20, marginBottom: 10 }}>Shape</Caption>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {['round', 'heart', 'square'].map(s => {
            const active = cake.shape === s;
            return (
              <button key={s} onClick={() => setCake({ ...cake, shape: s })} style={{
                padding: '12px 6px', borderRadius: 10,
                background: active ? 'var(--ninos-cream)' : 'var(--ninos-paper)',
                border: active ? '1.5px solid var(--ninos-salmon)' : 0,
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 600,
                letterSpacing: '0.04em', textTransform: 'uppercase',
                color: 'var(--ninos-ink)',
              }}>{s}</button>
            );
          })}
        </div>

        {/* Tip */}
        <div style={{
          marginTop: 20, padding: 12, borderRadius: 12,
          background: 'var(--ninos-pink-50)',
          fontSize: 12, color: 'var(--ninos-graphite)',
          fontFamily: 'var(--font-italic)', fontStyle: 'italic',
          display: 'flex', gap: 8, alignItems: 'flex-start',
        }}>
          <Icon name="sparkles" size={14} color="var(--ninos-burgundy)"/>
          pick an element from the left, then click anywhere on the cake to place it. drag the cake to rotate.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Studio, STUDIO_LIBRARY, STUDIO_COLORS, TIER_PALETTE, StudioElement });
