export const jobPostEmailTemplate = (email, username) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `Job posted successfully`,
    html: `
  <section>
      <div
        style="
          font-size: 19px;
          font-family: poppins;
          max-width: 700px;
          margin: auto;
          padding: 50px 20px;
        "
      >
        <h2
          style="
            text-transform: uppercase;
            color: teal;
            text-align: center;
            padding-bottom: 30px;
          "
        >
          Welcome to the Practiwiz Training Programme
        </h2>
        <p>Hi <b>${username}</b>,</p>
        <p>
          Congratulations! You have successfully a posted a job in the 
          our<b> Practiwiz</b>.
        </p>
        <p>You can login to practiwiz and edit the job post.</p>
        <p>We look forward to serving you better!</p>
        <p>
          If you have any questions, reply back to this email and we'll be happy
          to help.
        </p>
        <p>Thanks, Practiwiz</p>
        <img
          width="300px"
          height="100px"
          src="https://res.cloudinary.com/droa7dncb/image/upload/v1665987569/practiwiz-logo3_xifxbc.png"
          alt="Logo"
        />
      </div>
    </section>
    `,
  };
};
export const jobApplicationAppliedEmail = (email, username, jobName) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: ` Confirming your job application`,
    html: `
  <section>
     <div
       style="
         font-size: 19px;
         font-family: poppins;
         max-width: 700px;
         margin: auto;
         padding: 50px 20px;
       "
     >
       <h2
         style="
           text-transform: uppercase;
           color: teal;
           text-align: center;
           padding-bottom: 30px;
         "
       >
         Welcome to the Practiwiz Training Programme
       </h2>
       <p>Hi <b>${username}</b>,</p>
       <p>
        Please find below an automated confirmation email to show that you have applied for the position of <b> ${jobName}</b>.
       </p>
       <p>You will receive a response to your application within 5-7 days.</p>
       <p>Please log into your account and check the status of your application in your profile.</p>
       <p>We wish you success in applying for the position.</p>
       <p>We look forward to hearing from you.</p>
       <p>
         If you have any questions, reply back to this email and we'll be happy
         to help.
       </p>
       <p>Best regards,</p>
       <p>HR department</p>
       <p>Thanks, Practiwiz</p>
       <img
         width="300px"
         height="100px"
         src="https://res.cloudinary.com/droa7dncb/image/upload/v1665987569/practiwiz-logo3_xifxbc.png"
         alt="Logo"
       />
     </div>
   </section>
    `,
  };
};
