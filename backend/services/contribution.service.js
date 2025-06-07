import Contribution from "../model/contribution.model.js";

export const addContribution = async ( username, userUTCDateTime, offsetMinutes ) => {
  const utcDate = new Date(userUTCDateTime); // already UTC, no shifting

  // Determine user's "local" calendar date in UTC
  const localTime = new Date(utcDate.getTime() + offsetMinutes * 60000); // move into user's timezone
  localTime.setHours(0, 0, 0, 0); // set to local 00:00

  const dateKey = new Date(localTime.getTime() - offsetMinutes * 60000); // shift back to UTC

  const contribution = await Contribution.findOneAndUpdate(
    { username, date: dateKey },
    { $inc: { count: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return contribution;
};
