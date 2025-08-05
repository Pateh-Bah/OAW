# Email Configuration Guide for OAW Contact Form

## Overview
The contact form now has full email functionality implemented using nodemailer with Gmail SMTP. When users submit the contact form, it will:

1. Send the message to the company email (overheadaluminiumworkshop@gmail.com)
2. Send an auto-reply confirmation to the customer
3. Provide proper error handling and user feedback

## Setup Requirements

### 1. Gmail App Password Setup

For production use, you'll need to set up a Gmail App Password:

1. **Enable 2-Factor Authentication** on the Gmail account (overheadaluminiumworkshop@gmail.com)
2. **Generate App Password**:
   - Go to Google Account settings
   - Navigate to Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### 2. Environment Variables

Update your `.env.local` file with the Gmail App Password:

```bash
# Email Configuration (for contact form)
SMTP_EMAIL=overheadaluminiumworkshop@gmail.com
SMTP_PASSWORD=your-16-character-app-password
# Alternative: Use GMAIL_APP_PASSWORD instead of SMTP_PASSWORD
GMAIL_APP_PASSWORD=your-16-character-app-password
```

**Important:** Never commit the actual password to version control!

### 3. Production Deployment

For production deployment, make sure to:

1. Set the environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Use the actual Gmail App Password
3. Test the functionality after deployment

## Features Implemented

### Contact Form API (`/app/api/contact/route.ts`)
- **POST endpoint** at `/api/contact`
- **Validation** for required fields (name, email, message)
- **Email sending** to company email with professional HTML formatting
- **Auto-reply** to customer with confirmation
- **Error handling** with appropriate status codes

### Enhanced Contact Form (`/app/contact/page.tsx`)
- **Real-time form submission** with loading states
- **Success/error feedback** with visual indicators
- **Form validation** and proper error handling
- **Professional UI** with loading spinner during submission

### Email Templates
- **Company notification email** with professional formatting
- **Customer auto-reply** with company branding
- **HTML and plain text** versions for compatibility

## Email Features

### Company Notification Email
- Professional HTML template with company branding
- All form fields included (name, email, phone, subject, message)
- Reply-to set to customer's email for easy response
- Company footer with contact information

### Customer Auto-Reply
- Thank you message with company branding
- Copy of their submitted message
- Company contact information
- Professional appearance matching company website

## Testing

### Development Testing
1. Fill out the contact form on `/contact`
2. Check browser console for any errors
3. Verify form submission feedback

### Production Testing
1. Submit a test message through the contact form
2. Check the company email inbox
3. Verify customer receives auto-reply
4. Test with various form data combinations

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Verify Gmail App Password is correct
   - Ensure 2-Factor Authentication is enabled
   - Check environment variables are set correctly

2. **"Network error"**
   - Check internet connection
   - Verify API route is accessible
   - Check server logs for detailed errors

3. **"Failed to send message"**
   - Check Gmail account status
   - Verify SMTP settings
   - Check for rate limiting

### Environment Variables Check
```bash
# Verify environment variables are loaded
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL)
console.log('SMTP_PASSWORD exists:', !!process.env.SMTP_PASSWORD)
```

## Security Considerations

1. **Environment Variables**: Never expose email credentials in client-side code
2. **Rate Limiting**: Consider implementing rate limiting for the API endpoint
3. **Validation**: Server-side validation prevents malicious submissions
4. **CORS**: API route only accepts POST requests from same origin

## Monitoring

### Success Metrics
- Email delivery success rate
- Customer auto-reply delivery
- Form submission completion rate

### Error Monitoring
- API endpoint errors
- SMTP connection failures
- Form validation errors

## Future Enhancements

Potential improvements for the future:
1. **Attachment support** for project files
2. **SMS notifications** for urgent inquiries
3. **CRM integration** for lead management
4. **Email templates** for different inquiry types
5. **Analytics tracking** for form submissions

## Support

If you encounter issues with the email functionality:
1. Check the browser console for client-side errors
2. Review server logs for API errors
3. Verify Gmail account settings and app password
4. Test with different email providers

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Contact:** Technical Support
