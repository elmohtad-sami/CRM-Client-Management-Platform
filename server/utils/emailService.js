const nodemailer = require('nodemailer');

let transporter = null;
const isProductionEnvironment = process.env.NODE_ENV === 'production';

const initializeTransporter = () => {
  const gmailEmail = process.env.GMAIL_EMAIL;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;

  // Check if Gmail credentials are properly configured
  if (!gmailEmail || gmailEmail === 'your-email@gmail.com' || 
      !gmailPassword || gmailPassword === 'your-app-password') {
    console.warn('⚠️ Gmail credentials not properly configured in .env');
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailEmail,
        pass: gmailPassword
      },
      tls: {
        rejectUnauthorized: isProductionEnvironment
      }
    });
    console.log('✓ Gmail transporter initialized');
    return transporter;
  } catch (err) {
    console.error('❌ Failed to initialize Gmail transporter:', err.message);
    return null;
  }
};

const sendVerificationEmail = async (email, fullName, verificationCode) => {
  try {
    // Initialize transporter if not already done
    if (!transporter) {
      transporter = initializeTransporter();
    }

    if (!transporter) {
      console.warn('⚠️ Email service disabled - Gmail not configured');
      // In development, allow registration without email
      if (process.env.NODE_ENV === 'development') {
        console.log(`📧 [DEV MODE] Would send verification email to: ${email}`);
        console.log(`📧 [DEV MODE] Verification code: ${verificationCode}`);
        return true; // Simulate success in development
      }
      throw new Error('Email service is not configured');
    }

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationCode}`;
    
    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: 'Email Verification - CRM Finance',
      html: `
        <h2>Welcome, ${fullName}!</h2>
        <p>Thank you for registering. Please verify your email to activate your account.</p>
        <p>Your verification code is:</p>
        <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; padding: 12px 16px; background: #f1f5f9; display: inline-block; border-radius: 8px; margin: 12px 0;">${verificationCode}</div>
        <p><a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
        <p>Or copy and paste this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link expires in 24 hours.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Verification email sent to ${email}`);
    return true;
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    throw err;
  }
};

module.exports = { sendVerificationEmail };
