import Contribution from "../model/contribution.model.js";
import { buildContributionGrid } from "../utils/contribution.util.js";

export const getOneYearContribution = async (req, res) => {
  try {
    const userId = req.user._id;

    // ⏳ Read timezone offset in minutes (e.g. IST = -330)
    const offsetMinutes = parseInt(req.query.offsetMinutes || "0");

    // 🕐 Adjust current UTC date to user's local midnight
    const now = new Date();
    const userToday = new Date(now.getTime() + offsetMinutes * 60000);
    userToday.setUTCHours(0, 0, 0, 0);

    // 📆 Calculate how many days to go back: 52 weeks + current weekday
    const weekdayOffset = userToday.getUTCDay();
    const daysToGoBack = 7 * 52 + weekdayOffset;

    const oneYearAgo = new Date(userToday);
    oneYearAgo.setUTCDate(oneYearAgo.getUTCDate() - daysToGoBack);
    oneYearAgo.setUTCHours(0, 0, 0, 0);

    // 🔍 Fetch all contributions between oneYearAgo and today
    const raw = await Contribution.find({
      userId,
      date: { $gte: oneYearAgo, $lte: userToday },
    });

    const totalContribution = raw.reduce(
      (acc, { contributionCount }) => acc + contributionCount,
      0
    );

    // 🧠 Format contributions to map
    const map = new Map();
    for (const { date, contributionCount } of raw) {
      const key = new Date(date).toISOString().slice(0, 10);
      map.set(key, contributionCount);
    }

    const grid = buildContributionGrid(oneYearAgo, userToday, map);
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
