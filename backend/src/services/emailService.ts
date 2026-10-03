import nodemailer from 'nodemailer';

const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_EMAIL || 'admissionbychoice@gmail.com';

interface EnquiryNotificationData {
  studentName: string;
  phone: string;
  email?: string;
  collegeName: string;
  preferredCourse: string;
  notes?: string;
  preferredState?: string;
}

export async function sendAdminEnquiryNotification(data: EnquiryNotificationData): Promise<boolean> {
  // If SMTP is configured, send live email
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user, pass }
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Admission by Choice" <no-reply@admissionbychoice.com>`,
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `🔔 New Admission Enquiry: ${data.studentName} for ${data.collegeName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #DCE5EF; border-radius: 12px;">
            <div style="background: #0757C9; padding: 15px; border-radius: 8px; text-align: center; color: white;">
              <h2 style="margin: 0;">Admission by Choice</h2>
              <p style="margin: 5px 0 0; font-size: 13px;">New Student Admission Request Received</p>
            </div>
            
            <div style="padding: 20px 0;">
              <h3 style="color: #12305A; margin-top: 0;">Enquiry Details:</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 8px 0; color: #5F6F82;"><strong>Student Name:</strong></td><td style="color: #12305A;">${data.studentName}</td></tr>
                <tr><td style="padding: 8px 0; color: #5F6F82;"><strong>Phone:</strong></td><td style="color: #0757C9; font-weight: bold;">${data.phone}</td></tr>
                ${data.email ? `<tr><td style="padding: 8px 0; color: #5F6F82;"><strong>Email:</strong></td><td>${data.email}</td></tr>` : ''}
                <tr><td style="padding: 8px 0; color: #5F6F82;"><strong>College:</strong></td><td style="color: #12305A; font-weight: bold;">${data.collegeName}</td></tr>
                <tr><td style="padding: 8px 0; color: #5F6F82;"><strong>Preferred Course:</strong></td><td>${data.preferredCourse}</td></tr>
                ${data.preferredState ? `<tr><td style="padding: 8px 0; color: #5F6F82;"><strong>Preferred State:</strong></td><td>${data.preferredState}</td></tr>` : ''}
                ${data.notes ? `<tr><td style="padding: 8px 0; color: #5F6F82;"><strong>Notes / Message:</strong></td><td>${data.notes}</td></tr>` : ''}
              </table>
            </div>

            <div style="border-top: 1px solid #DCE5EF; padding-top: 15px; text-align: center; font-size: 12px; color: #5F6F82;">
              Log in to the <a href="https://admissionbychoice.com/admin" style="color: #0757C9; font-weight: bold;">Admin Dashboard</a> to manage and respond to this lead.
            </div>
          </div>
        `
      });
      console.log(`📧 [Notification] Email alert sent to ${ADMIN_NOTIFICATION_EMAIL} for ${data.studentName}`);
      return true;
    } catch (err: any) {
      console.error('⚠️ [Notification] Failed to send email alert:', err.message);
      return false;
    }
  } else {
    // Graceful fallback when SMTP credentials are not yet defined in environment
    console.log(`ℹ️ [Notification] New lead registered in PostgreSQL for ${data.studentName} (${data.phone}) - target: ${ADMIN_NOTIFICATION_EMAIL} (SMTP not configured)`);
    return true;
  }
}
