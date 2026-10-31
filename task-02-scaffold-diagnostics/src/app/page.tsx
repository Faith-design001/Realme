export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: 'var(--realme-color-surface)',
        color: 'var(--realme-color-on-surface)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Top Header & Tenant Pill */}
        <header
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            borderBottom: '1px solid var(--realme-color-outline-variant)',
            paddingBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--realme-type-label-small-font-family)',
                fontSize: 'var(--realme-type-label-small-font-size)',
                lineHeight: 'var(--realme-type-label-small-line-height)',
                fontWeight: 'var(--realme-type-label-small-font-weight)',
                letterSpacing: 'var(--realme-type-label-small-letter-spacing)',
                backgroundColor: 'var(--realme-color-primary-container)',
                color: 'var(--realme-color-on-primary-container)',
                padding: '4px 10px',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}
            >
              Workspace: Lekki Central (Tenant Isolated)
            </span>

            <span
              style={{
                fontFamily: 'var(--realme-type-body-small-font-family)',
                fontSize: 'var(--realme-type-body-small-font-size)',
                lineHeight: 'var(--realme-type-body-small-line-height)',
                color: 'var(--realme-color-on-surface-variant)',
              }}
            >
              Realme Properties Ltd • Lagos
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--realme-type-headline-large-font-family)',
              fontSize: 'var(--realme-type-headline-large-font-size)',
              lineHeight: 'var(--realme-type-headline-large-line-height)',
              fontWeight: 'var(--realme-type-headline-large-font-weight)',
              letterSpacing: 'var(--realme-type-headline-large-letter-spacing)',
              color: 'var(--realme-color-primary)',
              marginTop: '8px',
            }}
          >
            RealMe
          </h1>

          <p
            style={{
              fontFamily: 'var(--realme-type-body-medium-font-family)',
              fontSize: 'var(--realme-type-body-medium-font-size)',
              lineHeight: 'var(--realme-type-body-medium-line-height)',
              color: 'var(--realme-color-on-surface-variant)',
            }}
          >
            Internal Deal Intelligence &amp; Transaction Web Application
          </p>
        </header>

        {/* Minimal Configuration & Diagnostic Health Card */}
        <section
          className="primary-card"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--realme-type-title-large-font-family)',
                fontSize: 'var(--realme-type-title-large-font-size)',
                lineHeight: 'var(--realme-type-title-large-line-height)',
                fontWeight: 'var(--realme-type-title-large-font-weight)',
                color: 'var(--realme-color-on-surface)',
              }}
            >
              Base Engine Configuration
            </h2>

            <span
              style={{
                fontFamily: 'var(--realme-type-label-small-font-family)',
                fontSize: 'var(--realme-type-label-small-font-size)',
                fontWeight: 'var(--realme-type-label-small-font-weight)',
                backgroundColor: 'var(--realme-color-primary-container)',
                color: 'var(--realme-color-on-primary-container)',
                padding: '4px 8px',
                borderRadius: '4px',
              }}
            >
              Phase 02 Ready
            </span>
          </div>

          <p
            style={{
              fontFamily: 'var(--realme-type-body-medium-font-family)',
              fontSize: 'var(--realme-type-body-medium-font-size)',
              lineHeight: 'var(--realme-type-body-medium-line-height)',
              color: 'var(--realme-color-on-surface)',
            }}
          >
            Foundational Next.js workspace successfully configured with TypeScript, Prisma ORM,
            and 100% tokenized Light Mode styling.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginTop: '8px',
            }}
          >
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: 'var(--realme-color-secondary-container)',
                borderRadius: '6px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--realme-type-label-medium-font-family)',
                  fontSize: 'var(--realme-type-label-medium-font-size)',
                  fontWeight: 'var(--realme-type-label-medium-font-weight)',
                  color: 'var(--realme-color-on-secondary-container)',
                  marginBottom: '4px',
                }}
              >
                Multi-Tenant RLS
              </div>
              <div
                style={{
                  fontFamily: 'var(--realme-type-body-small-font-family)',
                  fontSize: 'var(--realme-type-body-small-font-size)',
                  color: 'var(--realme-color-on-surface-variant)',
                }}
              >
                PostgreSQL Engine Enforced
              </div>
            </div>

            <div
              style={{
                padding: '12px 14px',
                backgroundColor: 'var(--realme-color-primary-container)',
                borderRadius: '6px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--realme-type-label-medium-font-family)',
                  fontSize: 'var(--realme-type-label-medium-font-size)',
                  fontWeight: 'var(--realme-type-label-medium-font-weight)',
                  color: 'var(--realme-color-on-primary-container)',
                  marginBottom: '4px',
                }}
              >
                Design System Tokens
              </div>
              <div
                style={{
                  fontFamily: 'var(--realme-type-body-small-font-family)',
                  fontSize: 'var(--realme-type-body-small-font-size)',
                  color: 'var(--realme-color-on-surface-variant)',
                }}
              >
                0 Raw Hex / 100% Tokens
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginTop: '12px',
            }}
          >
            <a
              href="/api/diagnostics"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 18px',
                backgroundColor: 'var(--realme-color-primary)',
                color: 'var(--realme-color-on-primary)',
                fontFamily: 'var(--realme-type-label-large-font-family)',
                fontSize: 'var(--realme-type-label-large-font-size)',
                lineHeight: 'var(--realme-type-label-large-line-height)',
                fontWeight: 'var(--realme-type-label-large-font-weight)',
                letterSpacing: 'var(--realme-type-label-large-letter-spacing)',
                borderRadius: '6px',
                boxShadow: 'var(--realme-elevation-level-1)',
              }}
            >
              Check Telemetry Diagnostics
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            textAlign: 'center',
            paddingTop: '16px',
            borderTop: '1px solid var(--realme-color-outline-variant)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--realme-type-body-small-font-family)',
              fontSize: 'var(--realme-type-body-small-font-size)',
              lineHeight: 'var(--realme-type-body-small-line-height)',
              color: 'var(--realme-color-on-surface-variant)',
            }}
          >
            RealMe • Fiduciary Deal Platform • Lekki Lagos
          </span>
        </footer>
      </div>
    </main>
  );
}

