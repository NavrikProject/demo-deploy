export const notifications = [
  {
    id: "1",
    email: "keeprememberall@gmail.com",
    message: "Hello you have changed the password",
  },
];

export async function getNotifications(req, res, next) {
  return res.send(notifications);
}
