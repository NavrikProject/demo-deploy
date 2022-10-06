export const emailActivationTemplate = (email, subject, username, url, txt) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `${subject}`,
    html: `
   <div
        style="
          font-size: 19px;
          font-family: poppins;
          max-width: 700px;
          margin: auto;
          padding: 50px 20px;
        "
      >
        <h1
          style="
            text-align: center;
            text-transform: uppercase;
            color: teal;
            padding-bottom: 30px;
          "
        >
          Welcome to the Practiwiz Training Programme
        </h1>
        <p>Hi <b>${username}</b>,</p>
        <p>We're pleased to see you onboard with Practiwiz.</p>
        <p>
          Please click the following link and/or the "Activate Account" button
          below for activation.
        </p>
        <a
          href="${url}"
          style="
            text-decoration: none;
            padding: 10px 20px;
            background-color: rgb(48, 130, 238);
            color: white;
            border-radius: 5px;
          "
          >${txt}</a
        >
        <p>We look forward to seeing your progress with our service!</p>
        <p>
          If the button doesn't work for any reason, Please click the blow link
          below.
        </p>
        <div>${url}</div>
        <p>After 15 minutes this link will be expired.</p>
        <p>
          If you have any questions, reply back to this email and we'll be happy
          to help.
        </p>
        <p>Thanks, Practiwiz</p>
        <img
          src="https://navrikimages.blob.core.windows.net/newcontainer/practiwiz-logo3.png"
          alt="Logo"
        />
      </div>
    `,
  };
};

export const appointmentBookedTraineeEmailTemplate = (
  traineeEmail,
  username,
  mentorName,
  date,
  slotTime
) => {
  return {
    to: `${traineeEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Appointment booked successfully",
    html: `
    <div
        style="
          font-size: 19px;
          font-family: poppins;
          max-width: 700px;
          margin: auto;
          padding: 50px 20px;
        "
      >
        <h1 style="text-transform: uppercase; color: teal; text-align: center; padding-bottom: 30px;">
          Welcome to the Practiwiz Training Programme
        </h1>
        <p>Hi <b>${username}</b>,</p>
        <p>
          You have successfully booked a session with a <b>${mentorName}</b> on
          <b>${date}</b> and time is <b>${slotTime}</b>
        </p>
        <p>We look forward to seeing your progress with our service!</p>
        <p>
          If you have any questions, reply back to this email and we'll be happy
          to help.
        </p>
        <p>Thanks, Practiwiz</p>
        <img
          src="https://navrikimages.blob.core.windows.net/newcontainer/practiwiz-logo3.png"
          alt="Logo"
        />
      </div>
    `,
  };
};

export const appointmentBookedMentorEmailTemplate = (
  mentorEmail,
  mentorName,
  traineeName,
  date,
  slotTime
) => {
  return {
    to: `${mentorEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Appointment booked successfully",
    html: `
    <div
        style="
          font-size: 19px;
          font-family: poppins;
          max-width: 700px;
          margin: auto;
          padding: 50px 20px;
        "
      >
        <h1
          style="
            text-transform: uppercase;
            color: teal;
            text-align: center;
            padding-bottom: 30px;
          "
        >
          Welcome to the Practiwiz Training Programme
        </h1>
        <p>Hi <b>${mentorName}</b>,</p>
        <p>
          Some one has successfully booked a session with a you and trainee name
          is
          <b>${traineeName}</b> on <b>${date}</b> and time is <b>${slotTime}</b>
        </p>
        <p>
          Go to your profile in the Practiwiz application to see the all session
          details
        </p>
        <p>We look forward to seeing your progress with our service!</p>
        <p>
          If you have any questions, reply back to this email and we'll be happy
          to help.
        </p>
        <p>Thanks, Practiwiz</p>
        <img
          src="https://navrikimages.blob.core.windows.net/newcontainer/practiwiz-logo3.png"
          alt="Logo"
        />
      </div>
    `,
  };
};
