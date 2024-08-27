export const ALERT_NOTIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alert Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #444;
        }
        .content {
            font-size: 16px;
            line-height: 1.5;
        }
        .alert-details {
            background-color: #f9f9f9;
            border-left: 4px solid #ff5a5f;
            padding: 15px;
            margin-top: 20px;
            white-space: pre-wrap;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Alert Notification</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You have received a new alert. Please find the details below:</p>
            <div class="alert-details">
                {{ALERT_DETAILS_JSON}}
            </div>
            <p>Thank you for your attention.</p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;
