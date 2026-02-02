import { QrCode, Scan, FileImage, ImagePlus, FileText, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <QrCode className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">ScanMe</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              ScanMe is a free, fast, and secure online QR code scanner. 
              Scan QR codes from images or webcam without installing any app. 
              Works on all devices and browsers.
            </p>
          </div>

          {/* More Tools */}
          <div>
            <h4 className="font-semibold mb-4">More Tools</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-background transition-colors">
                  <Scan className="h-4 w-4" />
                  QR Scanner
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-background transition-colors">
                  <QrCode className="h-4 w-4" />
                  QR Generator
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-background transition-colors">
                  <FileImage className="h-4 w-4" />
                  Image to QR
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-background transition-colors">
                  <ImagePlus className="h-4 w-4" />
                  Bulk QR Generator
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>
                <a href="mailto:devdixitsocial@gmail.com" className="hover:text-background transition-colors">
                  devdixitsocial@gmail.com
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Report a Bug
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Feature Request
                </a>
              </li>
            </ul>
          </div>

          {/* Data Privacy */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Data Privacy
            </h4>
            <p className="text-sm text-background/70 leading-relaxed">
              Your privacy matters to us. All QR code processing happens locally in your browser. 
              We never store, transmit, or have access to your scanned data. 
              No registration required.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60">
          <p>Made by <a href="https://github.com/devdixit-dev" className="text-blue-500" target="_blank">Dev Dixit</a> © 2026 ScanMe. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-background transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
