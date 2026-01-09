
#!/bin/bash
cd "$(dirname "$0")/drive-uploader"

OUTPUT_DIR="../carousel-generator/output"

echo "Starting batch upload fix..."

for dir in "$OUTPUT_DIR"/*; do
    if [ -d "$dir" ]; then
        dirname=$(basename "$dir")
        # Skip empty directories or test
        if [ "$dirname" == "test" ]; then continue; fi
        
        echo "---------------------------------------------------"
        echo "Uploading $dirname..."
        
        # Check if directory has images
        count=$(find "$dir" -maxdepth 1 -name "*.png" | wc -l)
        if [ "$count" -eq 0 ]; then
            echo "Skipping $dirname (no images)"
            continue
        fi

        node upload.js "$dir" --delete
    fi
done

echo "Batch upload fix completed!"
