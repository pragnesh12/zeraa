import CompanyCrousal from "@/components/company-crousal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ZeraaFeatures } from "@/components/ui/zeraa-features";
import { ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import faqs from "@/data/faqs.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="container mx-auto py-[11rem] text-center">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
            Streamline Your Workflow
            <span className="flex mx-auto gap-3 sm:gap-4">
              with{" "}
              <Image
                src={"/image.png"}
                alt="zeraa"
                width={400}
                height={80}
                className="h-14 sm:h-24 w-auto object-contain"
              />
            </span>
          </h1>

          <p className="text-xl sm:text-sm lg:text-xl font-semibold mb-10 mx-auto">
            <span className="text-gray-300">
              Empower Your <span className="text-gray-100">Team</span>{" "}
            </span>{" "}
            –
            <span className="text-gray-300">
              {" "}
              Your All-in-One Project Management Solution Awaits.
            </span>
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="mr-4">
              Get Started <ChevronRight size={18} />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" className="mr-4" variant={"outline"}>
              Learn More
            </Button>
          </Link>
        </section>

        {/* Key features section */}
        <section id="features" className="bg-gray-900 py-20 px-5 ">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center">
              Key Features
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {ZeraaFeatures.map((features, index) => (
                <Card key={index} className="bg-gray-800">
                  <CardContent className="pt-7">
                    <features.icon className="h-12 w-12 mb-4 text-purple-300" />
                    <h4 className="text-gray-200 font-medium">
                      {features.title}
                    </h4>
                    <p className="text-gray-100 font-medium">
                      {features.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted By Leaders Section*/}
        <section id="Trusted By" className="py-20 px-5">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center">
              Trusted By Leaders
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <CompanyCrousal />
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section id="faqs" className="bg-gray-900 py-20 px-5">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center">
              Frequently Asked Questions
            </h3>
            {faqs.map(({ id, question, answer }) => (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`item-${id}`} key={id}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </section>

        {/* Call To Action Button */}
        <section id="Trusted By" className="py-20 px-10 text-center">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-6">
              Stay Ahead with Zeraa!
            </h3>
            <p className=" text-xl mb-12">
              Track progress, manage tasks, and lead projects like a pro—get
              started now.
            </p>
            <Link href="/onboarding">
              <Button size={"lg"} className="animate-bounce ">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
