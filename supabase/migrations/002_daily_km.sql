-- daily_km: stores kilometers driven per day
CREATE TABLE IF NOT EXISTS daily_km (
  date        DATE PRIMARY KEY,
  km          NUMERIC(8, 1) NOT NULL CHECK (km >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE daily_km ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_daily_km"
  ON daily_km
  FOR ALL
  USING (true)
  WITH CHECK (true);
