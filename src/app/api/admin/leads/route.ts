import { NextRequest, NextResponse } from 'next/server';
import { getLeads, updateLeadStatus } from '@/lib/leadsStore';
import nodemailer from 'nodemailer';

export async function GET() {
  const leads = getLeads();
  return NextResponse.json({ success: true, count: leads.length, leads });
}

export async function POST(req: NextRequest) {
  try {
    const { leadId } = await req.json();
    const leads = getLeads();
    const lead = leads.find((l) => l.id === leadId);

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

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

    await transporter.sendMail({
      from,
      to: recipients,
      bcc: bccRecipients,
      replyTo: lead.email,
      subject: `[Retried] Contact Enquiry — ${lead.requirement || 'General'} | ${lead.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2>Contact Form Enquiry</h2>
          <p><strong>Name:</strong> ${lead.name}</p>
          <p><strong>Email:</strong> ${lead.email}</p>
          <p><strong>Phone:</strong> ${lead.phone || 'N/A'}</p>
          <p><strong>Purpose:</strong> ${lead.requirement || 'N/A'}</p>
          <p><strong>Message:</strong><br />${lead.message}</p>
        </div>
      `,
    });

    updateLeadStatus(leadId, 'sent', null);
    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
