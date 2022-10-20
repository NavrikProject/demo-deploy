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

export const traineeFeedbackVideoUploadEmail = (
  traineeEmail,
  traineeName,
  courseName
) => {
  return {
    to: `${traineeEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Upload video feedback",
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
        <p>Hi <b>${traineeName}</b>,</p>
        <p>
          You have successfully completed the <b>${courseName}</b> course
          on our platform.
        </p>
        <p>Now it's time to take feedback from you
        </p>
        <p>Please record a Video on the Course about 1 minute. we are giving the Three topics to create the video</p>
        <ul>
          <li>What is BA ?</li>
        <li>Key roles in BA ?</li>
        <li>Functionality in BA ?</li>
      </ul>
      <p>Send your created video to this email address <b>support@practiwiz.com</b>, using <a href="https://wetransfer.com/" target="_blank">We Transfer</a>. After this you will receive certificate and course completion price along with the book. </p> 
        <p>
          If you have any questions, reply back to this email and we'll be happy
          to help.
        </p>
        <p>Thanks, Practiwiz</p>
        <img width="300px" height="100px"
          src="https://res.cloudinary.com/droa7dncb/image/upload/v1665987569/practiwiz-logo3_xifxbc.png"
          alt="Logo"
        />
      </div>
    </section>
    `,
  };
};
export const traineeMentorAttendEmail = (
  traineeEmail,
  traineeName,
  courseName
) => {
  return {
    to: `${traineeEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Attend Mentor Feedback",
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
        <p>Hi <b>${traineeName}</b>,</p>
        <p>
          You have successfully completed the <b>${courseName}</b> course
          on our platform.
        </p>
        <p>Now it's time to attend the mentor session
        </p>
        <p>You can book a session with mentor for free!</p>
      <p>Here the redeem code for the mentor session is: <b>KSDLKGJL</b></p> 
      <p>You can find the mentors here <a href="https://happy-tree-0192a720f.1.azurestaticapps.net/mentors-club">Mentors Club</a></p>
        <p>
          If you have any questions, reply back to this email and we'll be happy
          to help.
        </p>
        <p>Thanks, Practiwiz</p>
        <img width="300px" height="100px"
          src="https://res.cloudinary.com/droa7dncb/image/upload/v1665987569/practiwiz-logo3_xifxbc.png"
          alt="Logo"
        />
      </div>
    </section>
    `,
  };
};
