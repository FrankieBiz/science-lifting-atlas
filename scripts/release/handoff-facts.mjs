/**
 * Pure rendering for machine-generated handoff facts (ADR 0007 D7).
 *
 * Reviewers audited hand-copied commit, tree, and path lists in 14 of the 67
 * Critical/Important findings recorded before ADR 0007. These functions turn
 * facts gathered from Git and real command runs into the three handoff
 * sections that carry them, so nobody types a hash.
 */

export const TASK_ID_PATTERN = /^(SBLA|PLAN)-\d{3}$/;

/** Handoff sections whose content this module generates. */
export const GENERATED_SECTIONS = Object.freeze([
  '## Inputs and exact paths',
  '## Tests/checks run and results',
  '## Files created or modified',
]);

const STATUS_LABELS = Object.freeze({
  A: 'added',
  C: 'copied',
  D: 'deleted',
  M: 'modified',
  T: 'type changed',
});

/**
 * @typedef {object} ChangedPath
 * @property {string} status
 * @property {string} path
 */

/**
 * @typedef {object} CheckResult
 * @property {string} command
 * @property {number} exitCode
 * @property {string} outputTail
 */

/**
 * @typedef {object} HandoffFacts
 * @property {string} taskId
 * @property {string} branch
 * @property {string} baseCommit
 * @property {string} headCommit
 * @property {string} headTree
 * @property {boolean} worktreeClean
 * @property {string} nodeVersion
 * @property {string} pnpmVersion
 * @property {readonly ChangedPath[]} changedPaths
 * @property {readonly CheckResult[]} checks
 */

/**
 * Parse `git diff --name-status --no-renames -z` output.
 *
 * @param {string} output
 * @returns {ChangedPath[]}
 */
export function parseNameStatus(output) {
  const tokens = output.split('\0').filter(Boolean);
  /** @type {ChangedPath[]} */
  const entries = [];

  for (let index = 0; index < tokens.length; index += 2) {
    const status = tokens[index];
    const changedPath = tokens[index + 1];
    if (!status || !changedPath) {
      throw new Error('Could not parse the complete name-status diff.');
    }
    entries.push({ status: status.toUpperCase(), path: changedPath });
  }

  return entries.sort((left, right) => left.path.localeCompare(right.path));
}

/**
 * Keep the last `maxLines` non-empty lines of command output.
 *
 * @param {string} output
 * @param {number} [maxLines]
 */
export function tailLines(output, maxLines = 12) {
  const lines = output.replaceAll('\r\n', '\n').trimEnd().split('\n');
  return lines.slice(-maxLines).join('\n');
}

/** @param {HandoffFacts} facts */
function validateFacts(facts) {
  if (!TASK_ID_PATTERN.test(facts.taskId)) {
    throw new Error(
      `Task ID must look like SBLA-012 or PLAN-002: ${facts.taskId}`,
    );
  }
  for (const [label, value] of [
    ['base commit', facts.baseCommit],
    ['head commit', facts.headCommit],
    ['head tree', facts.headTree],
  ]) {
    if (!/^[0-9a-f]{40}$/.test(value ?? '')) {
      throw new Error(`The ${label} must be a full 40-character SHA: ${value}`);
    }
  }
}

/**
 * @param {HandoffFacts} facts
 * @returns {Record<string, string>}
 */
export function renderGeneratedSections(facts) {
  validateFacts(facts);

  const inputs = [
    '| Fact | Value |',
    '| --- | --- |',
    `| Branch | \`${facts.branch}\` |`,
    `| Base commit | \`${facts.baseCommit}\` |`,
    `| Candidate commit | \`${facts.headCommit}\` |`,
    `| Candidate tree | \`${facts.headTree}\` |`,
    `| Working tree at generation | ${facts.worktreeClean ? 'clean' : '**dirty — uncommitted changes are not part of this candidate**'} |`,
    `| Runtime | Node.js \`${facts.nodeVersion}\`, pnpm \`${facts.pnpmVersion}\` |`,
  ].join('\n');

  const checks =
    facts.checks.length === 0
      ? '_No checks were run by `pnpm handoff`. A check that is not listed here was not run._'
      : facts.checks
          .map((check) =>
            [
              `### \`${check.command}\` — ${check.exitCode === 0 ? 'PASS' : `FAIL (exit ${check.exitCode})`}`,
              '',
              '```text',
              check.outputTail,
              '```',
            ].join('\n'),
          )
          .join('\n\n');

  const files =
    facts.changedPaths.length === 0
      ? '_No paths changed between the base and candidate commits._'
      : [
          `${facts.changedPaths.length} path(s) changed in \`${facts.baseCommit.slice(0, 12)}...${facts.headCommit.slice(0, 12)}\`:`,
          '',
          ...facts.changedPaths.map(
            (entry) =>
              `- \`${entry.path}\` — ${STATUS_LABELS[/** @type {keyof typeof STATUS_LABELS} */ (entry.status)] ?? entry.status}`,
          ),
        ].join('\n');

  return {
    '## Inputs and exact paths': inputs,
    '## Tests/checks run and results': checks,
    '## Files created or modified': files,
  };
}

/**
 * Fill a handoff skeleton: the template body below its copy marker, with the
 * generated sections filled and every other section left for the author.
 *
 * @param {string} templateSource
 * @param {HandoffFacts} facts
 * @param {string} title
 */
export function buildHandoffDocument(templateSource, facts, title) {
  const marker = 'Copy everything below this line.';
  const markerIndex = templateSource.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error('Handoff template is missing its copy marker.');
  }

  const body = templateSource
    .slice(markerIndex + marker.length)
    .replace(/^\s*---\s*/, '')
    .trim();
  const sections = renderGeneratedSections(facts);
  const blocks = body.split(/^(?=## )/m);
  const [heading = '', ...rest] = blocks;

  const filled = rest.map((block) => {
    const sectionHeading = block.split('\n', 1)[0]?.trim() ?? '';
    const generated = sections[sectionHeading];
    if (generated === undefined) return block.trimEnd();
    return `${sectionHeading}\n\n<!-- generated by pnpm handoff; do not edit by hand -->\n\n${generated}`;
  });

  return [
    heading
      .replace('<task ID and title>', `${facts.taskId} — ${title}`)
      .trimEnd(),
    ...filled,
  ]
    .join('\n\n')
    .concat('\n');
}
