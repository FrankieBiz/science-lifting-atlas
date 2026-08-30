export const FOUNDATION_PAGE_CONTRACT = Object.freeze({
  documentLanguage: 'en',
  wcagTarget: '2.2 AA',
  supportsNoJavaScript: true,
});

export const FOUNDATION_VIEWPORTS = Object.freeze([
  Object.freeze({ id: 'desktop', width: 1440, height: 1000 }),
  Object.freeze({ id: 'mobile', width: 390, height: 844 }),
]);

export const FOUNDATION_PERFORMANCE_BUDGETS = Object.freeze([
  Object.freeze({
    id: 'static-non-3d-javascript',
    unit: 'gzip-kb',
    target: 100,
    hardLimit: 160,
  }),
  Object.freeze({
    id: 'anatomy-application-javascript',
    unit: 'gzip-kb',
    target: 180,
    hardLimit: null,
  }),
  Object.freeze({
    id: 'desktop-initial-3d',
    unit: 'mb',
    target: 6,
    hardLimit: 10,
  }),
  Object.freeze({
    id: 'mobile-initial-interactive',
    unit: 'mb',
    target: 3,
    hardLimit: null,
  }),
]);
