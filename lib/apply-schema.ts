// lib/apply-schema.ts
import { z } from "zod"

// ─── Postcode validation per country ─────────────────────────────────────────

const postcodePatterns: Record<string, RegExp> = {
  "United States": /^\d{5}(-\d{4})?$/,
  "United Kingdom": /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i,
  Italy: /^\d{5}$/,
  Germany: /^\d{5}$/,
  France: /^\d{5}$/,
  Spain: /^\d{5}$/,
  Australia: /^\d{4}$/,
  Canada: /^[A-Z]\d[A-Z]\s*\d[A-Z]\d$/i,
  Netherlands: /^\d{4}\s*[A-Z]{2}$/i,
  Belgium: /^\d{4}$/,
  Switzerland: /^\d{4}$/,
  Austria: /^\d{4}$/,
  Portugal: /^\d{4}-\d{3}$/,
  Brazil: /^\d{5}-?\d{3}$/,
  Japan: /^\d{3}-?\d{4}$/,
}

export function validatePostcode(postCode: string, country: string): boolean {
  const pattern = postcodePatterns[country]
  if (!pattern) return true // unknown country — accept any format
  return pattern.test(postCode.trim())
}

// ─── Schema ───────────────────────────────────────────────────────────────────

export const applicationSchema = z
  .object({
    // Course
    courseType: z.enum(["TESOL_TEFL_CERTIFICATION", "ONLINE_DISTANCE_TESOL_TEFL"]),
    location: z.enum(["TUSCANY", "URUGUAY"]),

    // Personal
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
    dateOfBirth: z.string().min(1, "Required"),
    email: z.string().email("Invalid email"),
    address: z.string().min(1, "Required"),
  streetNumber: z.string().min(1, "Required"),
    city: z.string().min(1, "Required"),
    postCode: z.string().min(1, "Required"),
    country: z.string().min(1, "Required"),

    // Contact
    phone: z.string().min(1, "Required"),
    fax: z.string().optional(),
    skype: z.string().optional(),

    // Background
    nativeEnglishSpeaker: z.boolean(),
    currentProfession: z.string().optional(),
    focusOfStudies: z.string().optional(),
    university: z.string().optional(),
    passportsHeld: z.string().optional(),
    previousTeachingExp: z.string().optional(),

    // Stay
    requiresAccommodation: z.boolean(),
    specialRequirements: z.string().optional(),

    // Health & eligibility
    hasDyslexia: z.boolean(),
    psychologicalDisorder: z.string().optional(),
    healthCondition: z.string().optional(),
    suitableToTeachChildren: z.boolean(),
    specialNeeds: z.string().optional(),
    criminalOffense: z.boolean(),

    // Motivation
    motivation: z.string().min(10, "Please tell us a bit more"),
    additionalComments: z.string().optional(),

    // Legal
    termsAccepted: z.literal(true, { message: "You must accept the terms and conditions" }),
    dataConsent: z.literal(true, { message: "You must give data consent" }),
  })
  .refine(
    (data) => validatePostcode(data.postCode, data.country),
    {
      message: "Invalid postcode format for the selected country",
      path: ["postCode"],
    }
  )

export type ApplicationFormData = z.infer<typeof applicationSchema>