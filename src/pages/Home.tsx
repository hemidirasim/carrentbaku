import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import FeaturedCars from '@/components/home/FeaturedCars';
import Reviews from '@/components/home/Reviews';
import FeedbackForm from '@/components/home/FeedbackForm';
import CTASection from '@/components/home/CTASection';
import SnowEffect from '@/components/home/SnowEffect';

const Home = () => {
  return (
    <>
      <SnowEffect />
      <Hero />
      <FeaturedCars />
      <Services />
      <Reviews />
      <FeedbackForm />
      <CTASection />
    </>
  );
};

export default Home;
