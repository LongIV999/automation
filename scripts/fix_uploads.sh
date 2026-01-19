
#!/bin/bash
cd "$(dirname "$0")/drive-uploader"

OUTPUT_DIR="../carousel-generator/output"

echo "Starting batch upload fix with Brand Awareness..."

for dir in "$OUTPUT_DIR"/*; do
    if [ -d "$dir" ]; then
        dirname=$(basename "$dir")
        # Skip empty directories or test
        if [ "$dirname" == "test" ]; then continue; fi
        
        echo "---------------------------------------------------"
        echo "Processing $dirname..."
        
        # Check if directory has images
        count=$(find "$dir" -maxdepth 1 -name "*.png" | wc -l)
        if [ "$count" -eq 0 ]; then
            echo "Skipping $dirname (no images)"
            continue
        fi

        # Detect brand
        BRAND="longbest"
        if [[ $dirname == thachvuland-* ]]; then
            BRAND="thachvuland"
        elif [[ $dirname == longbest-* ]]; then
            BRAND="longbest"
        fi

        echo "Detected Brand: $BRAND"
        node upload.js "$dir" --brand "$BRAND" --delete
    fi
done

echo "Batch upload fix completed!"
