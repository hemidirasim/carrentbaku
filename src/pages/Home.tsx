import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import FeaturedCars from '@/components/home/FeaturedCars';
import Reviews from '@/components/home/Reviews';
import FeedbackForm from '@/components/home/FeedbackForm';
import CTASection from '@/components/home/CTASection';

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedCars />
      <Reviews />
      <FeedbackForm />
      <CTASection />
    </>
  );
};

export default Home;
