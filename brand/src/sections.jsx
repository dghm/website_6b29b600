const { useState: useStateS, useEffect: useEffectS } = React;

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="hero" id="hero" data-screen-label="00 Hero">
      <div className="hero-grid"></div>
      <div className="container hero-inner">
        <div className="hero-meta">
          <span>v1.0 · 2025</span>
          <span className="hero-meta-dot"></span>
          <span>Brand Identity</span>
          <span className="hero-meta-dot"></span>
          <span>Internal Reference</span>
        </div>
        <div className="hero-eyebrow">Brand Color Guidelines</div>
        <h1 className="hero-title">
          萬能數維<br/>
          品牌<span className="accent">色彩</span>指南
        </h1>
        <p className="hero-sub">
          這是萬能數維（Digi-Handyman）對外溝通的視覺基礎。所有設計輸出 — 簡報、網頁、印刷品 — 都應從本指南取色，確保品牌在任何媒材上保持一致的張力與專業感。
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">03</div>
            <div className="hero-stat-label">主色</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">05</div>
            <div className="hero-stat-label">輔助色</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">04</div>
            <div className="hero-stat-label">配色組合</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">15<span style={{fontSize:'0.5em'}}>%</span></div>
            <div className="hero-stat-label">橘色用量上限</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- COPY HELPER ---------- */
function useCopy(showToast) {
  return (val, label) => {
    navigator.clipboard.writeText(val).then(() => {
      showToast(`${label}  ·  ${val}  已複製`);
    });
  };
}

