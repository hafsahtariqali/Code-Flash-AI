import  Banner from "../components/Banner";
import  NavBar  from "../components/NavBar";
import  Hero  from "../components/Hero";
import  {Features} from "../components/Features";
import  Pricings from "../components/Pricings";
import  {CallToAction} from "../components/CallToAction";
import  Footer  from "../components/Footer";

export default function Home() {
  return (
    <>
      <Banner />
      <NavBar />
      <Hero />
      <Features />
      <Pricings />
      <CallToAction />
      <Footer />
    </>
  );
}
