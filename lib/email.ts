import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendConfirmationEmail(to: string, subject: string, html: string) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("SendGrid send email error:", error);
    throw error;
  }
}
