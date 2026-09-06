#!/usr/bin/env bash
set -e
A="videos/Businesswoman_walking_in_corpora…_202609052228.mp4"
B="videos/Businesswoman_leading_corporate_…_202609052229.mp4"
OUT="assets/video"
mkdir -p "$OUT"

enc () { # src out width crf
  ffmpeg -v error -y -i "$1" -an -vf "scale=$3:-2:flags=lanczos" \
    -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p \
    -crf $4 -g 4 -keyint_min 4 -x264-params "scenecut=0:open_gop=0" \
    -preset slow -movflags +faststart "$2"
}

enc "$A" "$OUT/scene-01-1280.mp4" 1280 28
enc "$A" "$OUT/scene-01-768.mp4"   768 30
enc "$B" "$OUT/scene-02-1280.mp4" 1280 28
enc "$B" "$OUT/scene-02-768.mp4"   768 30

# Posters (first frame), WebP + JPEG fallback
ffmpeg -v error -y -i "$A" -vf "select=eq(n\,0),scale=1280:-2" -frames:v 1 -q:v 78 "$OUT/scene-01-poster.webp"
ffmpeg -v error -y -i "$B" -vf "select=eq(n\,0),scale=1280:-2" -frames:v 1 -q:v 78 "$OUT/scene-02-poster.webp"
ffmpeg -v error -y -i "$A" -vf "select=eq(n\,0),scale=1280:-2" -frames:v 1 -q:v 6 "$OUT/scene-01-poster.jpg"
ffmpeg -v error -y -i "$B" -vf "select=eq(n\,0),scale=1280:-2" -frames:v 1 -q:v 6 "$OUT/scene-02-poster.jpg"

# Social share image from a strong frame of scene 02
ffmpeg -v error -y -i "$B" -vf "select=eq(n\,120),scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630" -frames:v 1 -q:v 5 "assets/img/og-default.jpg"

echo "--- done ---"
ls -la "$OUT" assets/img
