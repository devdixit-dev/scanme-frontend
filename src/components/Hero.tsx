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
        </div>
      </div>
    </section>
  );
};

export default Hero;