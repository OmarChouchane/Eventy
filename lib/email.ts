import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface ConfirmationEmailParams {
  to: string;
  event: {
    title: string;
    description: string;
    location: string;
    startDateTime: string;
    endDateTime: string;
    imageUrl?: string;
  };
}

export const sendConfirmationEmail = async ({ to, event }: ConfirmationEmailParams) => {
const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `You're Registered for "${event.title}" 🎉`,
    html: `
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                .container { padding: 20px; background: #f9f9f9; }
                .card {
                    background: white;
                    border-radius: 8px;
                    padding: 24px;
                    max-width: 600px;
                    margin: auto;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                h1 { color: #333; }
                p { color: #555; }
                .footer { margin-top: 20px; font-size: 12px; color: #aaa; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <h1>You're Registered for ${event.title} 🎉</h1>
                    <p><strong>Description:</strong> ${event.description}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Starts:</strong> ${event.startDateTime}</p>
                    <p><strong>Ends:</strong> ${event.endDateTime}</p>
                    ${
                        event.imageUrl
                            ? `<img src="${event.imageUrl}" alt="Event Image" style="max-width:100%; border-radius: 6px; margin-top: 20px;" />`
                            : ""
                    }
                    <p>We're excited to see you there!</p>
                </div>
                <div class="footer">
                    You received this email because you registered for ${event.title}.
                </div>
            </div>
        </body>
    `,
};

  try {
    await sgMail.send(msg);
    console.log("Confirmation email sent to", to);
  } catch (error: any) {
    console.error("SendGrid email error:", error.response?.body || error.message);
    throw new Error("Failed to send confirmation email");
  }
};
