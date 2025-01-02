CREATE TABLE products (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products_characteristics (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id INT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE characteristics_options (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    characteristic_id INT,
    value VARCHAR(255) NOT NULL,
    is_in_stock BOOLEAN DEFAULT TRUE,  -- Boolean to indicate stock status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (characteristic_id) REFERENCES products_characteristics(id) ON DELETE CASCADE
);
CREATE TABLE products_rules (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id INTEGER NOT NULL,
    restricted_characteristic_id INTEGER NOT NULL,
    restricted_option_id INTEGER NOT NULL,
    depends_on_characteristic_id INTEGER NOT NULL,
    depends_on_option_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (restricted_characteristic_id) REFERENCES products_characteristics(id) ON DELETE CASCADE,
    FOREIGN KEY (restricted_option_id) REFERENCES characteristics_options(id) ON DELETE CASCADE,
    FOREIGN KEY (depends_on_characteristic_id) REFERENCES products_characteristics(id) ON DELETE CASCADE,
    FOREIGN KEY (depends_on_option_id) REFERENCES characteristics_options(id) ON DELETE CASCADE
);

-- Insert initial data
-- Add products
INSERT INTO products (name, description, base_price, category) VALUES
('Custom Bicycle', 'Fully customizable bicycle.', 499.99, 'Bicycle');

-- Add product characteristics
INSERT INTO products_characteristics (product_id, name) VALUES
(1, 'Frame Type'),
(1, 'Frame Finish'),
(1, 'Wheels'),
(1, 'Rim Color'),
(1, 'Chain');

-- Add characteristic options
-- Frame Type
INSERT INTO characteristics_options (characteristic_id, value) VALUES
(1, 'Full-suspension'),
(1, 'Diamond'),
(1, 'Step-through');

-- Frame Finish
INSERT INTO characteristics_options (characteristic_id, value) VALUES
(2, 'Matte'),
(2, 'Shiny');

-- Wheels
INSERT INTO characteristics_options (characteristic_id, value) VALUES
(3, 'Road wheels'),
(3, 'Mountain wheels'),
(3, 'Fat bike wheels');

-- Rim Color
INSERT INTO characteristics_options (characteristic_id, value) VALUES
(4, 'Red'),
(4, 'Black'),
(4, 'Blue');

-- Chain
INSERT INTO characteristics_options (characteristic_id, value) VALUES
(5, 'Single-speed chain'),
(5, '8-speed chain');

-- Add product rules
-- Rule 1: If "Mountain wheels", then the only frame available is "Full-suspension"
INSERT INTO products_rules (product_id, restricted_characteristic_id, restricted_option_id, depends_on_characteristic_id, depends_on_option_id) VALUES
(1, 1, 2, 3, 7), -- Diamond frame restricted when Mountain wheels are selected
(1, 1, 3, 3, 7); -- Step-through frame restricted when Mountain wheels are selected

-- Rule 2: If "Fat bike wheels", then "Red rim color" is unavailable
INSERT INTO products_rules (product_id, restricted_characteristic_id, restricted_option_id, depends_on_characteristic_id, depends_on_option_id) VALUES
(1, 4, 9, 3, 8); -- Red rims restricted when Fat bike wheels are selected