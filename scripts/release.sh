#!/usr/bin/env bash
# Copyright 2024-2026 Wingify Software Pvt. Ltd.
#
# Build both brand npm packages, publish them, then tag.
# Skips if the tag already exists (safe for docs-only merges).
#
#   wingify-fme-node-sdk  <- package.json      (default)
#   vwo-fme-node-sdk      <- package.vwo.json  (copied over package.json for its build)
#
# Usage (CI — called by GitHub Actions):
#   ./scripts/release.sh
#
# Usage (local dry-run, no npm publish, no tag push):
#   DRY_RUN=1 ./scripts/release.sh
#   DRY_RUN=1 RELEASE_REMOTE=<remote> ./scripts/release.sh   # if origin is unreachable

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

DRY_RUN="${DRY_RUN:-0}"
RELEASE_REMOTE="${RELEASE_REMOTE:-origin}"
export HUSKY=0

WINGIFY_PKG="package.json"
VWO_PKG="package.vwo.json"

read_pkg_field() {
  node -p "require('./$1').$2"
}

WINGIFY_NAME=$(read_pkg_field "${WINGIFY_PKG}" name)
VWO_NAME=$(read_pkg_field "${VWO_PKG}" name)
WINGIFY_VERSION=$(read_pkg_field "${WINGIFY_PKG}" version)
VWO_VERSION=$(read_pkg_field "${VWO_PKG}" version)
VERSION="${WINGIFY_VERSION}"
TAG="v${VERSION}"

echo "=== Version: ${VERSION} / Tag: ${TAG} ==="
echo "=== ${WINGIFY_NAME}=${WINGIFY_VERSION} / ${VWO_NAME}=${VWO_VERSION} ==="

if [ "${WINGIFY_VERSION}" != "${VWO_VERSION}" ]; then
  echo "ERROR: Version mismatch: ${WINGIFY_PKG}=${WINGIFY_VERSION} ${VWO_PKG}=${VWO_VERSION}"
  exit 1
fi

if [[ "${VERSION}" == *-* ]]; then
  echo "ERROR: Refusing to release non-stable version ${VERSION}"
  exit 1
fi

if ! grep -q "^## \[${VERSION}\]" CHANGELOG.md; then
  echo "ERROR: CHANGELOG.md has no '## [${VERSION}]' entry"
  exit 1
fi

is_on_npm() {
  [ "$(npm view "$1@${VERSION}" version 2>/dev/null || true)" = "${VERSION}" ]
}

# Skip if this version was already tagged and published (e.g. docs-only merge after a release).
# An unreachable remote must fail the release, not look like "tag missing".
if ! REMOTE_TAG=$(git ls-remote --tags "${RELEASE_REMOTE}" "refs/tags/${TAG}" "refs/tags/${TAG}^{}"); then
  echo "ERROR: Could not reach '${RELEASE_REMOTE}' to check for tag ${TAG}"
  exit 1
fi

TAG_EXISTS=0
if [ -n "${REMOTE_TAG}" ]; then
  TAG_EXISTS=1
  if is_on_npm "${WINGIFY_NAME}" && is_on_npm "${VWO_NAME}"; then
    echo "Tag ${TAG} already exists on ${RELEASE_REMOTE} and both packages are on npm. Skipping release."
    exit 0
  fi

  # Annotated tags are listed twice; the "^{}" line is the commit the tag points to.
  TAG_COMMIT=$(echo "${REMOTE_TAG}" | awk '/\^\{\}$/ { print $1 }')
  if [ -z "${TAG_COMMIT}" ]; then
    TAG_COMMIT=$(echo "${REMOTE_TAG}" | awk 'NR == 1 { print $1 }')
  fi
  if [ "${TAG_COMMIT}" != "$(git rev-parse HEAD)" ]; then
    echo "ERROR: Tag ${TAG} exists on ${RELEASE_REMOTE} at ${TAG_COMMIT}, but HEAD is $(git rev-parse HEAD),"
    echo "       and ${WINGIFY_NAME}/${VWO_NAME}@${VERSION} is not fully on npm."
    echo "       Release from the tagged commit, or bump the version."
    exit 1
  fi
  echo "Tag ${TAG} already exists at HEAD but not every package is on npm — publishing the missing ones."
fi

if NPM_USER=$(npm whoami 2>/dev/null); then
  echo "=== npm authenticated as ${NPM_USER} ==="
