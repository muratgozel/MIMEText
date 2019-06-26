#!/bin/bash

echo "👨‍🔧 releasing app..."
# measure script execution time
start_time=$(date +%s)

# validate
if [ -z "$1" ]; then
  echo "👨‍🔧 is it major, minor or patch?"
  exit 1
fi
if [ -z "$2" ]; then
  echo "👨‍🔧 you must add a commit message as an argument."
  exit 1
fi
branch=master
if [ ! -z "$3" ]; then
  branch=$3
fi

release_dir="./release/"

# check if there are changes
changes=$(node ${release_dir}checkChanges.js)

if [[ $changes == "yes" ]]; then
  # generate the next release tag
  next=$(node ${release_dir}getNextReleaseNum.js $1)
  if [[ $next == "none" ]]; then
    echo "👨‍🔧 couldn't compute the next release number."
    exit 1
  fi

  # push
  echo "Releasing new version (${next})..."
  git tag -a "$next" -m "$2"
  git add .
  git commit -m "$2"
  git push origin $branch
else
  echo "👨‍🔧 no changes detected in the codebase. nothing to push."
  exit 1
fi

echo "👨‍🔧 successfully released. ( $((($(date +%s)-$start_time)/60)) minutes. )"
