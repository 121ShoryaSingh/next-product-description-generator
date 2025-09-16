import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Wrapper } from '@/components/Wrapper';
import { product } from '@/types/types';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { cookies } from 'next/headers';

export default async function dashboard() {
  let productData: product[] = [];
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await axios.get('http://localhost:3000/api/getProduct', {
      headers: {
        'Content-Type': 'application/json',
        Cookie: token ? `token=${token}` : '',
      },
    });
    productData = response.data.message;
  } catch (error) {}
  return (
    <div className="pt-8">
      <Wrapper className="pt-16 flex-col">
        <div className="flex justify-between pb-7">
          <div className="sm:self-center self-start">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-lg text-gray-500">
              Manage your product and track perfomance
            </p>
          </div>
          <div className="self-center hidden sm:block">
            <Button className="">
              <Plus />
              <span>Add Product</span>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
