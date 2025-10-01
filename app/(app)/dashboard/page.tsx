import ErrorComponent from '@/components/ErrorComponent';
import NavButton from '@/components/NavButton';
import { ProductCard } from '@/components/ProductCard';
import { Wrapper } from '@/components/Wrapper';
import { product } from '@/types/types';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { cookies } from 'next/headers';

export default async function dashboard() {
  let productData: product[] = [];
  let errorMessage: string = '';
  try {
    errorMessage = '';
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/getProduct`,
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: token ? `token=${token}` : '',
        },
      }
    );
    productData = response.data.message;
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = 'An unexpected error occurred';
    }
  }

  if (errorMessage) {
    return <ErrorComponent error={errorMessage} />;
  }
  return (
    <div className="pt-8 min-h-screen bg-gray-200">
      <Wrapper className="pt-16 flex-col">
        <div className="flex justify-between pb-7">
          <div className="sm:self-center self-start">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-lg text-gray-500">
              Manage your product and track perfomance
            </p>
          </div>
          <div className="self-center hidden sm:block">
            <NavButton link="/upload">
              <Plus />
              <span>Add Product</span>
            </NavButton>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productData.map((product: product, index: number) => {
            return (
              <ProductCard
                key={index}
                {...product}
              />
            );
          })}
        </div>
      </Wrapper>
    </div>
  );
}
