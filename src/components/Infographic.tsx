import { 
  Link, 
  Type, 
  MapPin, 
  Wifi, 
  User, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Mail 
} from "lucide-react";

const qrTypes = [
  { icon: Link, label: "URL", color: "from-blue-500 to-blue-600" },
  { icon: Type, label: "Text", color: "from-green-500 to-green-600" },
  { icon: MapPin, label: "Location", color: "from-red-500 to-red-600" },
  { icon: Wifi, label: "WiFi", color: "from-purple-500 to-purple-600" },
  { icon: User, label: "vCard", color: "from-orange-500 to-orange-600" },
  { icon: MessageSquare, label: "SMS", color: "from-cyan-500 to-cyan-600" },
  { icon: Phone, label: "Call", color: "from-pink-500 to-pink-600" },
  { icon: Calendar, label: "Event", color: "from-indigo-500 to-indigo-600" },
  { icon: Mail, label: "Email", color: "from-amber-500 to-amber-600" },
];

const Infographic = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What can QR codes store?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            QR codes are versatile and can encode many types of information
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {qrTypes.map((type, index) => (
              <div 
                key={type.label}
                className="flex flex-col items-center gap-3 p-4 bg-background rounded-2xl border border-border hover:shadow-medium hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform`}>
                  <type.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{type.label}</span>
              </div>
            ))}
          </div>

          {/* Decorative QR Code Examples */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="aspect-square bg-gradient-to-br from-accent to-background rounded-2xl border border-border p-4 flex items-center justify-center hover:shadow-soft transition-all"
              >
                <div className="w-full h-full grid grid-cols-5 gap-1">
                  {[...Array(25)].map((_, j) => (
                    <div 
                      key={j} 
                      className={`rounded-sm ${
                        Math.random() > 0.5 ? "bg-foreground" : "bg-transparent"
                      }`} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Infographic;
