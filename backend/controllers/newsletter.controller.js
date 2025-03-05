import { sendNewsletterConfirmation, sendNewsletterToSubscribers } from '../services/email.service.js';
import Newsletter from '../models/newsletter.model.js';
import { validateNewsletterContent, validateNewsletterSubscription } from '../utils/validations/newsletterValidations.js';

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate subscription input
    const validation = validateNewsletterSubscription({ email });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.isSubscribed) {
        return res.status(400).json({
          success: false,
          message: 'Email already subscribed'
        });
      }
      existingSubscriber.isSubscribed = true;
      await existingSubscriber.save();
    } else {
      await Newsletter.create({ email });
    }

    const emailResult = await sendNewsletterConfirmation(email);
    
    res.status(201).json({
      success: true,
      message: emailResult.success 
        ? 'Successfully subscribed to newsletter' 
        : 'Subscribed to newsletter, but confirmation email could not be sent. Please ensure your email is correct.'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process newsletter subscription'
    });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate subscription input
    const validation = validateNewsletterSubscription({ email });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const subscriber = await Newsletter.findOneAndUpdate(
      { email },
      { isSubscribed: false },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process unsubscribe request'
    });
  }
};

export const sendNewsletter = async (req, res) => {
  try {
    const { subject, content } = req.body;

    // Validate newsletter content
    const validation = validateNewsletterContent({ subject, content });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const subscribers = await Newsletter.find({ isSubscribed: true });
        if (subscribers.length === 0) {
        return res.status(200).json({
            success: true,
            message: 'No active subscribers found'
        });
    }

    const emails = subscribers.map(sub => sub.email);
    const result = await sendNewsletterToSubscribers(emails, subject, content);

    // Update lastEmailSent for successful sends
    if (result.sent > 0) {
      await Newsletter.updateMany(
        { email: { $in: emails.slice(0, result.sent) } },
        { lastEmailSent: new Date() }
      );
    }

    res.status(200).json({
      success: result.success,
      message: result.sent === result.total 
        ? 'Newsletter sent successfully to all subscribers'
        : `Newsletter sent to ${result.sent} out of ${result.total} subscribers`,
      stats: {
        total: result.total,
        sent: result.sent,
        failed: result.failed
      }
    });
  } catch (error) {
    console.error('Send newsletter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process newsletter sending'
    });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const subscribers = await Newsletter.find({ isSubscribed: true })
      .sort({ subscribedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Newsletter.countDocuments({ isSubscribed: true });

    res.status(200).json({
      success: true,
      data: subscribers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers'
    });
  }
};