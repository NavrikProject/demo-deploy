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
      <p>Send your created video to this email address <b>support@practiwiz.com</b>, using <a href="https://wetransfer.com/" target="_blank">We Transfer</a>. After this you will receive certificate and course completion price along with the book or T shirt. </p> 
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

export const traineeMentorAttendEmailCourseComplete = (
  traineeEmail,
  traineeName,
  courseName
) => {
  return {
    to: `${traineeEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Attend Mentor session",
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

export const traineeFeedbackEmail = (traineeEmail, username) => {
  return {
    to: `${traineeEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Thank you for your feedback",
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
          Thank you for submitting your feedback and suggestions. We really
          appreciate your input and will take it into consideration for our
          future product updates.
        </p>
        <p>
          Your feedback has helped us serve our customers better in the past, so
          we really appreciate you taking the time to provide it.
        </p>
        <p>And also fill this google form to serve us better in the future. <a href="https://docs.google.com/forms/d/e/1FAIpQLSelTbmSfmdojU6wHvO17L4UUemYlpnufWaXMcSXI4YXkkxhXA/viewform?usp=sf_link">Google form feedback</a></p>
        <p>
          Please feel free to reach out if you have any other questions or
          concerns.
        </p>
        <p>We look forward to seeing your progress with our service!</p>
        <p>
          If you have any questions, reply back to this email and we'll be happy
          to help.
        </p>
        <p>We’ll be in touch soon!</p>
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
export const traineeRefundEmailTemplate = (traineeEmail, username) => {
  return {
    to: `${traineeEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Successfully initiated refund",
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
          We are happy to inform you that your refund has been processed. We
          appreciate the opportunity to serve you and hope that you will allow
          us to do so in the future.
        </p>
        <p>
          If you have any questions, reply back to this email and we'll be happy
          to help.
        </p>
        <p>We’ll be in touch soon!</p>
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

export const traineeProfileUpdateEmailTemplate = (email, username, details) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `${details} added successfully`,
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
        <p>Thank you for submitting the ${details} details,.</p>
        <p>
          Your privacy is most important to us, and we won't share any of your
          personal details or information with anybody else.
        </p>
        <p>
          If you have any questions, reply back to this email and we'll be happy
          to help.
        </p>
        <p>We’ll be in touch soon!</p>
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

export const traineeBookingDateChangeEmailTemplate = (
  userEmail,
  userFullname,
  mentorFullname,
  oldDate,
  changedDate
) => {
  return {
    to: `${userEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `Mentor Booking date changed successfully`,
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
        <p>Hi <b>${userFullname}</b>,</p>
        <p>
          We thank you for taking the time to book an appointment with us and we
          are glad that you have chosen our mentor ${mentorFullname}. Unfortunately, You have
          changed your booking date from <b>${oldDate}</b> to <b>${changedDate}</b>. We
          apologize for any inconvenience this may have caused.Please ensure to
          check your emails for any other updates regarding your mentor booking.
        </p>
        <p>
          If you have any questions, reply back to this email and we'll be happy
          to help.
        </p>
        <p>We’ll be in touch soon!</p>
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

export const traineeBookingRemainderEmailTemplate = (
  email,
  username,
  mentorName,
  date,
  slotTime,
  time,
  url
) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `Remainder for the mentor session`,
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
          You have successfully booked a session with a <b>${mentorName}</b> on
          <b>${date}</b> and time is <b>${slotTime}</b> will begin in the
          <b>${time}</b> minutes
        </p>
        <button
          style="
            background-color: #085cca;
            border: none;
            color: white;
            padding: 10px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 7px;
          "
        >
          <a
            style="text-decoration: none; font-size: 17px; color: white"
            href="${url}"
            >Join Now</a
          >
        </button>
        <p>or if it doesn't work try the link below</p>
        <p>${url}</p>
        <p>if you are facing any issue while joining please contact through email.</p>
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

export const traineeRescheduleEmailSentTemplate = (
  email,
  username,
  mentorName,
  date,
  slotTime,
  url
) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `Reschedule your mentor session`,
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
          You have not attended a session with a <b>${mentorName}</b> on
          <b>${date}</b> and time is <b>${slotTime}</b>.
        </p>
        <p>You will find the link below to rescheduled for the mentor session for only one time.</p>
        <button
          style="
            background-color: #085cca;
            border: none;
            color: white;
            padding: 10px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 7px;
          "
        >
          <a
            style="text-decoration: none; font-size: 17px; color: white"
            href="${url}"
            >Reschedule Mentor session</a
          >
        </button>
        <p>or if it doesn't work try the link below</p>
        <p>${url}</p>
        <p>if you are facing any issue while joining please contact through email.</p>
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

export const traineeRescheduledUpdatedEmailTemplate = (
  userEmail,
  traineeName,
  mentorName,
  date,
  slotTime
) => {
  return {
    to: `${userEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Appointment date rescheduled",
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
        <h2 style="text-transform: uppercase; color: teal; text-align: center; padding-bottom: 30px;">
          Welcome to the Practiwiz Training Programme
        </h2>
        <p>Hi <b>${traineeName}</b>,</p>
        <p>
          You have successfully rescheduled your booking a date and session with a <b>${mentorName}</b> new updated booking date is
          <b>${date}</b> and new updated time is <b>${slotTime}</b>
        </p>
        <p>This time don't miss the session, you can not modify the appointment date or rescheduling of mentor session </p>
        <p>We look forward to seeing your progress with our service!</p>
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
    `,
  };
};
export const traineeRescheduledMentorUpdatedEmailTemplate = (
  userEmail,
  traineeName,
  mentorName,
  date,
  slotTime
) => {
  return {
    to: `${userEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Appointment date rescheduled",
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
        <h2 style="text-transform: uppercase; color: teal; text-align: center; padding-bottom: 30px;">
          Welcome to the Practiwiz Training Programme
        </h2>
        <p>Hi <b>${traineeName}</b>,</p>
        <p> Your missed mentor session has been rescheduled by the mentor
          new booking date and session with a <b>${mentorName}</b> new updated booking date is
          <b>${date}</b> and new updated time is <b>${slotTime}</b>
        </p>
        <p>This time don't miss the session, you can not modify the appointment date or rescheduling of mentor session </p>
        <p>We look forward to seeing your progress with our service!</p>
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
    `,
  };
};
export const traineeLiveClassRemainderEmailTemplate = (
  email,
  username,
  mentorName,
  date,
  slotTime,
  time,
  url
) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `Remainder for the live class`,
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
           <b>${mentorName}</b> has setup live instructor class for the doubts for clearing on 
          <b>${date}</b> and time is <b>${slotTime}</b> will begin in the
          <b>${time}</b> minutes
        </p>
        <button
          style="
            background-color: #085cca;
            border: none;
            color: white;
            padding: 10px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 7px;
          "
        >
          <a
            style="text-decoration: none; font-size: 17px; color: white"
            href="${url}"
            >Join Live session</a
          >
        </button>
        <p>or if it doesn't work try the link below</p>
        <p>${url}</p>
        <p>if you are facing any issue while joining please contact through email.</p>
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

export const traineeCourseFeedbackEmail = (
  traineeEmail,
  traineeName,
  courseName
) => {
  return {
    to: `${traineeEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Please fill the feedback",
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
       <p>Now it's time to fill the feedback form
       </p>
     <p>You can find all your courses here <a href="https://happy-tree-0192a720f.1.azurestaticapps.net/trainee/profile/my-courses">My courses</a> to submit the feedback.</p>
         <p>
           Your feedback has helped us serve our customers better in the past, so
           we really appreciate you taking the time to provide it.
         </p>
         <p>And also fill this google form to serve us better in the future. <a href="https://docs.google.com/forms/d/e/1FAIpQLSelTbmSfmdojU6wHvO17L4UUemYlpnufWaXMcSXI4YXkkxhXA/viewform?usp=sf_link">Google form feedback</a></p>
         <p>
           Please feel free to reach out if you have any other questions or
           concerns.
         </p>
         <p>We look forward to seeing your progress with our service!</p>
         <p>
           If you have any questions, reply back to this email and we'll be happy
           to help.
         </p>
         <p>We’ll be in touch soon!</p>
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

export const traineeTShirtDispatchEmailTemplate = (
  traineeEmail,
  traineeName,
  courseName
) => {
  return {
    to: `${traineeEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "T shirt dispatch email",
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
         <p>With special thanks and much appreciation completion of course.Now take the T shirt from our side as complimentary </p>
         <p>You will receive a T shirt from the our side , delivered to your address provided in the trainee profile.</p> 
         <p>
           Please feel free to reach out if you have any other questions or
           concerns.
         </p>
         <p>We look forward to seeing your progress with our service!</p>
         <p>
           If you have any questions, reply back to this email and we'll be happy
           to help.
         </p>
         <p>We’ll be in touch soon!</p>
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

export const traineeCertificateDispatchEmailTemplate = (
  traineeEmail,
  traineeName,
  courseName
) => {
  return {
    to: `${traineeEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Certificate dispatch email",
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
         <p>With special thanks and much appreciation completion of course.You will receive a certification of course completion. </p>
         <p>You will receive a Course completion certificate from the our side , delivered to your address provided in the trainee profile.</p> 
         <p>
           Please feel free to reach out if you have any other questions or
           concerns.
         </p>
         <p>We look forward to seeing your progress with our service!</p>
         <p>
           If you have any questions, reply back to this email and we'll be happy
           to help.
         </p>
         <p>We’ll be in touch soon!</p>
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

export const traineeCourseFeedbackSubmissionEmail = (
  traineeEmail,
  username
) => {
  return {
    to: `${traineeEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Thank you for your submitting feedback",
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
          Thank you for submitting your feedback and suggestions. We really
          appreciate your input and will take it into consideration for our
          future product updates.
        </p>
        <p>
          Your feedback has helped us serve our customers better in the past, so
          we really appreciate you taking the time to provide it.
        </p>
        <p>And also fill this google form to serve us better in the future. <a href="https://docs.google.com/forms/d/e/1FAIpQLSelTbmSfmdojU6wHvO17L4UUemYlpnufWaXMcSXI4YXkkxhXA/viewform?usp=sf_link">Google form feedback</a></p>
        <p>
          Please feel free to reach out if you have any other questions or
          concerns.
        </p>
        <p>We look forward to seeing your progress with our service!</p>
        <p>
          If you have any questions, reply back to this email and we'll be happy
          to help.
        </p>
        <p>We’ll be in touch soon!</p>
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

export const traineeCoursePointsUpdateEmail = (
  traineeEmail,
  username,
  points
) => {
  return {
    to: `${traineeEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "You've earned reward points!",
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
          Your reward points account has been updated for the new catalogue. You now have a total of ${points}. Please click on the link to access your points and redeem them at any of our partner e-commerce sites.
        </p>
        <p>
          You can also use your points for our rewards programme that provides you with discounts on your next purchase.
        </p>
          Please feel free to reach out if you have any other questions or
          concerns.
        </p>
        <p>We look forward to seeing your progress with our service!</p>
        <p>
          If you have any questions, reply back to this email and we'll be happy
          to help.
        </p>
        <p>We’ll be in touch soon!</p>
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

export const traineeLiveClassRemainderStartedEmailTemplate = (
  email,
  username,
  mentorName,
  date,
  slotTime,
  url
) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `Remainder for the live class has all ready started`,
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
        <p>Hi <b>${mentorName}</b>,</p>
        <p>
          A live Instructor doubt clearing session with <b>${username}</b> on
          <b>${date}</b> and time is <b>${slotTime}</b> has started by the host, Join right now!.
        </p>
        <button
          style="
            background-color: #085cca;
            border: none;
            color: white;
            padding: 10px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 7px;
          "
        >
          <a
            style="text-decoration: none; font-size: 17px; color: white"
            href="${url}"
            >Host a Live session</a
          >
        </button>
        <p>or if it doesn't work try the link below</p>
        <p>${url}</p>
        <p>if you are facing any issue while joining please contact through email.</p>
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
