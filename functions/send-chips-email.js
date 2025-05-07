const sgMail = require('@sendgrid/mail');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  try {
    // Parse the incoming request body
    const { name, email, address, phone } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !address || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required' }),
      };
    }

    // Send email
    const msg = {
      to: 'keyreport@knnmailing.info', // Recipient
      from: 'keyreport@knnmailing.info', // Sender (verified in SendGrid)
      subject: 'New Pain and Energy Chips Signup',
      text: `A new user has signed up for Pain and Energy Chips!\n\nName: ${name}\nEmail: ${email}\nAddress: ${address}\nPhone: ${phone}`,
      html: `
        <h2>New Pain and Energy Chips Signup</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email', details: error.message }),
    };
  }
};