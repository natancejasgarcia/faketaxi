-- ============================================================
-- FakeTaxi – initial schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- rides table
CREATE TABLE IF NOT EXISTS rides (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  date           DATE NOT NULL,
  amount         NUMERIC(8, 2) NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card')),
  notes          TEXT
);

-- Index for fast day queries
CREATE INDEX IF NOT EXISTS rides_date_idx ON rides (date DESC);

-- Row Level Security (permissive – no auth required for now)
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_rides"
  ON rides
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- daily_summaries view
-- ============================================================
CREATE OR REPLACE VIEW daily_summaries AS
SELECT
  date,
  COUNT(*)::BIGINT                                                      AS total_rides,
  COALESCE(SUM(amount), 0)                                              AS total_amount,
  COALESCE(SUM(amount) FILTER (WHERE payment_method = 'cash'),  0)     AS cash_amount,
  COALESCE(SUM(amount) FILTER (WHERE payment_method = 'card'),  0)     AS card_amount
FROM rides
GROUP BY date;
