import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export const RewardSettingsStep = ({
  campaignData,
  setCampaignData,
  calculateEarnings,
}) => {
  const handleRewardAmountChange = (e, type) => {
    const value = Math.max(0, parseFloat(e.target.value)); // Ensure it's non-negative
    setCampaignData({
      ...campaignData,
      [type]: value,
    });
  };

  const handleCustomRewardChange = (e) => {
    setCampaignData({
      ...campaignData,
      customReward: e.target.value,
    });
  };
  const handleCustomTaskChange = (e) => {
    setCampaignData({
      ...campaignData,
      customTask: e.target.value,
    });
  };

  const handleRewardTriggerChange = (e) => {
    setCampaignData({
      ...campaignData,
      rewardTrigger: e.target.value,
    });
  };

  return (
    <div className="space-y-4 p-4 h-[44vh] overflow-auto dark:bg-slate-700/30 rounded-md">
      <h4 className="font-medium text-slate-700 dark:text-slate-300">
        Reward Settings
      </h4>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Reward Type
        </label>
        <Tabs
          selectedIndex={["fixed", "percentage", "custom"].indexOf(
            campaignData.rewardType
          )}
          onSelect={(index) =>
            setCampaignData({
              ...campaignData,
              rewardType: ["fixed", "percentage", "custom"][index],
            })
          }
        >
     <TabList className="flex space-x-1 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
  {["Fixed", "Percentage", "Custom"].map((tab, index) => (
    <Tab
      key={tab}
      className={`px-4 py-2 text-sm cursor-pointer font-medium rounded-md transition-all ${
        ["fixed", "percentage", "custom"][index] === campaignData.rewardType
          ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-white"
          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      }`}
    >
      {tab}
    </Tab>
  ))}
</TabList>

          <div className="mt-4">

             <TabPanel>
              <div className="flex items-center gap-4">
                <span className="text-slate-500">₦</span>
                <input
                  type="number"
                  min="1"
                  value={campaignData.rewardAmount}
                  onChange={(e) =>
                    handleRewardAmountChange(e, "rewardAmount")
                  }
                  className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-slate-500">per successful referral</span>
              </div>
            </TabPanel>
            
            <TabPanel>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={campaignData.rewardAmount}
                  onChange={(e) =>
                    handleRewardAmountChange(e, "rewardAmount")
                  }
                  className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-slate-500">% of referred purchase</span>
              </div>
              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Example: {calculateEarnings()}
              </div>
            </TabPanel>
           
            <TabPanel>
              <input
                type="text"
                value={campaignData.customReward}
                onChange={handleCustomRewardChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Free month, Store credit, etc."
              />
            </TabPanel>
          </div>
        </Tabs>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Reward Trigger
        </label>
        <select
          value={campaignData.rewardTrigger}
          onChange={handleRewardTriggerChange}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="signup">On sign up</option>
          <option value="purchase">On first purchase</option>
          <option value="task">On completing a task</option>
        </select>

        {campaignData.rewardTrigger === "task" && (
          <div className="mt-2">
            <input
              type="text"
              value={campaignData.customTask}
              onChange={handleCustomTaskChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description (e.g. 'Complete profile')"
            />
          </div>
        )}
      </div>
    </div>
  );
};