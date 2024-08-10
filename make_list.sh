#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

is_binary_file() {
  local file="$1"
  local file_output
  file_output=$(file "$file")
  
  if [[ "$file_output" == *"text"* ]] || [[ "$file_output" == *"JSON data"* ]]; then
    return 1
  else
    return 0
  fi
}

initialize_output_file() {
  local folder_name
  folder_name=$(basename "$PWD")
  output_file="${folder_name}.txt"
  : > "$output_file"
}

append_source_code() {
  local find_output
  find_output=$(git ls-files -co --exclude-standard | sort)

  echo "## Source Code" | tee -a "$output_file"

  while IFS= read -r line; do
    if [[ "$line" != "$output_file" ]] && [[ "$line" != "$0" ]] && ! is_binary_file "$line"; then
      local file_size
      file_size=$(stat -c%s "$line")
      if (( file_size <= 20480 )); then
        {
          echo "\`\`\`file:$line"
          cat "$line"
          echo "\`\`\`"
          echo
        } | tee -a "$output_file"
        echo "Processed: $line"
      else
        echo "Ignored (file too large): $line"
      fi
    elif [[ "$line" == "$0" ]]; then
      echo "Ignored (this script): $line"
    else
      if [[ "$line" == "$output_file" ]]; then
        echo "Ignored (output file): $line"
      else
        echo "Ignored (binary file): $line"
      fi
    fi
  done <<< "$find_output"
}

main() {
  initialize_output_file
  append_source_code
}

main "$@"
