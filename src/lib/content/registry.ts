import type {
  ApprovalManifestRecord,
  ChangeRecord,
  ClaimRecord,
  ExerciseRecord,
  MuscleRecord,
  RecordKind,
  SourceRecord,
} from './schemas';

export type LoadedRecord = {
  kind: RecordKind;
  path: string;
  data: unknown;
};

export type ContentRegistry = {
  claims: ClaimRecord[];
  sources: SourceRecord[];
  muscles: MuscleRecord[];
  exercises: ExerciseRecord[];
  approvalManifests: ApprovalManifestRecord[];
  changeRecords: ChangeRecord[];
};

export function partitionRecords(records: LoadedRecord[]): ContentRegistry {
  const registry: ContentRegistry = {
    claims: [],
    sources: [],
    muscles: [],
    exercises: [],
    approvalManifests: [],
    changeRecords: [],
  };

  for (const record of records) {
    switch (record.kind) {
      case 'claim':
        registry.claims.push(record.data as ClaimRecord);
        break;
      case 'source':
        registry.sources.push(record.data as SourceRecord);
        break;
      case 'muscle':
        registry.muscles.push(record.data as MuscleRecord);
        break;
      case 'exercise':
        registry.exercises.push(record.data as ExerciseRecord);
        break;
      case 'approvalManifest':
        registry.approvalManifests.push(record.data as ApprovalManifestRecord);
        break;
      case 'changeRecord':
        registry.changeRecords.push(record.data as ChangeRecord);
        break;
      case 'evidencePacket':
      case 'review':
        break;
    }
  }

  return registry;
}
