import { Header } from '@/components/Header';
import { Wrapper } from '@/components/Wrapper';
import axios from 'axios';
import { cookies } from 'next/headers';

interface product {
  name: string;
  description: string;
  price: number;
  processedImages: string[];
  caption: string[];
  hashtages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default async function dashboard() {
  let productData: any = [];
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await axios.get('http:/localhost:3000/api/getProduct', {
      headers: {
        'Content-Type': 'application/json',
        Cookie: token ? `token=${token}` : '',
      },
    });
    productData = response.data;
  } catch (error) {}
  return (
    <div>
      <Header />
      <Wrapper className="pt-16">
        <div>
          {productData.map((item: any) => {
            return <div>{item.name}</div>;
          })}
        </div>
      </Wrapper>
    </div>
  );
}
