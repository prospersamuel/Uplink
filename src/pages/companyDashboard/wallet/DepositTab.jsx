import { SiFlutter } from "react-icons/si";
import { FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";

export default function DepositTab({ amount, setAmount, handleFlutterPayment }) {
  return (
    <div className="p-6 space-y-6">
      <h3 className="text-xl font-bold">Deposit Funds</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Amount (₦)</label>
          <input
            type="number"
            className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 bg-transparent"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                setAmount(value);
              }
            }}
            min="1000"
            step="100"
          />
          <div className="text-xs text-slate-500 mt-2">
            Minimum deposit: ₦1,000
          </div>
        </div>

        <h4 className="font-medium">Payment Method</h4>
        <button
          onClick={() => {
            if (!amount || parseFloat(amount) < 10) {
              toast.error("Please enter an amount of at least ₦1,000");
              return;
            }
            handleFlutterPayment({
              amount: parseFloat(amount),
            });
          }}
          className={`w-full p-4 border rounded-lg flex items-center justify-between transition ${
            !amount || parseFloat(amount) < 10
              ? "border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
              : "border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer"
          }`}
          disabled={!amount || parseFloat(amount) < 10}
        >
          <div className="flex items-center gap-3">
            <SiFlutter className="text-blue-600 text-2xl" />
            <span>Flutterwave Payment</span>
          </div>
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}