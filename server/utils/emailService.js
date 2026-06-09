const nodemailer = require('nodemailer');

let transporter = null;

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
      }
    });
    console.log('✓ Gmail transporter initialized');
    return transporter;
  } catch (err) {
    console.error('❌ Failed to initialize Gmail transporter:', err.message);
    return null;
  }
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (email, fullName, verificationToken, verificationCode) => {
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
        console.log(`📧 [DEV MODE] Verification token: ${verificationToken}`);
        return true; // Simulate success in development
      }
      throw new Error('Email service is not configured');
    }

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: 'Email Verification - CRM Finance',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">Welcome, ${fullName}!</h2>
          <p style="color: #333; font-size: 14px; line-height: 1.6;">Thank you for registering. Please verify your email to activate your account.</p>
          
          <div style="background: #f4f4f8; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Your verification code</p>
            <p style="font-size: 32px; font-weight: bold; color: #1a1a2e; letter-spacing: 8px; margin: 0;">${verificationCode}</p>
          </div>
          
          <p style="color: #333; font-size: 14px;">Or click the button below:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 14px; font-weight: bold;">Verify Email</a>
          </p>
          <p style="color: #666; font-size: 12px;">Or copy and paste this link: <br/><a href="${verificationUrl}" style="color: #007bff;">${verificationUrl}</a></p>
          <p style="color: #999; font-size: 11px; margin-top: 20px;">This code and link expire in 24 hours.</p>
        </div>
      `
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(`📧 [DEV MODE] Verification code for ${email}: ${verificationCode}`);
    }

    await transporter.sendMail(mailOptions);
    console.log(`✓ Verification email sent to ${email}`);
    return true;
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    throw err;
  }
};

const sendPasswordResetEmail = async (email, fullName, resetToken, resetCode) => {
  try {
    if (!transporter) {
      transporter = initializeTransporter();
    }

    if (!transporter) {
      console.warn('⚠️ Email service disabled - Gmail not configured');
      if (process.env.NODE_ENV === 'development') {
        console.log(`📧 [DEV MODE] Would send password reset email to: ${email}`);
        console.log(`📧 [DEV MODE] Reset code: ${resetCode}`);
        console.log(`📧 [DEV MODE] Reset token: ${resetToken}`);
        return true;
      }
      throw new Error('Email service is not configured');
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: 'Password Reset - CRM Finance',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">Password Reset Request</h2>
          <p style="color: #333; font-size: 14px; line-height: 1.6;">Hello ${fullName},</p>
          <p style="color: #333; font-size: 14px; line-height: 1.6;">We received a request to reset your password. Use the code below to proceed.</p>
          
          <div style="background: #f4f4f8; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Your reset code</p>
            <p style="font-size: 32px; font-weight: bold; color: #1a1a2e; letter-spacing: 8px; margin: 0;">${resetCode}</p>
          </div>
          
          <p style="color: #333; font-size: 14px;">Or click the button below:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 14px; font-weight: bold;">Reset Password</a>
          </p>
          <p style="color: #666; font-size: 12px;">Or copy and paste this link: <br/><a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a></p>
          <p style="color: #999; font-size: 11px; margin-top: 20px;">This code and link expire in 1 hour.</p>
          <p style="color: #999; font-size: 11px;">If you did not request this, please ignore this email.</p>
        </div>
      `
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(`📧 [DEV MODE] Password reset code for ${email}: ${resetCode}`);
    }

    await transporter.sendMail(mailOptions);
    console.log(`✓ Password reset email sent to ${email}`);
    return true;
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    throw err;
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail, generateVerificationCode };
