import UserSubscription from "../models/userSubscription.model.js";
import jwt from "jsonwebtoken";
// Common middleware to check if the user has an active subscription
const checkSubscription = async (socket, next) => {
    try {
        // Assuming the socket data contains user information
        const token = socket.handshake.auth.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);


        // console.log(",......", decodedToken.userId)

  

        if (!decodedToken ) {
            return socket.emit("error", { message: "User information not provided" ,success: false});
        }

        // console.log('userId',decodedToken.userId)

        // Find the user's subscription status
        const subscription = await UserSubscription.findOne({
            userId: decodedToken.userId,
            status: "active",
            endDate: { $gt: Date.now() },  // Ensure the subscription is still active
        });
// console.log('subscription',subscription)
        if (!subscription) {
            return socket.emit("error", { message: "Subscription required", success: false });
        }

        // If subscription is valid, continue to the next middleware or event handler
        next();
    } catch (error) {
        console.error("Error in subscription check:", error);
        socket.emit("error", { message: "Error checking subscription" ,success: false});
    }
};

export default checkSubscription;
