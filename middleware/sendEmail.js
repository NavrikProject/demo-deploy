const sendEmail = (email, url, subject, txt) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `${subject}`,
    html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px;   font-size: 110%;">
    <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the PractiLearn Training Programme</h2>
    <p>Congratulations! You're almost set to start using. Just click the link below</p>
    <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
    <p>If the button doesn't work for any reason, you can also click on the link below:</p>
    <div>${url}</div>
    <p>After 15  minutes this link will be expired.</p>
    `,
  };
};

export default sendEmail;
