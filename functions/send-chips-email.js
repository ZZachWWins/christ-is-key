const sgMail = require('@sendgrid/mail');

exports.handler = async function(event, context) {
  try {
    const { name, email, address, phone } = JSON.parse(event.body);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: 'vaccinepolice@protonmail.com',
      from: 'no-reply@knn.world', // Replace with your verified sender
      subject: 'Free Pain and Energy Chips Request',
      text: `
        New request for Free Pain and Energy Chips:
        Name: ${name}
        Email: ${email}
        Address: ${address}
        Phone: ${phone}
      `,
      html: `
        <h2>Free Pain and Energy Chips Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `
    };

    await sgMail.send(msg);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' })
    };
  }
};