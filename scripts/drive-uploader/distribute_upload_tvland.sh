#!/bin/bash

# Configuration
SOURCE_DIR="/Users/admin/automation/scripts/carousel-generator/output/thachvuland-quotes-batch"
TEMP_DIR="/Users/admin/automation/scripts/carousel-generator/output/tvland-temp"

echo "Creating temp directories..."
mkdir -p "$TEMP_DIR/risk"
mkdir -p "$TEMP_DIR/broker"
mkdir -p "$TEMP_DIR/process"
mkdir -p "$TEMP_DIR/law"

echo "Copying files..."
cp "$SOURCE_DIR/01.png" "$TEMP_DIR/risk/01.png"
cp "$SOURCE_DIR/02.png" "$TEMP_DIR/broker/01.png"
cp "$SOURCE_DIR/03.png" "$TEMP_DIR/process/01.png"
cp "$SOURCE_DIR/04.png" "$TEMP_DIR/law/01.png"

echo "Running uploads..."

# 1. Risk
echo "Uploading Risk Quote..."
node upload.js "$TEMP_DIR/risk" "2026-01-14_Risk_Quote" --brand thachvuland --topic "Rủi ro pháp lý"

# 2. Broker
echo "Uploading Broker Quote..."
node upload.js "$TEMP_DIR/broker" "2026-01-14_Broker_Quote" --brand thachvuland --topic "Môi giới"

# 3. Process
echo "Uploading Process Quote..."
node upload.js "$TEMP_DIR/process" "2026-01-14_RedBook_Process" --brand thachvuland --topic "Quy trình Sổ đỏ"

# 4. Law
echo "Uploading Law Quote..."
node upload.js "$TEMP_DIR/law" "2026-01-14_Land_Law" --brand thachvuland --topic "Luật Đất đai 2024"

echo "Done!"
