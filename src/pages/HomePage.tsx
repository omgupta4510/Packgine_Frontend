import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { HowItWorks } from '../components/home/HowItWorks';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { BrowseCategories } from '../components/home/BrowseCategories';
import { SustainabilityImpact } from '../components/home/SustainabilityImpact';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { CtaSection } from '../components/home/CtaSection';

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FeaturedProducts />
      <BrowseCategories />
      <SustainabilityImpact />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
};