import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { BestSellers } from '@/components/home/BestSellers';
import { NewProducts } from '@/components/home/NewProducts';
import { PromoBanner } from '@/components/home/PromoBanner';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TrustBadges } from '@/components/home/TrustBadges';
import { CustomerReviews } from '@/components/home/CustomerReviews';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <BestSellers />
      <PromoBanner />
      <NewProducts />
      <HowItWorks />
      <TrustBadges />
      <CustomerReviews />
    </>
  );
}
