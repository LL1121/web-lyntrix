import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
    }

    const resend = new Resend(apiKey);

    const { name, email, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    await resend.emails.send({
      // Use Resend's test domain for now — replace with your verified domain in production
      from: "Lyntrix Contact <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL ?? "contact@lyntrix.com"],
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 32px; border-radius: 12px;">
          <div style="margin-bottom: 24px;">
            <img src="https://lyntrix.com/logo.png" alt="Lyntrix" style="height: 28px;" />
          </div>
          <h2 style="color: #00D2FF; font-size: 20px; margin: 0 0 24px;">New project inquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); font-size: 13px; width: 100px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 15px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); font-size: 13px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 15px;"><a href="mailto:${email}" style="color: #00D2FF;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: rgba(255,255,255,0.5); font-size: 13px; vertical-align: top;">Message</td>
              <td style="padding: 12px 0; font-size: 15px; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</td>
            </tr>
          </table>
          <p style="margin-top: 32px; font-size: 12px; color: rgba(255,255,255,0.3);">Sent via lyntrix.com contact form</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Contact API]", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
