import { Resend } from "resend";

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendInquiryNotification(params: {
  sellerEmail: string;
  sellerName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  message: string;
  listingTitle: string;
  listingUrl: string;
}) {
  const resend = getResendClient();
  if (!resend) return;

  const {
    sellerEmail,
    sellerName,
    buyerName,
    buyerEmail,
    buyerPhone,
    message,
    listingTitle,
    listingUrl,
  } = params;

  await resend.emails.send({
    from: "EraMarque <notifications@yt-pay.io>",
    to: sellerEmail,
    subject: `New inquiry for ${listingTitle}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f5f5f4;font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1c1917;padding:24px 32px;text-align:center;">
              <span style="font-size:22px;font-weight:700;color:#f59e0b;letter-spacing:2px;">ERAMARQUE</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#1c1917;">New inquiry for ${listingTitle}</h1>
              <p style="margin:0 0 24px;font-size:14px;color:#78716c;">Hi ${sellerName}, a buyer is interested in your listing.</p>

              <!-- Buyer Details -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafaf9;border-radius:8px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#a8a29e;text-transform:uppercase;letter-spacing:0.5px;">From</p>
                    <p style="margin:0 0 16px;font-size:15px;color:#1c1917;font-weight:500;">${buyerName}</p>

                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#a8a29e;text-transform:uppercase;letter-spacing:0.5px;">Email</p>
                    <p style="margin:0 0 16px;font-size:15px;color:#1c1917;">
                      <a href="mailto:${buyerEmail}" style="color:#d97706;text-decoration:none;">${buyerEmail}</a>
                    </p>

                    ${
                      buyerPhone
                        ? `
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#a8a29e;text-transform:uppercase;letter-spacing:0.5px;">Phone</p>
                    <p style="margin:0 0 16px;font-size:15px;color:#1c1917;">${buyerPhone}</p>
                    `
                        : ""
                    }

                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#a8a29e;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
                    <p style="margin:0;font-size:15px;color:#1c1917;line-height:1.5;white-space:pre-wrap;">${message}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Buttons -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <a href="${listingUrl}" style="display:inline-block;padding:12px 28px;background-color:#f59e0b;color:#1c1917;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">View Listing</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="mailto:${buyerEmail}?subject=Re: ${encodeURIComponent(listingTitle)}" style="display:inline-block;padding:12px 28px;background-color:#ffffff;color:#1c1917;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;border:1px solid #d6d3d1;">Reply to Buyer</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #e7e5e4;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a8a29e;">
                <a href="https://yt-pay.io" style="color:#a8a29e;text-decoration:none;">yt-pay.io</a> &mdash; Curated Classics & Beautiful Cars
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}

export async function sendReplyNotification(params: {
  buyerEmail: string;
  buyerName: string;
  sellerMessage: string;
  listingTitle: string;
  listingUrl: string;
}) {
  const resend = getResendClient();
  if (!resend) return;

  const { buyerEmail, buyerName, sellerMessage, listingTitle, listingUrl } =
    params;

  await resend.emails.send({
    from: "EraMarque <notifications@yt-pay.io>",
    to: buyerEmail,
    subject: `Reply to your inquiry — ${listingTitle}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f5f5f4;font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1c1917;padding:24px 32px;text-align:center;">
              <span style="font-size:22px;font-weight:700;color:#f59e0b;letter-spacing:2px;">ERAMARQUE</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#1c1917;">Seller replied to your inquiry</h1>
              <p style="margin:0 0 24px;font-size:14px;color:#78716c;">Hi ${buyerName}, the seller has responded regarding <strong>${listingTitle}</strong>.</p>

              <!-- Reply -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafaf9;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#a8a29e;text-transform:uppercase;letter-spacing:0.5px;">Seller's Reply</p>
                    <p style="margin:0;font-size:15px;color:#1c1917;line-height:1.6;white-space:pre-wrap;">${sellerMessage}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${listingUrl}" style="display:inline-block;padding:12px 28px;background-color:#f59e0b;color:#1c1917;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">View Listing</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #e7e5e4;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a8a29e;">
                <a href="https://yt-pay.io" style="color:#a8a29e;text-decoration:none;">yt-pay.io</a> &mdash; Curated Classics & Beautiful Cars
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
