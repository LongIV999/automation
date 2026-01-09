# Facebook Carousel Publisher Workflow

This n8n workflow automates the process of posting multi-image carousels to a Facebook Page using data from Google Sheets and images from Google Drive.

## 🚀 Features

- **Automated Scheduling**: Runs on a defined schedule (default: 15 minutes).
- **Sheet to Facebook**: Reads post content (captions) and status from Google Sheets.
- **Drive Integration**: Fetches all images from a specific Google Drive folder for each post.
- **Carousel Support**: Uploads multiple images and attaches them to a single Facebook post.
- **Status Tracking**: Updates the Google Sheet with the post connection URL and marks the status as "Published".

## 🛠 Prerequisites

### Credentials needed in n8n
1.  **Google Sheets OAuth2 API**: For reading and updating the content plan.
2.  **Google Drive OAuth2 API**: For listing and downloading images.
3.  **Facebook Graph API**: Page Access Token with `pages_show_list`, `pages_read_engagement`, and `pages_manage_posts` permissions.

### Google Sheet Structure
Create a Google Sheet with a tab named `Posts` and the following columns:

| Column Name | Description | Example |
| :--- | :--- | :--- |
| `ID` | Unique identifier for the post | `post_001` |
| `Caption` | The text content of the post | `Check out these amazing AI tips! #AI #Tech` |
| `Drive_Folder_ID` | The ID of the Drive folder containing images | `1AbCdEfGhIjKlMnOpQrStUvWxYz` |
| `Status` | Processing status | `Ready` (Initial), `Published` (After success) |
| `Post_URL` | Link to the published post | (Empty initially) |

## ⚙️ How it works

1.  **Trigger**: The workflow wakes up on schedule.
2.  **Read Sheet**: It queries the `Posts` sheet for rows where `Status` is `Ready`.
3.  **Process Rows**: For each ready post:
    -   It reads the `Drive_Folder_ID`.
    -   It lists all files in that folder from Google Drive.
    -   It downloads each image and uploads it to Facebook as a draft photo (`published=false`) to get a media ID.
    -   It collects all media IDs.
    -   It makes a final API call to Facebook to publish a `feed` post, attaching all media IDs and the `Caption`.
    -   It writes the resulting Post URL back to the Google Sheet and changes `Status` to `Published`.

## 📦 Import

Import the `facebook-carousel-workflow.json` file into your n8n instance.

## ⚠️ Notes

- Ensure your Google Drive folder contains *only* the images you want to post.
- Supported image formats: JPG, PNG.
- Facebook Graph API limits apply.
