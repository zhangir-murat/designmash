'use client';
import { useState } from 'react';
import { Entry, imageLabel } from '@/lib/designmash/data';
export function EntryImage({ entry }: { entry: Entry }) {
  const [broken, setBroken] = useState(false);
  if (entry.category_id === 'names') return <span className="name-example">{entry.name}</span>;
  return entry.image_url && !broken ? <img src={entry.image_url} alt={`${entry.name} ${imageLabel(entry.category_id).toLowerCase()}`} onError={() => setBroken(true)} /> : <span className="placeholder"><strong>{entry.name}</strong><small>{imageLabel(entry.category_id)} pending · sample entry</small></span>;
}
