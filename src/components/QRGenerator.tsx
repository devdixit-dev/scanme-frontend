import { useState } from "react";
import { QrCode, Copy, Check, Download, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/generate`;

/* ---------- user id helper ---------- */
const getUserId = () => {
  let id = localStorage.getItem("scanqr_user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("scanqr_user_id", id);
  }
  return id;
};

type QRType =
  | "url"
  | "text"
  | "wifi"
  | "vcard"
  | "sms"
  | "call"
  | "mail"
  | "location"
  | "event";

const QRGenerator = () => {
  const [type, setType] = useState<QRType>("url");
  const [form, setForm] = useState<Record<string, string>>({});
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (k: string, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  /* ---------- PAYLOAD BUILDER ---------- */
  const buildPayload = () => {
    switch (type) {
      case "url":
        return { type, data: { url: form.url } };

      case "text":
        return { type, data: { text: form.text } };

      case "wifi":
        return {
          type,
          data: {
            ssid: form.ssid,
            password: form.password,
            encryption: form.encryption || "WPA",
          },
        };

      case "vcard":
        return {
          type,
          data: {
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            email: form.email,
            organization: form.organization,
          },
        };

      case "sms":
        return {
          type,
          data: {
            number: form.number,
            message: form.message,
          },
        };

      case "call":
        return {
          type,
          data: { number: form.number },
        };

      case "mail":
        return {
          type,
          data: {
            email: form.email,
            subject: form.subject,
            body: form.body,
          },
        };

      case "location":
        return {
          type,
          data: {
            latitude: form.latitude,
            longitude: form.longitude,
          },
        };

      case "event":
        return {
          type,
          data: {
            title: form.title,
            location: form.location,
            startDate: form.startDate,
            endDate: form.endDate,
          },
        };

      default:
        return null;
    }
  };

  /* ---------- GENERATE ---------- */
  const handleGenerate = async () => {
    const payload = buildPayload();
    if (!payload) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": getUserId(),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "QR generation failed");
      }

      setQrImage(json.data.imageUrl);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyQrImageUrl = async () => {
    if (!qrImage) return;
    await navigator.clipboard.writeText(qrImage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---------- VALIDATION ---------- */
  const isValid = (() => {
    switch (type) {
      case "url":
        return !!form.url;
      case "text":
        return !!form.text;
      case "wifi":
        return !!form.ssid;
      case "vcard":
        return !!(form.firstName || form.lastName || form.phone || form.email);
      case "sms":
        return !!form.number;
      case "call":
        return !!form.number;
      case "mail":
        return !!form.email;
      case "location":
        return !!form.latitude && !!form.longitude;
      case "event":
        return !!(form.title || form.startDate || form.endDate);
      default:
        return false;
    }
  })();

  return (
    <div className="container max-w-4xl my-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-3">QR Code Generator</h2>
        <p className="text-muted-foreground">
          Create smart, scannable QR codes instantly
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* INPUT */}
        <div className="p-8 border rounded-2xl bg-background">
          <Select
            value={type}
            onValueChange={(v) => {
              setType(v as QRType);
              setForm({});
              setQrImage(null);
            }}
          >
            <SelectTrigger className="h-12 mb-6">
              <SelectValue placeholder="Select QR type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="url">URL</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="wifi">WiFi</SelectItem>
              <SelectItem value="vcard">vCard</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="mail">Email</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-3 min-h-[260px]">
            {type === "url" && (
              <Input
                placeholder="https://example.com"
                onChange={(e) => setField("url", e.target.value)}
              />
            )}

            {type === "text" && (
              <Input
                placeholder="Enter text"
                onChange={(e) => setField("text", e.target.value)}
              />
            )}

            {type === "wifi" && (
              <>
                <Input
                  placeholder="SSID"
                  onChange={(e) => setField("ssid", e.target.value)}
                />
                <Input
                  placeholder="Password"
                  onChange={(e) => setField("password", e.target.value)}
                />
                <Select
                  value={form.encryption || "WPA"}
                  onValueChange={(v) => setField("encryption", v)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Encryption" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">No password</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}

            {type === "call" && (
              <Input
                placeholder="Phone number"
                onChange={(e) => setField("number", e.target.value)}
              />
            )}

            {type === "sms" && (
              <>
                <Input
                  placeholder="Phone number"
                  onChange={(e) => setField("number", e.target.value)}
                />
                <Input
                  placeholder="Message (optional)"
                  onChange={(e) => setField("message", e.target.value)}
                />
              </>
            )}

            {type === "mail" && (
              <>
                <Input
                  placeholder="Email address"
                  onChange={(e) => setField("email", e.target.value)}
                />
                <Input
                  placeholder="Subject (optional)"
                  onChange={(e) => setField("subject", e.target.value)}
                />
                <Textarea
                  placeholder="Body (optional)"
                  onChange={(e) => setField("body", e.target.value)}
                />
              </>
            )}

            {type === "location" && (
              <>
                <Input
                  placeholder="Latitude"
                  onChange={(e) => setField("latitude", e.target.value)}
                />
                <Input
                  placeholder="Longitude"
                  onChange={(e) => setField("longitude", e.target.value)}
                />
              </>
            )}

            {type === "event" && (
              <>
                <Input
                  placeholder="Event title"
                  onChange={(e) => setField("title", e.target.value)}
                />
                <Input
                  placeholder="Location (optional)"
                  onChange={(e) => setField("location", e.target.value)}
                />
                <Input
                  type="datetime-local"
                  onChange={(e) => setField("startDate", e.target.value)}
                />
                <Input
                  type="datetime-local"
                  onChange={(e) => setField("endDate", e.target.value)}
                />
              </>
            )}

            {type === "vcard" && (
              <>
                <Input
                  placeholder="First Name"
                  onChange={(e) => setField("firstName", e.target.value)}
                />
                <Input
                  placeholder="Last Name"
                  onChange={(e) => setField("lastName", e.target.value)}
                />
                <Input
                  placeholder="Phone Number"
                  onChange={(e) => setField("phone", e.target.value)}
                />
                <Input
                  placeholder="Email"
                  onChange={(e) => setField("email", e.target.value)}
                />
                <Input
                  placeholder="Organization (optional)"
                  onChange={(e) => setField("organization", e.target.value)}
                />
              </>
            )}
          </div>

          {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

          <Button
            className="w-full mt-6"
            onClick={handleGenerate}
            disabled={!isValid || loading}
          >
            {loading ? "Generating..." : "Generate QR"}
          </Button>
        </div>

        {/* OUTPUT */}
        <div className="p-8 border rounded-2xl flex flex-col">
          <h3 className="font-semibold mb-4">Result</h3>

          <div className="flex-1 flex flex-col items-center justify-center border rounded-xl mb-6 gap-3">
            {qrImage ? (
              <img src={qrImage} className="w-48 h-48" />
            ) : (
              <QrCode className="h-12 w-12 opacity-50" />
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={copyQrImageUrl}
              disabled={!qrImage}
            >
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copied" : "Copy Image URL"}
            </Button>

            {type === "url" ? (
              <Button
                className="flex-1"
                onClick={() => window.open(form.url, "_blank")}
                disabled={!form.url}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Link
              </Button>
            ) : (
              <Button
                className="flex-1"
                onClick={() => window.open(qrImage || "")}
                disabled={!qrImage}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
