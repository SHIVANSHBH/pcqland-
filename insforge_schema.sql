-- 2026_05_27_000000_create_users_table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    business_name VARCHAR(255) NULL,
    gst_no VARCHAR(255) NULL,
    address TEXT NULL,
    city VARCHAR(255) NULL,
    state VARCHAR(255) NULL,
    pincode VARCHAR(255) NULL,
    cashback_wallet_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    prepaid_wallet_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    email_verified_at TIMESTAMP NULL,
    phone_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2026_05_27_000001_create_categories_table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT NULL REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    icon_path VARCHAR(255) NULL,
    banner_path VARCHAR(255) NULL,
    description TEXT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    seo_title VARCHAR(255) NULL,
    seo_description TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- 2026_05_27_000002_create_products_table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    image_path VARCHAR(255) NULL,
    short_description TEXT NULL,
    description_html TEXT NULL,
    activation_html TEXT NULL,
    features_json JSONB NULL,
    min_qty INTEGER NOT NULL DEFAULT 1,
    max_qty INTEGER NOT NULL DEFAULT 100,
    base_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    cashback_per_unit DECIMAL(12,2) NOT NULL DEFAULT 0,
    is_special_product BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    seo_title VARCHAR(255) NULL,
    seo_description TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_products_category_id ON products(category_id);

-- 2026_05_27_000003_create_product_price_slabs_table
CREATE TABLE product_price_slabs (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    qty INTEGER NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    label VARCHAR(255) NULL,
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    is_hot BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_product_price_slabs_product_id ON product_price_slabs(product_id);

-- 2026_05_27_000005_create_orders_table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    order_no VARCHAR(255) NOT NULL UNIQUE,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    wallet_discount DECIMAL(12,2) NOT NULL DEFAULT 0,
    prepaid_discount DECIMAL(12,2) NOT NULL DEFAULT 0,
    credit_used DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(255) NOT NULL DEFAULT 'pending_payment',
    order_status VARCHAR(255) NOT NULL DEFAULT 'pending',
    gateway VARCHAR(255) NULL,
    gateway_order_id VARCHAR(255) NULL,
    gateway_payment_id VARCHAR(255) NULL,
    invoice_no VARCHAR(255) NULL,
    gst_no VARCHAR(255) NULL,
    billing_json JSONB NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- 2026_05_27_000006_create_order_items_table
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name_snapshot VARCHAR(255) NOT NULL,
    qty INTEGER NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- 2026_05_27_000008_create_license_key_batches_table
CREATE TABLE license_key_batches (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    batch_name VARCHAR(255) NOT NULL,
    total_keys INTEGER NOT NULL DEFAULT 0,
    imported_count INTEGER NOT NULL DEFAULT 0,
    available_count INTEGER NOT NULL DEFAULT 0,
    sold_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(255) NOT NULL DEFAULT 'pending',
    imported_by BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_license_key_batches_product_id ON license_key_batches(product_id);
CREATE INDEX idx_license_key_batches_imported_by ON license_key_batches(imported_by);

-- 2026_05_27_000004_create_license_keys_table (+ batch_id from 000009)
CREATE TABLE license_keys (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    key_encrypted TEXT NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'available',
    reserved_until TIMESTAMP NULL,
    order_item_id BIGINT NULL REFERENCES order_items(id) ON DELETE SET NULL,
    sold_at TIMESTAMP NULL,
    batch_id BIGINT NULL REFERENCES license_key_batches(id) ON DELETE SET NULL,
    created_by BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_license_keys_product_id ON license_keys(product_id);
CREATE INDEX idx_license_keys_order_item_id ON license_keys(order_item_id);
CREATE INDEX idx_license_keys_batch_id ON license_keys(batch_id);
CREATE INDEX idx_license_keys_created_by ON license_keys(created_by);
CREATE INDEX idx_license_keys_updated_by ON license_keys(updated_by);

-- 2026_05_27_000007_create_audit_logs_table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    model_type VARCHAR(255) NOT NULL,
    model_id INTEGER NOT NULL,
    changes JSONB NULL,
    ip_address VARCHAR(255) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

-- 2026_05_27_000010_create_reviews_table
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    city VARCHAR(60) NOT NULL,
    state VARCHAR(60) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
