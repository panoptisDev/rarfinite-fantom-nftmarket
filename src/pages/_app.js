import Footer from '@/components/Footer'
import "@/styles/globals.css";
import "@/styles/tailwind.css";
import "@/styles/custom.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>)
}