elif [ "${DRY_RUN}" = "1" ]; then
  echo "WARNING: npm is not authenticated — a real release would fail here (set NODE_AUTH_TOKEN)"
else
  echo "ERROR: npm is not authenticated (set NODE_AUTH_TOKEN) — required unless DRY_RUN=1"
  exit 1
fi

# ---- Build and pack both brands first; publish and tag only after both succeed ----

WORK_DIR="$(mktemp -d)"
cp package.json "${WORK_DIR}/package.json.orig"

# dist/ is committed and holds the Wingify build; the VWO build overwrites it.
cleanup() {
  cp "${WORK_DIR}/package.json.orig" package.json
  git checkout -- dist 2>/dev/null || true
  git clean -fdq -- dist 2>/dev/null || true
  rm -rf "${WORK_DIR}"
}
trap cleanup EXIT

# Same naming as `npm pack`: "@scope/name" -> "scope-name-<version>.tgz"
tarball_for() {
  local name="${1#@}"
  echo "${WORK_DIR}/${name//\//-}-${VERSION}.tgz"
}

build_and_pack() {
  local brand="$1"
  local pkg_file="$2"
  local name="$3"
  local tarball
  tarball=$(tarball_for "${name}")

  echo "=== Building ${brand} (${name}) ==="
  if [ "${pkg_file}" != "package.json" ]; then
    cp "${pkg_file}" package.json
  fi

  yarn build

  node -e '
    const fs = require("fs");
    const pkg = require("./package.json");
    const missing = [pkg.main, pkg.browser, pkg.module, pkg.types].filter((f) => f && !fs.existsSync(f));
    if (missing.length) {
      console.error("ERROR: " + pkg.name + " build output missing: " + missing.join(", "));
      process.exit(1);
    }
  '

  npm pack --ignore-scripts --loglevel warn --pack-destination "${WORK_DIR}" >/dev/null

  if [ ! -f "${tarball}" ]; then
    echo "ERROR: Expected package not found: ${tarball}"
    ls -la "${WORK_DIR}"
    exit 1
  fi

  local packed_name
  packed_name=$(tar -xzOf "${tarball}" package/package.json | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).name")
  if [ "${packed_name}" != "${name}" ]; then
    echo "ERROR: ${tarball} contains package '${packed_name}', expected '${name}'"
    exit 1
  fi

  echo "=== Packed ${tarball} ==="
}

publish_tarball() {
  local name="$1"
  local tarball="$2"

  # npm has no --skip-duplicate; check the registry so a retry after a partial release is safe.
  if is_on_npm "${name}"; then
    echo "=== ${name}@${VERSION} already on npm — skipping ==="
    return
  fi

  if [ "${DRY_RUN}" = "1" ]; then
    echo "=== DRY_RUN: would publish ${name}@${VERSION} from ${tarball} ==="
  else
    echo "=== Publishing ${name}@${VERSION} ==="
    npm publish "${tarball}"
  fi
}

build_and_pack "wingify" "${WINGIFY_PKG}" "${WINGIFY_NAME}"
build_and_pack "vwo" "${VWO_PKG}" "${VWO_NAME}"

# Wingify first, then VWO. Tag only after both succeed.
# If VWO fails, Wingify may already be on npm — re-run without bumping the version.
publish_tarball "${WINGIFY_NAME}" "$(tarball_for "${WINGIFY_NAME}")"
publish_tarball "${VWO_NAME}" "$(tarball_for "${VWO_NAME}")"

if [ "${TAG_EXISTS}" = "1" ]; then
  echo "=== Tag ${TAG} already on ${RELEASE_REMOTE} — not re-tagging ==="
elif [ "${DRY_RUN}" = "1" ]; then
  echo "=== DRY_RUN: skipping tag push ==="
else
  if [ -n "${CI:-}" ]; then
    git config user.name "github-actions[bot]"
    git config user.email "github-actions[bot]@users.noreply.github.com"
  fi

  if git tag -l "${TAG}" | grep -q "^${TAG}$"; then
    echo "Removing stale local tag ${TAG}"
    git tag -d "${TAG}"
  fi

  git tag -a "${TAG}" -m "Release ${VERSION}"
  # The husky pre-push hook builds and commits dist/; never run it here.
  git push --no-verify "${RELEASE_REMOTE}" "${TAG}"
  echo "=== Pushed tag ${TAG} ==="
fi

echo "=== Release ${VERSION} done ==="
