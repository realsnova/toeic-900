"""本機開發伺服器：提供 worktree 的靜態檔案，並接受瀏覽器產生的音檔。

只用 Python 標準函式庫，不需要安裝任何套件。
只綁定 127.0.0.1；PUT 只能寫進 audio/ 底下，且只接受 .mp3 / .json。

用法（在 worktree 根目錄）：
    python tools/audio/devserver.py [port]
然後用瀏覽器開 http://127.0.0.1:<port>/tools/audio/generate.html
"""
import http.server
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT_ROOT = (ROOT / "audio").resolve()
ALLOWED_EXT = {".mp3", ".json"}
MAX_BYTES = 20 * 1024 * 1024


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        # 跨來源隔離：讓 onnxruntime-web 可以用多執行緒 WASM（SharedArrayBuffer）
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "credentialless")
        super().end_headers()

    def do_PUT(self):
        if not self.path.startswith("/__out/"):
            return self.send_error(404)
        rel = self.path[len("/__out/"):].split("?", 1)[0]
        target = (ROOT / rel).resolve()
        if OUT_ROOT not in target.parents or target.suffix not in ALLOWED_EXT:
            return self.send_error(403, "only audio/**/*.mp3|json")
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0 or length > MAX_BYTES:
            return self.send_error(413)
        data = self.rfile.read(length)
        target.parent.mkdir(parents=True, exist_ok=True)
        tmp = target.with_suffix(target.suffix + ".tmp")
        tmp.write_bytes(data)
        os.replace(tmp, target)
        self.send_response(201)
        self.end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8643
    http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
