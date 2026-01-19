const { addPostToSheets } = require('./sheets-updater');

// Data for recent uploads
const posts = [
  {
    spreadsheetId: '1MPyLQw9Q4sLlRiSvWSCyY4NvtVGeoDKoib6n3f4PRTo',
    sheetName: 'Post',
    folderId: '1rG0gW5SxIftnYe-pMkyrCgKo0P_eCj2P',
    folderLink: 'https://drive.google.com/drive/folders/1rG0gW5SxIftnYe-pMkyrCgKo0P_eCj2P',
    folderName: '2026-01-15_queennailbern-posts-new',
    uploadedCount: 10,
    caption: '',
    topic: 'New Content Batch',
    brand: 'queennailbern'
  },
  {
    spreadsheetId: '1MPyLQw9Q4sLlRiSvWSCyY4NvtVGeoDKoib6n3f4PRTo',
    sheetName: 'Post',
    folderId: '1AHeqWwoa7lUspe-n5tgyNOBcDCtfRm9_',
    folderLink: 'https://drive.google.com/drive/folders/1AHeqWwoa7lUspe-n5tgyNOBcDCtfRm9_',
    folderName: '2026-01-15_opencode-models',
    uploadedCount: 5,
    caption: '',
    topic: 'OpenCode Models',
    brand: 'longbestai'
  }
];

async function updateSheet() {
  for (const post of posts) {
    try {
      await addPostToSheets(post);
      console.log(`✅ Added post for ${post.brand}`);
    } catch (error) {
      console.error(`❌ Failed to add post for ${post.brand}:`, error.message);
    }
  }
}

updateSheet();