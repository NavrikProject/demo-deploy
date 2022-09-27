const rescheduleEmail = (email, subject, url, txt) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `${subject}`,
    html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px;   font-size: 110%;">
    <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Practiwiz Training Programme</h2>
    <p>Sorry you have missed a mentor session. Please login into portal and reschedule your mentor session</p>
    <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
    `,
  };
};

export default rescheduleEmail;
