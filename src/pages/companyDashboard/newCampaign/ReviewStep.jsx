import {FiCopy} from "react-icons/fi";

export function ReviewStep({ campaignData, copyReferralLink, calculateEarnings }) {
  return (
    <>
      <div className="space-y-6 h-[44vh] overflow-auto">
        <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-md">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
            Campaign Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                Basic Info
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Name:</span>{" "}
                  {campaignData.name}
                </p>
                <p>
                  <span className="text-slate-500">Status:</span>{" "}
                  {campaignData.status.charAt(0).toUpperCase() +
                    campaignData.status.slice(1)}
                </p>
                <p>
                  <span className="text-slate-500">Target URL:</span>{" "}
                  {campaignData.targetUrl || "Not set"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                Reward Settings
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Type:</span>{" "}
                  {campaignData.rewardType === "percentage"
                    ? `${campaignData.rewardAmount}% of purchase`
                    : campaignData.rewardType === "fixed"
                    ? `₦${campaignData.rewardAmount} fixed`
                    : campaignData.customReward}
                </p>
                <p>
                  <span className="text-slate-500">Trigger:</span> On{" "}
                  {campaignData.rewardTrigger}
                </p>
                {campaignData.rewardTrigger === 'task' ?
                
                  <textarea 
                  value={campaignData.customTask} 
                  rows={2} 
                  readOnly 
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" name="" id="">

                  </textarea> : ''
              }
              </div>
            </div>

            <div>
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                Campaign Rules
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Duration:</span>{" "}
                  {campaignData.startDate}{" "}
                  {campaignData.hasEndDate
                    ? `to ${campaignData.endDate}`
                    : "(No end date)"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                Referral Link
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={campaignData.targetUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border outline-none border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 text-sm truncate"
                />
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="p-2 text-slate-500 hover:text-blue-500"
                  title="Copy link"
                >
                  <FiCopy size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-100 dark:border-blue-800">
          <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
            Earnings Estimate
          </h4>
          <p className="text-sm text-blue-600 dark:text-blue-200">
            Based on your current settings: you will earn {calculateEarnings()}
          </p>
          <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
            This is just an estimate. Actual earnings may vary based on referral
            activity.
          </p>
        </div>
      </div>
    </>
  );
}
