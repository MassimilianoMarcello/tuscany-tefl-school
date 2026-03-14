"use client"

// components/apply/ApplicationForm.tsx
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2 } from "lucide-react"
import PhoneInput from "react-phone-number-input"
import type { Country as PhoneCountry } from "react-phone-number-input"
import { Country, City } from "country-state-city"
import "react-phone-number-input/style.css"
import { submitApplication } from "@/actions/apply"
import { applicationSchema, type ApplicationFormData } from "@/lib/apply-schema"
import { AddressAutocomplete } from "./AddressAutocomplete"
import { PostcodeInput } from "./PostcodeInput"


// ─── Helpers ──────────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-red-500 text-xs mt-1">{message}</p>
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-black text-white bg-brand-blue px-4 py-3 uppercase tracking-wide border-l-4 border-brand-gold mt-10 mb-6 first:mt-0">
      {children}
    </h2>
  )
}

function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
}: {
  label: string
  name: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  error?: string
}) {
  return (
    <div>
      <Label className="text-brand-blue font-semibold mb-2 block">{label}</Label>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`
              flex items-center gap-2 px-4 py-2 border-2 cursor-pointer text-sm font-medium transition-colors
              ${value === opt.value
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-brand-azure text-brand-blue hover:border-brand-blue"}
            `}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {opt.label}
          </label>
        ))}
      </div>
      <FieldError message={error} />
    </div>
  )
}

function YesNo({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: boolean | undefined
  onChange: (v: boolean) => void
  error?: string
}) {
  return (
    <div>
      <Label className="text-brand-blue font-semibold mb-2 block">{label}</Label>
      <div className="flex gap-3">
        {[true, false].map((opt) => (
          <label
            key={String(opt)}
            className={`
              flex items-center gap-2 px-5 py-2 border-2 cursor-pointer text-sm font-bold transition-colors
              ${value === opt
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-brand-azure text-brand-blue hover:border-brand-blue"}
            `}
          >
            <input
              type="radio"
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            {opt ? "Yes" : "No"}
          </label>
        ))}
      </div>
      <FieldError message={error} />
    </div>
  )
}

// ─── IP geolocation → ISO country code ───────────────────────────────────────

