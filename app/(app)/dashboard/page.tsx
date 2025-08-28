import { Header } from '@/components/Header';
import { Wrapper } from '@/components/Wrapper';

export default function dashboard() {
  return (
    <div>
      <Header />
      <Wrapper className="pt-16">
        <div>Products</div>
      </Wrapper>
    </div>
  );
}
