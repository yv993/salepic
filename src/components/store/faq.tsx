import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const QUESTIONS = [
  {
    id: "shipping",
    q: "How are the postcards shipped?",
    a: "Every order is packed flat in a rigid mailer to keep corners crisp, then sent by tracked mail. Most orders post within 2 business days of payment.",
  },
  {
    id: "stock",
    q: "Are these original prints?",
    a: "Yes — each design is hand-illustrated and printed in small batches on A6 (148 × 105 mm) recycled card stock with a soft matte finish.",
  },
  {
    id: "payment",
    q: "How do I pay?",
    a: "Place your order and you'll receive a secure payment link. Card payments via Payoneer Checkout are being finalised; in the meantime you'll get clear next steps the moment you check out.",
  },
  {
    id: "international",
    q: "Do you ship internationally?",
    a: "We do. Shipping is calculated at a flat rate and the studio sends worldwide. Delivery times vary by destination.",
  },
  {
    id: "returns",
    q: "What if my card arrives damaged?",
    a: "Reply to your confirmation email with a photo and we'll send a replacement straightaway — no card should arrive bent.",
  },
];

export function FaqSection() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <p className="stamp-label text-primary">Questions &amp; answers</p>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Good to know
        </h2>
      </div>
      <Accordion
        defaultValue={["shipping"]}
        className="surface mt-10 rounded-2xl px-5"
      >
        {QUESTIONS.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border-border/70 last:border-b-0"
          >
            <AccordionTrigger className="text-[15px]">{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