async function detectCountryFromIP(): Promise<PhoneCountry | undefined> {
  try {
    const res = await fetch("https://ipapi.co/json/")
    const data = await res.json()
    return data.country_code as PhoneCountry
  } catch {
    return undefined
  }
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry | undefined>(undefined)

  // Detect country from IP on mount
  useEffect(() => {
    detectCountryFromIP().then((code) => {
      if (code) setPhoneCountry(code)
    })
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      requiresAccommodation: false,
      hasDyslexia: false,
      suitableToTeachChildren: true,
      criminalOffense: false,
      nativeEnglishSpeaker: false,
    },
  })

  const selectedCountry = watch("country")

  // When user picks a country in the form → update phone prefix too
  const handleCountryChange = (countryName: string) => {
    setValue("country", countryName, { shouldValidate: true })
    setValue("city", "", { shouldValidate: false })
    setValue("postCode", "", { shouldValidate: false })

    // Find ISO code to update phone prefix
    const iso = Country.getAllCountries().find(
      (c) => c.name === countryName
    )?.isoCode as PhoneCountry | undefined
    if (iso) setPhoneCountry(iso)
  }

  const countryISO = Country.getAllCountries().find(
    (c) => c.name === selectedCountry
  )?.isoCode

  const onSubmit = async (data: ApplicationFormData) => {
    setServerError(null)
    const result = await submitApplication(data)
    if (result.success) {
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      setServerError(result.error)
    }
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <CheckCircle2 className="h-16 w-16 text-brand-green" />
        <h2 className="text-3xl font-black text-brand-blue">
          Application Submitted!
        </h2>
        <p className="text-brand-blue/70 max-w-md text-lg">
          Thank you for applying. We&apos;ve sent a confirmation to your email
          and will be in touch shortly with the next steps.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* ── Course Selection ─────────────────────────────────────────── */}
      <SectionTitle>Course Selection</SectionTitle>

      <RadioGroup
        label="What course are you applying to? *"
        name="courseType"
        options={[
          { value: "TESOL_TEFL_CERTIFICATION", label: "TESOL/TEFL Certification Program" },
          { value: "ONLINE_DISTANCE_TESOL_TEFL", label: "Online/Distance TESOL/TEFL Certification" },
        ]}
        value={watch("courseType") ?? ""}
        onChange={(v) => setValue("courseType", v as ApplicationFormData["courseType"], { shouldValidate: true })}
        error={errors.courseType?.message}
      />

      <RadioGroup
        label="Which location are you interested in? *"
        name="location"
        options={[
          { value: "TUSCANY", label: "Tuscany, Italy" },
          { value: "URUGUAY", label: "Uruguay" },
        ]}
        value={watch("location") ?? ""}
        onChange={(v) => setValue("location", v as ApplicationFormData["location"], { shouldValidate: true })}
        error={errors.location?.message}
      />

      {/* ── Personal Information ─────────────────────────────────────── */}
      <SectionTitle>Personal Information</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-brand-blue font-semibold">First Name *</Label>
          <Input {...register("firstName")} className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue" />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div>
          <Label className="text-brand-blue font-semibold">Last Name *</Label>
          <Input {...register("lastName")} className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue" />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      <RadioGroup
        label="Gender *"
        name="gender"
        options={[
          { value: "MALE", label: "Male" },
          { value: "FEMALE", label: "Female" },
          { value: "OTHER", label: "Other" },
          { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
        ]}
        value={watch("gender") ?? ""}
        onChange={(v) => setValue("gender", v as ApplicationFormData["gender"], { shouldValidate: true })}
        error={errors.gender?.message}
      />

      <div>
        <Label className="text-brand-blue font-semibold">Date of Birth *</Label>
        <Input
          type="date"
          {...register("dateOfBirth")}
          className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue max-w-xs"
        />
        <FieldError message={errors.dateOfBirth?.message} />
      </div>

      <div>
        <Label className="text-brand-blue font-semibold">Email *</Label>
        <Input
          type="email"
          {...register("email")}
          className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue"
        />
        <FieldError message={errors.email?.message} />
      </div>

      {/* ── Address ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        {/* Street autocomplete — takes 3/4 */}
        <div className="md:col-span-3">
          <AddressAutocomplete
            onSelect={({ address, city, postCode, country }) => {
              setValue("address", address, { shouldValidate: true })
              setValue("city", city, { shouldValidate: true })
              setValue("postCode", postCode, { shouldValidate: true })
              setValue("country", country, { shouldValidate: true })
              // Update phone prefix when address fills country
              const iso = Country.getAllCountries().find(
                (c) => c.name === country
              )?.isoCode as PhoneCountry | undefined
              if (iso) setPhoneCountry(iso)
            }}
            error={errors.address?.message}
          />
        </div>

        {/* Street number — 1/4 */}
        <div>
          <Label className="text-brand-blue font-semibold">Number *</Label>
          <Input
            {...register("streetNumber")}
            placeholder="e.g. 12A"
            className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue"
          />
          <FieldError message={errors.streetNumber?.message} />
        </div>
      </div>

      {/* Country / City / Postcode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label className="text-brand-blue font-semibold">Country *</Label>
          <select
            value={watch("country") ?? ""}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="mt-1 w-full border-2 border-brand-azure bg-white text-brand-blue px-3 py-2 text-sm focus:outline-none focus:border-brand-blue"
          >
            <option value="">Select country</option>
            {Country.getAllCountries().map((c) => (
              <option key={c.isoCode} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          <FieldError message={errors.country?.message} />
        </div>

        <div>
          <Label className="text-brand-blue font-semibold">City *</Label>
          {countryISO && City.getCitiesOfCountry(countryISO)?.length ? (
            <select
              {...register("city")}
              className="mt-1 w-full border-2 border-brand-azure bg-white text-brand-blue px-3 py-2 text-sm focus:outline-none focus:border-brand-blue"
            >
              <option value="">Select city</option>
              {City.getCitiesOfCountry(countryISO)?.map((city) => (
                <option key={`${city.name}-${city.stateCode}`} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          ) : (
            <Input
              {...register("city")}
              className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue"
              placeholder="Enter city"
            />
          )}
          <FieldError message={errors.city?.message} />
        </div>

        <PostcodeInput
            value={watch("postCode") ?? ""}
            country={selectedCountry ?? ""}
            onChange={(v) => setValue("postCode", v, { shouldValidate: true })}
            onBlur={() => {}}
            error={errors.postCode?.message}
          />
      </div>

      {/* ── Contact Information ──────────────────────────────────────── */}
      <SectionTitle>Contact Information</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Label className="text-brand-blue font-semibold mb-1 block">
            Phone *
            {phoneCountry && (
              <span className="text-brand-blue/40 text-xs font-normal ml-2">
                prefix auto-detected from your location
              </span>
            )}
          </Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                international
                defaultCountry={phoneCountry}
                country={phoneCountry}
                value={field.value}
                onChange={(val) => field.onChange(val ?? "")}
                className="phone-input"
              />
            )}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div>
          <Label className="text-brand-blue font-semibold">Skype</Label>
          <Input
            {...register("skype")}
            className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue"
            placeholder="skype.username"
          />
        </div>
      </div>

      <div>
        <Label className="text-brand-blue font-semibold">Fax</Label>
        <Input
          {...register("fax")}
          className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue max-w-xs"
        />
      </div>

      <YesNo
        label="Are you a native English speaker? *"
        value={watch("nativeEnglishSpeaker")}
        onChange={(v) => setValue("nativeEnglishSpeaker", v, { shouldValidate: true })}
        error={errors.nativeEnglishSpeaker?.message}
      />

      {/* ── Education & Background ───────────────────────────────────── */}
      <SectionTitle>Education & Background</SectionTitle>

      <div>
        <Label className="text-brand-blue font-semibold">Current Profession</Label>
        <Input {...register("currentProfession")} className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-brand-blue font-semibold">Focus of Studies</Label>
          <Input {...register("focusOfStudies")} className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue" />
        </div>
        <div>
          <Label className="text-brand-blue font-semibold">Name of University / College</Label>
          <Input {...register("university")} className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue" />
        </div>
      </div>

      <div>
        <Label className="text-brand-blue font-semibold">Passports Held (list countries)</Label>
        <Input {...register("passportsHeld")} className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue" />
      </div>

      <div>
        <Label className="text-brand-blue font-semibold">Previous Teaching Experience</Label>
        <Textarea {...register("previousTeachingExp")} rows={3} className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue" />
      </div>

      {/* ── Accommodation ────────────────────────────────────────────── */}
      <SectionTitle>Accommodation & Special Requirements</SectionTitle>

      <YesNo
        label="Will you require accommodation during your stay in Florence?"
        value={watch("requiresAccommodation")}
        onChange={(v) => setValue("requiresAccommodation", v, { shouldValidate: true })}
      />

      <div>
        <Label className="text-brand-blue font-semibold">Special Requirements</Label>
        <Textarea {...register("specialRequirements")} rows={3} className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue" />
      </div>

      {/* ── Health & Eligibility ─────────────────────────────────────── */}
      <SectionTitle>Health & Eligibility</SectionTitle>

      <YesNo
        label="Have you ever been diagnosed with dyslexia? *"
        value={watch("hasDyslexia")}
        onChange={(v) => setValue("hasDyslexia", v, { shouldValidate: true })}
        error={errors.hasDyslexia?.message}
      />

      <div>
        <Label className="text-brand-blue font-semibold">
          Have you ever been diagnosed with a psychological disorder that would affect your participation?
        </Label>
        <Textarea {...register("psychologicalDisorder")} rows={3} className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue" placeholder="If yes, please describe. Leave blank if not applicable." />
      </div>

      <div>
        <Label className="text-brand-blue font-semibold">
          Do you suffer from any health condition that would affect your performance on the course?
        </Label>
        <Textarea {...register("healthCondition")} rows={3} className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue" placeholder="If yes, please describe. Leave blank if not applicable." />
      </div>

      <YesNo
        label="Are you suitable to teach children? *"
        value={watch("suitableToTeachChildren")}
        onChange={(v) => setValue("suitableToTeachChildren", v, { shouldValidate: true })}
        error={errors.suitableToTeachChildren?.message}
      />

      <div>
        <Label className="text-brand-blue font-semibold">Do you have any special needs?</Label>
        <Textarea {...register("specialNeeds")} rows={2} className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue" placeholder="Leave blank if not applicable." />
      </div>

      <YesNo
        label="Have you ever been convicted of a criminal offense? *"
        value={watch("criminalOffense")}
        onChange={(v) => setValue("criminalOffense", v, { shouldValidate: true })}
        error={errors.criminalOffense?.message}
      />

      {/* ── Motivation ───────────────────────────────────────────────── */}
      <SectionTitle>Motivation</SectionTitle>

      <div>
        <Label className="text-brand-blue font-semibold">Why are you interested in taking our course? *</Label>
        <Textarea
          {...register("motivation")}
          rows={5}
          className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue"
          placeholder="Please briefly describe your motivation..."
        />
        <FieldError message={errors.motivation?.message} />
      </div>

      <div>
        <Label className="text-brand-blue font-semibold">Additional Comments</Label>
        <Textarea {...register("additionalComments")} rows={3} className="mt-1 rounded-none border-brand-azure focus-visible:ring-brand-blue" />
      </div>

      {/* ── Terms & Consent ──────────────────────────────────────────── */}
      <SectionTitle>Terms & Conditions</SectionTitle>

      <div className="bg-brand-bg border border-brand-azure p-6 text-sm text-brand-blue/70 leading-relaxed max-h-48 overflow-y-auto">
        Your initial application should be completed on the center&apos;s own internet application form.
        After successful application, you will be asked to pay a deposit of USD$500 which is non refundable.
        If for any reason you wish to subsequently cancel your place on the course after your part or full fees
        have been paid, TEFL Tuscany cannot provide any refund. Please be sure you plan to attend the course
        before you make the payments. As part of our pre-screening process, applicants are requested to submit
        an account of their personal history and background. Inaccuracies or fraudulent claims in the application
        are grounds for dismissal from the course. Cancellations are extremely rare. Yet, if for some reason we
        cancel a course, we will offer trainees a full refund, transfer to another course, or priority enroll in a
        future course. The TEFL International TESOL certificate is not graded and the final certificate will usually
        be available on the last day of the course. All course members are liable to the disciplinary regulations
        of the center.
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register("termsAccepted")} className="mt-1 h-4 w-4 accent-brand-blue" />
          <span className="text-sm text-brand-blue font-medium">
            I have read and accepted the Terms & Conditions. *
          </span>
        </label>
        <FieldError message={errors.termsAccepted?.message} />

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register("dataConsent")} className="mt-1 h-4 w-4 accent-brand-blue" />
          <span className="text-sm text-brand-blue font-medium">
            I consent to the processing of my personal data in accordance with Art. 23 of D.Lgs. 196/2003. *
          </span>
        </label>
        <FieldError message={errors.dataConsent?.message} />
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {serverError}
        </div>
      )}

      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto bg-brand-green hover:bg-brand-green-dark text-white font-black uppercase tracking-wide text-sm rounded-none px-12 py-4 h-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </form>
  )
}