export const mentorApplicationEmail = (mentorEmail, username) => {
  return {
    to: `${mentorEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Thank you for your mentor application!",
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
          Thank you for submitting your application for becoming a part of our
          team. In the meantime feel free to check out some information about
          our company on our website blogs and if you have any questions please don't
          hesitate to contact me.
        </p>
        <p>
          We will review the whole application and get back to you as soon as
          possible.
        </p>
        <p>Thank you for your interest,</p>
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
    </section>
    `,
  };
};

// mentor approve email
export const mentorApproveEmail = (mentorEmail, username) => {
  return {
    to: `${mentorEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Congratulations! You're our next mentor!",
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
          Congratulations, you've been approved to be a mentor! We are grateful
          for your willingness to share your expertise with our community and in
          return you will receive compensation for every session that is hosted
          on the site.
        </p>
        <p>
          Your first task is to join a live tutorial session. As soon as you do
          that, you'll have access to all of our other tools and can start
          getting paid!
        </p>
        <p>
          As a newly appointed mentor, we want to show you how to use our
          platform and help you stay on top of your game. <b>Practiwiz</b> is
          such a great tool for both students looking for knowledge and mentors
          wanting to share their expertise. We hope you are as excited about
          this as we are!
        </p>
        <p>
          Once you host a session, you'll be able to earn more by gaining
          referrals.
        </p>
        <p>
          Please know that we are more than happy to answer any questions or
          concerns that may arise.
        </p>
        <p>Best of luck in your mentorship journey!</p>
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
// mentor disapprove email
export const mentorDisApproveEmail = (mentorEmail, username) => {
  return {
    to: `${mentorEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "We are sorry to inform you...",
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
          Unfortunately, we are unable to approve you as a mentor at this time.
          Our decision are based on a number of different reasons including your
          application, amount of experience, engagement with the community,
          teaching and mentoring experience, and more.
        </p>
        <p>
          We're sorry for any inconvenience this may cause. If you have any
          questions about the process or requirements for mentoring please get
          in touch with us at contact at support@practiwiz.com .
        </p>
        <p>
          I know this may not be the answer you wanted to hear but I hope it's
          good news for you in the future
        </p>
        <p>
          Please know that we are more than happy to answer any questions or
          concerns that may arise.
        </p>
        <p>
          Best of luck with your application and thank you for your interest in
          being a part of our team!
        </p>
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
// appointment with trainee for mentor
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
          <b>${date}</b> and time is <b>${slotTime}</b>.
        </p>    
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

// appointment with mentor with trainee
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
          width="300px"
          height="100px"
          src="https://res.cloudinary.com/droa7dncb/image/upload/v1665987569/practiwiz-logo3_xifxbc.png"
          alt="Logo"
        />
      </div>
    `,
  };
};
// appointment date changed
export const mentorBookingDateChangeEmailTemplate = (
  mentorEmail,
  mentorFullname,
  userFullname,
  oldDate,
  changedDate
) => {
  return {
    to: `${mentorEmail}`, // Change to your recipient
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
export const mentorBankDetailsEmailTemplate = (email, username) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Appointment date changed successfully",
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
          Thank you for submitting your bank details with us. You are secure.
          "Your information is encrypted and can not be shared with anyone."
        </p>
        <p>
          We hope you are ready to experience our product because we believe we
          have something that will benefit both your business and your
          customers.
        </p>
        <p>
          your information is encrypted and cannot be shared with anyone. We
          appreciate your trust in our company and hope you will give us another
          chance.
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

export const emailActivationTemplate = (email, username, url) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `Welcome to Practiwiz`,
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
        <p>We're pleased to see you onboard with <b>Practiwiz</b></p>
        <p>
          Please click the following link and/or the "Activate Account" button
          below for activation. We look forward to seeing your progress with our
          service!
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
            >Activate Account</a
          >
        </button>
        <p>or if it doesn't work try the link below</p>
        <p>${url}</p>
        <p>After 15 minutes this link will be expired.</p>
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

export const mentorBookingRemainderEmailTemplate = (
  email,
  mentorName,
  username,
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
        <p>Hi <b>${mentorName}</b>,</p>
        <p>
          You have successfully booked a session with a <b>${username}</b> on
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
            >Host a mentor session</a
          >
        </button>
        <p>or if it doesn't work try the link below</p>
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
export const mentorRescheduleEmailSentTemplate = (
  email,
  mentorName,
  username,
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
        <p>Hi <b>${mentorName}</b>,</p>
        <p>
          You have not attended a session with a <b>${username}</b> on
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
        <p>You can only modify for only one time</p>
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

export const mentorRescheduledUpdateEmailTemplate = (
  mentorEmail,
  traineeName,
  mentorName,
  date,
  slotTime
) => {
  return {
    to: `${mentorEmail}`, // Change to your recipient
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
        <p>Hi <b>${mentorName}</b>,</p>
        <p>
          You have successfully rescheduled your booking a date and session with a <b>${traineeName}</b> new updated booking date is
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
export const mentorCancelledRefundEmailTemplate = (traineeEmail, username) => {
  return {
    to: `${traineeEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Mentor cancelled booking refund",
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
          We are sad to inform that your mentor has been cancelled the appointment due to unavailability. Your payed amount refund has been processed. We
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
