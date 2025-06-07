import Contribution from "../model/contribution.model.js";

const getStartAndEndDates = (offsetMinutes, userCurrentUTCDate) => {
  const utcNow = new Date(userCurrentUTCDate);
  const localTime = new Date(utcNow.getTime() + offsetMinutes * 60000); // shift to local time

  localTime.setHours(0, 0, 0, 0); // local start of day

  const endDate = new Date(localTime.getTime() - offsetMinutes * 60000); // convert local start → UTC

  const dayOfWeek = endDate.getUTCDay();
  const totalDaysBack = 364 + dayOfWeek;

  const startDate = new Date(endDate);
  startDate.setUTCDate(endDate.getUTCDate() - totalDaysBack);

  return { startDate, endDate };
};


export const getOneYearContribution = async (req, res) => {
  try {
    const { username } = req.params;
    const { currentDate, offset } = req.query;

    const userCurrentDate = new Date(currentDate);
    const offsetMinutes = parseInt(offset); // e.g. IST = 330

    const { startDate, endDate } = getStartAndEndDates(offsetMinutes, userCurrentDate);

    const rawContributions = await Contribution.find({
      username,
      date: {
        $gte: startDate.toISOString().slice(0, 10),
        $lte: endDate.toISOString().slice(0, 10),
      },
    });

    // Map contributions using UTC date string (YYYY-MM-DD)
    const map = new Map();
    rawContributions.forEach((e) => {
      const key = new Date(e.date).toISOString().slice(0, 10);
      map.set(key, e.count);
    });

    // Build result array with dates converted to local timezone
    const result = [];
    const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    for (let i = 0; i < days; i++) {
      const utcDate = new Date(startDate);
      utcDate.setUTCDate(startDate.getUTCDate() + i);

      const utcKey = utcDate.toISOString().slice(0, 10); // For DB match

      // Convert to local date
      const localDate = new Date(utcDate.getTime() + offsetMinutes * 60000);
      const localKey = localDate.toISOString().slice(0, 10); // For frontend

      result.push({ date: localKey, count: map.get(utcKey) || 0 });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getOneYearContribution\n", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
