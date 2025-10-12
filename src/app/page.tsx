'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuickAddReminder } from "@/components/quick-add-reminder"
import { Logo, LogoText } from "@/components/ui/logo"
import { ArrowRight, Clock, Smartphone, Zap, CheckCircle, Mic, Sparkles, Shield, Star, Users, TrendingUp, Award, Plus } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>

        <div className="container max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo */}
              <div className="flex justify-center lg:justify-start mb-8">
                <LogoText className="text-3xl" />
              </div>

              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-tight">
                The Fastest Way to{' '}
                <span className="gradient-primary bg-clip-text text-transparent">
                  Never Forget
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Create reminders in <span className="font-semibold text-primary">3 seconds</span> with voice input. 
                Built for professionals who can't afford to miss anything.
              </p>
              
              {/* Value Props */}
              <div className="space-y-6 mb-12">
                <motion.div 
                  className="flex items-center space-x-4 card-modern"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="p-3 bg-success/20 rounded-xl">
                    <Mic className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Voice-First Interface</h3>
                    <p className="text-muted-foreground">Just speak: "Meeting tomorrow at 3pm"</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-4 card-modern"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Multi-Layer Alerts</h3>
                    <p className="text-muted-foreground">14d, 7d, 3d, 1d, 2h, 1h advance warnings</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-4 card-modern"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="p-3 bg-secondary/20 rounded-xl">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Professional Grade</h3>
                    <p className="text-muted-foreground">Built for lawyers, founders, executives</p>
                  </div>
                </motion.div>
              </div>

              {/* CTAs */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <QuickAddReminder>
                  <Button size="lg" className="btn-primary text-lg px-8 py-4 h-auto">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Try Quick Add
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </QuickAddReminder>
                <Link href="/auth/register">
                  <Button size="lg" variant="outline" className="btn-glass text-lg px-8 py-4 h-auto">
                    Sign Up Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Mobile App Preview */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative mx-auto max-w-sm">
                {/* Phone Frame */}
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-2 shadow-3xl">
                  <div className="bg-background rounded-[2.5rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border/50">
                      <div className="flex items-center gap-2">
                        <Logo size="sm" variant="minimal" />
                        <span className="font-display font-bold text-lg">RE:MIND</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-success rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-1 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="p-6 space-y-6">
                      {/* Quick Add Button */}
                      <div className="text-center">
                        <motion.div 
                          className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center shadow-glow animate-pulse-glow mb-4"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus className="h-8 w-8 text-primary-foreground" />
                        </motion.div>
                        <p className="text-sm text-muted-foreground">Tap to add reminder</p>
                      </div>
                      
                      {/* Sample Reminders */}
                      <div className="space-y-3">
                        <div className="card-modern p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            <div>
                              <p className="font-semibold">Court hearing</p>
                              <p className="text-sm text-muted-foreground">Tomorrow at 10:00 AM</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="card-modern p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-warning rounded-full"></div>
                            <div>
                              <p className="font-semibold">Team meeting</p>
                              <p className="text-sm text-muted-foreground">Friday at 2:00 PM</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="card-modern p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-success rounded-full"></div>
                            <div>
                              <p className="font-semibold">Call dentist</p>
                              <p className="text-sm text-muted-foreground">Next Monday</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center shadow-glow animate-float"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Smartphone className="h-8 w-8 text-accent-foreground" />
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-12 h-12 gradient-warm rounded-xl flex items-center justify-center shadow-glow animate-float"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  <Zap className="h-6 w-6 text-warning-foreground" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 relative">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Trusted by <span className="gradient-primary bg-clip-text text-transparent">10,000+</span> Professionals
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join lawyers, founders, and executives who never miss important dates
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "10K+", label: "Active Users", color: "text-primary" },
              { icon: TrendingUp, value: "99.9%", label: "Uptime", color: "text-success" },
              { icon: Star, value: "4.9★", label: "User Rating", color: "text-warning" },
              { icon: Award, value: "50+", label: "Awards", color: "text-secondary" },
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center card-modern p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 gradient-primary rounded-2xl flex items-center justify-center`}>
                  <stat.icon className={`h-8 w-8 text-primary-foreground`} />
                </div>
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}