/**
 * Shared constants for Bruno Language Server
 */

export const DIAGNOSTIC_SOURCE = 'bruno-lsp';

export const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'] as const;

export const VALID_META_TYPES = ['http', 'graphql'] as const;

export const REQUIRED_META_FIELDS = ['name', 'type'] as const;

export const BLOCK_START_PATTERN = /^(\w+(?::\w+)?)\s*\{/;

export const VALID_BLOCKS = [
  ...HTTP_METHODS,
  'meta',
  'headers',
  'params:query',
  'params:path',
  'body:json',
  'body:xml',
  'body:text',
  'body:form-urlencoded',
  'body:multipart-form',
  'auth:basic',
  'auth:bearer',
  'auth:digest',
  'script:pre-request',
  'script:post-response',
  'tests',
  'assert',
  'vars',
  'docs'
] as const;

export const UNIQUE_BLOCKS = new Set([
  'meta',
  ...HTTP_METHODS,
]);

export const ALLOW_MULTIPLE_BLOCKS = new Set([
  'headers',
  'assert',
  'tests',
]);

export const COMPLETION_TRIGGER_CHARACTERS = ['{', '.', ':'] as const;

export enum DiagnosticCode {
  MissingHttpMethod = 'missing-http-method',
  MissingMeta = 'missing-meta',
  UnknownBlock = 'unknown-block',
  InvalidMetaType = 'invalid-meta-type',
  InvalidSeq = 'invalid-seq',
  MissingMetaField = 'missing-meta-field',
  InvalidUrl = 'invalid-url',
  InvalidHeader = 'invalid-header',
  InvalidJson = 'invalid-json',
  EmptyVariable = 'empty-variable',
  InvalidVariable = 'invalid-variable',
  DuplicateHttpMethod = 'duplicate-http-method',
  DuplicateBlock = 'duplicate-block',
  DuplicateBody = 'duplicate-body',
  DuplicateAuth = 'duplicate-auth',
  DuplicateScript = 'duplicate-script',
}
