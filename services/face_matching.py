import json
import os
import sys
from typing import Any, Dict

# Explicitly force CPU (no GPU / CUDA).
# This should be set before importing DeepFace / TensorFlow.
os.environ.setdefault("CUDA_VISIBLE_DEVICES", "-1")
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

try:
  # Extra safety: tell TensorFlow to ignore all GPU devices.
  import tensorflow as _tf  # type: ignore

  try:
      _tf.config.set_visible_devices([], "GPU")
  except Exception:
      # If GPUs are not present or TF version differs, just ignore.
      pass
except Exception:
  # TensorFlow not available or failed to import; DeepFace import below
  # will raise a clearer error if it really needs TF.
  _tf = None  # type: ignore

try:
    from deepface import DeepFace  # type: ignore
except Exception as exc:  # pragma: no cover - optional dependency
    DeepFace = None  # type: ignore[assignment]
    _import_error = exc
else:
    _import_error = None


def match_faces(
    img1_path: str,
    img2_path: str,
    *,
    model_name: str = "ArcFace",
    detector_backend: str = "opencv",
) -> Dict[str, Any]:
    """
    Compare two face images and return verification result.

    This uses DeepFace.verify under the hood and returns a small,
    JSON‑serialisable dictionary that can be consumed by Node.
    """
    if DeepFace is None:
        raise RuntimeError(
            f"deepface is not available: {_import_error!s}"
        )

    result: Dict[str, Any] = DeepFace.verify(
        img1_path=img1_path,
        img2_path=img2_path,
        model_name=model_name,
        detector_backend=detector_backend,
        enforce_detection=False,
    )

    distance = float(result.get("distance", 0.0))
    threshold = float(result.get("threshold", 0.0) or 0.0)

    # Convert distance + threshold to a simple 0–100 similarity score.
    similarity = 0.0
    if threshold > 0:
        similarity = max(0.0, (threshold - distance) / threshold) * 100.0

    return {
        "verified": bool(result.get("verified", False)),
        "distance": distance,
        "threshold": threshold,
        "similarity": similarity,
        "model_name": model_name,
        "detector_backend": detector_backend,
    }


def _main() -> None:
    """
    CLI entry point.

    Expects a JSON object on stdin:
      {"img1_path": "...", "img2_path": "..."}

    Prints a single‑line JSON result to stdout.
    """
    data = json.loads(sys.stdin.read() or "{}")
    img1_path = data.get("img1_path", "")
    img2_path = data.get("img2_path", "")

    if not img1_path or not img2_path:
        raise SystemExit("img1_path and img2_path are required")

    result = match_faces(img1_path, img2_path)
    print(json.dumps(result))


if __name__ == "__main__":
    _main()
