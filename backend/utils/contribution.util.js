import Contribution from "../model/contribution.model.js";
import User from "../model/user.model.js";

export const addContribution = async (userId) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // 📌 Update Contribution
    await Contribution.updateOne(
      { userId, date: today },
      { $inc: { contributionCount: 1 } },
      { upsert: true }
    );

    // 📈 Streak Logic
    const user = await User.findById(userId);
    const lastDate = user.lastContributionDate;
    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);

    if (
      !lastDate ||
      new Date(lastDate).toISOString().slice(0, 10) <
        yesterday.toISOString().slice(0, 10)
    ) {
      user.currentStreak = 1; // Reset streak
    } else if (
      new Date(lastDate).toISOString().slice(0, 10) ===
      yesterday.toISOString().slice(0, 10)
    ) {
      user.currentStreak += 1; // Continue streak
    } // else: same day update, don't touch currentStreak

    user.lastContributionDate = today;
    if (user.currentStreak > user.maxStreak) {
      user.maxStreak = user.currentStreak;
    }

    await user.save();
    return true;
  } catch (error) {
    console.error("Contribution update failed:\n", error.message);
    return false;
  }
};

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
