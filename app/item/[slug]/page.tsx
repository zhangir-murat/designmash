import { Item } from '@/components/designmash/item';
export default async function Page({params}:{params:Promise<{slug:string}>}){return <Item slug={(await params).slug}/>;}
