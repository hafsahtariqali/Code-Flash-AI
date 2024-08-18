import  NavBar  from "../components/NavBar";
import  Hero  from "../components/Hero";
import  {Features} from "../components/Features";
import  Pricings from "../components/Pricings";
import  {CallToAction} from "../components/CallToAction";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContactForm from "@/components/Contact";



export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Pricings />
      <CallToAction />
      <ContactForm></ContactForm>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
}
