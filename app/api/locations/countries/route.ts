// app/api/locations/countries/route.ts
import { NextResponse } from 'next/server';
import { getAllCountriesInfo } from '@/lib/utils/countryUtils';

export async function GET() {
  const countries = getAllCountriesInfo();
  return NextResponse.json(countries);
}