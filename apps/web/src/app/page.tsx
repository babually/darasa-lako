"use client";

import Header from "@/components/header";
import ResourceSection from "@/components/resources/resource-section";
import { SubmitButton } from "@/components/resources/submit-button";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <section className="pt-22 text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-medium text-foreground">
              Darasa Lako Hub
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Access notes, exam papers, and study materials to excel in your studies.
            </p>
          </section>
          <div className="mt-16">
            <ResourceSection />
          </div>


        </div>

        <SubmitButton />
      </main>
    </div>
  );
}
