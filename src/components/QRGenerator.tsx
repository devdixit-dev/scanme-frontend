// import { useState, useRef } from "react";
// import { QRCodeSVG } from "qrcode.react";
// import { Download, Copy, Check, QrCode, Link, Type } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const QRGenerator = () => {
//   const [inputValue, setInputValue] = useState("");
//   const [copied, setCopied] = useState(false);
//   const qrRef = useRef<HTMLDivElement>(null);

//   const handleCopy = async () => {
//     if (!inputValue || !qrRef.current) return;
    
//     const svg = qrRef.current.querySelector("svg");
//     if (svg) {
//       const svgData = new XMLSerializer().serializeToString(svg);
//       const blob = new Blob([svgData], { type: "image/svg+xml" });
      
//       try {
//         await navigator.clipboard.write([
//           new ClipboardItem({ "image/png": blob })
//         ]);
//       } catch {
//         // Fallback: copy SVG as text
//         await navigator.clipboard.writeText(svgData);
//       }
      
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   const handleDownload = () => {
//     if (!inputValue || !qrRef.current) return;
    
//     const svg = qrRef.current.querySelector("svg");
//     if (svg) {
//       const svgData = new XMLSerializer().serializeToString(svg);
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       const img = new Image();
      
//       img.onload = () => {
//         canvas.width = 300;
//         canvas.height = 300;
//         ctx?.drawImage(img, 0, 0, 300, 300);
        
//         const pngUrl = canvas.toDataURL("image/png");
//         const downloadLink = document.createElement("a");
//         downloadLink.href = pngUrl;
//         downloadLink.download = "qrcode.png";
//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//         document.body.removeChild(downloadLink);
//       };
      
//       img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
//     }
//   };

//   return (
//     <section id="qr-generator" className="py-16 md:py-20 section-alt">
//       <div className="container">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
//             Generate QR Code
//           </h2>
//           <p className="text-muted-foreground text-lg max-w-xl mx-auto">
//             Create custom QR codes instantly for URLs, text, and more
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
//           {/* Input Area */}
//           <div className="flex flex-col p-8 md:p-10 bg-background border border-border rounded-2xl shadow-soft">
//             <Tabs defaultValue="url" className="w-full">
//               <TabsList className="grid w-full grid-cols-2 mb-6">
//                 <TabsTrigger value="url" className="gap-2">
//                   <Link className="h-4 w-4" />
//                   URL
//                 </TabsTrigger>
//                 <TabsTrigger value="text" className="gap-2">
//                   <Type className="h-4 w-4" />
//                   Text
//                 </TabsTrigger>
//               </TabsList>
              
//               <TabsContent value="url" className="mt-0">
//                 <div className="space-y-4">
//                   <label className="text-sm font-medium text-foreground">
//                     Enter URL
//                   </label>
//                   <Input
//                     type="url"
//                     placeholder="https://example.com"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     className="h-12"
//                   />
//                 </div>
//               </TabsContent>
              
//               <TabsContent value="text" className="mt-0">
//                 <div className="space-y-4">
//                   <label className="text-sm font-medium text-foreground">
//                     Enter Text
//                   </label>
//                   <Input
//                     type="text"
//                     placeholder="Your text here..."
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     className="h-12"
//                   />
//                 </div>
//               </TabsContent>
//             </Tabs>

//             <p className="text-sm text-muted-foreground mt-6">
//               Enter your content above and the QR code will be generated automatically.
//             </p>
//           </div>

//           {/* QR Code Display */}
//           <div className="flex flex-col p-8 md:p-10 bg-background border border-border rounded-2xl shadow-soft">
//             <h3 className="text-lg font-semibold text-foreground mb-4">
//               Your QR Code
//             </h3>
            
//             <div 
//               ref={qrRef}
//               className="flex-1 flex items-center justify-center min-h-[200px] bg-scanner-bg rounded-xl border border-scanner-border p-6 mb-6"
//             >
//               {inputValue ? (
//                 <QRCodeSVG
//                   value={inputValue}
//                   size={180}
//                   level="H"
//                   includeMargin
//                   className="rounded-lg"
//                 />
//               ) : (
//                 <div className="flex flex-col items-center gap-3 text-center">
//                   <QrCode className="h-12 w-12 text-muted-foreground/50" />
//                   <p className="text-muted-foreground text-sm">
//                     Enter content to generate QR code
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-3">
//               <Button 
//                 variant="outline" 
//                 className="flex-1 border-primary text-primary hover:bg-accent transition-all gap-2"
//                 onClick={handleCopy}
//                 disabled={!inputValue}
//               >
//                 {copied ? (
//                   <>
//                     <Check className="h-4 w-4" />
//                     Copied!
//                   </>
//                 ) : (
//                   <>
//                     <Copy className="h-4 w-4" />
//                     Copy
//                   </>
//                 )}
//               </Button>
              
//               <Button 
//                 className="flex-1 gradient-primary text-primary-foreground hover:shadow-medium transition-all gap-2"
//                 onClick={handleDownload}
//                 disabled={!inputValue}
//               >
//                 <Download className="h-4 w-4" />
//                 Download
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default QRGenerator;









import { useState } from "react";
import {
  Download,
  Copy,
  Check,
  QrCode,
  Link,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const API_URL = "http://localhost:3000/api/generate";

/* ---------- user id helper ---------- */
const getUserId = () => {
  let id = localStorage.getItem("scanqr_user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("scanqr_user_id", id);
  }
  return id;
};

const QRGenerator = () => {
  const [tab, setTab] = useState<"url" | "text">("url");
  const [inputValue, setInputValue] = useState("");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- generate QR via backend ---------- */
  const handleGenerate = async () => {
    if (!inputValue) return;

    try {
      setLoading(true);
      setError(null);

      const payload =
        tab === "url"
          ? { type: "url", data: { url: inputValue } }
          : { type: "text", data: { text: inputValue } };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": getUserId(),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "QR generation failed");
      }

      setQrImage(result.data.imageUrl);
      setInputValue("")
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate QR");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- copy image url ---------- */
  const handleCopy = async () => {
    if (!qrImage) return;
    await navigator.clipboard.writeText(qrImage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---------- download image ---------- */
  const handleDownload = () => {
    if (!qrImage) return;
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="qr-generator" className="py-16 md:py-20 section-alt">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Generate QR Code
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Generate QR codes powered by the backend (history & analytics enabled)
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Input */}
          <div className="p-8 bg-background border rounded-2xl">
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="url" className="gap-2">
                  <Link className="h-4 w-4" /> URL
                </TabsTrigger>
                <TabsTrigger value="text" className="gap-2">
                  <Type className="h-4 w-4" /> Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url">
                <Input
                  placeholder="https://example.com"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="text">
                <Input
                  placeholder="Your text here"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </TabsContent>
            </Tabs>

            {error && (
              <p className="text-sm text-red-500 mt-3">{error}</p>
            )}

            <Button
              className="w-full mt-6 gradient-primary"
              onClick={handleGenerate}
              disabled={loading || !inputValue}
            >
              {loading ? "Generating..." : "Generate QR"}
            </Button>
          </div>

          {/* Output */}
          <div className="p-8 bg-background border rounded-2xl flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Your QR Code</h3>

            <div className="flex-1 flex items-center justify-center bg-scanner-bg border rounded-xl mb-6 min-h-[250px]">
              {qrImage ? (
                <img
                  src={qrImage}
                  alt="Generated QR"
                  className="w-48 h-48"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  Generate a QR code to preview
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleCopy}
                disabled={!qrImage}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy URL"}
              </Button>

              <Button
                className="flex-1 gap-2 gradient-primary"
                onClick={handleDownload}
                disabled={!qrImage}
              >
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRGenerator;
