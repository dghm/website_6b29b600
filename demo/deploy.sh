#!/bin/bash
# demo.dghm.tw 部署腳本（lftp 版）
#
# 前置需求：
#   - 安裝 lftp： brew install lftp
#   - 已依 deploy.local.sh.example 建立 deploy.local.sh（含 FTP 帳密）
#
# 用法：
#   ./deploy.sh           — 上傳有變動的檔案
#   ./deploy.sh --dry-run — 只列出會上傳哪些檔案，不實際執行
#
# 安全性說明：
#   - 此腳本只「上傳」（mirror --reverse），不會刪除遠端多出的檔案。
#   - 只會上傳本目錄（demo/）內容，不會動到主網站或 apt 系統。

set -euo pipefail
cd "$(dirname "$0")"

LOCAL_CONF="deploy.local.sh"
if [ ! -f "$LOCAL_CONF" ]; then
    echo "找不到 $LOCAL_CONF。"
    echo "請先執行： cp deploy.local.sh.example deploy.local.sh"
    echo "然後填入 FTP 帳密後再執行本腳本。"
    exit 1
fi

# shellcheck source=/dev/null
source "$LOCAL_CONF"

: "${FTP_HOST:?請在 deploy.local.sh 設定 FTP_HOST}"
: "${FTP_USER:?請在 deploy.local.sh 設定 FTP_USER}"
: "${FTP_PASS:?請在 deploy.local.sh 設定 FTP_PASS}"
: "${REMOTE_DIR:?請在 deploy.local.sh 設定 REMOTE_DIR}"

if ! command -v lftp >/dev/null 2>&1; then
    echo "找不到 lftp，請先執行： brew install lftp"
    exit 1
fi

DRYRUN=""
if [ "${1:-}" = "--dry-run" ]; then
    DRYRUN="--dry-run"
    echo "=== 預覽模式（不會實際上傳） ==="
fi

lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" <<EOF
set ftp:ssl-allow yes
set ssl:verify-certificate no
mirror --reverse --verbose --no-perms $DRYRUN \\
  --exclude-glob deploy.sh \\
  --exclude-glob deploy.local.sh* \\
  --exclude-glob .DS_Store \\
  . $REMOTE_DIR
bye
EOF

echo "完成。"
