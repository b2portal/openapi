import { readFile } from "node:fs/promises";

const [jsonPath, normalizedYamlPath] = process.argv.slice(2);
if (!jsonPath || !normalizedYamlPath) {
  throw new Error("Usage: node scripts/validate-artifacts.mjs <json-spec> <normalized-yaml-json>");
}

const [jsonContract, yamlContract] = await Promise.all([
  readFile(jsonPath, "utf8").then(JSON.parse),
  readFile(normalizedYamlPath, "utf8").then(JSON.parse),
]);

/**
 * Returns a JSON value with recursively sorted object keys.
 *
 * Array order remains significant because it can carry OpenAPI semantics.
 *
 * @param {unknown} value JSON value to canonicalize.
 * @returns {unknown} Canonical JSON value.
 */
function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
        .map(([key, nestedValue]) => [key, canonicalize(nestedValue)]),
    );
  }
  return value;
}

if (JSON.stringify(canonicalize(jsonContract)) !== JSON.stringify(canonicalize(yamlContract))) {
  throw new Error("The JSON and YAML specifications do not describe the same contract.");
}
if (jsonContract.openapi !== "3.1.0") {
  throw new Error(`Expected OpenAPI 3.1.0, received ${String(jsonContract.openapi)}.`);
}
if (!/^\d+\.\d+\.\d+$/.test(String(jsonContract.info?.version))) {
  throw new Error("The OpenAPI info.version must use semantic versioning.");
}
const expectedServers = [
  { url: "https://api.b2portal.com/api/v1", description: "Production" },
];
if (JSON.stringify(canonicalize(jsonContract.servers)) !== JSON.stringify(canonicalize(expectedServers))) {
  throw new Error("The public specification must expose only the production V1 server.");
}
if (!jsonContract.paths || Object.keys(jsonContract.paths).length === 0) {
  throw new Error("The public specification must contain at least one API path.");
}

const serializedContract = JSON.stringify(jsonContract).toLowerCase();
const nonProductionValues = ["github.com/", "localhost", "127.0.0.1", "staging."];
const nonProductionValue = nonProductionValues.find((value) => serializedContract.includes(value));
if (nonProductionValue) {
  throw new Error(`The public specification contains a non-production value: ${nonProductionValue}.`);
}

process.stdout.write(`Validated B2 Portal OpenAPI ${jsonContract.info.version}.\n`);
