const { useState, useEffect, useRef } = React;

function App() {
  const [theme, setTheme] = useState('light');
  const [active, setActive] = useState('hero');
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // scrollspy
  useEffect(() => {
    const ids = window.NAV.map(n => n.id);
    const obs = new IntersectionObserver((entries) => {
      // pick the entry most visible near the top
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length > 0) {
        const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        setActive(top.target.id);
      }
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const navigate = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1600);
  };

  return (
    <>
      <div className="layout">
        <Sidebar active={active} onNavigate={navigate} theme={theme} setTheme={setTheme} />
        <main className="main">
          <MobileBar theme={theme} setTheme={setTheme} />
          <Hero />
          <PrimarySection showToast={showToast} />
          <ExtendedSection showToast={showToast} />
          <CombinationsSection />
          <TypographySection />
          <PrintSection />
          <Footer />
        </main>
      </div>
      <div className={`toast ${toast ? 'show' : ''}`}>{toast || ' '}</div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
