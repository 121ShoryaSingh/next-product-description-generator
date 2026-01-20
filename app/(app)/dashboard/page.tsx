import ErrorComponent from '@/components/ErrorComponent';
import { Header } from '@/components/Header';
import NavButton from '@/components/NavButton';
import { ProductCard } from '@/components/ProductCard';
import { Wrapper } from '@/components/Wrapper';
import { product } from '@/types/types';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  userId: string;
  email: string;
  name: string;
}

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return {
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
      },
      expires: decoded.exp
        ? new Date(decoded.exp * 1000).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  } catch {
    return null;
  }
}

export default async function dashboard() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }
  let productData: product[] = [];
  let errorMessage: string = '';
  try {
    errorMessage = '';
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/getProduct`,
      {
        withCredentials: true,
      },
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
    <>
      <Header />
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
    </>
  );
}
