import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";

export const StepNavigation = ({ 
  currentStep, 
  steps, 
  prevStep, 
  nextStep, 
  handleSubmit 
}) => {
  return (
    <div className="mt-6 flex justify-between">
      {currentStep > 0 ? (
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
        >
          <FiChevronLeft size={16} />
          Back
        </button>
      ) : (
        <div></div>
      )}

      {currentStep < steps.length - 1 ? (
        <button
          type="button"
          onClick={nextStep}
          className="px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          Next
          <FiChevronRight size={16} />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <FiPlus size={16} />
          Create Campaign
        </button>
      )}
    </div>
  );
};