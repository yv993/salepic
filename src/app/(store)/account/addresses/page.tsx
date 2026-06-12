import { getBuyer } from "@/lib/auth";
import { getSavedAddresses } from "@/features/account/queries";
import { AddressForm } from "@/components/account/address-form";
import { AddressDelete } from "@/components/account/address-delete";

export default async function AccountAddressesPage() {
  const buyer = await getBuyer();
  if (!buyer) return null;
  const addresses = await getSavedAddresses(buyer.userId);

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <h2 className="font-heading text-xl font-bold tracking-tight">Saved addresses</h2>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">
          Reused to prefill checkout. You can still edit them at checkout.
        </p>
        {addresses.length === 0 ? (
          <p className="surface rounded-2xl p-6 text-sm text-muted-foreground">
            No saved addresses yet — add one to speed up checkout.
          </p>
        ) : (
          <ul className="space-y-4">
            {addresses.map((a) => (
              <li key={a.id} className="surface flex items-start justify-between gap-3 rounded-2xl p-5">
                <div className="text-sm leading-relaxed">
                  <p className="flex items-center gap-2 font-medium">
                    {a.name}
                    {a.label && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {a.label}
                      </span>
                    )}
                    {a.isDefault && (
                      <span className="rounded-full bg-primary/12 px-2 py-0.5 text-xs font-medium text-primary">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}
                    <br />
                    {a.city}
                    {a.state ? `, ${a.state}` : ""} {a.postal}
                    <br />
                    {a.country}
                  </p>
                </div>
                <AddressDelete id={a.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <AddressForm />
    </section>
  );
}
