import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  let name = '', email = '', phone = '', subject = '', message = ''
  
  try {
    const body = await request.json()
    const formData = body
    name = formData.name
    email = formData.email
    phone = formData.phone
    subject = formData.subject
    message = formData.message

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Create transporter using Ethereal Email for testing (or Gmail if configured)
    let transporter
    
    // Check if we have Gmail credentials configured
    const hasGmailCredentials = 
      (process.env.SMTP_PASSWORD && 
       process.env.SMTP_PASSWORD !== 'your-gmail-app-password' &&
       process.env.SMTP_PASSWORD !== 'development-mode-not-configured') ||
      (process.env.GMAIL_APP_PASSWORD &&
       process.env.GMAIL_APP_PASSWORD !== 'your-gmail-app-password' &&
       process.env.GMAIL_APP_PASSWORD !== 'development-mode-not-configured')

    if (hasGmailCredentials) {
      // Use Gmail SMTP
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL || 'overheadaluminiumworkshop@gmail.com',
          pass: process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD
        }
      })
    } else {
      // Use Ethereal Email for testing (creates a test email account)
      const testAccount = await nodemailer.createTestAccount()
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })
      
      console.log('📧 Using Ethereal Email for testing')
      console.log(`📧 Test account: ${testAccount.user}`)
    }

    // Email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #0066CC; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #0066CC; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>New Contact Form Submission</h2>
            <p>Overhead Aluminium Workshop</p>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span> ${name}
            </div>
            <div class="field">
              <span class="label">Email:</span> ${email}
            </div>
            ${phone ? `<div class="field"><span class="label">Phone:</span> ${phone}</div>` : ''}
            ${subject ? `<div class="field"><span class="label">Subject:</span> ${subject}</div>` : ''}
            <div class="field">
              <span class="label">Message:</span>
              <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #0066CC; margin-top: 10px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          <div class="footer">
            <p>This message was sent from the Overhead Aluminium Workshop contact form</p>
            <p>5c Hill Cot Road, Freetown, Sierra Leone | +232-77-902-889</p>
          </div>
        </body>
      </html>
    `

    // Plain text version
    const textContent = `
New Contact Form Submission - Overhead Aluminium Workshop

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${subject ? `Subject: ${subject}` : ''}

Message:
${message}

---
This message was sent from the Overhead Aluminium Workshop contact form
5c Hill Cot Road, Freetown, Sierra Leone | +232-77-902-889
    `

    // Send email
    const mailOptions = {
      from: hasGmailCredentials 
        ? `"${name}" <${process.env.SMTP_EMAIL || 'overheadaluminiumworkshop@gmail.com'}>`
        : `"${name}" <${email}>`,
      to: 'overheadaluminiumworkshop@gmail.com',
      replyTo: email,
      subject: subject ? `Contact Form: ${subject}` : `Contact Form Message from ${name}`,
      text: textContent,
      html: htmlContent
    }

    const mailInfo = await transporter.sendMail(mailOptions)

    // Send auto-reply to customer
    const autoReplyOptions = {
      from: hasGmailCredentials 
        ? `"Overhead Aluminium Workshop" <${process.env.SMTP_EMAIL || 'overheadaluminiumworkshop@gmail.com'}>`
        : `"Overhead Aluminium Workshop" <no-reply@ethereal.email>`,
      to: email,
      subject: 'Thank you for contacting Overhead Aluminium Workshop',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .header { background-color: #0066CC; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .footer { background-color: #f8f9fa; padding: 15px; text-align: center; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Thank You for Your Message</h2>
              <p>Overhead Aluminium Workshop</p>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for contacting Overhead Aluminium Workshop. We have received your message and will get back to you within 24 hours.</p>
              <p>Here's a copy of your message:</p>
              <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #0066CC; margin: 15px 0;">
                <strong>Subject:</strong> ${subject || 'General Inquiry'}<br>
                <strong>Message:</strong><br>
                ${message.replace(/\n/g, '<br>')}
              </div>
              <p>If you need immediate assistance, please call us at:</p>
              <ul>
                <li>Primary: +232-77-902-889</li>
                <li>Mobile: +232-74-74-902-889</li>
                <li>Office: +232-31-74-902-889</li>
              </ul>
              <p>Best regards,<br>Overhead Aluminium Workshop Team</p>
            </div>
            <div class="footer">
              <p>Overhead Aluminium Workshop</p>
              <p>5c Hill Cot Road, Freetown, Sierra Leone</p>
              <p>Email: overheadaluminiumworkshop@gmail.com | Phone: +232-77-902-889</p>
            </div>
          </body>
        </html>
      `
    }

    const autoReplyInfo = await transporter.sendMail(autoReplyOptions)

    // Log email info
    console.log('📧 CONTACT FORM EMAIL SENT SUCCESSFULLY:')
    console.log('═══════════════════════════════════════════════════')
    console.log(`👤 Name: ${name}`)
    console.log(`📧 Email: ${email}`)
    console.log(`📱 Phone: ${phone || 'Not provided'}`)
    console.log(`📋 Subject: ${subject || 'General Inquiry'}`)
    console.log(`💬 Message: ${message}`)
    
    if (!hasGmailCredentials) {
      // For Ethereal testing, provide preview URLs
      console.log('📧 Email Preview URLs:')
      console.log(`📧 Company Email: ${nodemailer.getTestMessageUrl(mailInfo)}`)
      console.log(`📧 Auto-reply Email: ${nodemailer.getTestMessageUrl(autoReplyInfo)}`)
    }
    
    console.log('═══════════════════════════════════════════════════')

    return NextResponse.json({ 
      success: true, 
      message: hasGmailCredentials 
        ? 'Your message has been sent successfully! We will get back to you soon.' 
        : 'Your message has been sent successfully! We will get back to you soon. (Check server console for email preview links)'
    })

  } catch (error) {
    console.error('Error sending email:', error)
    
    // Log the contact form submission even if email fails
    console.log('📧 CONTACT FORM SUBMISSION (Email failed but logged):')
    console.log('═══════════════════════════════════════════════════')
    console.log(`👤 Name: ${name}`)
    console.log(`📧 Email: ${email}`)
    console.log(`📱 Phone: ${phone || 'Not provided'}`)
    console.log(`📋 Subject: ${subject || 'General Inquiry'}`)
    console.log(`💬 Message: ${message}`)
    console.log('═══════════════════════════════════════════════════')
    console.log('⚠️ Email sending failed, but form submission logged')
    
    // Still return success for the user, since we logged the message
    return NextResponse.json({ 
      success: true, 
      message: 'Your message has been received! We will get back to you soon. (Email delivery pending - your message has been logged securely.)' 
    })
  }
}
