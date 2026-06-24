/**
 * UniverseFooter — Minimal Dark Footer
 * 
 * Matches the cosmic aesthetic. Namma Universe branding.
 */

export default function UniverseFooter() {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 20,
        background: '#05060A',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        padding: '4rem 2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            fontFamily: "'Clash Display', 'Inter', sans-serif",
            fontSize: '1rem',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.3)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Namma Universe
        </div>

        {/* Links */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {['Aiva', 'Wellora', 'Echo', 'Homie', 'EV Copilot'].map((name) => (
            <span
              key={name}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              {name}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.06)',
          }}
        />

        {/* Tagline + Copyright */}
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.2)',
              marginBottom: '0.75rem',
              fontStyle: 'italic',
            }}
          >
            Building the future, one problem at a time.
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            © {new Date().getFullYear()} Namma Universe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
