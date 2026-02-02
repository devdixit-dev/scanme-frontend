import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const qrTypes = [
  {
    type: "URL",
    description: "Links to websites. When scanned, opens the specified URL in a browser.",
  },
  {
    type: "Text",
    description: "Contains plain text information that can be displayed after scanning.",
  },
  {
    type: "Location",
    description: "Encodes geographic coordinates. Opens maps app to show the location.",
  },
  {
    type: "WiFi",
    description: "Stores WiFi network credentials. Allows instant connection to the network.",
  },
  {
    type: "vCard",
    description: "Contains contact information like name, phone, email, and address.",
  },
  {
    type: "SMS",
    description: "Pre-fills an SMS message with recipient number and message content.",
  },
  {
    type: "Call",
    description: "Encodes a phone number. Scanning initiates a call to that number.",
  },
  {
    type: "Event",
    description: "Contains calendar event details like date, time, location, and description.",
  },
  {
    type: "Mail",
    description: "Opens email client with pre-filled recipient, subject, and message body.",
  },
];

const QRTypesTable = () => {
  return (
    <section id="about" className="py-16 md:py-20 section-alt">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            QR code types
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Explore different types of QR codes and their uses
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-background rounded-2xl border border-border shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent hover:bg-accent">
                <TableHead className="w-[140px] font-semibold text-foreground">Type</TableHead>
                <TableHead className="font-semibold text-foreground">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qrTypes.map((item, index) => (
                <TableRow 
                  key={item.type}
                  className={index % 2 === 0 ? "bg-background" : "bg-scanner-bg"}
                >
                  <TableCell className="font-medium text-primary">{item.type}</TableCell>
                  <TableCell className="text-muted-foreground">{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default QRTypesTable;
