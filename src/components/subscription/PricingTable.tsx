"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Building2, Check, Crown, Shield, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function PricingTable() {
  const { role } = useAuthStore();
  const [plans, setPlans] = useState<any>(null);
  // State untuk menyimpan durasi yang dipilih user untuk setiap paket
  const [selectedDuration, setSelectedDuration] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    // Ambil config dari backend
    api.get("/subscription/plans").then((res) => {
      setPlans(res.data);
      // Set default duration (opsi pertama)
      const defaults: any = {};
      Object.keys(res.data).forEach((key) => {
        if (res.data[key].pricing.length > 0) {
          defaults[key] = 0; // Index 0 (harga pertama)
        }
      });
      setSelectedDuration(defaults);
    });
  }, []);

  if (!plans) return <div className="text-center p-10">Loading plans...</div>;

  const handleUpgrade = (planId: string, priceObj: any) => {
    if (priceObj?.is_contact_required) {
      window.location.href = "mailto:sales@ai-hub.com";
      return;
    }
    // Logika Payment Gateway
    console.log(
      `Checkout: ${planId} - ${priceObj.label} - Rp ${priceObj.price_idr}`,
    );
    alert(
      `Mengarahkan ke pembayaran: Rp ${priceObj.price_idr.toLocaleString("id-ID")}`,
    );
  };

  // Helper untuk icon
  const getIcon = (id: string) => {
    if (id === "enterprise")
      return <Crown className="w-6 h-6 text-purple-400" />;
    if (id === "premium") return <Zap className="w-6 h-6 text-yellow-400" />;
    if (id === "corporate")
      return <Building2 className="w-6 h-6 text-blue-400" />;
    return <Shield className="w-6 h-6 text-zinc-400" />;
  };

  // Urutan Tampilan
  const order = ["free", "premium", "enterprise", "corporate"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
      {order.map((key) => {
        const tier = plans[key];
        if (!tier) return null;

        const isCurrent = role === key;
        const isPremium = key === "premium";
        const hasPricing = tier.pricing && tier.pricing.length > 0;

        // Ambil harga yang sedang dipilih user
        const selectedIndex = selectedDuration[key] || 0;
        const currentPrice = hasPricing ? tier.pricing[selectedIndex] : null;

        return (
          <Card
            key={key}
            className={`relative flex flex-col ${isPremium ? "border-blue-500 shadow-lg shadow-blue-900/20 bg-zinc-900" : "bg-zinc-900/50 border-zinc-800"}`}
          >
            {isPremium && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-full text-center">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1">
                  BEST SELLER
                </Badge>
              </div>
            )}

            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <div className="p-2 bg-zinc-800 rounded-lg">{getIcon(key)}</div>
                {isCurrent && (
                  <Badge
                    variant="outline"
                    className="border-green-500 text-green-500"
                  >
                    Active
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <CardDescription className="min-h-[40px]">
                {tier.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-6">
              {/* --- BAGIAN HARGA --- */}
              <div className="min-h-[80px]">
                {!hasPricing ? (
                  <span className="text-3xl font-bold text-white">Gratis</span>
                ) : currentPrice.is_contact_required ? (
                  <span className="text-2xl font-bold text-white">
                    Hubungi Kami
                  </span>
                ) : (
                  <div>
                    <div className="text-3xl font-bold text-white">
                      Rp {currentPrice.price_idr.toLocaleString("id-ID")}
                    </div>
                    {/* Bonus Badge jika ada (misal Enterprise bonus) */}
                    {currentPrice.bonus && (
                      <Badge
                        variant="secondary"
                        className="mt-2 text-[10px] bg-green-900 text-green-300 border-green-700"
                      >
                        🎁 {currentPrice.bonus}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* --- DROPDOWN DURASI (Hanya jika ada harga) --- */}
              {hasPricing && !currentPrice.is_contact_required && (
                <Select
                  value={selectedIndex.toString()}
                  onValueChange={(val) =>
                    setSelectedDuration({
                      ...selectedDuration,
                      [key]: parseInt(val),
                    })
                  }
                >
                  <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tier.pricing.map((p: any, idx: number) => (
                      <SelectItem key={idx} value={idx.toString()}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* --- TRIAL INFO (Untuk Free) --- */}
              {key === "free" && tier.trial_benefit && (
                <div className="p-2 bg-blue-900/20 border border-blue-900/50 rounded text-xs text-blue-200 text-center">
                  🎁 Bonus: Akses Premium{" "}
                  {tier.trial_benefit.minutes_per_month / 60} Jam/Bulan
                </div>
              )}

              {/* --- FITUR LIST --- */}
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                {tier.features.map((feature: string) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2 text-sm text-zinc-300"
                  >
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                {tier.excluded &&
                  tier.excluded.map((feature: string) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2 text-sm text-zinc-600"
                    >
                      <X className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className={`w-full ${isPremium ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                variant={isPremium ? "default" : "outline"}
                disabled={isCurrent}
                onClick={() => handleUpgrade(key, currentPrice)}
              >
                {isCurrent
                  ? "Paket Saat Ini"
                  : key === "corporate"
                    ? "Kontak Sales"
                    : "Pilih Paket"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
