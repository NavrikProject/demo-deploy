const updateEmail = (email, subject, txt) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `${subject}`,
    html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px;   font-size: 110%;"> <p>Congratulations! You have ${txt}</p></div>`,
  };
};

export default updateEmail;
