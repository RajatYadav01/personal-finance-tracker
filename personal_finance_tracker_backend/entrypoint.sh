#!/bin/bash
set -e
bundle exec rails db:create
bundle exec rails db:migrate
echo "Starting Rails server..."
bundle exec rails server -b 0.0.0.0 -p ${PORT:-5000}