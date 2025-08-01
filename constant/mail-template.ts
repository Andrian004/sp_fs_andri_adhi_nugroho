export function getVerifyTemplate(username: string, link: string) {
  return `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f7; color: #51545e; margin: 0;
      padding: 0; } .email-wrapper { width: 100%; background-color: #f4f4f7; } .email-content {
      max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0
      4px 12px rgba(0, 0, 0, 0.1); overflow: hidden; } .email-header { background-color: #4c5caf;
      padding: 20px; text-align: center; color: #ffffff; } .email-body { padding: 30px; }
      .email-body h1 { font-size: 24px; margin: 0 0 20px; color: #333333; } .email-body p {
      font-size: 16px; line-height: 1.5; color: #51545e; } .email-body a { display: inline-block;
      padding: 10px 20px; margin: 10px 0 10px; font-size: 16px; color: #ffffff; background-color:
      #4caf50; border-radius: 5px; text-decoration: none; } .email-footer { padding: 20px;
      text-align: center; font-size: 12px; color: #525252; background-color: #cccccc; }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-content">
        <div class="email-header">
          <h2>Verify Your Email</h2>
        </div>
        <div class="email-body">
          <h1>Welcome to Zentask!</h1>
          <p>
            Dear 
            ${username}, someone just added your email to zentask, please confirm your email
            address by clicking the button below:
          </p>
          <a href="${link}" target="_blank">Verify Email</a>
          <p>If you did not create an account in zentask, no further action is required.</p>
          <p>Thanks,<br />Zentask Team</p>
        </div>
        <div class="email-footer">
          <p>&copy; ${new Date().getFullYear()} Zentask. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
</html>
`;
}
