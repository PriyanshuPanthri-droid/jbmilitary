import { sendContactConfirmationEmail, sendContactNotificationToAdmin } from '../services/email.service.js';
import Contact from '../models/contact.model.js';
import { validateContactInput } from '../utils/validations/contactValidations.js';
import { isValidObjectId } from '../utils/validations/commonValidations.js';


export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate request data
    const validation = validateContactInput({ name, email, subject, message });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message
    });

    await contact.save();

    // Send confirmation email to user
    await sendContactConfirmationEmail(email, name);
    
    // Notify admin about new contact submission
    await sendContactNotificationToAdmin(contact);

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID',
      });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status'
    });
  }
};