const BASE = ''

// ── Triage ────────────────────────────────────────────────────────────────────

export async function submitVoiceIntake(audioBlob, languageCode, abhaId) {
  const form = new FormData()
  form.append('audio', audioBlob, 'symptom.webm')
  form.append('language_code', languageCode)
  if (abhaId) form.append('abha_id', abhaId)

  const res = await fetch(`${BASE}/api/triage/voice-intake`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error(`Triage API error: ${res.status}`)
  return res.json()
}

export async function submitTextIntake(text, language = 'English', abhaId = null) {
  const res = await fetch(`${BASE}/api/triage/text-intake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language, abha_id: abhaId }),
  })
  if (!res.ok) throw new Error(`Triage API error: ${res.status}`)
  return res.json()
}

export async function getDemoTriage() {
  const res = await fetch(`${BASE}/api/triage/mock-demo`)
  if (!res.ok) throw new Error(`Mock triage error: ${res.status}`)
  return res.json()
}

// ── ABHA ──────────────────────────────────────────────────────────────────────

export async function fetchABHA(abhaId) {
  const res = await fetch(`${BASE}/api/abha/fetch/${encodeURIComponent(abhaId)}`)
  if (!res.ok) throw new Error(`ABHA fetch error: ${res.status}`)
  return res.json()
}

export async function getABHAIds() {
  const res = await fetch(`${BASE}/api/abha/known-ids`)
  if (!res.ok) throw new Error(`ABHA IDs error: ${res.status}`)
  return res.json()
}

// ── Notifications ─────────────────────────────────────────────────────────────

export async function sendWhatsApp(payload) {
  const res = await fetch(`${BASE}/api/notify/whatsapp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`WhatsApp error: ${res.status}`)
  return res.json()
}

// ── Ambulance ─────────────────────────────────────────────────────────────────

export async function getAmbulanceCurrent() {
  const res = await fetch(`${BASE}/api/ambulance/current`)
  if (!res.ok) throw new Error(`Ambulance API error: ${res.status}`)
  return res.json()
}
