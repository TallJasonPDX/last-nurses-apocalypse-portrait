
import { X, DollarSign } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface DonationLimitModalProps {
  onClose: () => void;
}

export default function DonationLimitModal({ onClose }: DonationLimitModalProps) {
  const { increaseGenerationsForDonation } = useUser();

  const handleDonation = () => {
    window.open("https://venmo.com/replace_rn", "_blank");
    increaseGenerationsForDonation();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="relative glass rounded-lg max-w-md w-full p-6 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center">
          <h3 className="text-xl text-white mb-4">Free Generations Exhausted</h3>
          
          <p className="text-white/80 mb-6">
            To ensure that we can afford for every nurse to have access to this free tool, 
            we have limited free generations at 10. However, we would love to offer more 
            with the help of your very modest financial support.
          </p>
          
          <p className="text-white/80 mb-6">
            Your donation of $2 - $5 helps us run this project and build more fun nurse experiences.
          </p>
          
          <button
            onClick={handleDonation}
            className="block w-full px-4 py-3 bg-[#3D95CE]/80 hover:bg-[#3D95CE] text-white rounded-md transition-transform hover:scale-105 mb-3 flex items-center justify-center space-x-2"
          >
            <DollarSign size={20} />
            <span>YES - I would love to generate more images and am happy to make a donation</span>
          </button>
          
          <button
            onClick={onClose}
            className="text-sm text-white/60 hover:text-white/80 transition-colors"
          >
            No Thanks - I understand but am not interested in donating at this time
          </button>
        </div>
      </div>
    </div>
  );
}

