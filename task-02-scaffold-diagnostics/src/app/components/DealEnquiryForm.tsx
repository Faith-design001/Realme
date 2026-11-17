'use client';

import React, { useState } from 'react';

export default function DealEnquiryForm() {
  const [title, setTitle] = useState('Waterfront Duplex Lekki Phase 1');
  const [address, setAddress] = useState('Plot 14 Admiralty Way, Lekki');
  const [askingPrice, setAskingPrice] = useState('410000000');
  const [agentEmail, setAgentEmail] = useState('tunde.bakare@realme.ng');
  const [loading, setLoading] = useState(false);
  const [responseLog, setResponseLog] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseLog(null);

    const startTime = performance.now();
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          address,
          askingPrice: parseFloat(askingPrice),
          agentEmail,
        }),
      });

      const elapsedMs = Math.round(performance.now() - startTime);
      const data = await res.json();

      setResponseLog({
        status: res.status,
        statusText: res.statusText || (res.status === 201 ? 'Created' : 'Service Unavailable'),
        elapsedMs,
        timestamp: new Date().toISOString(),
        payload: data,
      });
    } catch (err: any) {
      const elapsedMs = Math.round(performance.now() - startTime);
      setResponseLog({
        status: 0,
        statusText: 'Network / Socket Connection Error',
        elapsedMs,
        timestamp: new Date().toISOString(),
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        padding: '24px',
        backgroundColor: 'var(--realme-color-surface-container-low)',
        borderRadius: '8px',
        border: '1px solid var(--realme-color-outline-variant)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3
          style={{
            fontFamily: 'var(--realme-type-title-medium-font-family)',
            fontSize: 'var(--realme-type-title-medium-font-size)',
            lineHeight: 'var(--realme-type-title-medium-line-height)',
            fontWeight: 'var(--realme-type-title-medium-font-weight)',
            color: 'var(--realme-color-on-surface)',
          }}
        >
          Database Mutation &amp; Deal Ingestion Form
        </h3>
        <span
          style={{
            fontFamily: 'var(--realme-type-label-small-font-family)',
            fontSize: 'var(--realme-type-label-small-font-size)',
            backgroundColor: 'var(--realme-color-secondary-container)',
            color: 'var(--realme-color-on-secondary-container)',
            padding: '3px 8px',
            borderRadius: '4px',
          }}
        >
          Task 02 Step 6 Proof
        </span>
      </div>

      <p
        style={{
          fontFamily: 'var(--realme-type-body-small-font-family)',
          fontSize: 'var(--realme-type-body-small-font-size)',
          color: 'var(--realme-color-on-surface-variant)',
        }}
      >
        Submits real estate deal parameters directly to PostgreSQL via Prisma ORM to verify database writes and prevent false-success masking.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--realme-type-label-small-font-family)',
              fontSize: 'var(--realme-type-label-small-font-size)',
              marginBottom: '4px',
            }}
          >
            Listing Asset Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: '4px',
              border: '1px solid var(--realme-color-outline)',
              backgroundColor: 'var(--realme-color-surface)',
              color: 'var(--realme-color-on-surface)',
              fontFamily: 'var(--realme-type-body-medium-font-family)',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--realme-type-label-small-font-family)',
              fontSize: 'var(--realme-type-label-small-font-size)',
              marginBottom: '4px',
            }}
          >
            Property Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: '4px',
              border: '1px solid var(--realme-color-outline)',
              backgroundColor: 'var(--realme-color-surface)',
              color: 'var(--realme-color-on-surface)',
              fontFamily: 'var(--realme-type-body-medium-font-family)',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--realme-type-label-small-font-family)',
                fontSize: 'var(--realme-type-label-small-font-size)',
                marginBottom: '4px',
              }}
            >
              Asking Price (₦)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={askingPrice}
              onChange={(e) => setAskingPrice(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: '4px',
                border: '1px solid var(--realme-color-outline)',
                backgroundColor: 'var(--realme-color-surface)',
                color: 'var(--realme-color-on-surface)',
                fontFamily: 'var(--realme-type-body-medium-font-family)',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--realme-type-label-small-font-family)',
                fontSize: 'var(--realme-type-label-small-font-size)',
                marginBottom: '4px',
              }}
            >
              Agent Email
            </label>
            <input
              type="email"
              value={agentEmail}
              onChange={(e) => setAgentEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: '4px',
                border: '1px solid var(--realme-color-outline)',
                backgroundColor: 'var(--realme-color-surface)',
                color: 'var(--realme-color-on-surface)',
                fontFamily: 'var(--realme-type-body-medium-font-family)',
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '8px',
            padding: '0.75rem 1.25rem',
            backgroundColor: 'var(--realme-color-primary)',
            color: 'var(--realme-color-on-primary)',
            fontFamily: 'var(--realme-type-label-large-font-family)',
            fontSize: 'var(--realme-type-label-large-font-size)',
            fontWeight: 'var(--realme-type-label-large-font-weight)',
            borderRadius: '6px',
            border: 'none',
            cursor: loading ? 'wait' : 'pointer',
            boxShadow: 'var(--realme-elevation-level-1)',
          }}
        >
          {loading ? 'Submitting to Database...' : 'Submit Deal Record to Database'}
        </button>
      </form>

      {responseLog && (
        <div
          style={{
            marginTop: '12px',
            padding: '16px',
            borderRadius: '6px',
            backgroundColor:
              responseLog.status === 201
                ? 'var(--realme-color-primary-container)'
                : 'var(--realme-color-error-container)',
            color:
              responseLog.status === 201
                ? 'var(--realme-color-on-primary-container)'
                : 'var(--realme-color-on-error-container)',
            fontFamily: 'var(--realme-type-body-small-font-family)',
            fontSize: 'var(--realme-type-body-small-font-size)',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
            HTTP Response: {responseLog.status} {responseLog.statusText} ({responseLog.elapsedMs}ms)
          </div>
          <pre
            style={{
              margin: 0,
              padding: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '4px',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {JSON.stringify(responseLog, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}

