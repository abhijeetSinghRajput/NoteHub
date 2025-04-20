import Contribution from "../model/contribution.model.js";
import { buildContributionGrid } from "../utils/contribution.util.js";

export const getOneYearContribution = async (req, res) => {
  try {
    const userId = req.user._id;

    // ⏳ Read timezone offset in minutes (e.g. IST = -330)
    const offsetMinutes = parseInt(req.query.offsetMinutes || "0");

    // 🕐 Adjust current UTC date to user's local current time
    const now = new Date();
    const userNow = new Date(now.getTime() + offsetMinutes * 60000);

    // 📆 Calculate how many days to go back: 52 weeks + current weekday
    const weekdayOffset = userNow.getUTCDay();
    const daysToGoBack = 7 * 52 + weekdayOffset;

    const oneYearAgo = new Date(userNow);
    oneYearAgo.setUTCDate(oneYearAgo.getUTCDate() - daysToGoBack);
    oneYearAgo.setUTCHours(0, 0, 0, 0); // ⏪ Start of day a year ago

    // 🔍 Fetch all contributions between oneYearAgo and current local time
    const raw = await Contribution.find({
      userId,
      date: { $gte: oneYearAgo, $lte: userNow },
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

    const grid = buildContributionGrid(oneYearAgo, userNow, map);
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
