import {
  ComparisonSection,
  DailyQuestion,
  FinalCTA,
  Hero,
  NarrativeSection,
  Navbar,
  WeeklyTimeline,
  Footer,
} from "@/components/landing-page";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WeeklyTimeline />
      <ComparisonSection />
      <DailyQuestion />
      <NarrativeSection />
      <FinalCTA />
      <Footer />
    </>
  );
}
