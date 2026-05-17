// cake-render.jsx — The hero. Two render styles: 'illustrated' & 'editorial'.
// Both share shape/size/frosting/toppings/message state; they differ in
// surface treatment (highlights, plate, drip, lighting).

const { useState: useStateR, useEffect: useEffectR, useRef: useRefR } = React;

function shade(hex, percent) {
  if (!hex || !hex.startsWith('#')) return hex;
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00FF) + percent;
  let b = (num & 0x0000FF) + percent;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + ((r<<16)|(g<<8)|b).toString(16).padStart(6, '0');
}

// === Shape definitions ===
// Each shape function returns a clipPath / borderRadius style for a tier
const SHAPE_STYLES = {
  round:   (w, h) => ({ borderRadius: `${w/2}px / ${h*0.35}px ${h*0.35}px ${h*0.5}px ${h*0.5}px` }),
  square:  (w, h) => ({ borderRadius: `${h*0.2}px` }),
  heart:   (w, h) => ({
    clipPath: 'path("M50% 100% C40% 80%, 0% 70%, 0% 35% C0% 15%, 25% 0%, 50% 25% C75% 0%, 100% 15%, 100% 35% C100% 70%, 60% 80%, 50% 100% Z")',
    borderRadius: 0,
  }),
  number:  (w, h) => ({ borderRadius: `${h*0.4}px ${h*0.1}px ${h*0.4}px ${h*0.1}px` }),
};

// === Toppings ===
const TOPPINGS = {
  hearts:   { label: 'Hearts', emoji: null },
  flowers:  { label: 'Flowers', emoji: null },
  drip:     { label: 'Drip', emoji: null },
  sprinkles:{ label: 'Sprinkles', emoji: null },
  macarons: { label: 'Macarons', emoji: null },
  berries:  { label: 'Berries', emoji: null },
  pearls:   { label: 'Pearls', emoji: null },
};

// Render a single topping piece
function ToppingPiece({ kind, color, size = 14 }) {
  if (kind === 'hearts') {
    return <BrandHeart size={size} color={color} />;
  }
  if (kind === 'flowers') {
    const petalSize = size * 0.45;
    return (
      <div style={{ width: size, height: size, position: 'relative' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position: 'absolute', left: '50%', top: '50%',
            width: petalSize, height: petalSize, borderRadius: '60% 40% 60% 40%',
            background: color, transformOrigin: '0 0',
            transform: `translate(-50%, -100%) rotate(${i*72}deg)`,
            opacity: 0.94,
          }}/>
        ))}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: size*0.32, height: size*0.32, borderRadius: '50%',
          background: shade(color, -30),
        }}/>
      </div>
    );
  }
  if (kind === 'sprinkles') {
    return (
      <div style={{
        width: size*0.7, height: size*0.25, borderRadius: 999,
        background: color, transform: `rotate(${(Math.random()*60-30)}deg)`,
      }}/>
    );
  }
  if (kind === 'macarons') {
    return (
      <div style={{ width: size, height: size*0.7, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
          background: color, borderRadius: '50% 50% 12% 12%' }}/>
        <div style={{ position: 'absolute', top: '35%', left: '8%', right: '8%', height: '25%',
          background: shade(color, 40), borderRadius: 4 }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
          background: color, borderRadius: '12% 12% 50% 50%' }}/>
      </div>
    );
  }
  if (kind === 'berries') {
    return (
      <div style={{ width: size, height: size, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        background: `radial-gradient(circle at 30% 30%, ${shade(color, 30)}, ${color} 50%, ${shade(color, -25)})`,
        boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.18)',
      }}/>
    );
  }
  if (kind === 'pearls') {
    return (
      <div style={{ width: size*0.7, height: size*0.7, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, #fff, ${color} 70%)`,
        boxShadow: 'inset -1px -1px 3px rgba(0,0,0,0.2)',
      }}/>
    );
  }
  return <div style={{ width: size, height: size, borderRadius: 999, background: color }}/>;
}

