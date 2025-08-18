import {FiBarChart2, FiCopy, FiLink, FiPlus} from "react-icons/fi";
import { LuCalendarDays } from "react-icons/lu";
import { VscPreview } from "react-icons/vsc";

export function ReviewStep({ campaignData, copyReferralLink, calculateEarnings }) {
  return (
    <>
      <div className="space-y-4 h-[44vh] overflow-auto">
        <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-md">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
            Campaign Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/70 h-fit dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600">
               <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
      <FiBarChart2 className="text-blue-500" />
      Basic Info
    </h4>
              <div className="space-y-0.5 text-sm">
                  <span className="text-slate-500">Name:</span>{" "}
                <div className=" h-9 px-3 py-2 border outline-none border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 text-sm truncate">
                  {campaignData.name || 'Not set'}
                </div>
                 <span className="text-slate-500">Status:</span>{" "}
                <div className=" h-9 px-3 py-2 border outline-none border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 text-sm truncate">
                  {campaignData.status.charAt(0).toUpperCase() +
                    campaignData.status.slice(1)}
                </div>

                 <span className="text-slate-500">Target URL:</span>{" "}
                <p className=" h-9 px-3 py-2 border outline-none border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 text-sm truncate">
                  {campaignData.targetUrl || "Not set"}
                </p>
                  <span className="text-slate-500">Description:</span>{" "}
                <textarea 
                  value={campaignData.description || 'Not set'} 
                  rows={2} 
                  readOnly 
                  className="border outline-none border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 text-sm truncate w-full px-3 py-2">
                  </textarea>
              </div>
            </div>

            <div className="space-y-2">
            <div className="bg-white/70 h-fit dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600">
               <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
      <LuCalendarDays className="text-blue-500" />
      Campaign Duration
    </h4>
              <div className="space-y-0.5 text-sm">
                  <span className="text-slate-500">Duration:</span>{" "}
                <p className=" h-9 px-3 py-2 border outline-none border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 text-sm truncate">
                  {campaignData.startDate || 'Not set'}{" "}
                  {campaignData.hasEndDate
                    ? `to ${campaignData.endDate || 'Not set'}`
                    : "(No end date)"}
                </p>
              </div>
            </div>

            <div className="bg-white/70 h-fit dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600">
               <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
      <FiPlus className="text-blue-500" />
      Reward Settings
    </h4>
              <div className="space-y-0.5 text-sm">
                  <span className="text-slate-500">Type:</span>{" "}
                <p className=" h-9 px-3 py-2 border outline-none border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 text-sm truncate">
                  {campaignData.rewardType === "percentage"
                    ? `${campaignData.rewardAmount || '0'}% of purchase`
                    : campaignData.rewardType === "fixed"
                    ? `₦${campaignData.rewardAmount || '0'} fixed`
                    : campaignData.customReward || 'Not set'}
                </p>
                  <span className="text-slate-500">Trigger:</span>{" "}
                  <div className="space-y-2">
                <p className=" h-9 px-3 py-2 border outline-none border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 text-sm truncate">
                  On {campaignData.rewardTrigger }
                </p>
                {campaignData.rewardTrigger === 'task' ?
                
                  <textarea 
                  value={campaignData.taskDescription || 'Not set'} 
                  rows={2} 
                  readOnly 
                  className="border outline-none border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700 text-sm truncate w-full px-3 py-2" name="" id="">

                  </textarea> : ''
              }
              </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-100 dark:border-blue-800">
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
