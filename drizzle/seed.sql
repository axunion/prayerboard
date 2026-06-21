-- Development seed data. Safe to run multiple times (INSERT OR IGNORE).

INSERT OR IGNORE INTO boards (id, name, event_date, is_active, created_at) VALUES
  ('seed-board-1', '2025年度クリスマス礼拝', '2025-12-25', 1, unixepoch() * 1000);

INSERT OR IGNORE INTO posts (id, board_id, name, content, created_at) VALUES
  ('seed-post-1', 'seed-board-1', '田中太郎', '今日の礼拝に参加できて感謝します。皆さんのために祈っています。', unixepoch() * 1000),
  ('seed-post-2', 'seed-board-1', '鈴木花子', '家族の健康のためにお祈りください。', (unixepoch() - 120) * 1000),
  ('seed-post-3', 'seed-board-1', '山田一郎', '就職活動がうまくいくようお祈りしていただけると幸いです。', (unixepoch() - 240) * 1000);
