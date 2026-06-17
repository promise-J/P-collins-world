import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/ui";
import {
  ShoppingBag,
  Target,
  Home,
  Users,
  Shield,
  TrendingUp,
  Wallet,
  Truck,
  Star,
  Building2,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Award,
  Layers,
  UserCheck,
  Rocket,
  Eye,
  Gem,
  Crown,
  Flower,
  Sun
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const floatingObjects = [
    { icon: Gem, size: 56, color: "text-yellow-300", x: "10%", y: "15%", delay: 0, duration: 8 },
    { icon: Crown, size: 48, color: "text-yellow-200", x: "80%", y: "20%", delay: 1, duration: 10 },
    { icon: Sparkles, size: 40, color: "text-yellow-400", x: "5%", y: "70%", delay: 0.5, duration: 7 },
    { icon: Sun, size: 64, color: "text-yellow-300/60", x: "90%", y: "75%", delay: 1.5, duration: 9 },
    { icon: Flower, size: 32, color: "text-pink-300", x: "20%", y: "50%", delay: 0.8, duration: 6 },
    { icon: Gem, size: 44, color: "text-purple-300", x: "70%", y: "60%", delay: 2, duration: 11 },
    { icon: Crown, size: 36, color: "text-amber-300", x: "45%", y: "10%", delay: 0.3, duration: 8 },
    { icon: Sparkles, size: 28, color: "text-yellow-200", x: "55%", y: "85%", delay: 1.2, duration: 7 },
    { icon: Flower, size: 48, color: "text-rose-300", x: "85%", y: "45%", delay: 1.8, duration: 9 },
    { icon: Sun, size: 52, color: "text-yellow-400/50", x: "15%", y: "85%", delay: 0.7, duration: 10 },
  ];

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users, color: "from-blue-500 to-cyan-500" },
    { value: "500+", label: "Products", icon: ShoppingBag, color: "from-orange-500 to-rose-500" },
    { value: "200+", label: "Properties", icon: Home, color: "from-emerald-500 to-teal-500" },
    { value: "₦50M+", label: "Savings", icon: Wallet, color: "from-violet-500 to-purple-500" },
  ];

  const features = [
    {
      icon: ShoppingBag,
      title: "Marketplace",
      description: "Shop quality products from trusted vendors with secure payment and fast delivery",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      link: "/products",
      features: [
        "Secure payments with Paystack",
        "Fast delivery nationwide",
        "Buyer protection guarantee",
        "Easy returns & refunds"
      ],
    },
    {
      icon: Target,
      title: "Personal Savings",
      description: "Save towards your goals with flexible plans and competitive interest rates",
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      link: "/savings",
      features: [
        "Flexible savings plans",
        "Automated contributions",
        "No penalty for breaking",
        "Track your progress"
      ],
    },
    {
      icon: Users,
      title: "Group Savings",
      description: "Join or create groups to save together for common goals like food, gadgets, and more",
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
      link: "/savings/groups",
      features: [
        "Collective saving power",
        "Group chat feature",
        "Transparent tracking",
        "Penalty for early breaking"
      ],
    },
    {
      icon: Building2,
      title: "Real Estate",
      description: "Find your dream property with verified listings from trusted landlords and agents",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      link: "/properties",
      features: [
        "Verified properties",
        "Virtual inspections",
        "Agent support",
        "KYC verified listings"
      ],
    },
  ];

  const testimonials = [
    {
      name: "John Doe",
      role: "Property Buyer",
      content: "Found my dream apartment through P Collins. The process was smooth and transparent!",
      rating: 5,
      avatar: "JD",
      color: "from-indigo-500 to-purple-500",
    },
    {
      name: "Sarah Johnson",
      role: "Group Saver",
      content: "My savings group bought 50 bags of rice for Christmas. The group chat feature kept everyone connected!",
      rating: 5,
      avatar: "SJ",
      color: "from-emerald-500 to-teal-500",
    },
    {
      name: "Michael Okonkwo",
      role: "Vendor",
      content: "Sales have increased since joining the marketplace. Customer support is excellent!",
      rating: 4,
      avatar: "MO",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const steps = [
    {
      icon: UserCheck,
      title: "Create Account",
      description: "Sign up in minutes with your email or phone",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Verify Identity",
      description: "Complete KYC for full access to all features",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Rocket,
      title: "Start Using",
      description: "Shop, save, or invest in real estate instantly",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50" style={{ overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .min-h-screen::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .min-h-screen {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-[var(--color-brand-primary)] via-[var(--color-brand-primary-dark)] to-[var(--color-brand-text)] text-white overflow-hidden min-h-screen flex items-center"
      >
        {/* Animated Background with Floating Objects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large Floating Objects */}
          {floatingObjects.map((obj, index) => {
            const Icon = obj.icon;
            return (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  left: obj.x,
                  top: obj.y,
                }}
                animate={{
                  y: [0, -60, 0, 60, 0],
                  x: [0, 40, 0, -40, 0],
                  rotate: [0, 45, -45, 90, 0],
                  scale: [1, 1.2, 1, 0.8, 1],
                }}
                transition={{
                  duration: obj.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: obj.delay,
                }}
              >
                <Icon 
                  size={obj.size} 
                  className={`${obj.color} drop-shadow-2xl`}
                  style={{
                    filter: 'blur(1px) brightness(1.2)',
                    opacity: 0.7,
                  }}
                />
              </motion.div>
            );
          })}

          {/* Additional Glowing Orbs */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full bg-white/5"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -50, 50, -50],
                x: [null, 30, -30, 30],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              className="inline-block mb-8"
            >
              <span className="px-6 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium inline-flex items-center gap-2 border border-white/20 shadow-lg">
                <Sparkles size={16} className="text-yellow-300" />
                Trusted by 10,000+ users
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            >
              Your One-Stop Platform for
              <span className="text-[var(--color-brand-secondary)] block md:inline-block md:ml-3 relative">
                Marketplace, Savings & Real Estate
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[var(--color-brand-secondary)] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed"
            >
              Shop, save, and invest with confidence. Join thousands of users
              who trust P Collins for their financial and lifestyle needs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              {!isAuthenticated ? (
                <>
                  <Link to="/role-selection?mode=register">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="secondary" size="lg" className="bg-white text-[var(--color-brand-primary)] hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300">
                        Get Started Free
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/role-selection?mode=login">
                    <Button size="lg" variant="ghost" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                      Sign In
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="bg-white text-[var(--color-brand-primary)] hover:bg-gray-100 shadow-2xl">
                      Go to Dashboard
                      <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </motion.div>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 64L60 69.3C120 75 240 85 360 80C480 75 600 53 720 48C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64L1440 64L1440 120L1380 120C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120L0 120Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="py-16 md:py-20 bg-[#f8fafc]"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInScale}
                  className="relative group"
                >
                  <div className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <Icon size={28} />
                    </div>
                    <motion.h3
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, type: "spring", delay: 0.2 + index * 0.1 }}
                      className="text-3xl md:text-4xl font-bold text-[var(--color-brand-text)] mb-1"
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-gray-500 font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="py-20 md:py-28 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-brand-primary)]/10 rounded-full mb-4">
              <Layers size={16} className="text-[var(--color-brand-primary)]" />
              <span className="text-sm font-medium text-[var(--color-brand-primary)]">Our Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-brand-text)] mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Discover our comprehensive suite of services designed to help you
              shop, save, and invest
            </p>
          </motion.div>

          <div className="space-y-24">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-16`}
                >
                  <div className="flex-1">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white shadow-lg mb-6`}>
                      <Icon size={32} />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-text)] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="space-y-3 mb-8">
                      {feature.features.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle size={14} className="text-green-600" />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                    <Link to={feature.link}>
                      <Button variant="ghost" className="group text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/5">
                        Learn More
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex-1 w-full">
                    <motion.div
                      whileHover={{ scale: 1.02, rotate: 1 }}
                      transition={{ duration: 0.4 }}
                      className="relative"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur-2xl opacity-20`} />
                      <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                        <div className="h-64 flex items-center justify-center">
                          {feature.title === "Marketplace" && (
                            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                              {[
                                { icon: ShoppingBag, label: "Electronics" },
                                { icon: Truck, label: "Fast Delivery" },
                                { icon: Star, label: "Top Rated" },
                                { icon: Shield, label: "Secure" },
                              ].map((item, i) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-xl text-center hover:bg-gray-100 transition-colors">
                                  <item.icon className="mx-auto mb-2 text-[var(--color-brand-primary)]" size={24} />
                                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          {feature.title === "Personal Savings" && (
                            <div className="text-center w-full max-w-sm">
                              <div className="text-7xl mb-4">💰</div>
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Progress</span>
                                  <span className="font-medium text-[var(--color-brand-primary)]">75%</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "75%" }}
                                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                  />
                                </div>
                                <p className="text-sm text-gray-500 mt-2">75% of target achieved</p>
                              </div>
                            </div>
                          )}
                          {feature.title === "Group Savings" && (
                            <div className="flex -space-x-4">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, scale: 0 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.1, type: "spring" }}
                                  className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-white shadow-lg"
                                >
                                  {String.fromCharCode(65 + i)}
                                </motion.div>
                              ))}
                            </div>
                          )}
                          {feature.title === "Real Estate" && (
                            <div className="relative">
                              <motion.div
                                animate={{ 
                                  y: [0, -8, 0],
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              >
                                <Building2 size={80} className="text-[var(--color-brand-primary)]" />
                              </motion.div>
                              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-lg">
                                <CheckCircle size={16} className="text-white" />
                              </div>
                              <div className="absolute -top-4 -right-4 bg-blue-500 rounded-full p-1 shadow-lg">
                                <Eye size={14} className="text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="py-20 md:py-28 bg-[#f8fafc]"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
              <Zap size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Getting Started</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-brand-text)] mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Simple steps to get started with P Collins
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="relative group"
                >
                  <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-2xl transition-all duration-300">
                    <div className="relative inline-block mb-6">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <Icon size={32} />
                      </div>
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-[var(--color-brand-primary)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-brand-text)] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight size={24} className="text-gray-300" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="py-20 md:py-28 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full mb-4">
              <Star size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-brand-text)] mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Trusted by thousands of happy customers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-brand-text)] text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        className="py-20 md:py-28 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-primary)] via-[var(--color-brand-primary-dark)] to-[var(--color-brand-text)]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-sm font-medium text-white">Join the community</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of users already enjoying the benefits of shopping,
              saving, and investing with P Collins
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/role-selection?mode=register"}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-white text-[var(--color-brand-primary)] hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Today"}
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}