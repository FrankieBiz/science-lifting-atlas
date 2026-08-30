import { readFile } from 'node:fs/promises';

import {
  LICENSE_CLARITY_FLOOR,
  SPIKE_CRITERIA,
  evaluateCandidate,
} from './scorecard.mjs';

const inventory = JSON.parse(
  await readFile(
    new URL('../../docs/licenses/asset-candidates.json', import.meta.url),
    'utf8',
  ),
);

const candidates = Array.isArray(inventory.candidates)
  ? inventory.candidates
  : [];
const issues = [];

console.log(
  `Asset spike scorecard (recorded ${inventory.recordedOn}, re-verify by ${inventory.reverifyBy})`,
);
console.log(
  `Criteria: ${SPIKE_CRITERIA.map((c) => `${c.label} ${c.weight}%`).join('; ')}`,
);
console.log('');

for (const candidate of candidates) {
  const status = candidate.status ?? 'inventoried';
  const result = evaluateCandidate(candidate);

  if (status === 'placeholder') {
    console.log(
      `- ${result.name}: PLACEHOLDER — no vendor selected; not scored.`,
    );
    continue;
  }

  // A real candidate must carry complete, sourced licence fields. §18 SBLA-004.
  for (const issue of result.licenceIssues) issues.push(issue);

  if (result.rejected) {
    issues.push(`${result.id}: REJECTED — ${result.rejectionReason}`);
    console.log(`- ${result.name}: REJECTED (${result.rejectionReason})`);
    continue;
  }

  if (!result.complete) {
    console.log(
      `- ${result.name}: licence recorded; ${result.unmeasured.length} criteria awaiting SBLA-005 measurement (${result.unmeasured.join(', ')})`,
    );
    continue;
  }

  console.log(`- ${result.name}: weighted total ${result.weightedTotal}/100`);
}

console.log('');

if (issues.length > 0) {
  console.error('Asset spike failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(
    `Asset spike passed: ${candidates.length} candidate(s) inventoried; licence fields complete; licence-clarity floor ${LICENSE_CLARITY_FLOOR}/5 enforced.`,
  );
  console.log(
    'No asset is selected, purchased, or approved. SBLA-005 measures; SBLA-006 decides.',
  );
}
