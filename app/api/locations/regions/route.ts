// app/api/locations/regions/route.ts
import { NextResponse } from 'next/server';
import { getCountryRegions, getCountrySafe } from '@/lib/utils/countryUtils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get('countryCode');
  
  if (!countryCode) {
    return NextResponse.json({ error: 'Country code required' }, { status: 400 });
  }
  
  const regions = getCountryRegions(countryCode);
  
  const formatted = regions.map(regionName => ({
    code: regionName,
    name: regionName,
    countryCode: countryCode,
  }));
  
  return NextResponse.json(formatted);
}