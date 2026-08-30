import { ROLE_WRITE_BOUNDARIES, validateRolePaths } from './role-paths.mjs';

const [role, ...changedPaths] = process.argv.slice(2);
const roles = Object.keys(ROLE_WRITE_BOUNDARIES).join(', ');

if (!role || changedPaths.length === 0) {
  console.error(
    'Usage: node scripts/foundation/check-role-paths.mjs <role> <path...>',
  );
  console.error(`Known roles: ${roles}`);
  process.exit(2);
}

const issues = validateRolePaths({ role, changedPaths });

if (issues.length > 0) {
  console.error('Role path boundary failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(
    `Role path boundary passed: ${role} may write all ${changedPaths.length} listed path(s).`,
  );
}
