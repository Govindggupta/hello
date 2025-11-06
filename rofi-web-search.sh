#!/usr/bin/env bash
# Smart web search for Rofi
# Opens direct URLs or Google searches depending on the query

# query="$@"

# # This block runs when the user selects the "Google Search..." entry
# if [ "${ROFI_RETV:-0}" -eq 2 ]; then
#     # If it looks like a valid URL
#     if [[ "$query" =~ ^(https?://|www\.|[a-zA-Z0-9._-]+\.[a-z]{2,})$ ]]; then
#         # Add https:// if missing
#         if [[ ! "$query" =~ ^https?:// ]]; then
#             query="https://$query"
#         fi
#         xdg-open "$query" > /dev/null 2>&1 &
#     else
#         # Otherwise perform a Google search
#         encoded_query=$(printf "%s" "$query" | jq -s -R -r @uri)
#         xdg-open "https://www.google.com/search?q=$encoded_query" > /dev/null 2>&1 &
#     fi
#     exit 0
# fi

query="$@"

# This block runs when the user selects the search entry
if [ "${ROFI_RETV:-0}" -eq 2 ]; then
    # If it looks like a valid URL
    if [[ "$query" =~ ^(https?://|www\.|[a-zA-Z0-9._-]+\.[a-z]{2,})$ ]]; then
        # Add https:// if missing
        if [[ ! "$query" =~ ^https?:// ]]; then
            query="https://$query"
        fi
        xdg-open "$query" > /dev/null 2>&1 &
    else
        # Remove the first character (g or y) and trim spaces
        search_query="${query:1}"
        search_query="${search_query## }"
        encoded_query=$(printf "%s" "$search_query" | jq -s -R -r @uri)
        
        # Check if query starts with 'y' for YouTube
        if [[ "${query:0:1}" == "y" ]]; then
            xdg-open "https://www.youtube.com/results?search_query=$encoded_query" > /dev/null 2>&1 &
        # Check if query starts with 'g' for Google
        elif [[ "${query:0:1}" == "g" ]]; then
            xdg-open "https://www.google.com/search?q=$encoded_query" > /dev/null 2>&1 &
        else
            # Default to Google if no prefix
            xdg-open "https://www.google.com/search?q=$encoded_query" > /dev/null 2>&1 &
        fi
    fi
    exit 0
fi

# The prompt text that appears in Rofi's list
echo "Search (g: Google, y: YouTube)..."

