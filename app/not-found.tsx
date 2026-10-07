import Link from 'next/link';
import { Shell } from '@/components/designmash/shell';
export default function NotFound(){return <Shell><h1>Page not found</h1><p className="empty"><Link href="/">Back to Voting</Link></p></Shell>;}
