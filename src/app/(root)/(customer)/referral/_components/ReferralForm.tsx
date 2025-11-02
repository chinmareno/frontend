"use client";

import { claimReferral } from "@/app/actions/coupon/claimReferral";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ReferralForm = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const handleClick = async () => {
    setIsLoading(true);
    const coupon = await claimReferral({
      referral_code: code,
    });
    if (coupon) {
      toast.success("Referral code applied successfully");
      return router.push("/");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-2">
      <h2>Referral code</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter referral code"
        className="w-full border px-3 py-2 rounded-md"
      />
      <Button
        onClick={handleClick}
        disabled={isLoading || code.length === 0}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? "Applying..." : "Apply"}
      </Button>

      <div className="mt-4 items-center flex">
        <p className="text-sm text-gray-600">Don’t have any referral code?</p>
        <Button
          onClick={() => router.push("/")}
          className="w-fit px-2"
          variant="link"
        >
          Continue without referral
        </Button>
      </div>
    </div>
  );
};

export default ReferralForm;
