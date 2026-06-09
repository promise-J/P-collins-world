#!/bin/bash

# 1. Load your env variables or define the URI explicitly
MONGO_URI="mongodb://username:password@127.0.0.1:27017/pcollins-world?authSource=admin"

# 2. Define directory paths
BACKUP_DIR="/backups/$(date +%Y-%m-%d_%H%M%S)"
LOG_FILE="/var/log/mongo_backup.log"

echo "[$(date)] Starting MongoDB backup..." >> $LOG_FILE

# 3. Create backup folder directory
mkdir -p $BACKUP_DIR

# 4. Run the backup command
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR" >> $LOG_FILE 2>&1

# 5. Check if it succeeded
if [ $? -eq 0 ]; then
  echo "[$(date)] Backup completed successfully saved to $BACKUP_DIR" >> $LOG_FILE
else
  echo "[$(date)] ERROR: Backup failed!" >> $LOG_FILE
fi

# 6. Optional: Delete backups older than 7 days to protect disk storage space
find /backups/* -type d -ctime +7 -exec rm -rf {} + >> $LOG_FILE 2>&1
