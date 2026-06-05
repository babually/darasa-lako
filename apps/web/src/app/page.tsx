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
						<h1 className="font-medium font-serif text-5xl text-foreground md:text-6xl">
							Darasa Lako Hub
						</h1>
						<p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
							Access notes, exam papers, and study materials to excel in your
							studies.
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
