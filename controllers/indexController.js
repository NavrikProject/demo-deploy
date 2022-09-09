export const homeRoute = (req, res) => {
  const time = new Date().getTime();
  return res.send({
    message: `The server is working on fine with this time ${time} and date ${new Date().toDateString()}`,
  });
};
