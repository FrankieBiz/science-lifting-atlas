import { readFile } from 'node:fs/promises';

import {
  LICENSE_CLARITY_FLOOR,
  SPIKE_CRITERIA,
  evaluateInventory,
} from './scorecard.mjs';

const inventoryUrl = new URL(
  '../../docs/licenses/asset-candidates.json',
  import.meta.url,
);

/** @type {{recordedOn?: string, reverifyBy?: string, candidates?: unknown}} */
let inventory;
try {
  inventory = JSON.parse(await readFile(inventoryUrl, 'utf8'));
} catch (error) {
  console.error('Asset spike failed: could not read or parse the inventory.');
  console.error(`- ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const { issues, results } = evaluateInventory(inventory);

console.log(
  `Asset spike scorecard (recorded ${inventory.recordedOn ?? 'unknown'}, re-verify by ${inventory.reverifyBy ?? 'unknown'})`,
);
console.log(
  `Criteria: ${SPIKE_CRITERIA.map((c) => `${c.label} ${c.weight}%`).join('; ')}`,
);
console.log('');

for (const result of results) {
  if (result.status === 'placeholder') {
    console.log(
      `- ${result.name}: PLACEHOLDER — no vendor selected; not scored.`,
    );
  } else if (result.rejected) {
    console.log(`- ${result.name}: INELIGIBLE — ${result.rejectionReason}`);
  } else if (!result.complete) {
    console.log(
      `- ${result.name}: licence recorded; ${result.unmeasured.length} criteria awaiting SBLA-005 measurement (${result.unmeasured.join(', ')})`,
    );
  } else {
    console.log(`- ${result.name}: weighted total ${result.weightedTotal}/100`);
  }
}

console.log('');

if (issues.length > 0) {
  console.error('Asset spike failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  const eligible = results.filter(
    (r) => r.status === 'inventoried' && !r.rejected,
  ).length;
  const ineligible = results.filter((r) => r.rejected).length;
  console.log(
    `Asset spike passed: ${results.length} candidate(s); ${eligible} eligible, ${ineligible} ineligible under the §8.3 licence-clarity floor of ${LICENSE_CLARITY_FLOOR}/5.`,
  );
  console.log(
    'No asset is selected, purchased, or approved. SBLA-005 measures; SBLA-006 decides.',
  );
}
