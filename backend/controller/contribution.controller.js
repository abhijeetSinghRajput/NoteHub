import Contribution from "../model/contribution.model.js";

export const getOneYearContribution = async (req, res)=>{
    try{
        const userId = req.user._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const oneYearAgo = new Date(today);
        oneYearAgo.setDate(oneYearAgo.getDate() - 364);

        const raw = await Contribution.find({
            userId,
            date: {$gte: oneYearAgo, $lte: today},
        })
        console.log(raw);

        res.status(200).json({row});
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Internal Server error"});
    }
}

export const getContributionBetween = async (req, res)=>{

}