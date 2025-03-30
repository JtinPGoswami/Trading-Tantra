import jwt from "jsonwebtoken";

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token; // Get token from handshake
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    socket.user = decoded; // Attach user info to socket
    next();
  } catch (error) {
    return next(new Error("Authentication error: Invalid token"));
  }
};

export default authenticateSocket;
