import { FiCalendar } from "react-icons/fi";
import { LuCalendarDays } from "react-icons/lu";

export const BasicInfoStep = ({ campaignData, setCampaignData }) => {
  return (
    <div className="space-y-4 h-[44vh] overflow-auto">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Campaign Name *
        </label>
        <input
          type="text"
          value={campaignData.name}
          onChange={(e) => {
            setCampaignData({ ...campaignData, name: e.target.value });
          }}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. June Giveaway Campaign"
          autoFocus
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Campaign Description (Optional)
        </label>
        <textarea
          value={campaignData.description}
          onChange={(e) =>
            setCampaignData({ ...campaignData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description of your campaign goals and target audience"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Target URL *
        </label>
        <input
          type="url"
          value={campaignData.targetUrl}
          onChange={(e) =>
            setCampaignData({ ...campaignData, targetUrl: e.target.value })
          }
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://yourdomain.com/landing-page/"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Campaign Budget (₦)
        </label>
        <input
          type="number"
          value={campaignData.budget}
          onChange={(e) =>
            setCampaignData({ ...campaignData, budget: e.target.value })
          }
          required
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 5000"
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Initial Status
        </label>
        <select
          value={campaignData.status}
          onChange={(e) =>
            setCampaignData({ ...campaignData, status: e.target.value })
          }
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
      </div>
      
      <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-md">
        <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-4">
          Campaign Duration
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={campaignData.startDate}
                onChange={(e) =>
                  setCampaignData({
                    ...campaignData,
                    startDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              <input
                type="checkbox"
                checked={campaignData.hasEndDate}
                onChange={(e) =>
                  setCampaignData({
                    ...campaignData,
                    hasEndDate: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Set End Date
            </label>
            {campaignData.hasEndDate && (
              <div className="relative">
                <input
                  type="date"
                  value={campaignData.endDate}
                  min={campaignData.startDate}
                  onChange={(e) =>
                    setCampaignData({
                      ...campaignData,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};