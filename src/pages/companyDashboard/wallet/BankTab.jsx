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
  const handleSave = (data) => {
    onSaveBankAccount(data);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">
          Add New Bank Account
        </h3>
      </div>

      <BankAccountForm 
        onSave={handleSave} 
      />

      {savedMethods.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Your Saved Accounts</h4>
          <PaymentMethodList
            savedMethods={savedMethods}
            removePaymentMethod={removePaymentMethod}
          />
        </div>
      )}
    </div>
  );
}