import { useState } from "react";
import { Camera, Copy, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WebcamScanner = () => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleCopy = () => {
    if (scannedData) {
      navigator.clipboard.writeText(scannedData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenCamera = () => {
    setCameraOpen(true);
    // Simulate camera opening for UI purposes
    setTimeout(() => {
      setScannedData("https://example.com/sample-qr-result");
    }, 2000);
  };

  return (
    <section id="webcam-scanner" className="py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Webcam QR code scanner
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Click 'Open camera' & point the QR toward it
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Camera Area */}
          <div className="flex flex-col p-8 md:p-12 bg-scanner-bg border border-border rounded-2xl">
            <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] bg-background rounded-xl border border-scanner-border mb-6 overflow-hidden">
              {cameraOpen ? (
                <div className="w-full h-full min-h-[200px] bg-foreground/5 flex items-center justify-center relative">
                  <div className="absolute inset-4 border-2 border-primary/50 rounded-lg animate-pulse-soft" />
                  <Camera className="h-12 w-12 text-muted-foreground animate-pulse" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 p-8">
                  <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm text-center">
                    Camera preview will appear here
                  </p>
                </div>
              )}
            </div>

            <Button 
              className={`w-full transition-all gap-2 h-12 ${
                cameraOpen 
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                  : "gradient-primary text-primary-foreground hover:shadow-medium"
              }`}
              onClick={cameraOpen ? () => setCameraOpen(false) : handleOpenCamera}
            >
              <Camera className="h-5 w-5" />
              {cameraOpen ? "Close Camera" : "Open Camera"}
            </Button>

            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Make sure to allow camera access!</span>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex flex-col p-8 md:p-12 bg-background border border-border rounded-2xl shadow-soft">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Scanned Data
            </h3>
            
            <div className="flex-1 flex items-center justify-center min-h-[120px] bg-scanner-bg rounded-xl border border-scanner-border p-4 mb-6">
              {scannedData ? (
                <p className="text-foreground text-center break-all">{scannedData}</p>
              ) : (
                <p className="text-muted-foreground text-center text-sm">
                  Scan a QR code to view the results here
                </p>
              )}
            </div>

            <Button 
              variant="outline" 
              className="w-full border-primary text-primary hover:bg-accent transition-all gap-2"
              onClick={handleCopy}
              disabled={!scannedData}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Results
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebcamScanner;
