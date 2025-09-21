"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiGoogle } from "react-icons/si";
import { FaGithub, FaLinkedin } from "react-icons/fa";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LandingPage = () => {
  const [mounted, setMounted] = useState(false);
  const playgroundRef = useRef(null);
  const heroContentRef = useRef(null);
  const navRef = useRef(null);
  const featureCardsRef = useRef([]);
  const ctaSectionRef = useRef(null);
  const floatingElementsRef = useRef([]);

  useEffect(() => {
    setMounted(true);

    // Initialize GSAP animations
    const initAnimations = () => {
      // Hero animation with smoother stagger
      if (heroContentRef.current) {
        const heroTimeline = gsap.timeline({ delay: 0.3 });
        heroTimeline
          .from(heroContentRef.current.querySelector("h1"), {
            duration: 1,
            y: 80,
            opacity: 0,
            ease: "power4.out",
          })
          .from(
            heroContentRef.current.querySelector("p"),
            {
              duration: 0.8,
              y: 40,
              opacity: 0,
              ease: "power3.out",
            },
            "-=0.7"
          )
          .from(
            heroContentRef.current.querySelector(".cta-buttons"),
            {
              duration: 0.8,
              y: 20,
              opacity: 0,
              ease: "power3.out",
            },
            "-=0.5"
          );
      }

      // Navigation animation
      if (navRef.current) {
        gsap.from(navRef.current, {
          duration: 0.8,
          y: -80,
          opacity: 0,
          ease: "power3.out",
          delay: 0.1,
        });
      }

      // Floating elements animation
      floatingElementsRef.current.forEach((element, index) => {
        if (element) {
          gsap.from(element, {
            duration: 1.2,
            scale: 0.5,
            opacity: 0,
            ease: "back.out(1.5)",
            delay: 0.4 + index * 0.15,
          });
        }
      });

      // Feature cards animation
      featureCardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { y: 80, opacity: 0, scale: 0.9 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: "back.out(1.3)",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse",
              },
              delay: 0.2 + index * 0.15,
            }
          );
        }
      });

      // CTA section animation
      if (ctaSectionRef.current) {
        const ctaElements = ctaSectionRef.current.querySelectorAll(
          "h2, p, .cta-button"
        );
        gsap.fromTo(
          ctaElements,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaSectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    };

    // Background floating dots
    const createBackgroundDots = () => {
      const colors = [
        "rgba(59,130,246,0.25)",
        "rgba(139,92,246,0.2)",
        "rgba(236,72,153,0.2)",
        "rgba(34,197,94,0.15)",
      ];

      const interval = setInterval(() => {
        if (Math.random() < 0.2) {
          const dot = document.createElement("div");
          const size = Math.random() * 5 + 2;
          dot.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background-color: ${
              colors[Math.floor(Math.random() * colors.length)]
            };
            border-radius: 50%;
            left: ${Math.random() * window.innerWidth}px;
            top: -10px;
            pointer-events: none;
            z-index: 0;
            box-shadow: 0 0 12px rgba(59,130,246,0.25);
          `;
          document.body.appendChild(dot);

          gsap.to(dot, {
            y: window.innerHeight + 30,
            x: `+=${(Math.random() - 0.5) * 80}`,
            rotation: 180,
            duration: 10 + Math.random() * 6,
            ease: "none",
            onComplete: () => {
              if (dot.parentNode) dot.parentNode.removeChild(dot);
            },
          });
        }
      }, 1200);

      return () => clearInterval(interval);
    };

    initAnimations();
    const cleanup = createBackgroundDots();

    return cleanup;
  }, []);

  const handlePlaygroundMouseMove = (e) => {
    if (!playgroundRef.current) return;

    const rect = playgroundRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Glow effect
    const glowColors = [
      "rgba(59,130,246,0.35)",
      "rgba(139,92,246,0.3)",
      "rgba(236,72,153,0.3)",
      "rgba(34,197,94,0.3)",
    ];

    const glow = document.createElement("div");
    glow.className = "absolute pointer-events-none rounded-full";
    const glowSize = 100 + Math.random() * 30;
    glow.style.cssText = `
      left: ${x - glowSize / 2}px;
      top: ${y - glowSize / 2}px;
      width: ${glowSize}px;
      height: ${glowSize}px;
      background: radial-gradient(circle, ${
        glowColors[Math.floor(Math.random() * glowColors.length)]
      } 0%, transparent 70%);
      filter: blur(8px);
    `;
    playgroundRef.current.appendChild(glow);

    gsap.to(glow, {
      scale: 1.3,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
      onComplete: () => {
        if (glow.parentNode) glow.parentNode.removeChild(glow);
      },
    });

    // Particles
    if (Math.random() < 0.3) {
      for (let i = 0; i < 2; i++) {
        const particle = document.createElement("div");
        const particleSize = Math.random() * 2 + 1;
        particle.className = "absolute pointer-events-none rounded-full";
        particle.style.cssText = `
          left: ${x}px;
          top: ${y}px;
          width: ${particleSize}px;
          height: ${particleSize}px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          box-shadow: 0 0 5px rgba(59,130,246,0.5);
        `;
        playgroundRef.current.appendChild(particle);

        gsap.to(particle, {
          x: (Math.random() - 0.5) * 120,
          y: (Math.random() - 0.5) * 120,
          opacity: 0,
          scale: 0,
          rotation: 180,
          duration: 1.5 + Math.random(),
          ease: "power3.out",
          onComplete: () => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          },
        });
      }
    }
  };

  const FloatingElement = ({ delay = 0, className = "", index }) => (
    <div
      ref={(el) => (floatingElementsRef.current[index] = el)}
      className={`absolute rounded-full opacity-25 ${className}`}
      style={{
        background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
        animation: `float 5s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        boxShadow: "0 0 15px rgba(59,130,246,0.25)",
      }}
    />
  );

  const TodoCard = ({ title, dueDate, position, color, index }) => (
    <div
      className={`absolute ${position} w-64 bg-white rounded-xl p-5 shadow-lg border border-gray-100 transition-all duration-400 hover:scale-105 hover:shadow-xl cursor-pointer hover:rotate-2 group`}
      style={{
        transform: "translateZ(0)",
      }}
      onMouseEnter={(e) => {
        gsap.to(e.currentTarget, {
          y: -8,
          boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
          duration: 0.3,
          ease: "power2.out",
        });
      }}
      onMouseLeave={(e) => {
        gsap.to(e.currentTarget, {
          y: 0,
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          duration: 0.3,
          ease: "power2.out",
        });
      }}
    >
      <div className="flex items-center mb-3">
        <div
          className={`w-3 h-3 rounded-full ${color} mr-2 group-hover:scale-110 transition-transform duration-300`}
        ></div>
        <span className="font-semibold text-gray-800 group-hover:text-blue-500 transition-colors">
          {title}
        </span>
      </div>
      <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
        Due: {dueDate}
      </p>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/8 group-hover:via-purple-400/8 group-hover:to-pink-400/8 transition-all duration-400"></div>
    </div>
  );

  if (!mounted) return null;

  return (
    <div className="bg-gray-50 text-gray-900 overflow-x-hidden">
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-15px) rotate(3deg);
          }
          66% {
            transform: translateY(-8px) rotate(-2deg);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 4px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.7);
          }
        }

        .gradient-text {
          background: linear-gradient(
            135deg,
            #1e3a8a,
            #3b82f6 30%,
            #8b5cf6 60%,
            #1e3a8a
          );
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
        }

        .magnetic-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-blur {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.95);
        }

        .footer-dark {
          background: #111827;
        }
      `}</style>

      {/* Navigation */}
      <nav
        ref={navRef}
        className="fixed top-0 w-full z-50 nav-blur border-b border-gray-200/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-900 hover:scale-105 transition-transform duration-300">
                TodoApp
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                Features
              </Link>
              <Link
                href="#playground"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                Playground
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                Contact
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-blue-600 hover:bg-gray-100/50 transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 font-medium magnetic-button hover:scale-105 hover:shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto text-center w-full">
          <div ref={heroContentRef}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
              Modern Task
              <br />
              <span className="gradient-text">Management</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Build, organize, and track your tasks with precision. The
              developer-first todo app that scales with your workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center cta-buttons">
              <Link href="/auth/register">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-400 px-8 py-5 text-base hover:scale-105 hover:shadow-xl magnetic-button group">
                  <span className="group-hover:tracking-wider transition-all duration-300">
                    Start Building
                  </span>
                </Button>
              </Link>
              <Link href="#playground">
                <Button
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-blue-500 hover:text-blue-500 transition-all duration-300 px-8 py-5 text-base hover:scale-105 hover:shadow-lg"
                >
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <FloatingElement className="top-1/5 left-1/5 w-3 h-3" index={0} />
        <FloatingElement
          className="top-1/3 right-1/5 w-4 h-4"
          delay={-1.5}
          index={1}
        />
        <FloatingElement
          className="bottom-1/5 left-1/4 w-2 h-2"
          delay={-3}
          index={2}
        />
        <FloatingElement
          className="top-2/3 right-1/4 w-3 h-3"
          delay={-1}
          index={3}
        />
      </section>

      {/* Interactive Playground Section */}
      <section
        id="playground"
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 hover-lift">
              Interactive Playground
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Move your cursor to explore fluid interactions that make TodoApp
              unique.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div
              ref={playgroundRef}
              className="relative h-[500px] bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl overflow-hidden cursor-crosshair border border-gray-100 shadow-xl"
              onMouseMove={handlePlaygroundMouseMove}
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 50%)",
              }}
            >
              <TodoCard
                title="Review UI Components"
                dueDate="Today"
                position="top-12 left-12"
                color="bg-blue-500"
                index={0}
              />
              <TodoCard
                title="Deploy to Production"
                dueDate="Tomorrow"
                position="top-32 right-16"
                color="bg-green-500"
                index={1}
              />
              <TodoCard
                title="Team Standup Meeting"
                dueDate="This Week"
                position="bottom-20 left-1/4"
                color="bg-yellow-500"
                index={2}
              />
              <TodoCard
                title="Code Review Session"
                dueDate="Friday"
                position="bottom-32 right-1/3"
                color="bg-purple-500"
                index={3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 hover-lift">
              Everything You Need
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for modern teams and individual
              productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                ),
                title: "Smart Organization",
                description:
                  "Automatically categorize and prioritize tasks with AI-powered suggestions.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
                title: "Team Collaboration",
                description:
                  "Share projects, assign tasks, and track progress in real-time.",
              },
              {
                icon: <SiGoogle className="w-8 h-8 text-white" />,
                title: "Gemini Integration",
                description:
                  "Seamless AI-driven task automation and insights with Gemini.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                ref={(el) => (featureCardsRef.current[index] = el)}
                className="text-center p-6 group hover-lift rounded-xl hover:bg-gray-50 transition-all duration-400"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 group-hover:rotate-2 transition-all duration-400 shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaSectionRef}
        className="bg-gradient-to-r from-blue-900 via-gray-900 to-purple-900 text-white py-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers and teams who trust TodoApp for their
            project management needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/register">
              <Button className="bg-white text-blue-900 hover:bg-gray-100 transition-all duration-400 px-10 py-5 text-base hover:scale-105 hover:shadow-xl magnetic-button group cta-button">
                <span className="group-hover:tracking-wider transition-all duration-300">
                  Start Free Trial
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-dark text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-300 text-sm">
              Built by Rayhan Dita Adam Riski
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/rayhanditaadam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="GitHub"
              >
                <FaGithub className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/rayhan-dita-adam-riski-572b32355"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a
                href="mailto:rayhan.dita45@smk.belajar.id"
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                aria-label="Email"
              >
                rayhan.dita45@smk.belajar.id
              </a>
            </div>
          </div>
          <div className="mt-6 text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} TodoApp. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;