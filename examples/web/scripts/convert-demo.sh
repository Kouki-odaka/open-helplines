#!/usr/bin/env bash
# convert-demo.sh — ffmpeg 2-stage conversion: webm → mp4 → gif
#
# Inputs:
#   public/assets/demo.webm   (raw Playwright recording, 1280×800)
#
# Outputs:
#   public/assets/demo.mp4    (H.264/AAC, high-quality, for X/Twitter)
#   public/assets/demo.gif    (palette-optimized, ≤ 8MB, for README)
#
# Requirements: ffmpeg (brew install ffmpeg)
# Usage: bash scripts/convert-demo.sh [--no-gif]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR/../public/assets"
INPUT_WEBM="$ASSETS_DIR/demo.webm"
OUTPUT_MP4="$ASSETS_DIR/demo.mp4"
OUTPUT_GIF="$ASSETS_DIR/demo.gif"
PALETTE_PNG="$ASSETS_DIR/.palette.png"

# GIF settings (tuned for < 8MB target)
GIF_WIDTH=640          # output width  (height auto-scaled)
GIF_FPS=10             # frames per second
GIF_COLORS=128         # palette colours (64-256)
GIF_START=0            # start time (seconds)
GIF_DURATION=50        # trim to this many seconds for GIF

check_deps() {
  if ! command -v ffmpeg &>/dev/null; then
    echo "❌  ffmpeg not found. Install with: brew install ffmpeg"
    exit 1
  fi
  if [[ ! -f "$INPUT_WEBM" ]]; then
    echo "❌  Input not found: $INPUT_WEBM"
    echo "    Run: node scripts/record-demo.mjs"
    exit 1
  fi
}

convert_mp4() {
  echo "🎬  Converting → demo.mp4 (H.264/AAC, 1280×800)"
  ffmpeg -y \
    -i "$INPUT_WEBM" \
    -c:v libx264 \
    -preset slow \
    -crf 22 \
    -vf "scale=1280:800:flags=lanczos" \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -an \
    "$OUTPUT_MP4"

  local size_kb
  size_kb=$(du -k "$OUTPUT_MP4" | cut -f1)
  echo "✅  demo.mp4: ${size_kb} KB"
}

convert_gif() {
  echo "🎨  Converting → demo.gif (${GIF_WIDTH}px wide, ${GIF_FPS}fps, ${GIF_DURATION}s)"

  # Stage 1: generate optimised palette from source frames
  ffmpeg -y \
    -ss "$GIF_START" \
    -t "$GIF_DURATION" \
    -i "$INPUT_WEBM" \
    -vf "fps=${GIF_FPS},scale=${GIF_WIDTH}:-2:flags=lanczos,palettegen=max_colors=${GIF_COLORS}:stats_mode=diff" \
    -update 1 \
    "$PALETTE_PNG"

  # Stage 2: apply palette and produce GIF
  ffmpeg -y \
    -ss "$GIF_START" \
    -t "$GIF_DURATION" \
    -i "$INPUT_WEBM" \
    -i "$PALETTE_PNG" \
    -filter_complex "fps=${GIF_FPS},scale=${GIF_WIDTH}:-2:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
    "$OUTPUT_GIF"

  rm -f "$PALETTE_PNG"

  local size_kb
  size_kb=$(du -k "$OUTPUT_GIF" | cut -f1)
  local size_mb
  size_mb=$(echo "scale=1; $size_kb / 1024" | bc)
  echo "✅  demo.gif: ${size_kb} KB (${size_mb} MB)"

  if [[ "$size_kb" -gt 8192 ]]; then
    echo "⚠️   GIF exceeds 8MB target."
    echo "    Try reducing GIF_FPS or GIF_DURATION in this script."
  fi
}

print_summary() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Output summary:"
  for f in "$OUTPUT_MP4" "$OUTPUT_GIF"; do
    if [[ -f "$f" ]]; then
      local size_kb duration
      size_kb=$(du -k "$f" | cut -f1)
      duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$f" 2>/dev/null || echo "N/A")
      printf "  %-20s %6d KB  %.1fs\n" "$(basename "$f")" "$size_kb" "$duration"
    fi
  done
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
check_deps

NO_GIF=false
for arg in "$@"; do
  [[ "$arg" == "--no-gif" ]] && NO_GIF=true
done

convert_mp4

if [[ "$NO_GIF" == false ]]; then
  convert_gif
fi

print_summary
