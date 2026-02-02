import { useState, useCallback } from "react";
import { Upload, Copy, Check, Shield, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = "http://localhost:3000/api/scan/upload";

/* ------------------ user id helper ------------------ */
const getUserId = () => {
  let id = localStorage.getItem("scanqr_user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("scanqr_user_id", id);
  }
  return id;
};

/* ------------------ types ------------------ */
type ScanResult = {
  type: string;
  parsed: any;
};

const ImageScanner = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scannedData, setScannedData] = useState<ScanResult | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- Drag & Drop ---------------- */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (f: File) => {
    setFile(f);
    setScannedData(null);
    setError(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFileSelect(selected);
  };

  /* ---------------- Scan ---------------- */
  const handleScan = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("qrImage", file);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "x-user-id": getUserId(),
        },
        credentials: "include",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Scan failed");
      }

      setScannedData({
        type: result.data.type,
        parsed: result.data.parsed,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to scan image");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- Copy ---------------- */
  const handleCopy = () => {
    if (!scannedData) return;

    const text =
      scannedData.type === "url"
        ? scannedData.parsed.url
        : scannedData.type === "text"
        ? scannedData.parsed.text
        : JSON.stringify(scannedData.parsed, null, 2);

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="image-scanner" className="py-16 md:py-20 section-alt">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Scan QR code from image
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Upload an image of a QR code to instantly reveal its content
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              flex flex-col items-center justify-center p-8 md:p-12
              border-2 border-dashed rounded-2xl transition-all duration-300
              bg-background hover:border-primary/50 hover:bg-accent/50
              ${
                isDragging
                  ? "border-primary bg-accent scale-[1.02]"
                  : "border-scanner-border"
              }
            `}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-6 bg-accent">
              <Upload className="h-8 w-8 text-primary" />
            </div>

            <p className="text-lg font-semibold mb-2">Drag & Drop or Browse</p>
            <p className="text-sm text-muted-foreground mb-4">
              PNG, JPG, WEBP, GIF
            </p>

            {file && (
              <p className="text-xs text-muted-foreground mb-2">
                Selected: {file.name}
              </p>
            )}

            {error && (
              <p className="text-xs text-red-500 mb-2">{error}</p>
            )}

            <div className="relative">
              <Button className="gradient-primary text-primary-foreground">
                <Image className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleInputChange}
              />
            </div>

            {file && (
              <Button
                onClick={handleScan}
                disabled={isLoading}
                className="mt-4 w-full gradient-primary text-primary-foreground"
              >
                {isLoading ? "Scanning..." : "Submit & Scan"}
              </Button>
            )}
          </div>

          {/* Results */}
          <div className="flex flex-col p-8 md:p-12 bg-background border border-border rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Scanned Data</h3>

            <div className="flex-1 flex items-center justify-center min-h-[120px] bg-scanner-bg rounded-xl border border-scanner-border p-4 mb-6">
              {!scannedData ? (
                <p className="text-muted-foreground text-sm text-center">
                  Scan a QR code to view the results here
                </p>
              ) : scannedData.type === "url" ? (
                <a
                  href={scannedData.parsed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline break-all text-sm"
                >
                  {scannedData.parsed.url}
                </a>
              ) : scannedData.type === "text" ? (
                <p className="text-foreground text-sm break-all">
                  {scannedData.parsed.text}
                </p>
              ) : (
                <pre className="text-foreground text-sm break-all whitespace-pre-wrap">
                  {JSON.stringify(scannedData.parsed, null, 2)}
                </pre>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full border-primary text-primary gap-2"
              onClick={handleCopy}
              disabled={!scannedData}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy Results
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-primary" />
          <span>QR decoded locally & securely</span>
        </div>
      </div>
    </section>
  );
};

export default ImageScanner;
