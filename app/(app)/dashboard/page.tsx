import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { Wrapper } from '@/components/Wrapper';
import { product } from '@/types/types';
import axios from 'axios';
import { cookies } from 'next/headers';
import { toast } from 'sonner';

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
  } catch (error) {
    toast.error('error fetching data');
  }
  return (
    <div>
      <Header />
      <Wrapper className="pt-16">
        <div>
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
