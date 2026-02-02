import { Button } from "@/components/ui/button";
import { Scan, QrCode } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6 animate-fade-in">
            <span className="gradient-text">QR Code Scanner</span>{" "}
            <span className="text-foreground">Online</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            The QR code scanner online allows you to scan QR codes without any app. 
            It helps you scan QR from images and also webcam. You can use it online on mobile and desktop also.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button 
              size="lg" 
              className="gradient-primary text-primary-foreground shadow-glow hover:shadow-medium transition-all duration-300 hover:scale-105 gap-2 h-12 px-8 text-base font-semibold"
              onClick={() => document.getElementById('image-scanner')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Scan className="h-5 w-5" />
              Scan now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-accent hover:text-accent-foreground transition-all duration-300 gap-2 h-12 px-8 text-base font-semibold"
              onClick={() => document.getElementById('qr-generator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <QrCode className="h-5 w-5" />
              Generate QR
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
