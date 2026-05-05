#!/usr/bin/env bash
set -euo pipefail

# Remote server settings
HOST="1.1.1.1"
PORT="22"
DEFAULT_USER="root"
DEFAULT_KEY="${HOME}/.ssh/id_ed25519"

# Usage:
#   ./mssh.sh
#   ./mssh.sh <username>
#   ./mssh.sh <username> <private_key_path>
USER_NAME="${1:-$DEFAULT_USER}"
KEY_PATH="${2:-$DEFAULT_KEY}"

if [ ! -f "${KEY_PATH}" ]; then
  echo "[ERROR] SSH private key not found: \"${KEY_PATH}\""
  echo
  echo "Example:"
  echo "  ./mssh.sh ubuntu \"${HOME}/.ssh/id_ed25519\""
  exit 1
fi

echo "Connecting to ${USER_NAME}@${HOST}:${PORT} ..."
echo "KeepAlive: ServerAliveInterval=30s, ServerAliveCountMax=3"
echo

ssh -i "${KEY_PATH}" \
  -p "${PORT}" \
  -o ServerAliveInterval=30 \
  -o ServerAliveCountMax=3 \
  -o TCPKeepAlive=yes \
  -o StrictHostKeyChecking=accept-new \
  "${USER_NAME}@${HOST}"
