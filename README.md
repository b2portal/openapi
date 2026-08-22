# B2 Portal's OpenAPI Specification

This repository contains OpenAPI specifications for the B2 Portal Developer API.

[Changelog](https://github.com/b2portal/openapi/releases)

## Directory structure

| Directory | Description |
| --- | --- |
| [`/latest/`](./latest/) | **Recommended.** Latest generally available Developer API V1 specification. |

### `/latest/` — Generally available specification

The `latest` directory contains the current generally available contract for B2 Portal Developer API V1. Use these files to inspect the API, validate an integration, or generate client code.

The public contract includes tenant- and location-scoped RFQ intake, customer account and contact lookup, attachment upload, synchronized QuickProduct catalog reads, RFQ review context, and draft actions. The Developer API never pushes RFQs to CoreBridge. It returns operator review context, and an operator performs the push in B2 Portal.

## File formats

The specification is available in JSON and YAML:

- `latest/openapi.spec3.json`
- `latest/openapi.spec3.yaml`

Both files describe the same contract and carry the same `info.version`.
Tagged releases attach both formats and a `SHA256SUMS` file for integrity verification.

## OpenAPI version

B2 Portal uses OpenAPI 3.1. The specification is generated automatically through B2 Portal's private release process and is not intended to be edited directly.

## Authentication

Developer API keys are created in B2 Portal under **Settings → Developers**. Keys are scoped to one organization, explicit permissions, and selected CoreBridge locations. MCP OAuth tokens are not accepted by the Developer API.

## Documentation

- [Developer API guide](https://b2portal.com/docs/api)
- [Interactive API reference](https://b2portal.com/docs/api/reference)
- [Lifecycle webhooks](https://b2portal.com/docs/api/webhooks)

## License

The B2 Portal API specification is proprietary. See [LICENSE](./LICENSE).
