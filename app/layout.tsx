import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: { default: 'DESIGNMASH', template: '%s · DESIGNMASH' }, description: 'Two things enter. You pick one. Rankings change.', icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
