export const sendRemainderOnTheDay = (
  email,
  subject,
  url,
  txt,
  googleFormLink
) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
    subject: `${subject}`,
    html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px;   font-size: 110%;">
    <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Practiwiz Mentorship and Training Programme</h2>
    <p>Awesome! You're almost ready to join in the meeting. Just click the link below</p>
    <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
    <a href=${googleFormLink} style="background: lightblue; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
    <p>If the button doesn't work for any reason, you can also click on the link below:</p>
    <div>${url}</div>
    <p>After 15  minutes this link will be expired.</p>
    `,
  };
};

export const sendFeedbackEmail = (email, subject, txt) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
    subject: `${subject}`,
    html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px;  font-size: 110%;"> <p>You have ${txt}</p></div>`,
  };
};