/* ---------- PRIMARY ---------- */
function PrimarySection({ showToast }) {
  const copy = useCopy(showToast);
  const [copied, setCopied] = useStateS(null);

  const handleCopy = (val, label, key) => {
    copy(val, label);
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <section className="chapter" id="primary" data-screen-label="01 Primary">
      <div className="container">
        <div className="ch-header">
          <div className="ch-num">01 — PRIMARY PALETTE</div>
          <h2 className="ch-title">主要色彩<span className="en">Primary Palette</span></h2>
          <p className="ch-desc">品牌主色與強調色是所有視覺材料的核心。任何設計輸出都應優先從此色盤取色，不得任意替換。點擊任一色碼即可複製。</p>
        </div>

        <div className="color-grid">
          {window.PRIMARY_COLORS.map((c, i) => (
            <div className="color-card" key={i}>
              <div
                className={`color-swatch ${c.bordered ? 'bordered' : ''}`}
                style={{ background: c.hex, color: c.fg }}
              >
                <div className="color-role">{c.role}</div>
                <div>
                  <div className="color-name">{c.name}</div>
                  <div className="color-name-en">{c.en}</div>
                </div>
              </div>
              <div className="color-info">
                {[
                  { label: 'HEX', val: c.hex },
                  { label: 'RGB', val: c.rgb },
                  { label: 'CMYK', val: c.cmyk },
                  { label: 'PMS', val: c.pantone },
                ].map(row => {
                  const key = `${i}-${row.label}`;
                  return (
                    <div
                      key={row.label}
                      className={`color-row ${copied === key ? 'copied' : ''}`}
                      onClick={() => handleCopy(row.val, row.label, key)}
                    >
                      <div className="color-row-label">{row.label}</div>
                      <div className="color-row-value">{row.val}</div>
                      <div className="color-row-copy">{copied === key ? 'COPIED ✓' : 'COPY'}</div>
                    </div>
                  );
                })}
                <div className="color-usage">{c.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- EXTENDED ---------- */
function ExtendedSection({ showToast }) {
  const copy = useCopy(showToast);
  return (
    <section className="chapter" id="extended" data-screen-label="02 Extended" style={{ background: 'var(--bg-alt)' }}>
      <div className="container">
        <div className="ch-header">
          <div className="ch-num">02 — EXTENDED PALETTE</div>
          <h2 className="ch-title">輔助色彩<span className="en">Extended Palette</span></h2>
          <p className="ch-desc">輔助色用於支撐主色盤，提供層次與功能性表達 — 文字深淺、邊框、Hover 狀態。不可獨立作為主視覺色使用。</p>
        </div>

        <div className="palette-row">
          {window.EXTENDED_COLORS.map((c, i) => (
            <div className="palette-card" key={i} onClick={() => copy(c.hex, c.name)}>
              <div className="palette-swatch" style={{ background: c.hex, color: c.fg }}>
                <div style={{
                  position: 'absolute', top: 12, left: 14,
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  letterSpacing: 1.5, opacity: 0.7,
                }}>{c.en.toUpperCase()}</div>
              </div>
              <div className="palette-info">
                <div className="palette-name">{c.name}</div>
                <div className="palette-hex">{c.hex}</div>
                <div className="palette-use">{c.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- COMBINATIONS + RULES ---------- */
function CombinationsSection() {
  return (
    <section className="chapter" id="combinations" data-screen-label="03 Combinations">
      <div className="container">
        <div className="ch-header">
          <div className="ch-num">03 — COMBINATIONS</div>
          <h2 className="ch-title">配色組合規範<span className="en">Combinations & Rules</span></h2>
          <p className="ch-desc">以下為核心場景的配色用法。遵循此規範可確保所有媒材在視覺上保持一致，並避免常見的對比度與比例問題。</p>
        </div>

        <div className="combo-grid">
          {window.COMBOS.map((c, i) => (
            <div className="combo-card" key={i} style={c.bordered ? { borderColor: 'var(--border)' } : {}}>
              <div className="combo-preview" style={{ background: c.bg, color: c.fg }}>
                <div className="combo-preview-tag" style={{
                  background: c.bg === '#FFFFFF' ? 'rgba(13,47,110,0.08)' : 'rgba(255,255,255,0.15)',
                  color: c.fg,
                }}>COMBO {c.tag}</div>
                {c.isStat ? (
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 56, lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {c.headline}
                  </div>
                ) : (
                  <>
                    <div className="combo-headline" style={{ whiteSpace: 'pre-line' }}>{c.headline}</div>
                    {c.showCta && (
                      <div className="combo-cta" style={{ background: c.accent }}>立即諮詢 →</div>
                    )}
                  </>
                )}
              </div>
              <div className="combo-meta">
                <div className="combo-meta-title">{c.sub}</div>
                <div className="combo-meta-sub">{c.use}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rules-grid">
          <div className="rules-card rules-do">
            <div className="rules-head">
              <div className="rules-icon">✓</div>
              <span>DO — 應該這樣做</span>
            </div>
            <ul className="rules-list">
              {window.RULES_DO.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
          <div className="rules-card rules-dont">
            <div className="rules-head">
              <div className="rules-icon">✗</div>
              <span>DON'T — 不要這樣做</span>
            </div>
            <ul className="rules-list">
              {window.RULES_DONT.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- TYPOGRAPHY ---------- */
function TypographySection() {
  const [scale, setScale] = useStateS(1);
  const [weight, setWeight] = useStateS(700);
  const [bodyWeight, setBodyWeight] = useStateS(400);

  return (
    <section className="chapter" id="typography" data-screen-label="04 Typography" style={{ background: 'var(--bg-alt)' }}>
      <div className="container">
        <div className="ch-header">
          <div className="ch-num">04 — TYPOGRAPHY</div>
          <h2 className="ch-title">字體與排版<span className="en">Typography</span></h2>
          <p className="ch-desc">品牌字體為 K2D（中英混排），搭配 Noto Sans TC 作為繁體中文備援字體。拖動下方控制器即時預覽字體大小與字重變化。</p>
        </div>

        <div className="type-controls">
          <div className="type-control">
            <span className="type-control-label">縮放</span>
            <input type="range" min="0.7" max="1.5" step="0.05" value={scale} onChange={e => setScale(parseFloat(e.target.value))} />
            <span className="type-val">{Math.round(scale * 100)}%</span>
          </div>
          <div className="type-control">
            <span className="type-control-label">標題字重</span>
            <select value={weight} onChange={e => setWeight(parseInt(e.target.value))}>
              <option value="400">Regular 400</option>
              <option value="500">Medium 500</option>
              <option value="600">SemiBold 600</option>
              <option value="700">Bold 700</option>
              <option value="800">ExtraBold 800</option>
            </select>
          </div>
          <div className="type-control">
            <span className="type-control-label">內文字重</span>
            <select value={bodyWeight} onChange={e => setBodyWeight(parseInt(e.target.value))}>
              <option value="300">Light 300</option>
              <option value="400">Regular 400</option>
              <option value="500">Medium 500</option>
              <option value="600">SemiBold 600</option>
            </select>
          </div>
        </div>

        <div className="type-spec">
          <div className="type-spec-meta">
            <strong>Tagline</strong>
            <div className="type-spec-meta-row"><span>Family</span><span>K2D</span></div>
            <div className="type-spec-meta-row"><span>Weight</span><span>700</span></div>
            <div className="type-spec-meta-row"><span>Size</span><span>0.75rem</span></div>
            <div className="type-spec-meta-row"><span>Letter</span><span>2px</span></div>
            <div className="type-spec-meta-row"><span>Color</span><span>#E5622A</span></div>
          </div>
          <div className="type-tagline" style={{ fontSize: `${0.75 * scale}rem` }}>
            先 診 斷 ・ 再 設 計 ・ 讓 效 率 說 話
          </div>
        </div>

        <div className="type-spec">
          <div className="type-spec-meta">
            <strong>H1 標題</strong>
            <div className="type-spec-meta-row"><span>Family</span><span>K2D</span></div>
            <div className="type-spec-meta-row"><span>Weight</span><span>{weight}</span></div>
            <div className="type-spec-meta-row"><span>Size</span><span>{(3 * scale).toFixed(2)}rem</span></div>
            <div className="type-spec-meta-row"><span>Line</span><span>1.2</span></div>
            <div className="type-spec-meta-row"><span>Color</span><span>#0D2F6E</span></div>
          </div>
          <h1 className="type-h1" style={{ fontSize: `${3 * scale}rem`, fontWeight: weight }}>
            你說需要新網站，<br/>我幫你找到真正的問題
          </h1>
        </div>

        <div className="type-spec">
          <div className="type-spec-meta">
            <strong>內文 Body</strong>
            <div className="type-spec-meta-row"><span>Family</span><span>K2D</span></div>
            <div className="type-spec-meta-row"><span>Weight</span><span>{bodyWeight}</span></div>
            <div className="type-spec-meta-row"><span>Size</span><span>{(1 * scale).toFixed(2)}rem</span></div>
            <div className="type-spec-meta-row"><span>Line</span><span>1.7</span></div>
            <div className="type-spec-meta-row"><span>Color</span><span>#5A6580</span></div>
          </div>
          <p className="type-body" style={{ fontSize: `${1 * scale}rem`, fontWeight: bodyWeight, maxWidth: '60ch' }}>
            透過深入訪談與流程梳理，找出企業真正面臨的痛點，再用客製化的數位系統解決它。從品牌設計到作業流程優化，每一次合作都從「理解你的業務」開始。
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- PRINT ---------- */
function PrintSection() {
  return (
    <section className="chapter" id="print" data-screen-label="05 Print">
      <div className="container">
        <div className="ch-header">
          <div className="ch-num">05 — PRINT & MEDIA</div>
          <h2 className="ch-title">印刷品與各媒材用色<span className="en">Print & Media Specifications</span></h2>
          <p className="ch-desc">不同輸出媒材需使用對應的色彩規格。螢幕用 RGB / HEX，印刷用 CMYK 或 Pantone 對應，避免顏色偏差。</p>
        </div>

        <div className="print-grid">
          <div className="print-card">
            <div className="print-card-head">
              <div className="print-icon">🌐</div>
              <div>
                <div className="print-card-title">數位媒材</div>
                <div className="print-card-sub">SCREEN · RGB / HEX</div>
              </div>
            </div>
            <table className="spec-table">
              <thead>
                <tr><th>色彩</th><th>HEX</th><th>RGB</th></tr>
              </thead>
              <tbody>
                {window.PRINT_DIGITAL.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <div className="table-chip" style={{ background: r.hex }}></div>
                      {r.name}
                    </td>
                    <td>{r.hex}</td>
                    <td>{r.rgb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="print-card">
            <div className="print-card-head">
              <div className="print-icon">🖨</div>
              <div>
                <div className="print-card-title">印刷品</div>
                <div className="print-card-sub">PRINT · CMYK / PANTONE</div>
              </div>
            </div>
            <table className="spec-table">
              <thead>
                <tr><th>色彩</th><th>CMYK</th><th>Pantone</th></tr>
              </thead>
              <tbody>
                {window.PRINT_CMYK.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <div className="table-chip" style={{ background: r.hex }}></div>
                      {r.name}
                    </td>
                    <td>{r.cmyk}</td>
                    <td>{r.pantone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            letterSpacing: 2, textTransform: 'uppercase', color: 'var(--fg-muted)',
            marginBottom: 16,
          }}>📄 各媒材建議用色</div>
          <div className="media-grid">
            {window.MEDIA_USAGE.map((m, i) => (
              <div className="media-row" key={i}>
                <strong>{m.media}</strong>
                <span>{m.use}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            letterSpacing: 2, textTransform: 'uppercase', color: 'var(--fg-muted)',
            marginBottom: 16,
          }}>⚠ 無障礙對比度 · WCAG</div>
          <div className="contrast-grid">
            {window.CONTRAST.map((c, i) => (
              <div className="contrast-card" key={i}>
                <div className="contrast-preview" style={{ background: c.bg, color: c.fg }}>
                  {c.label}
                </div>
                <div className="contrast-meta">
                  <span>{c.ratio}</span>
                  <span className="contrast-pass">{c.wcag} ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-meta">
              <strong>萬能數維有限公司 — Digi-Handyman</strong>
              Brand Color Guidelines v1.0 · help@dghm.tw<br/>
              本文件僅供內部使用與設計委外參考 · © 2025
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="assets/logo-dghm.png" alt="DGHM" style={{ width: 40, height: 40 }} />
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Hero, PrimarySection, ExtendedSection,
  CombinationsSection, TypographySection, PrintSection, Footer,
});
