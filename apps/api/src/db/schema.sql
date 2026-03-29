-- JPG Style SmartWash — Database Schema
-- PostgreSQL 16

-- ─── Extensions ─────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Categories ─────────────────────────────────────────
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  image       VARCHAR(500) NOT NULL DEFAULT '',
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

-- ─── Products ───────────────────────────────────────────
CREATE TABLE products (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             VARCHAR(200) NOT NULL,
  slug             VARCHAR(200) NOT NULL UNIQUE,
  description      TEXT NOT NULL DEFAULT '',
  price            INT NOT NULL CHECK (price >= 0),
  compare_at_price INT CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  sku              VARCHAR(50) NOT NULL UNIQUE,
  category_id      UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  is_bestseller    BOOLEAN NOT NULL DEFAULT FALSE,
  is_new           BOOLEAN NOT NULL DEFAULT FALSE,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  stock            INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating           NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count     INT NOT NULL DEFAULT 0,
  images           JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_bestseller ON products(is_bestseller) WHERE is_bestseller = TRUE;
CREATE INDEX idx_products_new ON products(is_new) WHERE is_new = TRUE;
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('russian', name || ' ' || description));

-- ─── Customers ──────────────────────────────────────────
CREATE TABLE customers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL DEFAULT '',
  phone       VARCHAR(20) NOT NULL UNIQUE,
  email       VARCHAR(200),
  telegram_id VARCHAR(100),
  addresses   JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_count INT NOT NULL DEFAULT 0,
  total_spent BIGINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_phone ON customers(phone);

-- ─── Orders ─────────────────────────────────────────────
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number     VARCHAR(20) NOT NULL UNIQUE,
  customer_id      UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  items            JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal         INT NOT NULL DEFAULT 0,
  discount_amount  INT NOT NULL DEFAULT 0,
  delivery_fee     INT NOT NULL DEFAULT 0,
  total            INT NOT NULL DEFAULT 0,
  delivery_address VARCHAR(500) NOT NULL DEFAULT '',
  delivery_zone    VARCHAR(100) NOT NULL DEFAULT '',
  payment_method   VARCHAR(50) NOT NULL DEFAULT 'cash',
  payment_status   VARCHAR(20) NOT NULL DEFAULT 'pending',
  status           VARCHAR(20) NOT NULL DEFAULT 'pending',
  notes            TEXT NOT NULL DEFAULT '',
  discount_code    VARCHAR(50),
  telegram_msg_id  VARCHAR(100),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ─── Reviews ────────────────────────────────────────────
CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id   UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(100) NOT NULL,
  rating        INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT NOT NULL DEFAULT '',
  is_approved   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);

-- ─── Discounts ──────────────────────────────────────────
CREATE TABLE discounts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code       VARCHAR(50) NOT NULL UNIQUE,
  type       VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value      INT NOT NULL CHECK (value > 0),
  min_order  INT NOT NULL DEFAULT 0,
  max_uses   INT NOT NULL DEFAULT 0,
  used_count INT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_discounts_code ON discounts(code);

-- ─── Inventory Log ──────────────────────────────────────
CREATE TABLE inventory_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_change  INT NOT NULL,
  reason          VARCHAR(100) NOT NULL,
  reference_id    VARCHAR(100),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_product ON inventory_log(product_id);

-- ─── Admin Users ────────────────────────────────────────
CREATE TABLE admin_users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(500) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager')),
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Update Triggers ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
