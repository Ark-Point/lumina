import Footer from '@/components/footer';
import Header from '@/components/header';
import { StrictPropsWithChildren } from '@/types';

const GlobalLayout = ({ children }: StrictPropsWithChildren) => {
  return (
    <div className="layout">
      <Header />
      <main id={'root-container'}>{children}</main>
      <Footer />
    </div>
  );
};

export default GlobalLayout;