// === Main render ===
function CakeRender({
  style = 'illustrated', // 'illustrated' | 'editorial'
  shape = 'round',
  size = 2,             // 0-4 (feeds 6/10/15/20/30)
  frostColor = '#FFE4E2',
  toppingsArr = [],     // array of { kind, color, x, y }  (x,y are 0..1 normalized on top surface)
  toppingColor = '#E35F40',
  message = '',
  flavor = '',
  rotation = 0,         // -30 .. 30 degrees
  zoom = 1,             // 0.85..1.25
  onDropTopping = null, // (x,y) => void   when toppings are dropped on top surface
  draggingKind = null,  // currently dragging topping kind
  scale = 1,            // overall display scale
  tiers = 2,            // 1, 2, or 3 tiers
  interactive = true,   // enable rotate gesture
  onRemoveTopping = null,
}) {
  // Cake dimensions, scaled
  const baseW = (180 + size * 18) * scale;
  const baseH = (66 + size * 4) * scale;
  const containerW = baseW + 120 * scale;
  const containerH = (tiers === 1 ? 200 : tiers === 2 ? 260 : 320) * scale;

  const isEditorial = style === 'editorial';
  const stageRef = useRefR(null);

  // Drop handling on top surface
  const topRef = useRefR(null);
  function handleDrop(e) {
    if (!onDropTopping) return;
    e.preventDefault();
    const rect = topRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onDropTopping(Math.max(0.08, Math.min(0.92, x)), Math.max(0.15, Math.min(0.85, y)));
  }
  function handleDragOver(e) { if (draggingKind) e.preventDefault(); }

  // Tier widths
  const tierWidths = tiers === 1 ? [baseW]
    : tiers === 2 ? [baseW, baseW - 60*scale]
    : [baseW, baseW - 50*scale, baseW - 100*scale];
  const tierHeights = tierWidths.map(() => baseH);

  // Position bottoms
  const plateY = 18 * scale;
  let tierBottoms = [];
  let acc = plateY + 10*scale;
  for (let i = 0; i < tiers; i++) {
    tierBottoms.push(acc);
    acc += tierHeights[i] - 8*scale;
  }
  // Top tier surface is at acc - 8 (top edge of last tier)
  const topTierIdx = tiers - 1;
  const topTierTop = tierBottoms[topTierIdx] + tierHeights[topTierIdx] - 4*scale;
  const topTierW = tierWidths[topTierIdx];
  const topTierH = tierHeights[topTierIdx];

  // Shape clip for top-down topping surface
  const isHeart = shape === 'heart';

  return (
    <div ref={stageRef} style={{
      position: 'relative', width: containerW, height: containerH,
      perspective: '900px', perspectiveOrigin: '50% 30%',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${isEditorial ? -8 : -6}deg) rotateY(${rotation}deg) scale(${zoom})`,
        transition: 'transform 320ms var(--ease-frosting)',
      }}>
        {/* PLATE (shadow ground) */}
        <div style={{
          position: 'absolute', bottom: plateY - 14*scale, left: '50%',
          transform: 'translateX(-50%)',
          width: baseW + 80*scale, height: 30*scale, borderRadius: '50%',
          background: isEditorial
            ? 'radial-gradient(ellipse at 50% 30%, #fff 0%, #F3ECDE 60%, rgba(243,236,222,0))'
            : 'radial-gradient(ellipse at 50% 30%, var(--ninos-paper), rgba(243,236,222,0.15) 80%)',
          boxShadow: isEditorial
            ? '0 18px 24px rgba(107,15,26,0.18), 0 4px 8px rgba(107,15,26,0.1)'
            : '0 12px 18px rgba(107,15,26,0.16)',
        }}/>

        {/* Plate rim */}
        <div style={{
          position: 'absolute', bottom: plateY - 6*scale, left: '50%',
          transform: 'translateX(-50%)',
          width: baseW + 70*scale, height: 14*scale, borderRadius: '50%',
          background: 'linear-gradient(to bottom, #fff, var(--ninos-paper))',
          border: '1px solid rgba(42,26,24,0.08)',
        }}/>

        {/* TIERS */}
        {Array.from({ length: tiers }).map((_, i) => {
          const w = tierWidths[i];
          const h = tierHeights[i];
          const bottom = tierBottoms[i];
          const c = i === 0 ? frostColor : shade(frostColor, 4 + i * 4);
          const shapeStyle = SHAPE_STYLES[shape] ? SHAPE_STYLES[shape](w, h) : SHAPE_STYLES.round(w, h);
          return (
            <React.Fragment key={i}>
              {/* Tier side */}
              <div style={{
                position: 'absolute', bottom, left: '50%', transform: 'translateX(-50%)',
                width: w, height: h,
                background: isEditorial
                  ? `linear-gradient(to right, ${shade(c,-14)} 0%, ${shade(c,10)} 30%, ${shade(c,18)} 50%, ${shade(c,4)} 75%, ${shade(c,-18)} 100%)`
                  : c,
                boxShadow: isEditorial
                  ? `inset 0 -10px 20px ${shade(c,-22)}, inset 0 4px 8px rgba(255,255,255,0.4), 0 4px 10px rgba(107,15,26,0.18)`
                  : `inset -16px 0 30px ${shade(c,-12)}, inset 16px 0 30px ${shade(c,16)}, 0 4px 10px rgba(107,15,26,0.18)`,
                transition: 'background 320ms var(--ease-frosting), box-shadow 320ms',
                ...shapeStyle,
              }}/>
              {/* Frosting drip on each tier edge */}
              <div style={{
                position: 'absolute', bottom: bottom + h - 6*scale, left: '50%',
                transform: 'translateX(-50%)',
                width: w + 2*scale, height: 12*scale,
                background: shade(c, -14),
                opacity: isEditorial ? 0.6 : 0.55,
                clipPath: 'polygon(0 0, 6% 70%, 12% 30%, 20% 80%, 28% 40%, 36% 90%, 44% 30%, 52% 80%, 60% 30%, 68% 70%, 76% 20%, 84% 70%, 92% 30%, 100% 0, 100% 0)',
                ...shapeStyle,
              }}/>
              {/* Top surface highlight ellipse */}
              <div style={{
                position: 'absolute', bottom: bottom + h - 4*scale,
                left: '50%', transform: 'translateX(-50%)',
                width: w, height: 10*scale,
                borderRadius: '50% / 100%',
                background: isEditorial
                  ? `radial-gradient(ellipse at 50% 30%, ${shade(c,20)} 0%, ${shade(c,8)} 60%, ${shade(c,-6)} 100%)`
                  : `linear-gradient(to bottom, ${shade(c,18)}, ${shade(c,4)})`,
                ...(isHeart ? { clipPath: SHAPE_STYLES.heart(w, 10*scale).clipPath } : {}),
              }}/>
            </React.Fragment>
          );
        })}

        {/* TOP SURFACE for dropping toppings — invisible interactive layer */}
        <div
          ref={topRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={(e) => {
            if (!draggingKind || !onDropTopping) return;
            const rect = topRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            onDropTopping(Math.max(0.08, Math.min(0.92, x)), Math.max(0.15, Math.min(0.85, y)));
          }}
          style={{
            position: 'absolute', bottom: topTierTop - 8*scale,
            left: '50%', transform: 'translateX(-50%)',
            width: topTierW, height: 24*scale,
            cursor: draggingKind ? 'copy' : 'default',
            outline: draggingKind ? `2px dashed var(--ninos-salmon)` : 'none',
            outlineOffset: 4,
            borderRadius: '50% / 100%',
            zIndex: 5,
          }}
        />

        {/* TOPPINGS — rendered absolutely on top surface */}
        {toppingsArr.map((t, i) => {
          const x = (t.x - 0.5) * topTierW;
          const yOffset = (t.y - 0.5) * topTierH * 0.35;
          return (
            <div key={i} style={{
              position: 'absolute',
              bottom: topTierTop + yOffset,
              left: `calc(50% + ${x}px)`,
              transform: 'translate(-50%, 0)',
              zIndex: 6 + Math.round(t.y * 10),
              animation: t.fresh ? 'scale-in 320ms var(--ease-bounce)' : 'none',
              cursor: onRemoveTopping ? 'pointer' : 'default',
              filter: isEditorial ? 'drop-shadow(0 2px 3px rgba(107,15,26,0.25))' : 'drop-shadow(0 1px 2px rgba(107,15,26,0.18))',
            }}
            onClick={(e) => { e.stopPropagation(); onRemoveTopping && onRemoveTopping(i); }}
            title={onRemoveTopping ? 'Click to remove' : ''}>
              <ToppingPiece kind={t.kind} color={t.color || toppingColor}
                size={(t.kind === 'sprinkles' ? 10 : t.kind === 'pearls' ? 11 : t.kind === 'flowers' ? 18 : 16) * scale} />
            </div>
          );
        })}

        {/* Cherry / signature heart on top — only when no message */}
        {!message && toppingsArr.length === 0 && (
          <div style={{
            position: 'absolute',
            bottom: topTierTop + 4*scale,
            left: '50%', transform: 'translate(-50%, 0)',
            filter: 'drop-shadow(0 2px 3px rgba(107,15,26,0.25))',
            zIndex: 8,
          }}>
            <BrandHeart size={22*scale} color="var(--ninos-salmon)" />
          </div>
        )}

        {/* MESSAGE written on top of cake */}
        {message && (
          <div style={{
            position: 'absolute',
            bottom: topTierTop + 4*scale,
            left: '50%', transform: 'translate(-50%, 0) rotateX(70deg)',
            width: topTierW * 0.86,
            textAlign: 'center',
            fontFamily: 'var(--font-script)',
            fontSize: Math.max(13, 18 * scale - message.length * 0.15),
            color: shade(toppingColor, -10),
            fontWeight: 600,
            lineHeight: 1.05,
            textShadow: '0 1px 0 rgba(255,255,255,0.4)',
            zIndex: 9,
            pointerEvents: 'none',
            transformOrigin: 'center top',
          }}>
            {message}
          </div>
        )}

        {/* Stand decoration line at base of bottom tier */}
        {!isEditorial && (
          <div style={{
            position: 'absolute', bottom: plateY + 4*scale,
            left: '50%', transform: 'translateX(-50%)',
            width: baseW - 30*scale, height: 6*scale,
            borderTop: `2px dotted ${shade(frostColor, -22)}`,
            opacity: 0.4,
          }}/>
        )}
      </div>
    </div>
  );
}

// Interactive 3D stage — wraps CakeRender with rotation gesture, zoom controls,
// and the background/lighting plate.
function CakeStage({
  cake,                       // cake state object
  background = 'cream',       // 'cream' | 'pattern' | 'warm'
  renderStyle = 'illustrated',
  draggingKind = null,
  onDropTopping = null,
  onRemoveTopping = null,
  rotation: rotationProp = null, // controlled rotation, else internal
  onRotateChange = null,
  showHints = true,
  scale = 1,
  height = 480,
}) {
  const [internalRot, setInternalRot] = useStateR(0);
  const [zoom, setZoom] = useStateR(1);
  const [dragging, setDragging] = useStateR(false);
  const stageRef = useRefR(null);
  const lastXRef = useRefR(0);
  const rotation = rotationProp != null ? rotationProp : internalRot;
  const setRotation = (v) => {
    if (onRotateChange) onRotateChange(v);
    else setInternalRot(v);
  };

  // Pointer drag to rotate
  function onPointerDown(e) {
    if (draggingKind) return; // don't rotate while placing toppings
    setDragging(true);
    lastXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    setRotation(Math.max(-45, Math.min(45, rotation + dx * 0.5)));
  }
  function onPointerUp(e) { setDragging(false); }

  // Background
  const bgStyles = {
    cream:   { background: 'var(--ninos-cream)' },
    warm:    { background: 'var(--ninos-paper)' },
    pattern: {
      background: 'var(--ninos-cream)',
      backgroundImage: 'url(assets/patterns/pattern-pink-hearts.png)',
      backgroundSize: '220px 220px',
      backgroundBlendMode: 'multiply',
    },
  };

  return (
    <div
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: 'relative', width: '100%', height,
        ...bgStyles[background],
        overflow: 'hidden',
        cursor: draggingKind ? 'copy' : (dragging ? 'grabbing' : 'grab'),
        userSelect: 'none',
        touchAction: 'none',
      }}>
      {/* Soft floor gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: renderStyle === 'editorial'
          ? 'radial-gradient(ellipse at 50% 78%, rgba(255,191,190,0.4) 0%, rgba(252,248,239,0) 60%)'
          : 'radial-gradient(ellipse at 50% 75%, var(--ninos-pink-100) 0%, transparent 60%)',
        pointerEvents: 'none',
      }}/>
      {/* Pattern watermark layer when bg=pattern */}
      {background === 'pattern' && (
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.18,
          backgroundImage: 'url(assets/patterns/pattern-pink-hearts.png)',
          backgroundSize: '220px 220px',
          pointerEvents: 'none',
        }}/>
      )}
      {/* Live chip */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <LiveChip/>
      </div>
      {/* Tools */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: 6 }}>
        <ToolButton onClick={() => setRotation(0)} title="Reset rotation"><Icon name="rotate" size={16}/></ToolButton>
        <ToolButton onClick={() => setZoom(Math.min(1.3, zoom + 0.1))} title="Zoom in"><Icon name="plus" size={16}/></ToolButton>
        <ToolButton onClick={() => setZoom(Math.max(0.8, zoom - 0.1))} title="Zoom out"><Icon name="minus" size={16}/></ToolButton>
      </div>

      {/* The cake itself */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <CakeRender
          style={renderStyle}
          shape={cake.shape}
          size={cake.sizeIdx}
          frostColor={cake.frostColor}
          toppingsArr={cake.toppings || []}
          toppingColor={cake.toppingColor}
          message={cake.message}
          flavor={cake.flavor}
          rotation={rotation}
          zoom={zoom}
          tiers={cake.tiers || 2}
          draggingKind={draggingKind}
          onDropTopping={onDropTopping}
          onRemoveTopping={onRemoveTopping}
          scale={scale}
        />
      </div>

      {/* Hints */}
      {showHints && (
        <div style={{
          position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--font-italic)', fontStyle: 'italic',
          fontSize: 13, color: 'var(--ninos-stone)', zIndex: 10,
          display: 'flex', gap: 16, alignItems: 'center',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="rotate" size={13}/> drag to rotate
          </span>
          {draggingKind && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ninos-salmon)' }}>
              <Icon name="plus" size={13}/> drop on cake to place
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function ToolButton({ children, onClick, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: 36, height: 36, borderRadius: 999, border: 0,
      background: 'rgba(255,255,255,0.86)',
      backdropFilter: 'blur(10px)',
      boxShadow: 'var(--shadow-sm)',
      cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      color: 'var(--ninos-ink)',
      transition: 'transform 160ms var(--ease-frosting)',
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      {children}
    </button>
  );
}

Object.assign(window, {
  CakeRender, CakeStage, ToppingPiece, TOPPINGS, shade,
});
