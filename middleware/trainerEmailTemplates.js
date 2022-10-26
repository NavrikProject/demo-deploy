export const trainerApplicationEmail = (trainerEmail, username) => {
  return {
    to: `${trainerEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Thank you for your application!",
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
          Thank you for submitting your trainer application for becoming a
          part of our trainer team. In the meantime feel free to check out
          some information about our company on our website blogs and if you
          have any questions please don't hesitate to contact me.
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
// trainer approve email
export const trainerApproveEmail = (trainerEmail, username) => {
  return {
    to: `${trainerEmail}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Congratulations! You're our next trainer!",
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
          Congratulations, you've been approved to be a trainer! We are grateful
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
          As a newly appointed trainer, we want to show you how to use our
          platform and help you stay on top of your game. <b>Practiwiz</b> is
          such a great tool for both students looking for knowledge and trainers
          wanting to share their expertise. We hope you are as excited about
          this as we are!
        </p>
        <p>
          Please know that we are more than happy to answer any questions or
          concerns that may arise.
        </p>
        <p>Best of luck in your training journey!</p>
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
// trainer disapprove email
export const trainerDisApproveEmail = (trainerEmail, username) => {
  return {
    to: `${trainerEmail}`, // Change to your recipient
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
          Unfortunately, we are unable to approve you as a trainer at this time.
          Our decision are based on a number of different reasons including your
          application, amount of experience, engagement with the community,
          teaching and training experience, and more.
        </p>
        <p>
          We're sorry for any inconvenience this may cause. If you have any
          questions about the process or requirements for training please get
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

export const trainerBankDetailsEmailTemplate = (email, username) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practilearn.com", // Change to your verified sender
    subject: "Bank details added successfully",
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
export const trainerProfileUpdateEmailTemplate = (email, username, details) => {
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
