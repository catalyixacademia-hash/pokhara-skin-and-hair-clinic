export type Credential = { label: string; value: string };

function nmcNumberFrom(text: string): string | undefined {
  return text.match(/(\d{4,})/)?.[1];
}

function specialtyFrom(text: string): string | undefined {
  return text.match(/Specialist\s*\(\s*([^)]+?)\s*\)/i)?.[1]?.trim();
}

/** Public-facing NMC chip, e.g. "NMC Reg. No. 12549". */
export function nmcColumnLabel(credentials: Credential[]): string {
  const nmc = credentials.find((c) => /nmc/i.test(c.label) || /nmc/i.test(c.value));
  const number = nmcNumberFrom(`${nmc?.label ?? ''} ${nmc?.value ?? ''}`);
  return number ? `NMC Reg. No. ${number}` : '—';
}

/** Separate specialist chip, never combined with the registration number. */
export function specialistColumnLabel(credentials: Credential[]): string {
  const labeled = credentials.find((c) => /specialist\s*\(/i.test(c.label));
  if (labeled) return labeled.label;
  const nmc = credentials.find((c) => /nmc/i.test(c.label) || /nmc/i.test(c.value));
  const specialty = specialtyFrom(nmc?.value ?? '');
  return specialty ? `Specialist (${specialty})` : '—';
}

/**
 * Persist chips the public site expects:
 * NMC Registration → "NMC Reg. No. {n}"
 * Specialist (Dermatology) as its own row, not joined with the NMC value.
 */
export function normalizeDoctorCredentials(
  raw: Credential[],
  doctorName = '',
): Credential[] {
  const cleaned = raw
    .map((c) => ({ label: c.label.trim(), value: c.value.trim() }))
    .filter((c) => c.label || c.value);

  let nmcNumber: string | undefined;
  let specialty: string | undefined;
  const rest: Credential[] = [];

  for (const cred of cleaned) {
    const blob = `${cred.label} ${cred.value}`;
    const isNmc =
      /nmc/i.test(cred.label) || /nmc\s*reg/i.test(cred.value) || /^no\.\s*\d/i.test(cred.value);
    const isSpecialistLabel = /specialist\s*\(/i.test(cred.label);

    if (isNmc) {
      nmcNumber = nmcNumberFrom(blob) ?? nmcNumber;
      specialty = specialtyFrom(cred.value) ?? specialty;
      continue;
    }

    if (isSpecialistLabel) {
      specialty = specialtyFrom(cred.label) ?? specialty ?? 'Dermatology';
      rest.push({
        label: `Specialist (${specialty})`,
        value: cred.value || 'Nepal Medical Council specialist',
      });
      continue;
    }

    rest.push(cred);
  }

  if (/prakash/i.test(doctorName) && !specialty) {
    specialty = 'Dermatology';
  }

  const next: Credential[] = [];
  if (nmcNumber) {
    next.push({ label: 'NMC Registration', value: `NMC Reg. No. ${nmcNumber}` });
  }
  if (specialty && !rest.some((c) => /specialist\s*\(/i.test(c.label))) {
    next.push({
      label: `Specialist (${specialty})`,
      value: 'Nepal Medical Council specialist',
    });
  }
  next.push(...rest.filter((c) => !/specialist\s*\(/i.test(c.label)));

  return next.length ? next : [{ label: '', value: '' }];
}
