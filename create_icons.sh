#!/bin/bash
# Создаем простые PNG-иконки через ImageMagick
if command -v convert &> /dev/null; then
  convert -size 48x48 xc:transparent \
    -fill '#667eea' -draw 'roundrectangle 4,4 44,44 8,8' \
    -fill white -draw 'text 12,32 "HH"' \
    icons/icon-48.png
  convert -size 96x96 xc:transparent \
    -fill '#667eea' -draw 'roundrectangle 8,8 88,88 16,16' \
    -fill white -draw 'text 24,64 "HH"' \
    icons/icon-96.png
  echo "[+] Icons created with ImageMagick"
else
  echo "[!] ImageMagick not found, creating minimal PNG"
  # Минимальный валидный PNG 1x1 (прозрачный)
  printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n\xe2\xe1\x00\x00\x00\x00IEND\xaeB`\x82' > icons/icon-48.png
  cp icons/icon-48.png icons/icon-96.png
  echo "[+] Minimal PNG icons created"
fi
