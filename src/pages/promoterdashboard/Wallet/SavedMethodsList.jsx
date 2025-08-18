import { BsBank } from "react-icons/bs";
import { FiCheck, FiTrash2, FiPlus } from "react-icons/fi";

export default function SavedMethodsList({ 
  methods, 
  selectedMethod, 
  onSelect, 
  onRemove, 
  emptyState,
  showRemoveOnly = false
}) {
  if (methods.length === 0 && emptyState) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-lg">
        {emptyState.icon}
        <p className="text-slate-500">{emptyState.message}</p>
        <button
          onClick={emptyState.action}
          className="mt-3 text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 mx-auto"
        >
          <FiPlus size={14} /> {emptyState.actionText}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
      {methods.map((method, index) => (
        <div
          key={index}
          onClick={!showRemoveOnly ? () => onSelect(index) : undefined}
          className={`p-4 border rounded-lg transition ${
            !showRemoveOnly && selectedMethod === index
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
              : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:bg-slate-900/30"
          } ${!showRemoveOnly ? 'cursor-pointer' : ''}`}
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
            {!showRemoveOnly && selectedMethod === index ? (
              <FiCheck className="text-blue-500 text-xl" />
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <FiTrash2 size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}