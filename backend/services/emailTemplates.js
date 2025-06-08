export const otpTemplate = ({ email, otpCode, expiresInMinutes, purpose }) => {
    const emailContent = {
        signup: {
            subjectLine: "Verify Your Email to Get Started with Notehub",
            actionText: "To complete your registration and start using Notehub, please verify your email address using the code below:",
            subHeading: "Verification Code",
            footerNote: "If you did not sign up for Notehub, you can safely ignore this email."
        },
        password_reset: {
            subjectLine: "Reset Your Notehub Password",
            actionText: "To reset your password, please use the verification code below:",
            subHeading: "Password Reset Code",
            footerNote: "If you didn't request a password reset, please ignore this email or contact our support team."
        },
        email_update: {
            subjectLine: "Confirm Your New Email for Notehub",
            actionText: "To update your email address for your Notehub account, please verify your new email using the code below:",
            subHeading: "Email Update Code",
            footerNote: "If you did not request this change, please contact our support immediately."
        }
    };

    const { subjectLine, actionText, subHeading, footerNote } = emailContent[purpose] || emailContent.signup;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${subjectLine}</title>
    <style>
        /* Dark mode styles for compatible clients */
        @media (prefers-color-scheme: dark) {
            body,
            table,
            td {
                background-color: #0a0a0a !important;
                color: #fafafa !important;
            }
        }

        [data-ogsc] .email-header {
            background-color: #fafafa !important;
            color: #a0a0a0 !important;
        }

        [data-ogsc] .otp-container {
            background-color: #121212 !important;
            border-color: #2e2f2f !important;
        }

        [data-ogsc] .email-footer {
            background-color: #0a0a0a !important;
            border-top-color: #2e2f2f !important;
            color: #fafafa !important;
        }

        [data-ogsc] .muted-text {
            color: #a1a1a1 !important;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; color: #0a0a0a;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="margin: auto; background-color: #ffffff;" bgcolor="#ffffff">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 20px; text-align: center; background-color: #0a0a0a; color: #fafafa;" bgcolor="#0a0a0a" class="email-header">
                            <h1 style="margin: 0; font-size: 24px;">Notehub</h1>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 30px; color: #0a0a0a;">
                            <h2 style="margin: 0 0 10px 0; font-size: 18px;">Hello ${email},</h2>
                            <p style="margin-bottom: 25px; line-height: 1.5;">${actionText}</p>

                            <!-- OTP Block -->
                            <table width="100%" cellpadding="20" cellspacing="0" border="0" style="background-color: #f5f5f5; border-radius: 8px; border: 1px solid #e5e5e5; margin: 25px 0;" bgcolor="#f5f5f5" class="otp-container">
                                <tr>
                                    <td style="text-align: center;">
                                        <p style="font-size: 16px; color: #737373; margin-bottom: 10px; font-weight: 600;">${subHeading}</p>
                                        <p style="font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 15px 0;">${otpCode.toString().replace(/(\\d{3})(\\d{3})/, '$1 $2')}</p>
                                        <p style="font-size: 13px; color: #737373;">This code will expire in ${expiresInMinutes} minutes.</p>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size: 13px; color: #737373;">${footerNote}</p>
                            <p style="font-size: 13px; margin-top: 10px;">— The Notehub Team</p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px; text-align: center; background-color: #ffffff; border-top: 1px solid #e5e5e5; color: #0a0a0a;" bgcolor="#ffffff" class="email-footer">
                            <table cellpadding="0" cellspacing="0" style="margin: 15px auto;">
                                <tr>
                                    <td style="padding: 0 8px;">
                                        <a href=https://www.linkedin.com/in/abhijeet-singh-rajput1/" target="_blank">
                                            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="24" height="24" style="opacity: 0.8; filter: grayscale(100%);" />
                                        </a>
                                    </td>
                                    <td style="padding: 0 8px;">
                                        <a href="https://github.com/abhijeetSinghRajput" target="_blank">
                                            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="24" height="24" style="opacity: 0.8; filter: grayscale(100%);" />
                                        </a>
                                    </td>
                                    <td style="padding: 0 8px;">
                                        <a href="https://www.instagram.com/abhijeet_singh_rajput1" target="_blank">
                                            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="24" height="24" style="opacity: 0.8; filter: grayscale(100%);" />
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 0; font-size: 12px;">© 2024 Notehub. All rights reserved.</p>
                            <p style="margin: 8px 0 0 0; font-size: 11px; color: #737373;">Created by Abhijeet Singh Rajput</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
};