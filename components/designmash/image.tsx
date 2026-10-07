'use client';
import { useState } from 'react';
import { Entry, imageLabel } from '@/lib/designmash/data';
export function EntryImage({ entry }: { entry: Entry }) {
  const [broken, setBroken] = useState(false);
  if (entry.category_id === 'names') return <span className="name-example">{entry.name}</span>;
  if (entry.category_id === 'checkout-page' && (!entry.image_url || entry.image_url.startsWith('https://s0.wp.com/mshots/') || broken)) return <span className="placeholder"><strong>{entry.name}</strong><small>Screenshot unavailable</small></span>;
  return entry.image_url && !broken ? <img src={entry.image_url} alt={`${entry.name} ${imageLabel(entry.category_id).toLowerCase()}`} onError={() => setBroken(true)} /> : <span className="placeholder"><strong>{entry.name}</strong><small>{imageLabel(entry.category_id)} pending · sample entry</small></span>;
}
