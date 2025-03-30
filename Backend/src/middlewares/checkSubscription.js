import UserSubscription from "../models/userSubscription.model.js";



const checkSubscription = async (req, res, next) => {
    try {


        console.log('req user',req.user)
        const subscription = await UserSubscription.findOne({
            userId: req.user._id,
            status:"active",
            endDate:{$gt:Date.now()}
        })
        if (!subscription) {
            return res.status(403).json({ success: false, message: "Subscription required" });
          }
      
          next()

        
    } catch (error) {
        console.log('middleware error',error)
        res.status(500).json({ success: false, message: "Internal server error" ,error:error.message});
    }



}

export default checkSubscription