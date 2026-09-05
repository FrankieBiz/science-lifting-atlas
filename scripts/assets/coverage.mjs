import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * The 28 evaluation targets are transcribed from master plan §4.3. Each inner
 * array is a required concept group; alternative strings within a group are
 * accepted labels. Compound targets pass only when every group is present.
 */
export const COVERAGE_TARGETS = Object.freeze([
  target('pectoralis-major', 'pectoralis major', [['pectoralis major']]),
  target('deltoid-regions', 'deltoid regions', [['deltoid']]),
  target('latissimus-dorsi', 'latissimus dorsi', [['latissimus dorsi']]),
  target('teres-major', 'teres major', [['teres major']]),
  target('trapezius-regions', 'trapezius regions', [['trapezius']]),
  target('rhomboids', 'rhomboids', [['rhomboid']]),
  target('rotator-cuff', 'rotator cuff muscles', [
    ['supraspinatus'],
    ['infraspinatus'],
    ['subscapularis'],
    ['teres minor'],
  ]),
  target('biceps-brachii', 'biceps brachii', [['biceps brachii']]),
  target('brachialis', 'brachialis', [['brachialis']]),
  target('brachioradialis', 'brachioradialis', [['brachioradialis']]),
  target('triceps-brachii', 'triceps brachii', [['triceps brachii']]),
  target('forearm-flexors-extensors', 'forearm flexor/extensor groupings', [
    ['muscle of anterior compartment of forearm'],
    ['muscle of posterior compartment of forearm'],
  ]),
  target('rectus-abdominis', 'rectus abdominis', [['rectus abdominis']]),
  target('external-oblique', 'external oblique', [['external oblique']]),
  target('internal-oblique', 'internal oblique', [['internal oblique']]),
  target('transversus-abdominis', 'transversus abdominis', [
    ['transversus abdominis'],
  ]),
  target('spinal-erectors', 'spinal erector grouping', [
    ['iliocostalis'],
    ['longissimus'],
    ['spinalis'],
  ]),
  target('multifidus', 'multifidus grouping', [['multifidus']]),
  target('gluteus-maximus', 'gluteus maximus', [['gluteus maximus']]),
  target('gluteus-medius', 'gluteus medius', [['gluteus medius']]),
  target('gluteus-minimus', 'gluteus minimus', [['gluteus minimus']]),
  target('quadriceps', 'quadriceps components', [
    ['rectus femoris'],
    ['vastus lateralis'],
    ['vastus medialis'],
    ['vastus intermedius'],
  ]),
  target('hamstrings', 'hamstring components', [
    ['biceps femoris'],
    ['semitendinosus'],
    ['semimembranosus'],
  ]),
  target('hip-adductors', 'hip adductor group', [
    ['adductor longus'],
    ['adductor brevis'],
    ['adductor magnus'],
  ]),
  target('major-hip-flexors', 'major hip flexors', [
    ['iliacus'],
    ['psoas major'],
  ]),
  target('gastrocnemius-heads', 'gastrocnemius heads', [
    ['medial head of gastrocnemius'],
    ['lateral head of gastrocnemius'],
  ]),
  target('soleus', 'soleus', [['soleus']]),
  target('tibialis-anterior', 'tibialis anterior', [['tibialis anterior']]),
]);

/**
 * @param {string} id
 * @param {string} label
 * @param {string[][]} requiredGroups
 */
function target(id, label, requiredGroups) {
  return Object.freeze({
    id,
    label,
    requiredGroups: Object.freeze(
      requiredGroups.map((group) => Object.freeze([...group])),
    ),
  });
}

/** @param {string} text */
export function evaluateCoverage(text) {
  if (typeof text !== 'string')
    throw new TypeError('coverage input must be text');
  const haystack = text.toLocaleLowerCase('en-US');
  const results = COVERAGE_TARGETS.map((coverageTarget) => {
    const groups = coverageTarget.requiredGroups.map((alternatives) => ({
      alternatives,
      matched: alternatives.filter((term) => haystack.includes(term)),
    }));
    return {
      id: coverageTarget.id,
      label: coverageTarget.label,
      present: groups.every((group) => group.matched.length > 0),
      groups,
    };
  });
  const absentIds = results
    .filter((result) => !result.present)
    .map((result) => result.id);
  return {
    targets: COVERAGE_TARGETS.length,
    present: results.length - absentIds.length,
    absent: absentIds.length,
    absentIds,
    byId: Object.fromEntries(results.map((result) => [result.id, result])),
    results,
  };
}

const isMain =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isMain) {
  const paths = process.argv.slice(2);
  if (paths.length === 0) {
    console.error(
      'Usage: node scripts/assets/coverage.mjs <metadata.txt> [...]',
    );
    process.exitCode = 1;
  } else {
    const contents = await Promise.all(
      paths.map((path) => readFile(path, 'utf8')),
    );
    console.log(JSON.stringify(evaluateCoverage(contents.join('\n')), null, 2));
  }
}
