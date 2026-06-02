import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
  Lightbulb, Zap, Wrench, X, Phone, Mail, MapPin, 
  ChevronRight, Star, CheckCircle, ArrowRight, Menu,
  Sparkles, Layers, Zap as ZapIcon, ExternalLink, ZoomIn
} from 'lucide-react';

// --- SEO Meta Tags (index.html mein daalne ke liye comment) ---
// <title>SB LED Boards | Premium LED Signage & Neon Signs in Jaipur</title>
// <meta name="description" content="Jaipur's #1 premium LED signage studio. Custom 3D LED boards, neon signs & maintenance services. 500+ projects delivered. Call +91 9001933901" />
// <meta name="keywords" content="LED board Jaipur, neon sign Jaipur, LED signage Rajasthan, 3D LED board, shop board Jaipur, SB LED Boards" />
// <meta property="og:title" content="SB LED Boards | Premium LED Signage Jaipur" />
// <meta property="og:description" content="Custom 3D LED boards, neon signs & maintenance. Jaipur's trusted signage experts." />

// --- 3D Tilt Card ---
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(40px)" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

// --- Service Data ---
const services = [
  {
    id: 'LED Board',
    icon: Lightbulb,
    title: 'LED Board',
    subtitle: 'Illuminate Your Brand',
    description: 'Premium 3D LED signage boards that make your brand stand out day and night. Custom designs with vibrant colors and durable materials.',
    features: ['3D Acrylic LED Letters', 'Backlit & Front-lit Options', 'Weather Resistant', 'Energy Efficient', 'Custom Colors & Sizes', '5+ Years Warranty'],
    color: 'from-amber-500 to-orange-600',
    glowColor: 'shadow-amber-500/50',
    borderColor: 'border-amber-500/30',
    bgGlow: 'bg-amber-500/10'
  },
  {
    id: 'Neon Signage',
    icon: Zap,
    title: 'Neon Signage',
    subtitle: 'Glow With Style',
    description: "Eye-catching neon signs perfect for shops, restaurants, bars, and events. Modern LED neon that's safe, bright, and long-lasting.",
    features: ['Custom Neon Designs', 'Multiple Color Options', 'Indoor & Outdoor Use', 'Low Power Consumption', 'Flexible Shapes', 'Instant On/Off'],
    color: 'from-fuchsia-500 to-purple-600',
    glowColor: 'shadow-fuchsia-500/50',
    borderColor: 'border-fuchsia-500/30',
    bgGlow: 'bg-fuchsia-500/10'
  },
  {
    id: 'Maintenance',
    icon: Wrench,
    title: 'Maintenance',
    subtitle: 'Always Shining Bright',
    description: 'Professional maintenance and repair services for all types of LED boards and neon signs. We keep your signage looking brand new.',
    features: ['Regular Check-ups', 'LED Module Replacement', 'Wiring & Circuit Repair', 'Cleaning & Polishing', 'Emergency Repairs', 'Annual Maintenance Contracts'],
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'shadow-cyan-500/50',
    borderColor: 'border-cyan-500/30',
    bgGlow: 'bg-cyan-500/10'
  }
];

const galleryImages = [
  { src: '/images/gallery1.jpg', alt: 'LED Signage Work 1' },
  { src: '/images/gallery2.jpg', alt: 'LED Signage Work 2' },
  { src: '/images/gallery3.jpg', alt: 'LED Signage Work 3' },
  { src: '/images/gallery4.jpg', alt: 'LED Signage Work 4' },
  { src: '/images/gallery5.jpg', alt: 'LED Signage Work 5' },
  { src: '/images/gallery6.jpg', alt: 'LED Signage Work 6' },
];

// --- Image Lightbox ---
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
      onClick={onClose}
    >
      <button className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all">
        <X className="w-6 h-6 text-white" />
      </button>
      <motion.img
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        src={src}
        alt={alt}
        className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
}

