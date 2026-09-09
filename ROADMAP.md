# Multimodal Healthcare Triage Assistant (India Public Health & Clinic Edition)
## Developer Roadmap, Architecture & Implementation Blueprint

---

### Executive Summary & Clinical Safety Mandate
This platform is a **human-in-the-loop decision-support tool** engineered for Primary Health Centers (PHCs), Ayushman Arogya Mandirs, Civil Hospital Outpatient Departments (OPDs), mobile health camps, industrial estate clinics, and campus infirmaries across India.

> **CRITICAL CLINICAL SAFETY GUARDRAIL (NON-DIAGNOSTIC MANDATE):**
> 1. **No Prescriptions or Diagnostic Assertions**: The system never outputs phrases like *"You have typhoid"* or *"Take Paracetamol 650mg"*.
> 2. **Information Organizer & Risk Stratifier**: The output is strictly a **Structured Triage Note** highlighting reported symptoms, parsed vitals/lab flags, duration timelines, and risk urgency tags (**RED / YELLOW / GREEN**).
> 3. **Doctor/Nurse Primacy**: All information must be explicitly reviewed, validated, and signed off by a Registered Medical Practitioner (RMP) or qualified triage nurse before taking any clinical action.

---

## 1. Phased Development Roadmap

```
                                  DEVELOPMENT ROADMAP
  ====================================================================================
  PHASE 1: MVP / HACKATHON DEMO (Weeks 1 - 2)
  ------------------------------------------------------------------------------------
  [✓] Responsive Mobile-First React + Tailwind PWA UI
  [✓] Multimodal Input (Web Speech API voice transcription + text symptom chips)
  [✓] Dual-Language (English + Hindi) with auto-translation
  [✓] Client-side / Cloud OCR parser for standard lab report images (CBC, Blood Sugar)
  [✓] Rule-assisted LLM structured triage note generation with 3-tier risk tagging
  [✓] Reviewer Dashboard for Doctors/Nurses with real-time queue & referral slip export

  PHASE 2: FIELD READINESS & REGIONAL LOCALIZATION (Weeks 3 - 6)
  ------------------------------------------------------------------------------------
  [ ] Integration with Bhashini API (Govt of India Indic Voice & Translation)
  [ ] Offline-first IndexedDB caching & ServiceWorker background sync for rural PHCs
  [ ] ABDM (Ayushman Bharat Digital Mission) compliance: ABHA ID lookup & M1/M2 consent
  [ ] Structured medical vocabulary mapping (SNOMED-CT / ICD-10 triage tags)
  [ ] Multi-role Auth (ASHA/ANM field worker, Triage Nurse, Medical Officer)

  PHASE 3: ENTERPRISE & PUBLIC HEALTH DEPLOYMENT (Weeks 7 - 12)
  ------------------------------------------------------------------------------------
  [ ] Tele-triage queue integration with e-Sanjeevani API
  [ ] Industrial health protocol engine (ESIC claim format, toxic gas / chemical triage)
  [ ] Edge deployment on low-cost tablet/kiosk devices with local quantized models (Ollama/WebLLM)
  [ ] Epidemiological outbreak heatmaps (district surveillance / IDSP integration)
  ====================================================================================
```

---

## 2. End-to-End System Architecture & Dataflow

