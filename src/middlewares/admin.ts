const { userModel } = require("../models/user.model");

export const adminOnly = async (req, res, next) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(401).json({ message: "Do Login first" });
    }
    const userData = await userModel.findById(id);
    if (!userData) {
      return res
        .status(404)
        .json({ message: "Id is not matching with our databases" });
    }
    if (userData.role !== "admin") {
      return res.status(403).json({ message: "You are not an Admin" });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Problem in verifying that you are admin or not" });
  }
};
