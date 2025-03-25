import Hero from '@/components/home/Hero';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import SkillsShowcase from '@/components/home/SkillsShowcase';
import LatestPosts from '@/components/home/LatestPosts';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <SkillsShowcase />
      <LatestPosts />
      <ContactSection />
    </>
  );
}