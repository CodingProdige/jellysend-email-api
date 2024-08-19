import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    // Destructuring the request body to extract necessary parameters
    const { 
      to,           // The recipient's email address. Example: "recipient@example.com"
      subject,      // The subject line of the email. Example: "Welcome to our service"
      text,         // The plain text body of the email. Example: "This is a plain text email body."
      html,         // The HTML body of the email. Example: "<h1>This is an HTML email body</h1>"
      from,         // The sender's email address. Example: "your-email@example.com"
      fromName,     // The sender's name that will appear in the email. Example: "Dillon Jurgens"
      smtpUser,     // The SMTP username for authentication. Example: "your-email@example.com"
      smtpPass,     // The SMTP password for authentication. Example: "your-email-password"
      smtpHost,     // The SMTP host server address. Example: "smtp.example.com"
      smtpPort,     // The SMTP server port number. Example: 587 (for TLS), 465 (for SSL)
      smtpSecure    // Boolean indicating if SSL/TLS should be used. Example: true (for SSL), false (for TLS)
    } = await req.json();

    // Validate required fields
    if (!to || (!text && !html) || !from || !fromName || !smtpUser || !smtpPass || !smtpHost || !smtpPort) {
      return new Response(JSON.stringify({ message: 'Missing required parameters' }), { status: 400 });
    }

    // Create a Nodemailer transporter using the provided SMTP settings
    let transporter = nodemailer.createTransport({
      host: smtpHost,         // SMTP host provided by the user
      port: smtpPort,         // SMTP port provided by the user
      secure: smtpSecure,     // Use SSL/TLS based on user input
      auth: {
        user: smtpUser,       // SMTP username provided by the user
        pass: smtpPass,       // SMTP password provided by the user
      },
    });

    // Define the email options
    let mailOptions = {
      from: `"${fromName}" <${from}>`,  // Combines the sender's name and email into a single string
      to,                                // The recipient's email address
      subject: subject || 'No Subject',  // Defaults to "No Subject" if not provided
      text,                              // The plain text body of the email
      html,                              // The HTML body of the email
    };

    // Send the email using the configured transporter
    await transporter.sendMail(mailOptions);

    // Return a success response
    return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    // Return an error response if something goes wrong
    return new Response(JSON.stringify({ message: 'Internal Server Error', error }), { status: 500 });
  }
}
