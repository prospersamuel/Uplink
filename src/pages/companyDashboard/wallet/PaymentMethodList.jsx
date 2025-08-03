import { BsBank } from "react-icons/bs";
import { FiCheck, FiTrash2, FiEdit } from "react-icons/fi";

export default function PaymentMethodList({
  savedMethods,
  selectedMethod,
  setSelectedMethod,
  removePaymentMethod,
  onEdit,
  emptyState
}) {
  if (savedMethods.length === 0) {
    return emptyState || <p>No payment methods found</p>;
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
      {savedMethods.map((method, index) => (
        <div
          key={index}
          onClick={() => setSelectedMethod && setSelectedMethod(index)}
          className={`p-4 border rounded-lg cursor-pointer transition ${
            selectedMethod === index
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
              : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:bg-slate-900/30"
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BsBank className="text-slate-600 dark:text-slate-300 text-xl" />
              <div>
                <p className="font-medium">{method.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {method.details}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedMethod === index ? (
                <FiCheck className="text-blue-500 text-xl" />
              ) : (
                <>
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(index);
                      }}
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <FiEdit size={16} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePaymentMethod(index);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}