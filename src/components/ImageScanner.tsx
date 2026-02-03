import { useState, useCallback } from "react";
import { Upload, Copy, Check, Shield, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/scan/upload`;

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
  type: "url" | "text" | "wifi" | "vcard" | "sms" | "call" | "mail" | "location" | "event";
  value: string;
  fields?: { label: string; value: string; href?: string }[];
};

const normalizeString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const buildScanResult = (qrType: ScanResult["type"], decodedData, raw: string): ScanResult => {
  const decoded = decodedData || {};
  const safeRaw = normalizeString(raw);

  switch (qrType) {
    case "url": {
      const url = normalizeString(decoded.url || decoded.text || safeRaw);
      return {
        type: "url",
        value: url,
        fields: url ? [{ label: "URL", value: url, href: url }] : undefined,
      };
    }
    case "wifi": {
      const ssid = normalizeString(decoded.ssid);
      const password = normalizeString(decoded.password);
      const encryption = normalizeString(decoded.encryption);
      const fallback = normalizeString(decoded.text || safeRaw);
      const value =
        fallback ||
        [ssid && `SSID: ${ssid}`, password && `Password: ${password}`, encryption && `Encryption: ${encryption}`]
          .filter(Boolean)
          .join(" | ");
      const fields = [
        ssid && { label: "SSID", value: ssid },
        password && { label: "Password", value: password },
        encryption && { label: "Encryption", value: encryption },
      ].filter(Boolean) as ScanResult["fields"];
      return { type: "wifi", value, fields: fields?.length ? fields : undefined };
    }
    case "vcard": {
      const firstName = normalizeString(decoded.firstName);
      const lastName = normalizeString(decoded.lastName);
      const phone = normalizeString(decoded.phone);
      const email = normalizeString(decoded.email);
      const organization = normalizeString(decoded.organization);
      const displayName = normalizeString(decoded.text) || [firstName, lastName].filter(Boolean).join(" ");
      const value = displayName || phone || email || safeRaw;
      const fields = [
        displayName && { label: "Name", value: displayName },
        organization && { label: "Organization", value: organization },
        phone && { label: "Phone", value: phone, href: `tel:${phone}` },
        email && { label: "Email", value: email, href: `mailto:${email}` },
      ].filter(Boolean) as ScanResult["fields"];
      return { type: "vcard", value, fields: fields?.length ? fields : undefined };
    }
    case "sms": {
      const number = normalizeString(decoded.number);
      const message = normalizeString(decoded.message);
      const fallback = normalizeString(decoded.text || safeRaw);
      const value = fallback || [number, message].filter(Boolean).join(" - ");
      const fields = [
        number && { label: "Number", value: number },
        message && { label: "Message", value: message },
      ].filter(Boolean) as ScanResult["fields"];
      return { type: "sms", value, fields: fields?.length ? fields : undefined };
    }
    case "call": {
      const number = normalizeString(decoded.number || decoded.text || safeRaw);
      return {
        type: "call",
        value: number,
        fields: number ? [{ label: "Phone", value: number, href: `tel:${number}` }] : undefined,
      };
    }
    case "mail": {
      const email = normalizeString(decoded.email);
      const subject = normalizeString(decoded.subject);
      const body = normalizeString(decoded.body);
      const fallback = normalizeString(decoded.text || safeRaw);
      const value =
        fallback ||
        [email && `Email: ${email}`, subject && `Subject: ${subject}`, body && `Body: ${body}`]
          .filter(Boolean)
          .join(" | ");
      const fields = [
        email && { label: "Email", value: email, href: `mailto:${email}` },
        subject && { label: "Subject", value: subject },
        body && { label: "Body", value: body },
      ].filter(Boolean) as ScanResult["fields"];
      return { type: "mail", value, fields: fields?.length ? fields : undefined };
    }
    case "location": {
      const latitude = normalizeString(decoded.latitude);
      const longitude = normalizeString(decoded.longitude);
      const fallback = normalizeString(decoded.text || safeRaw);
      const value = fallback || [latitude, longitude].filter(Boolean).join(", ");
      const fields = [
        latitude && { label: "Latitude", value: latitude },
        longitude && { label: "Longitude", value: longitude },
      ].filter(Boolean) as ScanResult["fields"];
      return { type: "location", value, fields: fields?.length ? fields : undefined };
    }
    case "event": {
      const title = normalizeString(decoded.title);
      const location = normalizeString(decoded.location);
      const startDate = normalizeString(decoded.startDate);
      const endDate = normalizeString(decoded.endDate);
      const fallback = normalizeString(decoded.text || safeRaw);
      const value =
        fallback ||
        [title, location && `Location: ${location}`, startDate && `Start: ${startDate}`, endDate && `End: ${endDate}`]
          .filter(Boolean)
          .join(" | ");
      const fields = [
        title && { label: "Title", value: title },
        location && { label: "Location", value: location },
        startDate && { label: "Start", value: startDate },
        endDate && { label: "End", value: endDate },
      ].filter(Boolean) as ScanResult["fields"];
      return { type: "event", value, fields: fields?.length ? fields : undefined };
    }
    case "text":
    default: {
      const text = normalizeString(decoded.text || safeRaw || decoded);
      return { type: "text", value: text || "Unknown content" };
    }
  }
};

const ImageScanner = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scannedData, setScannedData] = useState<ScanResult | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderFieldValue = (field: NonNullable<ScanResult["fields"]>[number]) =>
    field.href ? (
      <a
        href={field.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline break-all"
      >
        {field.value}
      </a>
    ) : (
      <span className="break-all">{field.value}</span>
    );

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

      const qrType = (result?.data?.qrType || "text") as ScanResult["type"];
      const decodedData = result?.data?.decodedData;
      const rawData = result?.data?.qrData || "";

      const structured = buildScanResult(qrType, decodedData, rawData);

      if (!structured.value) {
        throw new Error("Unable to extract QR content");
      }

      setScannedData(structured);
    } catch (err) {
      console.error("Scan error:", err);
      setError(err.message || "Failed to scan image");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- Copy ---------------- */
  const handleCopy = () => {
    if (!scannedData) return;
    navigator.clipboard.writeText(scannedData.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="image-scanner" className="py-16 md:py-20 section-alt">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
              border-2 border-dashed rounded-2xl transition-all
              bg-background hover:border-primary/50
              ${
                isDragging
                  ? "border-primary bg-accent scale-[1.02]"
                  : "border-scanner-border"
              }
            `}
          >
            <Upload className="h-10 w-10 text-primary mb-4" />

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
              <Button className="gradient-primary">
                <Image className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleInputChange}
              />
            </div>

            {file && (
              <Button
                onClick={handleScan}
                disabled={isLoading}
                className="mt-4 w-full gradient-primary"
              >
                {isLoading ? "Scanning..." : "Submit & Scan"}
              </Button>
            )}
          </div>

          {/* Result */}
          <div className="flex flex-col p-8 md:p-12 bg-background border rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Scanned Data</h3>

            <div className="flex-1 flex items-center justify-center min-h-[120px] border rounded-xl p-4 mb-6">
              {!scannedData ? (
                <p className="text-muted-foreground text-sm text-center">
                  Scan a QR code to view the results here
                </p>
              ) : scannedData.fields?.length ? (
                <div className="w-full space-y-2">
                  {scannedData.fields.map((field) => (
                    <div key={field.label} className="text-sm">
                      <span className="text-muted-foreground">{field.label}:</span>{" "}
                      {renderFieldValue(field)}
                    </div>
                  ))}
                </div>
              ) : scannedData.type === "url" ? (
                <a
                  href={scannedData.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline break-all text-sm"
                >
                  {scannedData.value}
                </a>
              ) : (
                <p className="text-sm break-all">{scannedData.value}</p>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
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
          <span>QR decoded securely</span>
        </div>
      </div>
    </section>
  );
};

export default ImageScanner;
