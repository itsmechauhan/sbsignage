import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
  Lightbulb, Zap, Wrench, X, Phone, Mail, MapPin, 
  ChevronRight, Star, CheckCircle, ArrowRight, Menu,
  Sparkles, Layers, Zap as ZapIcon
} from 'lucide-react';

// --- 3D Tilt Card Component ---
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(75px)" }} className="h-full w-full">
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
    description: 'Eye-catching neon signs perfect for shops, restaurants, bars, and events. Modern LED neon that\'s safe, bright, and long-lasting.',
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
        setTimeout(() => { onClose(); setIsSubmitted(false); setFormData({ name: '', phone: '', email: '', message: '' }); }, 3000);
      } else { alert('Something went wrong. Please try again or call us directly.'); }
    } catch (error) { alert('Network error. Please check your connection and try again.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 perspective-1000">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotateX: -10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left - Service Info */}
          <div className={`p-10 md:p-14 bg-gradient-to-br ${service.color} relative overflow-hidden flex flex-col justify-center`}>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/20 rounded-full blur-[80px]" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30 shadow-lg">
                <service.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-3 font-['Outfit'] tracking-tight">{service.title}</h3>
              <p className="text-white/80 text-xl mb-8 font-light">{service.subtitle}</p>
              <p className="text-white/90 mb-10 leading-relaxed text-lg">{service.description}</p>
              
              <div className="space-y-4">
                {service.features.map((feature, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 text-white font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-white/60 text-sm mb-1 uppercase tracking-wider">Prefer to call?</p>
                <p className="text-white font-bold text-2xl font-['Space_Grotesk']">+91 9461018391</p>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="p-10 md:p-14 bg-[#0a0a0a]">
            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3 font-['Outfit']">Thank You! 🎉</h3>
                <p className="text-gray-400 text-lg">We'll contact you within 24 hours.</p>
              </motion.div>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-white mb-2 font-['Outfit']">Get a Quote</h3>
                <p className="text-gray-400 mb-10 text-lg">Fill in your details and we'll get back to you soon.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {[
                    { label: 'Full Name', type: 'text', key: 'name', placeholder: 'Your name' },
                    { label: 'Phone Number', type: 'tel', key: 'phone', placeholder: '+91 XXXXX XXXXX' },
                    { label: 'Email Address', type: 'email', key: 'email', placeholder: 'your@email.com' }
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{field.label} *</label>
                      <input
                        type={field.type}
                        required={field.key !== 'email'}
                        value={(formData as any)[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-['Space_Grotesk']"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Service</label>
                    <div className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-['Space_Grotesk'] flex items-center gap-3">
                      <service.icon className="w-5 h-5" /> {service.title}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all resize-none font-['Space_Grotesk']"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-5 bg-gradient-to-r ${service.color} text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg shadow-lg ${service.glowColor} font-['Outfit']`}
                  >
                    {isSubmitting ? (
                      <><div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <>Send Inquiry <ArrowRight className="w-6 h-6" /></>
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
function App() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-['Space_Grotesk'] selection:bg-amber-500/30">
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 origin-left z-50" style={{ scaleX }} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => scrollToSection('home')}>
            {/* LOGO PLACEHOLDER - Replace src with your actual logo path */}
            <div className="relative w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-500/20 overflow-hidden group">
               {/* <img src="/logo.png" alt="SB Logo" className="w-full h-full object-cover" /> */}
               <span className="group-hover:scale-110 transition-transform">SB</span>
            </div>
            <div>
              <span className="text-xl font-bold font-['Outfit'] tracking-tight block leading-none">SB LED BOARDS</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Premium Signage</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Home', 'Services', 'Gallery', 'About', 'Contact'].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
                {item}
              </button>
            ))}
            <button onClick={() => setSelectedService(services[0])} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all text-sm uppercase tracking-wider">
              Get Quote
            </button>
          </div>

          <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-8 h-8" />
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#0a0a0a] border-b border-white/10">
              <div className="px-6 py-8 space-y-6">
                {['Home', 'Services', 'Gallery', 'About', 'Contact'].map((item) => (
                  <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="block w-full text-left text-2xl font-['Outfit'] font-bold text-white">
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(245,158,11,0.15),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        
        {/* Animated Orbs */}
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 mb-10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-gray-300 font-medium tracking-wide">Jaipur's #1 Premium LED Signage Studio</span>
            </div>

            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black mb-8 leading-[0.9] font-['Outfit'] tracking-tighter">
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">ILLUMINATE</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 mt-2">YOUR BRAND</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-14 font-light leading-relaxed">
              We craft stunning <span className="text-white font-medium">3D LED Boards</span>, <span className="text-white font-medium">Neon Signs</span> & provide expert <span className="text-white font-medium">Maintenance</span> that make your business impossible to ignore.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedService(services[0])} className="px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all flex items-center gap-3 text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                Start Your Project <ChevronRight className="w-6 h-6" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => scrollToSection('services')} className="px-10 py-5 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:bg-white/10 transition-all text-lg backdrop-blur-sm">
                Explore Services
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto border-t border-white/10 pt-12">
            {[{ value: '500+', label: 'Projects Delivered' }, { value: '100+', label: 'Happy Clients' }, { value: '5+', label: 'Years Experience' }, { value: '24/7', label: 'Support' }].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl sm:text-5xl font-black text-white mb-2 font-['Outfit'] group-hover:text-amber-500 transition-colors">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest font-bold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-24">
            <span className="text-amber-500 font-bold text-sm uppercase tracking-[0.3em]">Our Expertise</span>
            <h2 className="text-5xl sm:text-7xl font-black mt-6 mb-8 font-['Outfit'] tracking-tight">
              What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Create</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-xl">From concept to installation, we deliver premium signage solutions that elevate your brand presence to the next level.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 perspective-1000">
            {services.map((service, index) => (
              <TiltCard key={service.id} className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative h-full bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500"
                >
                  <div className={`absolute inset-0 ${service.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full" />
                  
                  <div className="p-10 h-full flex flex-col relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-8 shadow-lg ${service.glowColor} group-hover:scale-110 transition-transform duration-500`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-3 font-['Outfit']">{service.title}</h3>
                    <p className="text-gray-400 mb-8 text-lg leading-relaxed flex-grow">{service.description}</p>

                    <ul className="space-y-3 mb-10">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                          <CheckCircle className={`w-4 h-4 text-transparent bg-clip-text bg-gradient-to-r ${service.color} fill-current`} />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedService(service)}
                      className={`w-full py-5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 group-hover:border-white/30 font-['Outfit']`}
                    >
                      Contact Now <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-40 bg-[#080808] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.1),transparent_40%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-24">
            <span className="text-fuchsia-500 font-bold text-sm uppercase tracking-[0.3em]">Portfolio</span>
            <h2 className="text-5xl sm:text-7xl font-black mt-6 mb-8 font-['Outfit'] tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500">Masterpieces</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-xl">Browse through our collection of premium signage projects delivered across Rajasthan.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative aspect-square rounded-3xl overflow-hidden bg-[#111] border border-white/5 group cursor-pointer ${i === 0 || i === 5 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/10 group-hover:opacity-75 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Layers className="w-16 h-16 text-gray-700 mx-auto mb-4 group-hover:text-amber-500/50 transition-colors" />
                    <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">Your Image {i + 1}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-lg border border-white/30 px-6 py-3 rounded-full">View Project</span>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-12 text-sm font-mono">💡 Replace placeholder images with your actual work photos in /public/images/</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-cyan-500 font-bold text-sm uppercase tracking-[0.3em]">About Us</span>
              <h2 className="text-5xl sm:text-6xl font-black mt-6 mb-10 font-['Outfit'] tracking-tight leading-tight">
                Jaipur's Trusted <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Signage Experts</span>
              </h2>
              <p className="text-gray-400 text-xl mb-12 leading-relaxed">
                SB LED Boards specializes in creating stunning LED signage, neon signs, and providing maintenance services that help businesses stand out. Based in Jaipur, Rajasthan, we've been illuminating brands since day one.
              </p>

              <div className="space-y-8">
                {[
                  { title: 'Premium Quality', desc: 'We use only the best materials and LED modules from reputed manufacturers.', icon: Star },
                  { title: 'Custom Designs', desc: 'Every project is unique. We create custom designs tailored to your brand.', icon: ZapIcon },
                  { title: 'Warranty Support', desc: 'All our installations come with warranty and dedicated after-sales support.', icon: CheckCircle },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 transition-all">
                      <item.icon className="w-8 h-8 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2 text-xl font-['Outfit']">{item.title}</h4>
                      <p className="text-gray-400 text-lg">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="aspect-[4/5] rounded-[2.5rem] bg-[#111] border border-white/10 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                      <Lightbulb className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-gray-600 font-bold uppercase tracking-widest">Your Workshop Image</p>
                  </div>
                </div>
              </div>
              
              {/* Floating card */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-10 -left-10 bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                    <Star className="w-10 h-10 text-green-500 fill-green-500" />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-white font-['Outfit']">5.0</div>
                    <div className="text-sm text-gray-500 uppercase tracking-widest font-bold">Google Rating</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-40 bg-[#080808] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(245,158,11,0.1),transparent_40%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-24">
            <span className="text-amber-500 font-bold text-sm uppercase tracking-[0.3em]">Contact Us</span>
            <h2 className="text-5xl sm:text-7xl font-black mt-6 mb-8 font-['Outfit'] tracking-tight">
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Connect</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Phone, title: 'Call Us', info: '+91 9461018391', link: 'tel:+919461018391', color: 'from-amber-500 to-orange-600' },
              { icon: Mail, title: 'Email Us', info: 'rbsjaipur1@gmail.com', link: 'mailto:rbsjaipur1@gmail.com', color: 'from-fuchsia-500 to-purple-600' },
              { icon: MapPin, title: 'Visit Us', info: 'Ganesh Vihar, Jamna Puri, Jaipur - 302012', link: '#', color: 'from-cyan-500 to-blue-600' }
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.link}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 text-center hover:border-white/20 transition-all group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className={`w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/10`}>
                  <item.icon className="w-10 h-10 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-white mb-3 text-xl font-['Outfit']">{item.title}</h3>
                <p className="text-gray-400 text-lg">{item.info}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-500/20">
                SB
              </div>
              <div>
                <div className="font-bold text-white text-lg font-['Outfit']">SB LED Boards</div>
                <div className="text-sm text-gray-500">Jaipur, Rajasthan</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {['Fb', 'Ig', 'Yt'].map((social) => (
                <a key={social} href="#" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm font-bold border border-white/5 hover:border-white/20">
                  {social}
                </a>
              ))}
            </div>

            <p className="text-gray-600 text-sm">© 2025 SB LED Boards. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <AnimatePresence>
        {selectedService && <ContactModal service={selectedService} onClose={() => setSelectedService(null)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
