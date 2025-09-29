import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const SERPAPI_KEY = process.env.SERPAPI_API_KEY;
const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';

export async function GET(req: NextRequest) {
  try {
    if (!SERPAPI_KEY) {
      return NextResponse.json(
        { error: 'SerpAPI key not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const seapApiParams = {
      engine: 'google_shopping',
      api_key: SERPAPI_KEY,
      q: query,
      location: 'India',
      gl: 'in',
      h1: 'en',
      google_domain: 'google.co.in',
      output: 'json',
    };

    const response = await axios.get(SERPAPI_BASE_URL, {
      params: seapApiParams,
    });

    const { shopping_results } = response.data;

    const ProductData = shopping_results.slice(0, 6);

    return NextResponse.json(
      {
        success: true,
        data: ProductData,
        message: 'Products fetched successfully',
        total_results: response.data.shopping_results?.length || 0,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('SerpApi Error', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}
