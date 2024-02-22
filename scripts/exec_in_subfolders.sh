#!/bin/bash

# Check if necessary arguments are provided
if [ $# -lt 2 ]; then
  echo "Usage: $0 <folder_path> <command>"
  exit 1
fi

# Get folder path and command from arguments
folder_path="$1"
command="$2"

# Loop through each directory in the specified folder
for dir in "$folder_path"/*; do
  # Check if the path is a directory
  if [ -d "$dir" ]; then
    # Execute the command in the current directory
    (cd "$dir" && eval "$command")
  fi
done

echo "Finished running the command in all non-recursive subfolders."
