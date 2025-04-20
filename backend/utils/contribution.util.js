import Contribution from "../model/contribution.model.js";

export const addContribution = async(userId)=>{
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        await Contribution.updateOne(
            { userId, date: today },
            {$inc: {contributionCount: 1}},
            {upsert: true}
        );
        return true;
    } catch (error) {
        console.error("Contribution update failed:\n", error.message);
        return false;
    }
}

export const buildContributionGrid = (startDate, endDate, contributionMap) => {
  const result = [];
  let week = [];

  const date = new Date(startDate);
  date.setUTCHours(0, 0, 0, 0);
  while (date <= endDate) {
    const dateStr = date.toISOString().slice(0, 10);
    const contributionCount = contributionMap.get(dateStr) || 0;
    week.push({ date: dateStr, contributionCount });

    if (week.length === 7) {
      result.push(week);
      week = [];
    }

    date.setDate(date.getDate() + 1);
  }
  if (week.length) result.push(week);

  return result;
};
// two methods one for one year and second for range
