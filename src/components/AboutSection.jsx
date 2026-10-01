import CloudServices from './CloudServices';
import HomeCloudPlatforms from './home/HomeCloudPlatforms';
import HomeIndustries from './home/HomeIndustries';
import HomeHowWeWork from './home/HomeHowWeWork';
import HomeFaq from './home/HomeFaq';
import Hero from './Hero';
import Footer from './Footer';

export function AboutSection({ platforms, benefits, journey }) {
  return (
    <>
      <div className="page-shell">
        <Hero platforms={platforms} benefits={benefits} />
        <main className="about-page">
          <CloudServices />
          <HomeCloudPlatforms />
          <HomeIndustries />
          <HomeHowWeWork />
        </main>
      </div>
      <HomeFaq />
      <Footer />
    </>
  );
}
