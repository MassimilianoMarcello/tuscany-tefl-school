"use server"

// actions/apply.ts
import { prisma } from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { applicationSchema, type ApplicationFormData } from "@/lib/apply-schema"


// ─── Result type ─────────────────────────────────────────────────────────────

export type ActionResult =
  | { success: true }
  | { success: false; error: string }



// ─── Server Action ───────────────────────────────────────────────────────────

export async function submitApplication(
  data: ApplicationFormData
): Promise<ActionResult> {
  const parsed = applicationSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data. Please check your inputs." }
  }

  const d = parsed.data

  try {
    await prisma.application.create({
      data: {
        courseType: d.courseType,
        location: d.location,
        firstName: d.firstName,
        lastName: d.lastName,
        gender: d.gender,
        dateOfBirth: new Date(d.dateOfBirth),
        email: d.email,
        address: `${d.address} ${d.streetNumber}`.trim(),
        city: d.city,
        postCode: d.postCode,
        country: d.country,
        phone: d.phone,
        fax: d.fax,
        skype: d.skype,
        nativeEnglishSpeaker: d.nativeEnglishSpeaker,
        currentProfession: d.currentProfession,
        focusOfStudies: d.focusOfStudies,
        university: d.university,
        passportsHeld: d.passportsHeld,
        previousTeachingExp: d.previousTeachingExp,
        requiresAccommodation: d.requiresAccommodation,
        specialRequirements: d.specialRequirements,
        hasDyslexia: d.hasDyslexia,
        psychologicalDisorder: d.psychologicalDisorder,
        healthCondition: d.healthCondition,
        suitableToTeachChildren: d.suitableToTeachChildren,
        specialNeeds: d.specialNeeds,
        criminalOffense: d.criminalOffense,
        motivation: d.motivation,
        additionalComments: d.additionalComments,
        termsAccepted: d.termsAccepted,
        dataConsent: d.dataConsent,
      },
    })

    const courseName =
      d.courseType === "TESOL_TEFL_CERTIFICATION"
        ? "TESOL/TEFL Certification Program"
        : "Online/Distance TESOL/TEFL Certification"

    const locationName = d.location === "TUSCANY" ? "Tuscany, Italy" : "Uruguay"

    void resend.emails.send({
      from: "TEFL Tuscany <onboarding@resend.dev>",
      to: d.email,
      subject: "We received your application — TEFL Tuscany",
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1f3d4b;">
          <div style="background-color: #1f3d4b; padding: 24px 32px;">
            <h1 style="color: #ffd704; margin: 0; font-size: 24px;">TEFL Tuscany</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="margin-top: 0;">Thank you, ${d.firstName}!</h2>
            <p>We have received your application for the <strong>${courseName}</strong> in <strong>${locationName}</strong>.</p>
            <p>Our team will review your application and get back to you shortly with the next steps, including details on the <strong>USD $500 deposit</strong>.</p>
            <div style="background-color: #eceff0; padding: 16px 20px; border-left: 4px solid #ffd704; margin: 24px 0;">
              <p style="margin: 0; font-size: 14px; color: #555;">
                Please note: the deposit is non-refundable. Make sure you plan to attend before making any payment.
              </p>
            </div>
            <p>If you have any questions in the meantime, feel free to reply to this email.</p>
            <p style="margin-bottom: 0;">The TEFL Tuscany Team</p>
          </div>
          <div style="background-color: #eceff0; padding: 16px 32px; font-size: 12px; color: #888;">
            TEFL Tuscany · Florence, Tuscany, Italy
          </div>
        </div>
      `,
    })

    void resend.emails.send({
      from: "TEFL Tuscany Applications <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL ?? "admin@tefltuscany.com",
      subject: `New Application — ${d.firstName} ${d.lastName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1f3d4b;">
          <div style="background-color: #1f3d4b; padding: 24px 32px;">
            <h1 style="color: #ffd704; margin: 0; font-size: 20px;">New Course Application</h1>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              ${row("Name", `${d.firstName} ${d.lastName}`)}
              ${row("Email", d.email)}
              ${row("Phone", d.phone)}
              ${row("Course", courseName)}
              ${row("Location", locationName)}
              ${row("Date of Birth", d.dateOfBirth)}
              ${row("Nationality", d.passportsHeld ?? "—")}
              ${row("Native English", d.nativeEnglishSpeaker ? "Yes" : "No")}
              ${row("Accommodation", d.requiresAccommodation ? "Yes" : "No")}
              ${row("Criminal Offense", d.criminalOffense ? "Yes" : "No")}
            </table>
            <div style="margin-top: 24px;">
              <strong>Motivation:</strong>
              <p style="background: #eceff0; padding: 12px; border-radius: 4px;">${d.motivation}</p>
            </div>
            ${d.additionalComments ? `<div><strong>Additional Comments:</strong><p style="background: #eceff0; padding: 12px; border-radius: 4px;">${d.additionalComments}</p></div>` : ""}
          </div>
        </div>
      `,
    })

    return { success: true }
  } catch (err) {
    console.error("Application submission error:", err)
    return { success: false, error: "Something went wrong. Please try again later." }
  }
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eceff0; font-weight: 600; width: 40%;">${label}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eceff0;">${value}</td>
    </tr>
  `
}