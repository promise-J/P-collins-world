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
  Headphones,
  Star,
  Clock,
  Building2,
  Heart,
  Share2,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "500+", label: "Products", icon: ShoppingBag },
    { value: "200+", label: "Properties", icon: Home },
    { value: "₦50M+", label: "Savings", icon: Wallet },
  ];

  const features = [
    {
      icon: ShoppingBag,
      title: "Marketplace",
      description:
        "Shop quality products from trusted vendors with secure payment and fast delivery",
      color: "from-orange-500 to-red-500",
      link: "/products",
      features: [
        "Secure payments with Paystack",
        "Fast delivery nationwide",
        "Buyer protection guarantee",
        "Easy returns & refunds",
      ],
    },
    {
      icon: Target,
      title: "Personal Savings",
      description:
        "Save towards your goals with flexible plans and competitive interest rates",
      color: "from-green-500 to-emerald-500",
      link: "/savings",
      features: [
        "Flexible savings plans",
        "Automated contributions",
        "No penalty for breaking",
        "Track your progress",
      ],
    },
    {
      icon: Users,
      title: "Group Savings",
      description:
        "Join or create groups to save together for common goals like food, gadgets, and more",
      color: "from-purple-500 to-pink-500",
      link: "/savings/groups",
      features: [
        "Collective saving power",
        "Group chat feature",
        "Transparent tracking",
        "Penalty for early breaking",
      ],
    },
    {
      icon: Building2,
      title: "Real Estate",
      description:
        "Find your dream property with verified listings from trusted landlords and agents",
      color: "from-blue-500 to-cyan-500",
      link: "/properties",
      features: [
        "Verified properties",
        "Virtual inspections",
        "Agent support",
        "KYC verified listings",
      ],
    },
  ];

  const testimonials = [
    {
      name: "John Doe",
      role: "Property Buyer",
      content:
        "Found my dream apartment through P Collins. The process was smooth and transparent!",
      rating: 5,
      avatar: "JD",
    },
    {
      name: "Sarah Johnson",
      role: "Group Saver",
      content:
        "My savings group bought 50 bags of rice for Christmas. The group chat feature kept everyone connected!",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Michael Okonkwo",
      role: "Vendor",
      content:
        "Sales have increased since joining the marketplace. Customer support is excellent!",
      rating: 4,
      avatar: "MO",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-[var(--color-brand-primary)] via-[var(--color-brand-primary-dark)] to-[var(--color-brand-text)] text-white overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                ⭐ Trusted by 10,000+ users
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Your One-Stop Platform for
              <span className="text-[var(--color-brand-secondary)]">
                {" "}
                Marketplace, Savings & Real Estate
              </span>
            </h1>

            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Shop, save, and invest with confidence. Join thousands of users
              who trust P Collins for their financial and lifestyle needs.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link to="/register">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button size="lg" variant="secondary">
                        Get Started Free
                        {/* <ArrowRight className="ml-2" size={18} /> */}
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="ghost" className="border-white text-white hover:bg-white/10">
                      Sign In
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" variant="secondary">
                      Go to Dashboard
                      <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </motion.div>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 64L60 69.3C120 75 240 85 360 80C480 75 600 53 720 48C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64L1440 64L1440 120L1380 120C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120L0 120Z"
              fill="white"
            />
          </svg>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div className="inline-flex p-3 bg-[var(--color-brand-primary)]/10 rounded-full mb-4">
                    <Icon
                      className="text-[var(--color-brand-primary)]"
                      size={24}
                    />
                  </div>
                  <motion.h3
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="text-3xl font-bold text-[var(--color-brand-text)]"
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-gray-500">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[var(--color-brand-text)] mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive suite of services designed to help you
              shop, save, and invest
            </p>
          </motion.div>

          <div className="space-y-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`flex flex-col ${
                    index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                  } items-center gap-12`}
                >
                  <div className="flex-1">
                    <div
                      className={`inline-flex p-3 bg-gradient-to-r ${feature.color} rounded-2xl mb-6`}
                    >
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-[var(--color-brand-text)] mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                      {feature.description}
                    </p>
                    <div className="space-y-3 mb-6">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle size={18} className="text-green-500" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                    <Link to={feature.link}>
                      <Button variant="ghost" className="group">
                        Learn More
                        <ArrowRight
                          size={18}
                          className="ml-2 group-hover:translate-x-1 transition-transform"
                        />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex-1">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-2xl opacity-20`}
                      />
                      <div className="relative bg-white rounded-2xl p-8 shadow-xl">
                        <div className="h-64 flex items-center justify-center">
                          {feature.title === "Marketplace" && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-100 p-4 rounded-xl text-center">
                                <ShoppingBag className="mx-auto mb-2 text-[var(--color-brand-primary)]" />
                                <p className="text-sm">Electronics</p>
                              </div>
                              <div className="bg-gray-100 p-4 rounded-xl text-center">
                                <Truck className="mx-auto mb-2 text-[var(--color-brand-primary)]" />
                                <p className="text-sm">Fast Delivery</p>
                              </div>
                              <div className="bg-gray-100 p-4 rounded-xl text-center">
                                <Star className="mx-auto mb-2 text-[var(--color-brand-primary)]" />
                                <p className="text-sm">Top Rated</p>
                              </div>
                              <div className="bg-gray-100 p-4 rounded-xl text-center">
                                <Shield className="mx-auto mb-2 text-[var(--color-brand-primary)]" />
                                <p className="text-sm">Secure</p>
                              </div>
                            </div>
                          )}
                          {feature.title === "Personal Savings" && (
                            <div className="text-center">
                              <div className="text-6xl mb-4">💰</div>
                              <div className="h-4 w-48 bg-gray-200 rounded-full mx-auto mb-2 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: "75%" }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                />
                              </div>
                              <p className="text-sm text-gray-500">
                                75% of target achieved
                              </p>
                            </div>
                          )}
                          {feature.title === "Group Savings" && (
                            <div className="flex -space-x-3">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold border-2 border-white"
                                >
                                  {String.fromCharCode(65 + i)}
                                </div>
                              ))}
                            </div>
                          )}
                          {feature.title === "Real Estate" && (
                            <div className="relative">
                              <Building2
                                size={80}
                                className="text-[var(--color-brand-primary)]"
                              />
                              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                                <CheckCircle size={16} className="text-white" />
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
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[var(--color-brand-text)] mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get started with P Collins
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up in minutes with your email or phone",
                icon: "📝",
              },
              {
                step: "02",
                title: "Verify Identity",
                desc: "Complete KYC for full access to all features",
                icon: "✅",
              },
              {
                step: "03",
                title: "Start Using",
                desc: "Shop, save, or invest in real estate instantly",
                icon: "🚀",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-sm text-[var(--color-brand-primary)] font-semibold mb-2">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[var(--color-brand-text)] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[var(--color-brand-text)] mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by thousands of happy customers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-brand-text)]">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-text)] text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users already enjoying the benefits of shopping,
              saving, and investing with P Collins
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="secondary">
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