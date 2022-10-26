//email activation working
export const emailActivationTemplate = (email, username, url) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `Email account activation`,
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
// account created email working
export const accountCreatedEmailTemplate = (email, username) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `Account created successfully`,
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
          Congratulations! You have successfully activated your account on
          our<b> Practiwiz</b>.
        </p>
        <p>You can login and explore our services at any time.</p>
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
// email reset password working
export const resetPasswordEmailTemplates = (email, username, url) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `Reset your password`,
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
          We're sorry to see that you've forgotten your password. Let us know if
          you forgot it, or if you just want to change your password.
        </p>
        <p>
          Please visit this click on the reset button to reset your password on
          <b>Practiwiz</b>
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
            >Reset Password</a
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
//password update email working
export const passwordUpdateEmailTemplate = (email, username) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: `Password changed successfully`,
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
          Just a quick note to let you know that your password has been changed
          to the new password you requested.
        </p>
        <p>
          If you have any questions or are experiencing any difficulties logging
          in, please reach out to our customer service team directly at
          <b>(120) 3569310</b>.
        </p>
        <p>We look forward to seeing your progress with our service!</p>
        <p>
          If you have any questions or would like us to help you with anything
          else, please don't hesitate to reach out <b>support@practiwiz.com</b>.
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

// admin approve email working
export const adminApproveEmail = (adminEmail, username) => {
  return {
    to: `${adminEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Congratulations! You're our next admin!",
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
          Congratulations, you've been approved to be a admin! We are grateful
          for your willingness to share your expertise with our community.
        </p>
        <p>
          Your first task is to join a live tutorial session. As soon as you do
          that, you'll have access to all of our other tools and can start
          getting paid!
        </p>
        <p>
          As a newly appointed admin, we want to show you how to use our
          platform and help you stay on top of your game.
        </p>
        <p>
          Please know that we are more than happy to answer any questions or
          concerns that may arise.
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

// admin disapprove email working
export const adminDisApproveEmail = (adminEmail, username) => {
  return {
    to: `${adminEmail}`, // Change to your recipient
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
          Unfortunately, we are unable to approve you as a admin at this time.
          Our decision are based on a number of different reasons including your
          application, amount of experience, engagement with the community,
          teaching and admin experience, and more.
        </p>
        <p>
          We're sorry for any inconvenience this may cause. If you have any
          questions about the process or requirements for admin please get
          in touch with us at contact at support@practiwiz.com .
        </p>
        <p>
          I know this may not be the answer you wanted to hear but I hope it's
          good news for you in the future
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
