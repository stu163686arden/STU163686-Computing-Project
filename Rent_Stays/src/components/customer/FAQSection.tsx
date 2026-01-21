import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What documents do I need to apply?",
    answer:
      "You'll need a valid student ID or enrollment letter, proof of income or guarantor details, a copy of your ID/passport, and a completed application form. International students may need additional documentation.",
  },
  {
    question: "Are utilities included in the rent?",
    answer:
      "Most of our properties include water, electricity (with a fair usage policy), and WiFi in the rental price. Some premium units may have additional utility costs which are clearly stated in the listing.",
  },
  {
    question: "What is the lease duration?",
    answer:
      "We offer flexible lease terms to accommodate the academic calendar. Standard leases are 11 months, but we also offer semester-based leases and short-term stays during summer months.",
  },
  {
    question: "Is there a security deposit?",
    answer:
      "Yes, a refundable security deposit equal to one month's rent is required. This is fully refundable upon move-out, subject to the property being in good condition.",
  },
  {
    question: "Can I view the property before signing?",
    answer:
      "Absolutely! We encourage all prospective tenants to schedule a viewing. You can book a viewing directly through our platform or contact our team for a virtual tour option.",
  },
  {
    question: "What amenities are typically included?",
    answer:
      "Our properties typically include furnished rooms, study desks, high-speed WiFi, laundry facilities, and secure access. Many also feature common areas, gyms, and bike storage.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about renting with Rent&Stay
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
