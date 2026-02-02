import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How to scan QR code on iPhone?",
    answer: "Open the Camera app on your iPhone and point it at the QR code. A notification will appear with the link or content. Tap it to open. You can also use our web-based scanner which works on any device.",
  },
  {
    question: "How to scan QR code on Android?",
    answer: "Most modern Android phones can scan QR codes directly from the camera app. Simply open your camera and point it at the QR code. If this doesn't work, you can use our online scanner or download a QR scanner app.",
  },
  {
    question: "How to scan QR code on laptop?",
    answer: "Use our online webcam scanner above! Click 'Open Camera' and allow camera access. Point the QR code at your webcam, and we'll decode it instantly. You can also upload an image of a QR code.",
  },
  {
    question: "How to scan QR code from image?",
    answer: "Use our Image QR Scanner above. Simply drag and drop an image containing a QR code, or click 'Browse Files' to select one from your device. We support all common image formats.",
  },
  {
    question: "Is this QR scanner free to use?",
    answer: "Yes! Our QR code scanner is completely free to use. There are no hidden charges, no sign-up required, and no limits on the number of scans you can perform.",
  },
  {
    question: "Is my data secure when using this scanner?",
    answer: "Absolutely. All QR code processing happens locally in your browser. We don't store, transmit, or have access to any of your scanned data. Your privacy is our priority.",
  },
  {
    question: "What types of QR codes can you scan?",
    answer: "We can scan all standard QR code types including URLs, text, WiFi credentials, vCards, locations, phone numbers, SMS, emails, and calendar events.",
  },
  {
    question: "Why isn't my QR code scanning?",
    answer: "Make sure the QR code is clearly visible, well-lit, and not damaged. Try adjusting the distance or angle. If using webcam, ensure you've granted camera permissions. For images, ensure the file isn't corrupted.",
  },
  {
    question: "Can I scan QR codes without installing an app?",
    answer: "Yes! That's exactly what our online scanner is for. You can scan QR codes directly from your browser on any device—no app installation required.",
  },
];

const FAQ = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            We have answered some of the most commonly asked questions
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background border border-border rounded-xl px-6 data-[state=open]:shadow-soft transition-all"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
