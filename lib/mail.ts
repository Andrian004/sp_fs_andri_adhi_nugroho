import getTransporter from "@/lib/transporter";

interface SendMailProps {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendMail({ to, subject, text, html }: SendMailProps) {
  const transporter = getTransporter();

  try {
    await transporter.sendMail({
      from: `Zentask <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("Failed to send email.");
  }
}
