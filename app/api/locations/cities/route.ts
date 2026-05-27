// app/api/locations/cities/route.ts
import { NextResponse } from 'next/server';
import { getCountryCities } from '@/lib/utils/countryUtils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get('countryCode');
  const regionCode = searchParams.get('regionCode');
  const search = searchParams.get('search')?.toLowerCase() || '';
  
  if (!countryCode) {
    return NextResponse.json({ error: 'Country code required' }, { status: 400 });
  }
  
  let cities = getCountryCities(countryCode, regionCode || undefined);
  
  // Фильтрация по поисковому запросу
  if (search) {
    cities = cities.filter(city => city.toLowerCase().includes(search));
  }
  
  return NextResponse.json(cities.slice(0, 100));
}