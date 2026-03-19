"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderLinkEmail(orderLink: string, memberEmail: string, clubName: string, startDate: string, endDate: string, date: string) {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "jarne.tekin@hotmail.com",
    subject: "Your fitting day is scheduled!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #1a202c; text-align: center;">Your Fitting Day at ${clubName}</h2>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.5;">
          Dear club member,<br><br>
          A new fitting day has been scheduled for your club <strong>${clubName}</strong>.
        </p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
          <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 12px;">Fitting Day Details</h3>
          <p style="margin: 4px 0; color: #4a5568;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 4px 0; color: #4a5568;"><strong>Time:</strong> ${startDate} - ${endDate}</p>
        </div>

        <p style="color: #4a5568; font-size: 16px; line-height: 1.5; text-align: center;">
          Via the button below you can select your kit items and sizes.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${orderLink}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
            Select My Kit
          </a>
        </div>
        <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 30px;">
          This link is personal and specific to your profile. Do not share it with others.<br>
          If the button doesn't work, copy the link into your browser.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Error sending email:", error);
    return { error };
  }

  return { data };
}

export async function sendReminderEmail(
  memberEmail: string,
  memberName: string,
  clubName: string,
  date: string,
  startTime: string,
  endTime: string,
  location: string | null,
  orderToken: string | null
) {
  const orderLink = orderToken
    ? `${process.env.NEXT_PUBLIC_APP_URL}/order/${orderToken}`
    : null;

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: memberEmail,
    subject: `Reminder: je pasdag bij ${clubName} is morgen!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #1a202c; text-align: center;">Reminder: pasdag morgen bij ${clubName}!</h2>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.5;">
          Hallo ${memberName},<br><br>
          Een korte herinnering: morgen is de pasdag van <strong>${clubName}</strong>.
        </p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
          <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 12px;">Details pasdag</h3>
          <p style="margin: 4px 0; color: #4a5568;"><strong>Datum:</strong> ${date}</p>
          <p style="margin: 4px 0; color: #4a5568;"><strong>Tijdstip:</strong> ${startTime} - ${endTime}</p>
          ${location ? `<p style="margin: 4px 0; color: #4a5568;"><strong>Locatie:</strong> ${location}</p>` : ""}
        </div>

        ${orderLink ? `
        <p style="color: #4a5568; font-size: 16px; line-height: 1.5; text-align: center;">
          Heb je jouw kledij nog niet geselecteerd? Doe dit via de knop hieronder.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${orderLink}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
            Selecteer mijn kledij
          </a>
        </div>
        <p style="color: #a0aec0; font-size: 12px; text-align: center; margin-top: 30px;">
          Deze link is persoonlijk en specifiek voor jouw profiel. Deel deze niet met anderen.
        </p>
        ` : ""}
      </div>
    `,
  });

  if (error) {
    console.error("Error sending email:", error);
    return { error };
  }

  return { data };
}

