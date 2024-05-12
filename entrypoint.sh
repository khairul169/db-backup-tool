#!/bin/sh

set -e

# Run migration
bun run migrate & PID=$!
wait $PID

# Start app
bun start & PID=$!
wait $PID
