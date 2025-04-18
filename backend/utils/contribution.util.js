import Contribution from "../model/contribution.model.js";

export const addContribution = async(userId)=>{
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

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

// two methods one for one year and second for range