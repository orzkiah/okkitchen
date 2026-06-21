import nodemailer from "nodemailer";
import { SITE } from "./constants";

const hasSmtp =
  !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

const transporter = hasSmtp
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

const FROM = process.env.SMTP_FROM ?? `${SITE.name} <no-reply@okkitchen.id>`;

async function send(to: string, subject: string, html: string) {
  if (!transporter) {
    // Dev fallback: log instead of failing when SMTP isn't configured.
    console.log(`\n📧 [DEV EMAIL] to=${to} subject="${subject}"\n${html}\n`);
    return;
  }
  await transporter.sendMail({ from: FROM, to, subject, html });
}

const shell = (title: string, body: string) => `
  <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a">
    <div style="text-align:center;margin-bottom:24px">
      <span style="display:inline-block;background:linear-gradient(135deg,#f97316,#fbbf24);color:#fff;font-weight:800;padding:8px 14px;border-radius:12px;font-size:18px">O'K Kitchen</span>
    </div>
    <div style="background:#fff;border:1px solid #f0e6da;border-radius:16px;padding:28px">
      <h1 style="font-size:20px;margin:0 0 12px">${title}</h1>
      ${body}
    </div>
    <p style="text-align:center;color:#9b8e80;font-size:12px;margin-top:20px">
      © ${new Date().getFullYear()} ${SITE.name} · ${SITE.tagline}
    </p>
  </div>`;

const button = (href: string, label: string) => `
  <a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#f97316,#fbbf24);color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:10px;margin:16px 0">${label}</a>`;

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await send(
    to,
    "Reset Password — O'K Kitchen",
    shell(
      "Reset Password Anda",
      `<p>Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah untuk membuat password baru. Tautan berlaku 1 jam.</p>
       ${button(resetUrl, "Reset Password")}
       <p style="font-size:13px;color:#777">Jika Anda tidak meminta ini, abaikan email ini.</p>`
    )
  );
}

export async function sendOrderInvoiceEmail(
  to: string,
  orderNumber: string,
  total: string,
  orderUrl: string
) {
  await send(
    to,
    `Invoice ${orderNumber} — O'K Kitchen`,
    shell(
      "Terima kasih atas pesanan Anda! 🎉",
      `<p>Pesanan <strong>${orderNumber}</strong> telah kami terima.</p>
       <p style="font-size:18px;font-weight:700">Total: ${total}</p>
       ${button(orderUrl, "Lihat Detail Pesanan")}
       <p style="font-size:13px;color:#777">Kami akan segera memproses pesanan Anda.</p>`
    )
  );
}
