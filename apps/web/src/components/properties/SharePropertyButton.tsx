import { Share2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

interface Props {
  propertyId: string;
  propertyTitle?: string;
}

export function SharePropertyButton({ propertyId, propertyTitle }: Props) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/properties/${propertyId}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Property link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <button
      onClick={share}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 text-sm"
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? "Copied!" : "Share"}
    </button>
  );
}