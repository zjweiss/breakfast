from __future__ import annotations

import os
from datetime import datetime, timezone
from http import HTTPStatus
from typing import Any
from uuid import uuid4

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)


ALLOWED_CATEGORIES = {"contract", "invoice", "health_record", "legal", "unknown"}
ALLOWED_RISK_LEVELS = {"low", "medium", "high", "critical"}


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@app.get("/health")
def health() -> tuple[dict[str, Any], int]:
    return (
        {
            "status": "ok",
            "service": "audit-ready-ai-flask",
            "timestamp": _now_iso(),
        },
        HTTPStatus.OK,
    )


@app.post("/api/upload-and-analyze")
def upload_and_analyze() -> tuple[dict[str, Any], int]:
    """
    Flask backend entry point for the Upload-and-Analyze pipeline.

    Current behavior:
    - Validates request shape.
    - Returns a deterministic demo payload representing what should be stored in
      `documents`, `tags`, and `document_embeddings`.

    You can wire real integrations for:
    - Supabase Storage upload
    - Gemini summarization + PII analysis + categorization
    - Embedding generation and pgvector insert
    - Audit logging
    """

    payload = request.get_json(silent=True) or {}

    file_name = payload.get("file_name")
    mime_type = payload.get("mime_type", "application/pdf")
    organization_id = payload.get("organization_id")
    user_id = payload.get("user_id")

    if not file_name or not organization_id or not user_id:
        return (
            {
                "error": "validation_error",
                "message": "file_name, organization_id, and user_id are required.",
            },
            HTTPStatus.BAD_REQUEST,
        )

    category = payload.get("category", "unknown")
    risk_level = payload.get("risk_level", "medium")

    if category not in ALLOWED_CATEGORIES:
        return (
            {
                "error": "validation_error",
                "message": f"category must be one of: {sorted(ALLOWED_CATEGORIES)}",
            },
            HTTPStatus.BAD_REQUEST,
        )

    if risk_level not in ALLOWED_RISK_LEVELS:
        return (
            {
                "error": "validation_error",
                "message": f"risk_level must be one of: {sorted(ALLOWED_RISK_LEVELS)}",
            },
            HTTPStatus.BAD_REQUEST,
        )

    document_id = str(uuid4())

    result = {
        "document": {
            "id": document_id,
            "organization_id": organization_id,
            "uploaded_by": user_id,
            "file_path": f"{organization_id}/{document_id}/{file_name}",
            "mime_type": mime_type,
            "status": "analyzed",
            "summary": "This is a demo 3-sentence summary. It simulates LLM output for compliance workflows. Replace with Gemini response in production.",
            "pii_detected": True,
            "pii_findings": {
                "ssn": [{"redacted": "***-**-1234", "confidence": 0.93}],
                "credit_card": [{"redacted": "**** **** **** 4242", "confidence": 0.89}],
            },
            "category": category,
            "risk_level": risk_level,
            "created_at": _now_iso(),
        },
        "tags": [
            {"tag": category, "source": "ai", "confidence": 0.92},
            {"tag": "pii_detected", "source": "ai", "confidence": 0.95},
        ],
        "embedding_chunks": [
            {
                "chunk_index": 0,
                "token_count": 128,
                "content_preview": "Demo chunk for semantic search.",
                "embedding_dimensions": 768,
            }
        ],
        "audit_log": {
            "action_type": "analyze",
            "ip_address": request.headers.get("X-Forwarded-For", request.remote_addr),
            "browser_user_agent": request.headers.get("User-Agent"),
            "created_at": _now_iso(),
        },
    }

    return ({"ok": True, "result": result}, HTTPStatus.CREATED)


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_ENV") == "development")
