const { useState, useEffect } = React;

function Sidebar({ active, onNavigate, theme, setTheme }) {
  return (
    <aside className="sidebar">
      <div className="side-brand">
        <img src="assets/logo-dghm.png" alt="DGHM" />
        <div className="side-brand-text">
          <div className="side-brand-name">萬能數維</div>
          <div className="side-brand-sub">Digi-Handyman</div>
        </div>
      </div>

      <div className="side-section">
        <div className="side-label">Brand Color Guide</div>
        {window.NAV.map(item => (
          <a
            key={item.id}
            className={`side-link ${active === item.id ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
            href={`#${item.id}`}
          >
            <span className="side-num">{item.num}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      <div className="side-section">
        <div className="side-label">Theme</div>
        <div className="theme-toggle">
          <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>LIGHT</button>
          <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>DARK</button>
        </div>
      </div>

      <div className="side-meta">
        <strong>v1.0 — 2025</strong>
        萬能數維有限公司<br/>
        help@dghm.tw<br/>
        <span style={{ opacity: 0.7, marginTop: 8, display: 'block' }}>本文件僅供內部使用<br/>與設計委外參考</span>
      </div>
    </aside>
  );
}

function MobileBar({ theme, setTheme }) {
  return (
    <div className="mobile-bar">
      <img src="assets/logo-dghm.png" alt="DGHM" />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>萬能數維 品牌色彩指南</div>
        <div style={{ fontSize: 10, color: 'var(--fg-muted)', letterSpacing: 1, textTransform: 'uppercase' }}>v1.0 · Brand Guide</div>
      </div>
      <div className="theme-toggle" style={{ marginTop: 0 }}>
        <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>L</button>
        <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>D</button>
      </div>
    </div>
  );
}

window.Sidebar = Sidebar;
window.MobileBar = MobileBar;
