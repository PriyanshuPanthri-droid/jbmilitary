import { generateAdminNotificationHtml, generateContactConfirmationHtml, generateNewsletterConfirmationHtml, generateNewsletterHtml, generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateSellRequestAdminNotificationHtml, generateSellRequestConfirmationHtml, generateWelcomeEmailHtml, htmlContent } from "../emailTemplates/htmlEmails.js";
import { client, sender } from "../config/mailtrap.config.js";
import dotenv from 'dotenv';

dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];
    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Verify your email',
            html: htmlContent.replace("{verificationToken}", verificationToken),
            category: 'Email Verification'
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send email verification");
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];
    const htmlContent = generateWelcomeEmailHtml(name);
    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Welcome to jbmilitary Antiques',
            html: htmlContent,
            template_variables: {
                company_info_name: "jbmilitary",
                name: name
            }
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send welcome email");
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Reset your password',
            html: htmlContent,
            category: "Reset Password"
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to reset password");
    }
};

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];
    const htmlContent = generateResetSuccessEmailHtml();
    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Password Reset Successfully',
            html: htmlContent,
            category: "Password Reset"
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send password reset success email");
    }
};


export const sendContactConfirmationEmail = async (email, name) => {
    const recipient = [{ email }];
    try {
      await client.send({
        from: sender,
        to: recipient,
        subject: 'Thank you for contacting JB Military Antiques',
        html: generateContactConfirmationHtml(name),
        category: 'Contact Confirmation'
      });
      return { success: true };
    } catch (error) {
      console.error('Contact confirmation email error:', error);
      return { 
        success: false, 
        error: 'Failed to send confirmation email, but your message was received' 
      };
    }
  };
  
export const sendContactNotificationToAdmin = async (contact) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const recipient = [{ email: adminEmail }];
    try {
      await client.send({
        from: sender,
        to: recipient,
        subject: 'New Contact Form Submission',
        html: generateAdminNotificationHtml(contact),
        category: 'Admin Notification'
      });
      return { success: true };
    } catch (error) {
      console.error('Admin notification email error:', error);
      return { 
        success: false, 
        error: 'Failed to notify admin, but contact was saved' 
      };
    }
  };
  
export const sendNewsletterConfirmation = async (email) => {
    const recipient = [{ email }];
    try {
      await client.send({
        from: sender,
        to: recipient,
        subject: 'Welcome to JB Military Antiques Newsletter',
        html: generateNewsletterConfirmationHtml(),
        category: 'Newsletter Subscription'
      });
      return { success: true };
    } catch (error) {
      console.error('Newsletter confirmation email error:', error);
      return { 
        success: false, 
        error: 'Subscription successful, but confirmation email failed' 
      };
    }
  };
  
export const sendNewsletterToSubscribers = async (emails, subject, content) => {
    const recipients = emails.map(email => ({ email }));
    const html = generateNewsletterHtml(content);
    const results = {
      success: true,
      sent: 0,
      failed: 0,
      total: recipients.length
    };
    
    try {
        // Send in batches using configured batch size
        const batchSize = parseInt(process.env.NEWSLETTER_BATCH_SIZE, 10) || 50;
        const batchDelay = parseInt(process.env.NEWSLETTER_BATCH_DELAY, 10) || 1000;

        for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        try {
            await client.send({
            from: sender,
            to: batch,
            subject,
            html,
            category: 'Newsletter'
            });
            results.sent += batch.length;
        } catch (error) {
            console.error(`Batch send error (${i}-${i + batch.length}):`, error);
            results.failed += batch.length;
        }
        
        // Add configured delay between batches
        if (batch.length === batchSize && i + batchSize < recipients.length) {
            await new Promise(resolve => setTimeout(resolve, batchDelay));
        }
        }

        results.success = results.sent > 0;
        return results;
    } catch (error) {
        console.error('Newsletter sending error:', error);
        return {
        success: false,
        sent: results.sent,
        failed: recipients.length - results.sent,
        total: recipients.length,
        error: 'Newsletter sending partially failed'
        };
    }
};  

export const sendSellRequestConfirmation = async (email, name) => {
  const recipient = [{ email }];
  try {
    await client.send({
      from: sender,
      to: recipient,
      subject: 'Thank you for your submission to JB Military Antiques',
      html: generateSellRequestConfirmationHtml(name),
      category: 'Sell Request Confirmation'
    });
    return { success: true };
  } catch (error) {
    console.error('Sell request confirmation email error:', error);
    return { 
      success: false, 
      error: 'Failed to send confirmation email' 
    };
  }
};

export const sendSellRequestNotificationToAdmin = async (sellRequest) => {
  const recipient = [{ email: process.env.ADMIN_EMAIL }];
  try {
    await client.send({
      from: sender,
      to: recipient,
      subject: 'New Sell Request Submission',
      html: generateSellRequestAdminNotificationHtml(sellRequest),
      category: 'Admin Notification'
    });
    return { success: true };
  } catch (error) {
    console.error('Admin notification email error:', error);
    return { 
      success: false, 
      error: 'Failed to notify admin' 
    };
  }
};