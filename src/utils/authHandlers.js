import { openNotification } from "components/Form";

/**
 * Handle SSO login attempt
 * Currently shows a notification that SSO server is not available
 */
export const handleSSOLogin = () => {
  openNotification({
    title: "Connection Error",
    message: "Could not connect to SSO server",
  });
};
