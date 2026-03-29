"""
bridge_engine.py — Google Drive Sync for Facet Lab

Syncs the local /specs and /data directories to a Google Drive folder,
making them available as grounding files for Gemini Gems.
"""

import json
import os
import sys
from pathlib import Path

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = ["https://www.googleapis.com/auth/drive.file"]
PROJECT_ROOT = Path(__file__).resolve().parent.parent
TOKEN_PATH = PROJECT_ROOT / "token.json"
CREDENTIALS_PATH = PROJECT_ROOT / "credentials.json"

SYNC_DIRS = ["specs", "data", "config"]
DRIVE_ROOT_FOLDER = "facet-lab"


def authenticate():
    """Authenticate with Google Drive API using OAuth2."""
    creds = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIALS_PATH.exists():
                print(
                    "ERROR: credentials.json not found in project root.\n"
                    "Download it from Google Cloud Console → APIs & Services → Credentials."
                )
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(
                str(CREDENTIALS_PATH), SCOPES
            )
            creds = flow.run_local_server(port=0)
        TOKEN_PATH.write_text(creds.to_json())
    return creds


def get_or_create_folder(service, name, parent_id=None):
    """Find or create a folder in Google Drive."""
    query = (
        f"name='{name}' and mimeType='application/vnd.google-apps.folder' "
        f"and trashed=false"
    )
    if parent_id:
        query += f" and '{parent_id}' in parents"

    results = service.files().list(q=query, fields="files(id, name)").execute()
    files = results.get("files", [])

    if files:
        return files[0]["id"]

    metadata = {
        "name": name,
        "mimeType": "application/vnd.google-apps.folder",
    }
    if parent_id:
        metadata["parents"] = [parent_id]

    folder = service.files().create(body=metadata, fields="id").execute()
    print(f"  Created Drive folder: {name}")
    return folder["id"]


def upload_file(service, local_path, parent_id):
    """Upload or update a file in Google Drive."""
    filename = os.path.basename(local_path)

    query = (
        f"name='{filename}' and '{parent_id}' in parents and trashed=false"
    )
    results = service.files().list(q=query, fields="files(id)").execute()
    existing = results.get("files", [])

    media = MediaFileUpload(str(local_path), resumable=True)

    if existing:
        file_id = existing[0]["id"]
        service.files().update(
            fileId=file_id, media_body=media
        ).execute()
        print(f"  Updated: {local_path}")
    else:
        metadata = {"name": filename, "parents": [parent_id]}
        service.files().create(
            body=metadata, media_body=media, fields="id"
        ).execute()
        print(f"  Uploaded: {local_path}")


def sync_directory(service, local_dir, drive_parent_id):
    """Recursively sync a local directory to Google Drive."""
    local_path = PROJECT_ROOT / local_dir
    if not local_path.exists():
        print(f"  Skipping {local_dir}/ (not found)")
        return

    folder_id = get_or_create_folder(service, local_dir, drive_parent_id)

    for item in sorted(local_path.rglob("*")):
        if item.is_file():
            rel = item.relative_to(local_path)
            parent = folder_id
            for part in rel.parts[:-1]:
                parent = get_or_create_folder(service, part, parent)
            upload_file(service, item, parent)


def sync():
    """Run the full sync pipeline."""
    print("Facet Lab — Bridge Engine")
    print("=" * 40)

    creds = authenticate()
    service = build("drive", "v3", credentials=creds)

    root_id = get_or_create_folder(service, DRIVE_ROOT_FOLDER)
    print(f"Drive root: /{DRIVE_ROOT_FOLDER} ({root_id})\n")

    for dir_name in SYNC_DIRS:
        print(f"Syncing {dir_name}/...")
        sync_directory(service, dir_name, root_id)
        print()

    # Update last_sync timestamp in state.json
    state_path = PROJECT_ROOT / "data" / "state.json"
    if state_path.exists():
        from datetime import datetime, timezone

        state = json.loads(state_path.read_text())
        state["meta"]["last_sync"] = datetime.now(timezone.utc).isoformat()
        state_path.write_text(json.dumps(state, indent=2) + "\n")
        print("Updated state.json last_sync timestamp.")

    print("\nSync complete.")


if __name__ == "__main__":
    sync()
