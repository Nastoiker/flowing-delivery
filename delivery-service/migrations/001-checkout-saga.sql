-- Version 1 is an immutable workflow: reserve inventory, charge, fulfill.
-- Apply explicitly; the application must not synchronize/drop these tables.
CREATE TABLE IF NOT EXISTS checkout_sagas (
  id text PRIMARY KEY,
  input jsonb NOT NULL,
  status text NOT NULL DEFAULT 'running'
    CHECK (status IN ('running', 'compensating', 'completed', 'cancelled')),
  step integer NOT NULL DEFAULT 0,
  version integer NOT NULL DEFAULT 0 CHECK (version >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((status = 'running' AND step BETWEEN 0 AND 2)
      OR (status = 'compensating' AND step BETWEEN 0 AND 1)
      OR (status = 'completed' AND step = 2)
      OR (status = 'cancelled' AND step = -1))
);
CREATE INDEX IF NOT EXISTS checkout_sagas_pending
  ON checkout_sagas (updated_at, id) WHERE status IN ('running', 'compensating');
-- A fresh HTTP idempotency key must not charge the same order a second time.
CREATE UNIQUE INDEX IF NOT EXISTS checkout_sagas_order ON checkout_sagas ((input->>'orderId'));
CREATE TABLE IF NOT EXISTS checkout_saga_events (
  saga_id text NOT NULL REFERENCES checkout_sagas(id),
  version integer NOT NULL,
  status text NOT NULL,
  step integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (saga_id, version)
);
