'use client';
import { useEffect, useState } from 'react';
import { Entry, imageLabel } from '@/lib/designmash/data';
function CheckoutScreenshot({ entry }: { entry: Entry }) {
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (ready) return;
    const timer = setTimeout(() => setAttempt(n => n + 1), Math.min(10000 * (attempt + 1), 30000));
    return () => clearTimeout(timer);
  }, [ready, attempt]);
  // mShots initially redirects to a 400px-wide "generating" GIF. Request the
  // 1280px capture again until it is available instead of displaying that GIF.
  const src = `${entry.image_url}${attempt ? `&designmash_retry=${attempt}` : ''}`;
  return <>
    <img src={src} alt={`${entry.name} screenshot`} style={ready ? undefined : { display: 'none' }} onLoad={event => setReady(event.currentTarget.naturalWidth >= 1280)} onError={() => setReady(false)} />
    {!ready && <span className="placeholder" role="status"><strong>{entry.name}</strong><small>Loading screenshot…</small></span>}
  </>;
}
export function EntryImage({ entry }: { entry: Entry }) {
  const [broken, setBroken] = useState(false);
  if (entry.category_id === 'names') return <span className="name-example">{entry.name}</span>;
  if (entry.category_id === 'checkout-page' && entry.image_url?.startsWith('https://s0.wp.com/mshots/v1/')) return <CheckoutScreenshot key={entry.image_url} entry={entry} />;
  return entry.image_url && !broken ? <img src={entry.image_url} alt={`${entry.name} ${imageLabel(entry.category_id).toLowerCase()}`} onError={() => setBroken(true)} /> : <span className="placeholder"><strong>{entry.name}</strong><small>{imageLabel(entry.category_id)} pending · sample entry</small></span>;
}
