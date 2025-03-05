export const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 20px 0;
            }
            .header h1 {
                margin: 0;
                color: #333333;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .content h2 {
                color: #333333;
            }
            .content p {
                color: #666666;
                font-size: 16px;
                line-height: 1.5;
            }
            .content .code {
                font-size: 24px;
                font-weight: bold;
                color: #333333;
                margin: 20px 0;
                padding: 10px;
                border: 1px solid #dddddd;
                border-radius: 5px;
                background-color: #f9f9f9;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #999999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Verify Your Email</h1>
            </div>
            <div class="content">
                <h2>Hello,</h2>
                <p>Thank you for registering with us. To complete your registration, please verify your email address by entering the following verification code:</p>
                <div class="code">{verificationToken}</div>
                <p>If you did not request this verification, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 jbmilitary. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;

export const generateWelcomeEmailHtml = (name) => {
    return `
        <html>
        <head>
          <style>
            .email-container {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              padding: 20px;
              background-color: #f4f4f4;
              border-radius: 10px;
              max-width: 600px;
              margin: auto;
            }
            .email-header {
              background-color: #4CAF50;
              color: white;
              padding: 10px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .email-body {
              padding: 20px;
              background-color: white;
              border-radius: 0 0 10px 10px;
            }
            .email-footer {
              text-align: center;
              padding: 10px;
              font-size: 12px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Welcome to jbmilitary!</h1>
            </div>
            <div class="email-body">
              <p>Hi ${name},</p>
              <p>Congratulations! Your email has been successfully verified.</p>
              <p>We are excited to have you on board at jbmilitary. Explore our platform and enjoy our services.</p>
              <p>If you have any questions or need assistance, feel free to reach out to us.</p>
              <p>Best Regards,<br/>The jbmilitary Team</p>
            </div>
            <div class="email-footer">
              <p>&copy; ${new Date().getFullYear()} JB Military Antiques. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};

export const generatePasswordResetEmailHtml = (resetURL) => {
    return `
        <html>
        <head>
          <style>
            .email-container {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              padding: 20px;
              background-color: #f4f4f4;
              border-radius: 10px;
              max-width: 600px;
              margin: auto;
            }
            .email-header {
              background-color: #d9534f;
              color: white;
              padding: 10px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .email-body {
              padding: 20px;
              background-color: white;
              border-radius: 0 0 10px 10px;
            }
            .email-footer {
              text-align: center;
              padding: 10px;
              font-size: 12px;
              color: #777;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              margin: 20px 0;
              font-size: 16px;
              color: white;
              background-color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="email-body">
              <p>Hi,</p>
              <p>We received a request to reset your password. Click the button below to reset it.</p>
              <a href="${resetURL}" class="button">Reset Password</a>
              <p>If you didn't request a password reset, please ignore this email.</p>
              <p>Thank you,<br/>The jbmilitary Team</p>
            </div>
            <div class="email-footer">
              <p>&copy; ${new Date().getFullYear()} JB Military Antiques. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};

export const generateResetSuccessEmailHtml = () => {
    return `
        <html>
        <head>
          <style>
            .email-container {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              padding: 20px;
              background-color: #f4f4f4;
              border-radius: 10px;
              max-width: 600px;
              margin: auto;
            }
            .email-header {
              background-color: #4CAF50;
              color: white;
              padding: 10px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .email-body {
              padding: 20px;
              background-color: white;
              border-radius: 0 0 10px 10px;
            }
            .email-footer {
              text-align: center;
              padding: 10px;
              font-size: 12px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Password Reset Successful</h1>
            </div>
            <div class="email-body">
              <p>Hi,</p>
              <p>Your password has been successfully reset. You can now log in with your new password.</p>
              <p>If you did not request this change, please contact our support team immediately.</p>
              <p>Thank you,<br/>The jbmilitary Team</p>
            </div>
            <div class="email-footer">
              <p>&copy; ${new Date().getFullYear()} JB Military Antiques. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};


//contact and newsletter from here

export const generateAdminNotificationHtml = (contact) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Contact Form Submission</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .details {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
        }
        .label {
          font-weight: bold;
          color: #2c3e50;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>New Contact Form Submission</h2>
        <div class="details">
          <p><span class="label">Name:</span> ${contact.name}</p>
          <p><span class="label">Email:</span> ${contact.email}</p>
          <p><span class="label">Subject:</span> ${contact.subject}</p>
          <p><span class="label">Message:</span></p>
          <p>${contact.message}</p>
          <p><span class="label">Submitted:</span> ${contact.createdAt.toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateContactConfirmationHtml = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Contact Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          background-color: #2c3e50;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Contacting Us</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to JB Military Antiques. We have received your message and will get back to you as soon as possible.</p>
          <p>We typically respond to inquiries within 24-48 business hours.</p>
          <p>Best regards,<br>JB Military Antiques Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} JB Military Antiques. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateNewsletterHtml = (content) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>JB Military Antiques Newsletter</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2c3e50;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #ffffff;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
          background-color: #f5f5f5;
        }
        .unsubscribe {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>JB Military Antiques</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} JB Military Antiques. All rights reserved.</p>
          <div class="unsubscribe">
            <p>To unsubscribe from our newsletter, <a href="{unsubscribe_url}">click here</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateNewsletterConfirmationHtml = () => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Newsletter Subscription Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2c3e50;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Our Newsletter!</h1>
        </div>
        <div class="content">
          <p>Thank you for subscribing to the JB Military Antiques newsletter!</p>
          <p>You'll now receive updates about:</p>
          <ul>
            <li>New military antiques and collectibles</li>
            <li>Special offers and promotions</li>
            <li>Historical insights and articles</li>
            <li>Event announcements</li>
          </ul>
          <p>Stay tuned for our next update!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} JB Military Antiques. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateSellRequestAdminNotificationHtml = (sellRequest) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(price);
  };

  const formatImages = (images) => {
    if (!images || images.length === 0) {
      return '<p>No images provided</p>';
    }

    return `
      <div class="images">
        ${images.map(img => `
          <div class="image-container">
            <img src="${process.env.BASE_URL}/uploads/${img.filename}" 
                 alt="Item image" 
                 class="image">
            <p class="image-name">${img.filename}</p>
          </div>
        `).join('')}
      </div>
    `;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Sell Request</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2c3e50;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .details {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
        }
        .label {
          font-weight: bold;
          color: #2c3e50;
        }
        .images {
          margin: 15px 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
        }
        .image-container {
          text-align: center;
        }
        .image {
          max-width: 150px;
          height: auto;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 5px;
        }
        .image-name {
          font-size: 12px;
          color: #666;
          margin: 5px 0;
          word-break: break-all;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Sell Request Received</h1>
        </div>
        <div class="details">
          <h2>Seller Information</h2>
          <p><span class="label">Name:</span> ${sellRequest.name}</p>
          <p><span class="label">Email:</span> ${sellRequest.email}</p>
          <p><span class="label">Phone:</span> ${sellRequest.phone}</p>
          
          <h2>Item Details</h2>
          <p><span class="label">Product Name:</span> ${sellRequest.productName}</p>
          <p><span class="label">Price:</span> ${formatPrice(sellRequest.price)}</p>
          <p><span class="label">Description:</span></p>
          <p>${sellRequest.description}</p>
          
          <h2>Images</h2>
          ${formatImages(sellRequest.images)}
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateSellRequestConfirmationHtml = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Sell Request Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2c3e50;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Submission</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for submitting your item to JB Military Antiques. We have received your request and our team will review it carefully.</p>
          <p>What happens next:</p>
          <ol>
            <li>Our experts will evaluate your submission</li>
            <li>We'll contact you within 2-3 business days</li>
            <li>If interested, we'll make you an offer</li>
            <li>We'll arrange payment and shipping details if you accept</li>
          </ol>
          <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>
          <p>Best regards,<br>JB Military Antiques Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} JB Military Antiques. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};