// --- Contact Modal ---
function ContactModal({ service, onClose }: { service: typeof services[0]; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, service_type: service.id })
      });
      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
          setFormData({ name: '', phone: '', email: '', message: '' });
        }, 3000);
      } else {
        alert('Something went wrong. Please try again or call us directly.');
      }
    } catch {
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/5 hover:bg-white/15 transition-colors border border-white/10">
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left */}
          <div className={`p-8 md:p-12 bg-gradient-to-br ${service.color} relative overflow-hidden flex flex-col justify-center`}>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/20 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 font-['Outfit']">{service.title}</h3>
              <p className="text-white/80 text-lg mb-6 font-light">{service.subtitle}</p>
              <p className="text-white/90 mb-8 leading-relaxed">{service.description}</p>
              <div className="space-y-3">
                {service.features.map((feature, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle className="w-4 h-4 text-white/80 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 p-5 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-white/60 text-xs mb-1 uppercase tracking-wider">Prefer to call?</p>
                <a href="tel:+919001933901" className="text-white font-bold text-xl font-['Space_Grotesk'] hover:text-white/80 transition-colors">+91 9001933901</a>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="p-8 md:p-12 bg-[#0a0a0a]">
            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-['Outfit']">Thank You! 🎉</h3>
                <p className="text-gray-400">We'll contact you within 24 hours.</p>
              </motion.div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-1 font-['Outfit']">Get a Free Quote</h3>
                <p className="text-gray-400 mb-8">Fill in your details and we'll get back to you soon.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {[
                    { label: 'Full Name *', type: 'text', key: 'name', placeholder: 'Your name', required: true },
                    { label: 'Phone Number *', type: 'tel', key: 'phone', placeholder: '+91 XXXXX XXXXX', required: true },
                    { label: 'Email Address', type: 'email', key: 'email', placeholder: 'your@email.com', required: false }
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        required={field.required}
                        value={(formData as any)[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all text-sm"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Service</label>
                    <div className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm flex items-center gap-2">
                      <service.icon className="w-4 h-4 flex-shrink-0" /> {service.title}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all resize-none text-sm"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 bg-gradient-to-r ${service.color} text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg font-['Outfit']`}
                  >
                    {isSubmitting ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <>Send Inquiry <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt: string } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-['Space_Grotesk'] selection:bg-amber-500/30">
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 origin-left z-50" style={{ scaleX }} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button className="flex items-center gap-3" onClick={() => scrollToSection('home')} aria-label="SB LED Boards - Go to home">
            <div className="relative w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-amber-500/20 overflow-hidden group">
              <span className="group-hover:scale-110 transition-transform">SB</span>
            </div>
            <div>
              <span className="text-lg font-bold font-['Outfit'] tracking-tight block leading-none">SB LED BOARDS</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em]">Premium Signage</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Services', 'Gallery', 'About', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-wider relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-amber-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            <button
              onClick={() => setSelectedService(services[0])}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full hover:opacity-90 active:scale-95 transition-all text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20"
            >
              Get Quote
            </button>
          </div>

          <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#0a0a0a] border-b border-white/10">
              <div className="px-6 py-6 space-y-4">
                {['Home', 'Services', 'Gallery', 'About', 'Contact'].map((item) => (
                  <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="block w-full text-left text-xl font-['Outfit'] font-bold text-white hover:text-amber-500 transition-colors py-1">
                    {item}
                  </button>
                ))}
                <button onClick={() => { setSelectedService(services[0]); setMobileMenuOpen(false); }} className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl text-sm uppercase tracking-wider">
                  Get Free Quote
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(245,158,11,0.12),transparent_50%)]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-600/15 rounded-full blur-[100px] pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-gray-300 font-medium">Jaipur's #1 Premium LED Signage Studio</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 leading-[0.95] font-['Outfit'] tracking-tighter">
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">ILLUMINATE</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 mt-1">YOUR BRAND</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              We craft stunning <span className="text-white font-medium">3D LED Boards</span>, <span className="text-white font-medium">Neon Signs</span> & provide expert <span className="text-white font-medium">Maintenance</span> that make your business impossible to ignore.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedService(services[0])}
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all flex items-center gap-2 text-base shadow-[0_0_40px_-10px_rgba(255,255,255,0.25)]"
              >
                Start Your Project <ChevronRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => scrollToSection('services')}
                className="px-8 py-4 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:bg-white/10 transition-all text-base backdrop-blur-sm"
              >
                Explore Services
              </motion.button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-white/10 pt-10">
            {[{ value: '500+', label: 'Projects Delivered' }, { value: '100+', label: 'Happy Clients' }, { value: '5+', label: 'Years Experience' }, { value: '24/7', label: 'Support' }].map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="text-3xl sm:text-4xl font-black text-white mb-1 font-['Outfit'] group-hover:text-amber-500 transition-colors">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <span className="text-amber-500 font-bold text-xs uppercase tracking-[0.3em]">Our Expertise</span>
            <h2 className="text-4xl sm:text-6xl font-black mt-4 mb-6 font-['Outfit'] tracking-tight">
              What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Create</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">From concept to installation, premium signage solutions that elevate your brand presence.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
            {services.map((service, index) => (
              <TiltCard key={service.id} className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative h-full bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer"
                  onClick={() => setSelectedService(service)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedService(service)}
                  aria-label={`Get quote for ${service.title}`}
                >
                  <div className={`absolute inset-0 ${service.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="p-8 h-full flex flex-col relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 font-['Outfit']">{service.title}</h3>
                    <p className="text-sm text-amber-500/80 font-medium mb-4">{service.subtitle}</p>
                    <p className="text-gray-400 mb-6 leading-relaxed flex-grow text-sm">{service.description}</p>
                    <ul className="space-y-2 mb-8">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className={`w-full py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl group-hover:bg-white/10 transition-all flex items-center justify-center gap-2 group-hover:border-white/30 font-['Outfit'] text-sm`}>
                      Get Quote <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 bg-[#080808] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.08),transparent_40%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <span className="text-fuchsia-500 font-bold text-xs uppercase tracking-[0.3em]">Portfolio</span>
            <h2 className="text-4xl sm:text-6xl font-black mt-4 mb-6 font-['Outfit'] tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500">Masterpieces</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">Browse our collection of premium signage projects delivered across India.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl overflow-hidden bg-[#111] border border-white/5 group cursor-pointer ${i === 0 || i === 5 ? 'md:col-span-2 aspect-[2/1]' : 'aspect-square'}`}
                onClick={() => setLightboxImg(img)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setLightboxImg(img)}
                aria-label={`View ${img.alt}`}
              >
                {/* Real image */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {/* Placeholder when no image */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/3 to-transparent">
                  <div className="text-center">
                    <Layers className="w-12 h-12 text-gray-700 mx-auto mb-2 group-hover:text-amber-500/40 transition-colors" />
                    <p className="text-gray-700 font-medium text-xs uppercase tracking-widest">Image {i + 1}</p>
                  </div>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                  <div className="flex items-center gap-2 text-white font-bold text-sm border border-white/30 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md">
                    <ZoomIn className="w-4 h-4" /> View Full
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-cyan-500 font-bold text-xs uppercase tracking-[0.3em]">About Us</span>
              <h2 className="text-4xl sm:text-5xl font-black mt-4 mb-8 font-['Outfit'] tracking-tight leading-tight">
                Jaipur's Trusted <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Signage Experts</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                SB LED Boards specializes in creating stunning LED signage, neon signs, and providing maintenance services that help businesses stand out. Based in Jaipur, Rajasthan, we've been illuminating brands since day one.
              </p>
              <div className="space-y-6">
                {[
                  { title: 'Premium Quality', desc: 'We use only the best materials and LED modules from reputed manufacturers.', icon: Star },
                  { title: 'Custom Designs', desc: 'Every project is unique. We create custom designs tailored to your brand.', icon: ZapIcon },
                  { title: 'Warranty Support', desc: 'All our installations come with warranty and dedicated after-sales support.', icon: CheckCircle },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all">
                      <item.icon className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 font-['Outfit']">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="aspect-[4/5] rounded-[2rem] bg-[#111] border border-white/10 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                      <Lightbulb className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">Your Workshop Image</p>
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-8 -left-8 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 flex-shrink-0">
                    <Star className="w-7 h-7 text-green-500 fill-green-500" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white font-['Outfit']">5.0</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Google Rating</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-[#080808] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(245,158,11,0.08),transparent_40%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-amber-500 font-bold text-xs uppercase tracking-[0.3em]">Contact Us</span>
            <h2 className="text-4xl sm:text-6xl font-black mt-4 mb-4 font-['Outfit'] tracking-tight">
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Connect</span>
            </h2>
            <p className="text-gray-500 text-lg">We're ready to bring your signage vision to life</p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {[
              { icon: Phone, title: 'Call Us', info: '+91 9001933901', link: 'tel:+919001933901', color: 'from-amber-500 to-orange-600', desc: 'Mon–Sat, 9am–7pm' },
              { icon: Mail, title: 'Email Us', info: 'sbsignagebrandingsolution@gmail.com', link: 'mailto:sbsignagebrandingsolution@gmail.com', color: 'from-fuchsia-500 to-purple-600', desc: 'We reply within 24 hours' },
              { icon: MapPin, title: 'Visit Us', info: 'Ganesh Vihar, Jamna Puri, Jaipur – 302012', link: 'https://maps.app.goo.gl/frH9c1c64CkQGPDg7', color: 'from-cyan-500 to-blue-600', desc: 'Open for walk-ins' }
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.link}
                target={i > 0 ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-8 text-center hover:border-white/15 transition-all group relative overflow-hidden block"
                aria-label={`${item.title}: ${item.info}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.04] transition-opacity`} />
                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-400 border border-white/10">
                  <item.icon className="w-7 h-7 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-white mb-2 font-['Outfit']">{item.title}</h3>
                <p className="text-gray-300 text-sm mb-1 break-words leading-relaxed">{item.info}</p>
                <p className="text-gray-600 text-xs">{item.desc}</p>
              </motion.a>
            ))}
          </div>

          {/* Google Maps Embed */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <div className="bg-[#0e0e0e] px-6 py-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm font-['Outfit']">SB LED BOARDS</p>
                  <p className="text-gray-500 text-xs">Ganesh Vihar, Jaipur, Rajasthan 302012</p>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/frH9c1c64CkQGPDg7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/5"
              >
                <ExternalLink className="w-3 h-3" /> Open in Maps
              </a>
            </div>
            <div className="relative w-full h-[380px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3555.0420058117797!2d75.73202591110939!3d26.997220956355925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db37439e8507f%3A0xac53fa48dec4b5c0!2sSB%20LED%20BOARDS!5e0!3m2!1sen!2sin!4v1780372837316!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SB LED Boards Location"
              />
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-14">
            <p className="text-gray-500 mb-5 text-sm">Ready to transform your brand visibility?</p>
            <button
              onClick={() => setSelectedService(services[0])}
              className="px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full hover:opacity-90 active:scale-95 transition-all text-base shadow-lg shadow-amber-500/20 font-['Outfit']"
            >
              Get Your Free Quote Today →
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <button className="flex items-center gap-3" onClick={() => scrollToSection('home')}>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">SB</div>
              <div>
                <div className="font-bold text-white font-['Outfit']">SB LED Boards</div>
                <div className="text-xs text-gray-500">Jaipur, Rajasthan</div>
              </div>
            </button>

            <div className="flex items-center gap-6 text-sm">
              {['Services', 'Gallery', 'About', 'Contact'].map((item) => (
                <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-gray-500 hover:text-white transition-colors">
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {[
                { label: 'Fb', href: '#', aria: 'Facebook' },
                { label: 'Ig', href: '#', aria: 'Instagram' },
                { label: 'Yt', href: '#', aria: 'YouTube' }
              ].map((s) => (
                <a key={s.label} href={s.href} aria-label={s.aria} className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all text-xs font-bold border border-white/5 hover:border-white/20">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
            <p>© 2025 SB LED Boards. All rights reserved.</p>
            <p>Premium LED Signage · Neon Signs · Maintenance · Jaipur, Rajasthan</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {selectedService && <ContactModal service={selectedService} onClose={() => setSelectedService(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {lightboxImg && <Lightbox src={lightboxImg.src} alt={lightboxImg.alt} onClose={() => setLightboxImg(null)} />}
      </AnimatePresence>
    </div>
  );
}