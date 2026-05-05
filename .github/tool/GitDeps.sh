#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "[GitDeps] Usage: GitDeps.sh <REPO_URL> <LOCAL_REPO_DIR> <SOURCE_SUBDIR> <TARGET_DIR> [LOCAL_GIT_POLICY]"
  echo "[GitDeps] LOCAL_GIT_POLICY: remove | keep (default)"
  echo "[GitDeps] This is a generic core script used by higher-level wrappers."
}

if [ "$#" -lt 4 ] || [ "$#" -gt 5 ]; then
  echo "[GitDeps] Error: expected 4 or 5 arguments, got $#."
  usage
  exit 1
fi

# Args:
#   1: REPO_URL
#   2: LOCAL_REPO_DIR
#   3: SOURCE_SUBDIR
#   4: TARGET_DIR
#   5: LOCAL_GIT_POLICY (optional): remove | keep
REPO_URL="${1:?missing REPO_URL}"
LOCAL_REPO_DIR="${2:?missing LOCAL_REPO_DIR}"
SOURCE_SUBDIR="${3:?missing SOURCE_SUBDIR}"
TARGET_DIR="${4:?missing TARGET_DIR}"
LOCAL_GIT_POLICY="${5:-keep}"

if [ "${LOCAL_GIT_POLICY}" != "remove" ] && [ "${LOCAL_GIT_POLICY}" != "keep" ]; then
  echo "[GitDeps] Error: LOCAL_GIT_POLICY must be 'remove' or 'keep', got: ${LOCAL_GIT_POLICY}"
  usage
  exit 1
fi

if [ "${SOURCE_SUBDIR#/}" != "${SOURCE_SUBDIR}" ]; then
  echo "[GitDeps] Error: SOURCE_SUBDIR must be a relative path: ${SOURCE_SUBDIR}"
  exit 1
fi

LOCAL_SRC_DIR="${LOCAL_REPO_DIR}/${SOURCE_SUBDIR}"

echo "[GitDeps] Repo: ${REPO_URL}"
echo "[GitDeps] Target: ${TARGET_DIR}"
echo "[GitDeps] Source Subdir: ${SOURCE_SUBDIR}"
echo "[GitDeps] Local Repo: ${LOCAL_REPO_DIR}"
echo "[GitDeps] Local .git Policy: ${LOCAL_GIT_POLICY}"

if ! command -v git >/dev/null 2>&1; then
  echo "[GitDeps] Error: git is not installed or not in PATH."
  exit 1
fi

if [ -e "${TARGET_DIR}" ]; then
  echo "[GitDeps] Target already exists. Removing: ${TARGET_DIR}"
  rm -rf "${TARGET_DIR}"
fi

if [ ! -d "${LOCAL_REPO_DIR}" ]; then
  echo "[GitDeps] Local repo not found. Cloning to: ${LOCAL_REPO_DIR}"
  git clone --depth 1 "${REPO_URL}" "${LOCAL_REPO_DIR}"
else
  echo "[GitDeps] Using local repo: ${LOCAL_REPO_DIR}"
fi

if [ "${LOCAL_GIT_POLICY}" = "remove" ] && [ -d "${LOCAL_REPO_DIR}/.git" ]; then
  echo "[GitDeps] Removing git metadata: ${LOCAL_REPO_DIR}/.git"
  rm -rf "${LOCAL_REPO_DIR}/.git"
fi

if [ ! -d "${LOCAL_SRC_DIR}" ]; then
  echo "[GitDeps] Error: source subdir not found: ${LOCAL_SRC_DIR}"
  exit 1
fi

if [ "${LOCAL_GIT_POLICY}" = "keep" ]; then
  mkdir -p "${TARGET_DIR}"
  shopt -s dotglob nullglob
  for item in "${LOCAL_SRC_DIR}"/*; do
    base="$(basename "${item}")"
    if [ "${base}" = ".git" ]; then
      continue
    fi
    cp -R "${item}" "${TARGET_DIR}"
  done
  shopt -u dotglob nullglob
else
  cp -R "${LOCAL_SRC_DIR}" "${TARGET_DIR}"
fi

echo "[GitDeps] Done."
