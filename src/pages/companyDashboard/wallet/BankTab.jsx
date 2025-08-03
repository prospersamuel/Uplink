import { useState } from "react";
import { BsBank } from "react-icons/bs";
import BankAccountForm from "./BankAccountForm";
import PaymentMethodList from "./PaymentMethodList";

export default function BankTab({
  savedMethods,
  removePaymentMethod,
  setActiveTab,
  onSaveBankAccount
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleSave = (data) => {
    onSaveBankAccount(data);
    if (isEditing) {
      setIsEditing(false);
      setEditData(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">
          {isEditing ? "Edit Bank Account" : "Add New Bank Account"}
        </h3>
        <button
          onClick={() => {
            setActiveTab("withdraw");
            setIsEditing(false);
          }}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to Withdraw
        </button>
      </div>

      <BankAccountForm 
        onSave={handleSave} 
        initialData={editData || {}} 
      />

      {savedMethods.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Your Saved Accounts</h4>
          <PaymentMethodList
            savedMethods={savedMethods}
            removePaymentMethod={removePaymentMethod}
            onEdit={(index) => {
              setIsEditing(true);
              setEditData(savedMethods[index].fullDetails);
            }}
          />
        </div>
      )}
    </div>
  );
}