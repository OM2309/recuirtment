import { resend } from "@/lib/resend";

export async function sendOtpEmail(email: string, otp: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Recuirtment Inc. <onboarding@resend.dev>", // Updated to match branding
      to: email,
      subject: "Your OTP Code for Recuirtment Inc.",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Helvetica Neue', Arial, sans-serif;
              background-color: #f4f4f9;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #4a90e2;
              padding: 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              color: #ffffff;
              font-weight: 600;
            }
            .content {
              padding: 30px;
              text-align: center;
            }
            .otp {
              display: inline-block;
              font-size: 32px;
              font-weight: bold;
              color: #4a90e2;
              background-color: #f0f4ff;
              padding: 15px 25px;
              border-radius: 8px;
              margin: 20px 0;
              letter-spacing: 4px;
            }
            .content p {
              font-size: 16px;
              line-height: 1.5;
              color: #555;
              margin: 10px 0;
            }
            .footer {
              background-color: #f4f4f9;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              color: #777;
            }
            .footer a {
              color: #4a90e2;
              text-decoration: none;
              font-weight: 500;
            }
            @media only screen and (max-width: 600px) {
              .container {
                margin: 20px;
              }
              .otp {
                font-size: 28px;
                padding: 12px 20px;
              }
              .content p {
                font-size: 14px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Recuirtment Inc.</h1>
            </div>
            <div class="content">
              <h2>Your OTP Code</h2>
              <p>Thank you for choosing Recuirtment Inc. Please use the following OTP to complete your login.</p>
              <div class="otp">${otp}</div>
              <p>This code is valid for the next 10 minutes. Do not share it with anyone.</p>
            </div>
            <div class="footer">
              <p>Need help? Contact us at <a href="mailto:support@recuirtment.com">support@recuirtment.com</a></p>
              <p>&copy; ${new Date().getFullYear()} Recuirtment Inc. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }

    console.log("Email sent successfully:", data);
    return true;
  } catch (err) {
    console.error("Send OTP failed:", err);
    return false;
  }
}
