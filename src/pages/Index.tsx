import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ImageScanner from "@/components/ImageScanner";
import WebcamScanner from "@/components/WebcamScanner";
import QRGenerator from "@/components/QRGenerator";
import Infographic from "@/components/Infographic";
import QRTypesTable from "@/components/QRTypesTable";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ImageScanner />
        {/* <WebcamScanner /> */}
        <QRGenerator />
        <Infographic />
        <QRTypesTable />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
