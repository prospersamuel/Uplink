import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { NIGERIAN_BANKS } from "./NIGERIAN_BANKS";
import toast from "react-hot-toast";

export default function BankAccountForm({ onSave, initialData = {} }) {
  const [formData, setFormData] = useState({
    bankName: initialData.bankName || "",
    accountName: initialData.accountName || "",
    accountNumber: initialData.accountNumber || "",
  });
  const [bankSearch, setBankSearch] = useState("");
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const bankDropdownRef = useRef(null);

  useEffect(() => {
    if (bankSearch.trim() === "") {
      setFilteredBanks(NIGERIAN_BANKS.slice(0, 5));
    } else {
      const filtered = NIGERIAN_BANKS.filter(bank =>
        bank.name.toLowerCase().includes(bankSearch.toLowerCase())
      ).slice(0, 5);
      setFilteredBanks(filtered);
    }
  }, [bankSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(event.target)) {
        setShowBankDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectBank = (bank) => {
    setFormData({ ...formData, bankName: bank.name });
    setBankSearch(bank.name);
    setShowBankDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bankName || !formData.accountName || !formData.accountNumber) {
      toast.error("Please fill all bank details");
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative" ref={bankDropdownRef}>
        <label className="block text-sm font-medium mb-1">Bank Name</label>
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-500 bg-transparent outline-none focus:border-none focus:outline-none focus:outline-primary pr-10"
            placeholder="Search for your bank"
            value={bankSearch}
            onChange={(e) => {
              setBankSearch(e.target.value);
              setFormData({ ...formData, bankName: e.target.value });
              setShowBankDropdown(true);
            }}
            onFocus={() => setShowBankDropdown(true)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            onClick={() => setShowBankDropdown(!showBankDropdown)}
          >
            <FiChevronDown />
          </button>
        </div>
        {showBankDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 shadow-lg rounded-lg max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-600">
            {filteredBanks.length > 0 ? (
              filteredBanks.map((bank, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer"
                  onClick={() => selectBank(bank)}
                >
                  {bank.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-slate-500 dark:text-slate-400">
                No banks found
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Account Number</label>
        <input
          type="text"
          className="w-full p-3 rounded-lg outline-none focus:border-none focus:outline-none focus:outline-primary border border-slate-200 dark:border-slate-500 bg-transparent"
          placeholder="10-digit account number"
          value={formData.accountNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setFormData({ ...formData, accountNumber: value });
          }}
          maxLength={10}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Account Name</label>
        <input
          type="text"
          className="w-full p-3 rounded-lg outline-none focus:border-none focus:outline-none focus:outline-primary border border-slate-200 dark:border-slate-500 bg-transparent"
          placeholder="Enter account name"
          value={formData.accountName}
          onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
        disabled={!formData.bankName || !formData.accountName || !formData.accountNumber}
      >
        Save Bank Account
      </button>
    </form>
  );
}