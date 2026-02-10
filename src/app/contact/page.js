"use client";

import ContactSection from "@/components/ContactSection";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <main className="flex-1">
        <section className="bg-primary/10 py-16 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-primary">Contact Us</h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Have questions about admission or courses? We are here to help.
            Visit our campus or send us a message.
          </p>
        </section>

        <ContactSection bgClass="bg-transparent" className="py-12" />
      </main>
    </div>
  );
}