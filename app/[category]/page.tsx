import { notFound } from 'next/navigation';
import { Voting } from '@/components/designmash/voting';
import { isCategory } from '@/lib/designmash/data';
export default async function Page({params}:{params:Promise<{category:string}>}){const {category}=await params;if(category!=='random'&&!isCategory(category))notFound();return <Voting category={category}/>;}
