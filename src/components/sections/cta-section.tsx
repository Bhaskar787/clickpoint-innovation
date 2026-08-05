"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="relative py-20 lg:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-16 text-center sm:px-16"
        >
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/40 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-ember-500/30 blur-[100px]" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl section-title text-white">
              Ready to build your next{" "}
              <span className="text-[#f58220]">
                AI-first product?
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-md section-subtitle text-white/60">
              Tell us about your project — we'll get back with a plan and
              timeline within 24 hours.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a href="/contact">
              <Button variant="primary" size="lg" className="group">
                Talk to an Expert
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              </a>
              <a href="/case-studies">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
              >
                Explore Case Studies
              </Button>

              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
