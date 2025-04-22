import Contribution from "../model/contribution.model.js";
import { buildContributionGrid } from "../utils/contribution.util.js";

export const getOneYearContribution = async (req, res) => {
  try {
    const userId = req.user._id;

    const offsetMinutes = parseInt(req.query.offsetMinutes || "0");

    const now = new Date();
    const userNow = new Date(now.getTime() + offsetMinutes * 60000);

    const weekdayOffset = userNow.getDay(); // use local weekday
    const daysToGoBack = 7 * 52 + weekdayOffset;

    const oneYearAgo = new Date(userNow);
    oneYearAgo.setDate(oneYearAgo.getDate() - daysToGoBack);
    oneYearAgo.setHours(0, 0, 0, 0); // ✅ local start of day

    const raw = await Contribution.find({
      userId,
      date: { $gte: oneYearAgo, $lte: userNow },
    });

    const totalContribution = raw.reduce(
      (acc, { contributionCount }) => acc + contributionCount,
      0
    );

    const map = new Map();
    for (const { date, contributionCount } of raw) {
      const localDate = new Date(
        new Date(date).getTime() + offsetMinutes * 60000
      );
      const key = localDate.toISOString().slice(0, 10);
      map.set(key, contributionCount);
    }

    const todayKey = userNow.toISOString().slice(0, 10);
    const hasContributedToday = map.has(todayKey);

    const grid = buildContributionGrid(oneYearAgo, userNow, map);
    res.status(200).json({
      totalContribution,
      weeks: grid,
      hasContributedToday,
    });
  } catch (error) {
    console.error("Error in getOneYearContribution:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getContributionBetween = async (req, res) => {};
