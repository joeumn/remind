'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuickAddReminder } from "@/components/quick-add-reminder"
import { Logo, LogoCompact } from "@/components/ui/Logo"
import { ArrowRight, Clock, Smartphone, Zap, CheckCircle, Sparkles, Star, Users, Shield, Brain, Mic, Globe, Download } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center px-4 py-20 min-h-screen">
        <div className="container max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo */}
              <div className="flex justify-center lg:justify-start mb-8">
                <Logo size="xl" />
              </div>

              {/* Main Headline */}
              <motion.h1 
                className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                The Future of{' '}
                <span className="text-gradient">Reminders</span>
                <br />
                <span className="text-4xl md:text-6xl text-muted-foreground">is Here</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Never miss another moment. RE:MIND uses AI-powered voice recognition to capture your thoughts instantly, 
                then intelligently schedules them for maximum impact.
              </motion.p>
              
              {/* Value Props */}
              <motion.div 
                className="space-y-6 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center space-x-4 group">
                  <div className="p-2 bg-gradient-primary rounded-xl group-hover:scale-110 transition-transform">
                    <Mic className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-medium">Voice-first design - just speak and it's done</span>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="p-2 bg-gradient-secondary rounded-xl group-hover:scale-110 transition-transform">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-medium">AI that understands context and urgency</span>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="p-2 bg-gradient-accent rounded-xl group-hover:scale-110 transition-transform">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-medium">Seamless sync across all your devices</span>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <QuickAddReminder>
                  <Button size="lg" className="gap-3 px-8 py-4 text-lg font-semibold gradient-primary hover:opacity-90 hover-lift shadow-glow">
                    <Sparkles className="h-5 w-5" />
                    Try Voice Capture
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </QuickAddReminder>
                <Link href="/auth/register">
                  <Button size="lg" variant="outline" className="gap-3 px-8 py-4 text-lg font-semibold glass hover:glass-strong hover-lift">
                    <Download className="h-5 w-5" />
                    Get Started Free
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Privacy First</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>50K+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.9/5 Rating</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div 
              className="hidden lg:block relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Main Phone Mockup */}
              <div className="relative">
                <div className="glass-strong rounded-3xl p-8 w-80 mx-auto">
                  <div className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-2xl p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <LogoCompact />
                      <div className="w-8 h-8 bg-gradient-primary rounded-full animate-pulse-glow" />
                    </div>
                    
                    {/* Quick Add Button */}
                    <div className="bg-gradient-primary rounded-xl p-4 text-center">
                      <Mic className="h-8 w-8 text-white mx-auto mb-2 animate-bounce-slow" />
                      <p className="text-white font-semibold">Tap to speak</p>
                      <p className="text-white/80 text-sm">Your reminder will be created instantly</p>
                    </div>
                    
                    {/* Sample Reminders */}
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                        <span className="text-sm">Call mom at 3 PM</span>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">Team meeting tomorrow</span>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full" />
                        <span className="text-sm">Buy groceries this weekend</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 glass rounded-2xl p-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                    <span className="text-sm font-medium">AI Processing</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-6 -left-6 glass rounded-2xl p-4"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Synced</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why <span className="text-gradient">RE:MIND</span> is Different
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for the modern professional who demands speed, intelligence, and reliability
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Mic className="h-8 w-8" />,
                title: "Voice-First Design",
                description: "Just speak naturally. Our AI understands context, urgency, and automatically schedules your reminders.",
                gradient: "gradient-primary"
              },
              {
                icon: <Brain className="h-8 w-8" />,
                title: "Smart Scheduling",
                description: "AI analyzes your patterns and suggests optimal times for reminders based on your behavior and preferences.",
                gradient: "gradient-secondary"
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Universal Sync",
                description: "Works seamlessly across all devices. Your reminders are always with you, everywhere you go.",
                gradient: "gradient-accent"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass rounded-2xl p-8 hover-lift group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by <span className="text-gradient">Professionals</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of users who never miss important deadlines
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Active Users", icon: <Users className="h-8 w-8" /> },
              { number: "99.9%", label: "Uptime", icon: <Shield className="h-8 w-8" /> },
              { number: "4.9★", label: "User Rating", icon: <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" /> },
              { number: "2.3s", label: "Avg Response", icon: <Zap className="h-8 w-8" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center glass rounded-2xl p-8 hover-lift"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-primary mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gradient mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <motion.div
            className="glass-strong rounded-3xl p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="text-gradient">Never Forget</span> Again?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the productivity revolution. Start capturing your thoughts instantly with voice commands.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <QuickAddReminder>
                <Button size="lg" className="gap-3 px-8 py-4 text-lg font-semibold gradient-primary hover:opacity-90 hover-lift shadow-glow">
                  <Mic className="h-5 w-5" />
                  Try Voice Capture Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </QuickAddReminder>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="gap-3 px-8 py-4 text-lg font-semibold glass hover:glass-strong hover-lift">
                  <Download className="h-5 w-5" />
                  Get Started Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}