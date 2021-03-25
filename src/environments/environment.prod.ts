import { isRobot } from "app/functions";

export const environment = {
  production: true,
  isRobot: isRobot(navigator.userAgent)
};
