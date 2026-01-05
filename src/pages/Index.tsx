import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BlockchainBackground from '@/components/BlockchainBackground';
import { Building2, Gem, Leaf, TrendingUp, Shield, Globe, ArrowRight, Users, Award, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      <BlockchainBackground />
      
      <div className="relative z-10">
        {/* Navigation Header */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/')} className="text-2xl font-bold text-gradient-gold">
              Hatra Suci
            </button>
            
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/about')} className="text-sm hover:text-primary transition-colors">
                About
              </button>
              <button onClick={() => navigate('/ceo')} className="text-sm hover:text-primary transition-colors">
                CEO
              </button>
              <button onClick={() => navigate('/contact')} className="text-sm hover:text-primary transition-colors">
                Contact
              </button>
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="gold" size="sm" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>

            <button 
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border shadow-lg">
              <div className="flex flex-col p-4 space-y-3">
                <button 
                  onClick={() => { navigate('/about'); setMobileMenuOpen(false); }} 
                  className="text-left px-4 py-3 hover:bg-secondary rounded-lg transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => { navigate('/ceo'); setMobileMenuOpen(false); }} 
                  className="text-left px-4 py-3 hover:bg-secondary rounded-lg transition-colors"
                >
                  CEO
                </button>
                <button 
                  onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }} 
                  className="text-left px-4 py-3 hover:bg-secondary rounded-lg transition-colors"
                >
                  Contact
                </button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                >
                  Login
                </Button>
                <Button 
                  variant="gold" 
                  className="w-full justify-start"
                  onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                >
                  Register
                </Button>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center p-4 text-center pt-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-gradient-gold mb-4 tracking-wider">Hatra Suci</h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-primary font-semibold mb-4">Indonesia's Trusted Global Enterprise</p>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto px-4">
              A diversified Indonesia-based conglomerate and digital technology provider, operating across natural resources, global trade, and blockchain-powered financial technology.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mb-12">
              <Button 
                variant="gold" 
                size="lg"
                onClick={() => navigate('/register')}
                className="group w-full sm:w-auto"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/about')}
                className="w-full sm:w-auto"
              >
                Learn More
              </Button>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto"
              >
                Login
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
              <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 sm:p-4">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-gradient-gold">20+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Years Experience</p>
              </div>
              <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 sm:p-4">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-accent mx-auto mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-gradient-gold">15+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Countries</p>
              </div>
              <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 sm:p-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-gradient-gold">5M+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Users</p>
              </div>
              <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 sm:p-4">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-accent mx-auto mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-gradient-gold">$10M+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Rewards Paid</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Industries Section */}
        <section className="py-12 sm:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 sm:mb-4 text-gradient-gold">Our Core Industries</h2>
            <p className="text-center text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              Operating across traditional and digital sectors with sustainable practices and innovative solutions
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-xl p-5 sm:p-6 card-glow hover:border-primary transition-all">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3 sm:mb-4">
                  <Leaf className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Palm Oil</h3>
                <p className="text-sm text-muted-foreground">Sustainable plantation management and eco-friendly production</p>
              </div>

              <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-xl p-5 sm:p-6 card-glow hover:border-primary transition-all">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-3 sm:mb-4">
                  <Gem className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Diamond Mining</h3>
                <p className="text-sm text-muted-foreground">Ethical mining operations with environmental compliance</p>
              </div>

              <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-xl p-5 sm:p-6 card-glow hover:border-primary transition-all">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-3 sm:mb-4">
                  <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Global Trade</h3>
                <p className="text-sm text-muted-foreground">International export-import network with full logistics</p>
              </div>

              <div className="bg-card/90 backdrop-blur-sm border-2 border-border rounded-xl p-5 sm:p-6 card-glow hover:border-primary transition-all">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3 sm:mb-4">
                  <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Blockchain Finance</h3>
                <p className="text-sm text-muted-foreground">Secure USDT platform with daily rewards system</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 sm:py-20 px-4 bg-primary/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-gradient-gold">Why Choose Hatra Suci</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">Trusted & Secure</h3>
                <p className="text-sm sm:text-base text-muted-foreground px-4">20+ years of ethical operations with full transparency and blockchain security</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">Sustainable Practice</h3>
                <p className="text-sm sm:text-base text-muted-foreground px-4">Committed to eco-friendly production and responsible resource management</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">Proven Results</h3>
                <p className="text-sm sm:text-base text-muted-foreground px-4">Millions paid in rewards with a growing global community of satisfied users</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary rounded-2xl p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gradient-gold">Ready to Start Earning?</h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
                Join thousands of members earning daily rewards with Hatra Suci Investment & Rewards Platform
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                <Button 
                  variant="gold" 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto"
                >
                  Create Account
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/contact')}
                  className="w-full sm:w-auto"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 sm:py-12 px-4 border-t border-border bg-card/50">
          <div className="max-w-6xl mx-auto">
            {/* Company Info - Full Width */}
            <div className="text-center mb-6 sm:mb-10">
              <h3 className="text-xl sm:text-3xl font-bold text-gradient-gold mb-2">Hatra Suci</h3>
              <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                Indonesia's trusted global enterprise in natural resources and blockchain finance.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 sm:gap-12 mb-6 sm:mb-10">
              {/* Left Column - Company & Platform Links */}
              <div className="space-y-5 sm:space-y-8">
                <div>
                  <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-primary">Company</h4>
                  <div className="space-y-2 sm:space-y-3">
                    <button onClick={() => navigate('/about')} className="block text-xs sm:text-base text-muted-foreground hover:text-primary transition-colors">
                      About Us
                    </button>
                    <button onClick={() => navigate('/ceo')} className="block text-xs sm:text-base text-muted-foreground hover:text-primary transition-colors">
                      Leadership
                    </button>
                    <button onClick={() => navigate('/contact')} className="block text-xs sm:text-base text-muted-foreground hover:text-primary transition-colors">
                      Contact
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-primary">Platform</h4>
                  <div className="space-y-2 sm:space-y-3">
                    <button onClick={() => navigate('/login')} className="block text-xs sm:text-base text-muted-foreground hover:text-primary transition-colors">
                      Login
                    </button>
                    <button onClick={() => navigate('/register')} className="block text-xs sm:text-base text-muted-foreground hover:text-primary transition-colors">
                      Register
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="block text-xs sm:text-base text-muted-foreground hover:text-primary transition-colors">
                      Dashboard
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Info */}
              <div>
                <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-primary">Contact</h4>
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-base text-muted-foreground">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="leading-tight">Jakarta, Indonesia</p>
                  </div>
                  
                  <div className="flex items-start gap-2 sm:gap-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="break-all leading-tight">support@hatrasuci.co.id</p>
                  </div>
                  
                  <div className="flex items-start gap-2 sm:gap-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.68-.52.36-.99.53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.48 1.03-.73 4.04-1.76 6.73-2.92 8.08-3.49 3.85-1.62 4.65-1.9 5.17-1.91.11 0 .37.03.54.17.14.11.18.26.2.37-.01.06.01.24 0 .38z"/>
                    </svg>
                    <a href="https://t.me/HatraSuciSupport" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors leading-tight">
                      Telegram Support
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-4 sm:pt-8 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
              <p>© 2025 Hatra Suci. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
