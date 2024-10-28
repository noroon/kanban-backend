import express from "express";
import authentication from "../middlewares/authentication";
import userController from "../controllers/user.controller";
import authorization from "../middlewares/authorization";

const router = express.Router();

router.get(
  "/users",
  authentication,
  authorization(["admin"]),
  userController.getUsers
);
router.get(
  "/profile",
  authentication,
  authorization(["user", "admin"]),
  userController.getProfile
);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.put(
  "/update/:id",
  authentication,
  authorization(["user", "admin"]),
  userController.updateUser
);
router.delete(
  "/delete/:id",
  authentication,
  authorization(["admin"]),
  userController.deleteUser
);

export { router as userRouter };
