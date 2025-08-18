import { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { NIGERIAN_BANKS } from "../../companyDashboard/wallet/NIGERIAN_BANKS";

export default function BankDropdown({ bankName, onChange }) {
  const [bankSearch, setBankSearch] = useState("");
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectBank = (bank) => {
    onChange(bank.name);
    setBankSearch(bank.name);
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium mb-1">Bank Name</label>
      <div className="relative">
        <input
          type="text"
          className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-500 bg-transparent outline-none focus:border-none focus:outline-none focus:outline-primary pr-10"
          placeholder="Search for your bank"
          value={bankSearch}
          onChange={(e) => {
            setBankSearch(e.target.value);
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <FiChevronDown />
        </button>
      </div>
      {showDropdown && (
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
  );
}