```
+----------------------------------------------------------------------------------------------------+
|                                         PATIENT / ASHA INTAKE                                      |
|                                                                                                    |
|   +-----------------------+     +-----------------------+     +--------------------------------+   |
|   |  Voice Input (Audio)  |     |  Text & Symptom Chips |     |  Lab Report / Prescription Cam |   |
|   |  (Web Speech/Bhashini)|     |  (English / Hindi)    |     |  (CBC, Vitals, Doctor Slip)    |   |
|   +-----------+-----------+     +-----------+-----------+     +---------------+----------------+   |
+---------------|-----------------------------|---------------------------------|--------------------+
                |                             |                                 |
                v                             v                                 v
+----------------------------------------------------------------------------------------------------+
|                                    INTAKE & NORMALIZATION PIPELINE                                 |
|                                                                                                    |
|   [Indic Audio -> Text]           [Indic -> English Translation]      [OCR Processing Engine]      |
|   Bhashini / Web Speech API       Bhashini / LibreTranslate / Google   Cloud Vision / Tesseract.js |
|             \                               |                                /                     |
|              +------------------------------+-------------------------------+                      |
|                                             |                                                      |
|                                             v                                                      |
|                             [Multimodal Normalized Context Payload]                                |
|                             - Chief complaint + timeline (English)                                 |
|                             - Extracted lab values & abnormal flags                                |
|                             - Reported physiological red-flags                                     |
+---------------------------------------------|------------------------------------------------------+
                                              v
+----------------------------------------------------------------------------------------------------+
|                                    LLM TRIAGE & STRUCTURING ENGINE                                 |
|                                                                                                    |
|   [Safety Guardrail & Prompt Sandbox]                                                              |
|   - System Role: Clinical Triage Scribe & Risk Highlighter (Strictly Non-Diagnostic)              |
|   - Red-Flag Rules Matrix: Vital Thresholds (SpO2 < 92%, BP > 180/110, Rigid Abdomen, etc.)        |
|                                             |                                                      |
|                                             v                                                      |
|   [JSON Structured Output Schema]                                                                  |
|   {                                                                                                |
|     urgency_tier: "RED" | "YELLOW" | "GREEN",                                                      |
|     triage_summary: "...",                                                                         |
|     extracted_timeline: "...",                                                                     |
|     abnormal_findings: [...],                                                                      |
|     critical_red_flags: [...],                                                                     |
|     recommended_clarifications_for_doctor: [...],                                                  |
|     suggested_referral_facility: "District Hospital (ICU/Emergency)"                               |
|   }                                                                                                |
+---------------------------------------------|------------------------------------------------------+
                                              v
+----------------------------------------------------------------------------------------------------+
|                                    DOCTOR / NURSE REVIEW DASHBOARD                                 |
|                                                                                                    |
|   +---------------------------------------+   +------------------------------------------------+   |
|   |  Priority Queue (Sorted by Urgency)   |   |  Interactive Triage Note Card                  |   |
|   |  - [RED]    Patient #104 (5m wait)    |   |  - Audio playback & original transcript        |   |
|   |  - [YELLOW] Patient #102 (12m wait)   |   |  - Side-by-side OCR image & parsed lab values  |   |
|   |  - [GREEN]  Patient #108 (2m wait)    |   |  - Suggested clinical questions for doctor     |   |
|   +---------------------------------------+   |  - 1-Click "Referral Slip" / "Admit to OPD"    |   |
|                                               +------------------------------------------------+   |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Data Schemas & API Specification

### 3.1. Core Triage Request Payload (`POST /api/triage/process`)
```json
{
  "patient_id": "P-98421",
  "facility_type": "PRIMARY_HEALTH_CENTER", 
  "intake_language": "hi",
  "symptoms_raw": "पिछले 3 दिनों से तेज़ बुखार और ठंड लग रही है, उल्टी भी हो रही है",
  "symptoms_translated": "High fever with chills and vomiting for the past 3 days",
  "vitals": {
    "temperature_f": 102.4,
    "pulse_bpm": 108,
    "spo2_percent": 95,
    "systolic_bp": 110,
    "diastolic_bp": 70
  },
  "report_image_urls": [
    "https://storage.provider.in/reports/cbc_p98421.jpg"
  ],
  "ocr_text_extracted": "PLATELET COUNT: 45,000 /cumm (Ref: 150000 - 450000)\nWBC: 3,200 /cumm\nHb: 13.2 g/dL"
}
```

### 3.2. Structured Triage Note Response (`GET /api/triage/note/:id`)
```json
{
  "triage_id": "TRG-2026-8812",
  "patient_id": "P-98421",
  "timestamp": "2026-09-08T14:35:00Z",
  "urgency_tier": "RED",
  "urgency_score": 88,
  "red_flags": [
    "Severe Thrombocytopenia (Platelets: 45,000 /cumm)",
    "High fever (>102°F) with tachycardia (HR: 108 bpm)",
    "Potential acute hemorrhagic/dengue warning signs"
  ],
  "structured_note": {
    "chief_complaint": "Acute febrile illness with chills and vomiting x 3 days",
    "timeline_summary": "Day 1: Onset of high grade fever and nausea; Day 3: Persistent fever, multiple vomiting episodes, acute weakness",
    "vital_interpretation": "Febrile (102.4°F), Tachycardic (108 bpm), SpO2 stable on room air (95%)",
    "critical_report_findings": [
      {
        "test_name": "Platelet Count",
        "value": "45,000 /cumm",
        "reference": "150,000 - 450,000",
        "status": "CRITICAL_LOW"
      },
      {
        "test_name": "WBC Count",
        "value": "3,200 /cumm",
        "reference": "4,000 - 11,000",
        "status": "LOW"
      }
    ],
    "identified_data_gaps": [
      "No Hematocrit (PCV) value present in report to assess plasma leakage",
      "No blood pressure recorded in standing/supine position for postural drop"
    ],
    "suggested_questions_for_doctor": [
      "Check for spontaneous bleeding (gums, epistaxis, petechiae, melena).",
      "Inquire regarding severe abdominal pain or persistent vomiting in last 12 hours.",
      "Verify fluid intake and urine output in the past 6 hours."
    ],
    "referral_recommendation": {
      "level": "DISTRICT_HOSPITAL",
      "specialty": "Internal Medicine / High Dependency Unit",
      "reason": "Severe thrombocytopenia requiring close platelet monitoring and IV fluid hydration protocol"
    }
  },
  "audit_disclaimer": "NON-DIAGNOSTIC TRIAGE SUMMARY. Generated solely to assist triage prioritization. Requires mandatory review by Registered Medical Practitioner."
}
```

---

## 4. India-Wide Real-World Scenarios & Risk Rules

| Scenario | Primary Setting | Critical Signals & Red Flags | Action / Referral Path |
| :--- | :--- | :--- | :--- |
| **1. Outpatient OPD Surge** | Civil / District Hospital | Severe dehydration, altered consciousness, chest tightness, high triage score | Divert directly from general queue to Emergency / Triage Bay |
| **2. Industrial Estate Unit** | MIDC / GIDC Manufacturing Plant | Chemical fume inhalation, caustic eye exposure, crushing injury, crush syndrome | Immediate decontamination, O2 therapy alert, ESIC referral |
| **3. Campus Fever Triage** | University / Boarding School | Rapid onset high fever + stiff neck, petechial rash, cluster cases (>3 hostel rooms) | Isolation ward intake, meningitis protocol alert, IDSP alert |
| **4. Maternal Health (ANC)** | Rural PHC / Sub-Center | BP $\ge$ 140/90 after 20 weeks, pedal edema, severe headache/visual blurring | Pre-eclampsia red flag $\rightarrow$ Sub-District / FRU Hospital |
| **5. NCD Check-in (Ayushman)**| Urban Health Post / HWCs | Random Blood Sugar > 350 mg/dL with ketoacidotic symptoms, BP > 180/110 | Urgent Physician review, microalbuminuria test ordering |
| **6. Mobile Camp Intake** | Tribal / Drought-prone Region | Severe Acute Malnutrition (SAM - MUAC < 115mm), chronic cough > 2 weeks + night sweats | Nutrition Rehab Centre (NRC) or Nikshay TB screening referral |

---

## 5. Technical Implementation Details & Code Blueprints

### 5.1. Tech Stack Overview
- **Client**: React 18 / Next.js (App Router), Tailwind CSS, Lucide-React icons, PWA manifest.
- **Speech**: Browser native Web Speech API (`webkitSpeechRecognition`) + Indian Regional Voice Fallback.
- **OCR Engine**: Tesseract.js (Edge / Zero-cost client-side) + Optional Server Google Vision API / Azure Health Document Intelligence.
- **Backend API**: Node.js / Express or Python FastAPI with JSON Schema validation.
- **Triage LLM Integration**: Google Gemini 1.5 Flash (via `@google/genai` or Vertex AI) with strictly typed JSON Schema enforcement.

---

## 6. Hackathon / Showcase Demo Script (3-Minute Flow)

1. **Minute 0:00 - 0:45 (The Problem & The Voice Input)**:
   - Introduce the crowded PHC context in Uttar Pradesh or Maharashtra (1 doctor for 150 OPD patients).
   - Switch language selector to **Hindi (हिन्दी)**.
   - Click the microphone and speak in Hindi: *"मुझे तीन दिन से बहुत तेज़ बुखार है, उल्टी हो रही है और शरीर में दर्द है।"*
   - Show instant speech-to-text and automatic English translation side-by-side.

2. **Minute 0:45 - 1:30 (Multimodal Report Extraction)**:
   - Drag and drop a sample CBC report image (with Platelet: 42,000 and Leukopenia).
   - Watch Tesseract.js extract the text in real-time with an active progress bar.
   - Click **"Generate Structured Triage Note"**.

3. **Minute 1:30 - 2:15 (Triage Intelligence & Risk Tagging)**:
   - Show the generated **RED TIER** urgency badge with automated red-flag detection.
   - Highlight the non-diagnostic disclaimer.
   - Point out the **"Questions for the Clinician"** (e.g. asking about bleeding or petechial rash).
   - Point out **Missing Information Detection** (e.g. Hematocrit missing).

4. **Minute 2:15 - 3:00 (Doctor's Workflow & Referral Preparation)**:
   - Switch to the **Doctor/Nurse Triage Queue Dashboard**.
   - Show how the patient automatically floated to the top of the queue over routine check-ins.
   - Click **"Export Referral Slip"** to generate a pre-filled referral document formatted for the District Hospital.
