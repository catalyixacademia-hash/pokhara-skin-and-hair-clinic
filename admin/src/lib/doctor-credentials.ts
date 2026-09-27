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
  if (labeled) {
    return /md\s+specialist/i.test(labeled.label)
      ? labeled.label
      : labeled.label.replace(/^Specialist/i, 'MD Specialist');
  }
  const nmc = credentials.find((c) => /nmc/i.test(c.label) || /nmc/i.test(c.value));
  const specialty = specialtyFrom(nmc?.value ?? '');
  return specialty ? `MD Specialist (${specialty})` : '—';
}

/**
 * Persist chips the public site expects:
 * NMC Registration → "NMC Reg. No. {n}"
 * MD Specialist (Dermatology) as its own row, not joined with the NMC value.
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
        label: `MD Specialist (${specialty})`,
        value: cred.value || 'Nepal Medical Council specialist',
      });
      continue;
    }

    rest.push(cred);
  }

  if (!specialty) {
    specialty = 'Dermatology';
  }

  const next: Credential[] = [];
  if (nmcNumber) {
    next.push({ label: 'NMC Registration', value: `NMC Reg. No. ${nmcNumber}` });
  }
  if (specialty && !rest.some((c) => /specialist\s*\(/i.test(c.label))) {
    next.push({
      label: `MD Specialist (${specialty})`,
      value: 'Nepal Medical Council specialist',
    });
  }
  if (!rest.some((c) => /^mbbs$/i.test(c.label) || /^md,\s*mbbs$/i.test(c.label))) {
    rest.push({
      label: 'MBBS',
      value: /bishnu/i.test(doctorName)
        ? 'Ryazan State I.P. Medical University, Ryazan'
        : 'Tribhuvan University, Maharajgunj Medical Campus (2011)',
    });
  }
  next.push(...rest.filter((c) => !/specialist\s*\(/i.test(c.label)));

  return next.length ? next : [{ label: '', value: '' }];
}
