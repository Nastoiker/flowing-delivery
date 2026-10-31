-- Synthetic, data-only demo dump. Apply after account has initialized its schema.
-- No real contacts, reusable passwords, destructive statements or fixed primary keys.
BEGIN;
SELECT pg_advisory_xact_lock(719310042);
CREATE TABLE IF NOT EXISTS demo_imports (version text PRIMARY KEY, imported_at timestamptz NOT NULL DEFAULT now());
DO $$
DECLARE
  category_id integer;
  food_id integer;
  user_id integer;
  order_id integer;
  item record;
BEGIN
  IF EXISTS (SELECT 1 FROM demo_imports WHERE version = 'catalog-orders-v1') THEN RETURN; END IF;
  IF EXISTS (SELECT 1 FROM "Users" WHERE email = 'demo-buyer@example.invalid') THEN
    RAISE EXCEPTION 'Demo email already exists; refusing to attach demo data to an existing account';
  END IF;
  INSERT INTO "Categories" (name, slug, pictures, "createdAt", "updatedAt")
  VALUES ('Демо-меню', 'demo-menu-v1', '', now(), now()) RETURNING id INTO category_id;
  INSERT INTO "Users" (name, surname, username, email, password, roles, "createdAt", "updatedAt")
  VALUES ('Тестовый', 'Покупатель', 'demo-buyer', 'demo-buyer@example.invalid', '!LOGIN_DISABLED!', 2, now(), now())
  RETURNING id INTO user_id;
  FOR item IN SELECT * FROM (VALUES
    ('Демо: пицца Маргарита', 590, 12),
    ('Демо: салат Цезарь', 390, 18),
    ('Демо: паста с томатами', 490, 15),
    ('Демо: чизкейк', 290, 20),
    ('Демо: лимонад', 190, 30)
  ) AS menu(title, price, stock) LOOP
    INSERT INTO "Food" (title, price, count, in_stock, description, pictures, "categoryId", "createdAt", "updatedAt")
    VALUES (item.title, item.price, item.stock, item.stock, 'Синтетические данные демонстрационного стенда', '', category_id, now(), now())
    RETURNING id INTO food_id;
    INSERT INTO "Orders" (status, "deliveryAddress", "priceFood", "deliveryPrice", "isPickUp", completed, "isPaid", "totalPrice", "userId", "createdAt", "updatedAt")
    VALUES ('created', 'Тестовый город, Демонстрационная улица, 1', item.price, 0, true, false, false, item.price, user_id, now(), now())
    RETURNING id INTO order_id;
    INSERT INTO "OrderFoods" ("orderId", "foodId", quantity, "productTitle", "unitPriceMinor")
    VALUES (order_id, food_id, 1, item.title, item.price * 100);
  END LOOP;
  INSERT INTO demo_imports(version) VALUES ('catalog-orders-v1');
END $$;
-- Repair the original demo import once; never replenish stock on later imports.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM demo_imports WHERE version = 'catalog-stock-v2') THEN RETURN; END IF;
  UPDATE "Food" AS food
  SET count = food.in_stock, "updatedAt" = now()
  FROM "Categories" AS category
  WHERE food."categoryId" = category.id
    AND category.slug = 'demo-menu-v1'
    AND food.count = 0
    AND food.in_stock > 0;
  INSERT INTO demo_imports(version) VALUES ('catalog-stock-v2');
END $$;
COMMIT;
