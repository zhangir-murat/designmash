import Link from 'next/link';
import { categories } from '@/lib/designmash/data';
export function CategoryLinks({ active, random = true, query = false }: { active?: string; random?: boolean; query?: boolean }) {
  return <nav className="categories" aria-label="Categories">{[...categories, ...(random ? [{ slug: 'random', name: 'RANDOM' }] : [])].map(c => <Link key={c.slug} href={query ? `/rankings?category=${c.slug}` : `/${c.slug}`} className={active === c.slug ? 'active' : ''} aria-current={active === c.slug ? 'page' : undefined}>{c.name}</Link>)}</nav>;
}
export function Footer() { return <footer><Link href="/about">About</Link><span> · </span><Link href="/add">Add</Link><span> · </span><Link href="/rankings">Rankings</Link><span> · </span><Link href="/removal">Removal</Link></footer>; }
export function Shell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <><header className="masthead"><Link href="/">DESIGNMASH</Link></header><main className={`frame ${className}`}>{children}<Footer /></main></>;
}
