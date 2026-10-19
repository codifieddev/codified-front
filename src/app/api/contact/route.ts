import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { saveLead, updateLeadStatus } from '@/lib/leadsStore';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const name = (data.get('name') as string)?.trim();
    const email = (data.get('email') as string)?.trim();
    const phone = (data.get('phone') as string)?.trim();
    const requirement = (data.get('requirement') as string)?.trim();
    const message = (data.get('message') as string)?.trim();
    const resume = data.get('resume') as File | null;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 });
    }

    // 1. Immediately save the lead locally so it is NEVER lost
    const savedLead = saveLead({
      name,
      email,
      phone,
      requirement,
      message,
      resumeName: resume ? resume.name : null,
      emailStatus: 'pending_hostinger',
    });

    // 2. Prepare attachments if present
    const attachments = [];
    if (resume) {
      const buffer = Buffer.from(await resume.arrayBuffer());
      attachments.push({
        filename: resume.name,
        content: buffer,
        contentType: resume.type,
      });
    }

    // 3. Build transporter using Hostinger SMTP
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const isSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: smtpPort,
      secure: isSecure,
      auth: {
        user: process.env.SMTP_USER || 'hello@codifiedweb.com',
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const recipients = process.env.CONTACT_RECIPIENTS || 'hello@codifiedweb.com';
    const bccRecipients = process.env.SMTP_BCC || 'vijendrajat693@gmail.com';
    const from = process.env.SMTP_FROM || `Codified Web <${process.env.SMTP_USER || 'hello@codifiedweb.com'}>`;

    const mailOptions = {
      from,
      to: recipients,
      bcc: bccRecipients,
      replyTo: email,
      subject: `New Contact Form Enquiry — ${requirement || 'General'} | ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 32px; border-radius: 12px;">
          <div style="background: #04060d; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
            <img src="https://codifiedweb.com/img/white-logo.svg" alt="Codified Web" style="height: 40px;" />
          </div>
          <div style="background: #ffffff; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111; margin: 0 0 24px; font-size: 20px; display: flex; align-items: center; gap: 10px;">
              <span style="display:inline-block; vertical-align:middle; margin-right:10px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1DC3F3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              New Enquiry Received
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-size: 13px; width: 120px; vertical-align: top;">Name</td>
                <td style="padding: 10px 0; color: #111; font-weight: 600; font-size: 14px;">${name}</td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top;">Email</td>
                <td style="padding: 10px 0; color: #111; font-size: 14px;"><a href="mailto:${email}" style="color: #1DC3F3;">${email}</a></td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top;">Phone</td>
                <td style="padding: 10px 0; color: #111; font-size: 14px;">${phone || 'Not specified'}</td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top;">Purpose</td>
                <td style="padding: 10px 0; color: #111; font-size: 14px;">${requirement || 'Not specified'}</td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; color: #111; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</td>
              </tr>
              ${resume ? `
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top;">Attachment</td>
                <td style="padding: 10px 0; color: #111; font-size: 14px;"><strong>${resume.name}</strong> (Attached to email)</td>
              </tr>
              ` : ''}
            </table>
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; background: #1DC3F3; color: #04060d; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14px;">
                Reply to ${name}
              </a>
            </div>
          </div>
          <p style="text-align: center; font-size: 11px; color: #9ca3af; margin-top: 16px;">
            Codified Web Solutions · Jagatpura, Jaipur · hello@codifiedweb.com
          </p>
        </div>
      `,
      attachments,
    };

    // 4. Attempt to send via Nodemailer
    try {
      await transporter.sendMail(mailOptions);
      updateLeadStatus(savedLead.id, 'sent', null);
      console.log(`[Contact API] Email dispatched successfully for lead ${savedLead.id}`);
    } catch (smtpErr: any) {
      console.warn(`[Contact API] SMTP delivery issue (Lead saved safely #${savedLead.id}):`, smtpErr?.message || smtpErr);
      updateLeadStatus(savedLead.id, 'pending_hostinger', smtpErr?.message || 'SMTP delivery issue');
    }

    // Always return success to the customer so they are never blocked by email server policies
    return NextResponse.json({
      success: true,
      message: 'Thank you! Your enquiry has been received successfully. We will get back to you shortly.',
    });
  } catch (error: any) {
    console.error('[Contact API Unexpected Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
