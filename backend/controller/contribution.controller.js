import Contribution from "../model/contribution.model.js";
import { buildContributionGrid } from "../utils/contribution.util.js";

export const getOneYearContribution = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔒 Normalize `today` to 00:00 UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // 🔁 Calculate how many days to go back: 52 full weeks + current weekday (Sunday=0)
    const weekdayOffset = today.getUTCDay();
    const daysToGoBack = 7 * 52 + weekdayOffset;

    const oneYearAgo = new Date(today);
    oneYearAgo.setUTCDate(oneYearAgo.getUTCDate() - daysToGoBack);
    oneYearAgo.setUTCHours(0, 0, 0, 0);

    // 🔍 Query all contributions in range
    const raw = await Contribution.find({
      userId,
      date: { $gte: oneYearAgo, $lte: today },
    });
    const totalContribution = raw.reduce((acc, { contributionCount }) => {
      return acc + contributionCount;
    }, 0);

    // 🧠 Format date for keying (YYYY-MM-DD)
    const map = new Map();
    for (const { date, contributionCount } of raw) {
      const key = new Date(date).toISOString().slice(0, 10);
      map.set(key, contributionCount);
    }

    const grid = buildContributionGrid(oneYearAgo, today, map);
    res.status(200).json({
      totalContribution,
      weeks: grid,
    });
  } catch (error) {
    console.error("Error in getOneYearContribution:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getContributionBetween = async (req, res) => {};
