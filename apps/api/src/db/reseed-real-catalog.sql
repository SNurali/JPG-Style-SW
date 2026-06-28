-- Реальный каталог SmartWash (точные данные от Нурали 2026-06-29, бренд ЗЕЛЁНЫЙ).
-- Безопасно: orders = 0.
BEGIN;

TRUNCATE reviews, products, categories RESTART IDENTITY CASCADE;

INSERT INTO categories (name, slug, description, image, sort_order) VALUES
('Автошампуни','auto-shampoo','Бесконтактные автошампуни для автомоек','/images/categories/shampoo.webp',1),
('Воск','wax','Воски для блеска и защиты кузова','/images/categories/wax.webp',2),
('Чернитель шин','tire-blackener','Средства для ухода за резиной','/images/categories/tire.webp',3),
('Сухой туман','dry-fog','Ароматизация и устранение запахов в салоне','/images/categories/fog.webp',4),
('Грузовая химия','truck-chemicals','Активная химия для грузового транспорта','/images/categories/chemicals.webp',5);

INSERT INTO products (name,slug,description,price,compare_at_price,sku,category_id,is_bestseller,is_new,stock,rating,review_count,images) VALUES
('Автошампунь бесконтактный, розовая пена — 20 кг','pink-shampoo-20kg','Бесконтактный автошампунь с активной розовой пеной. Густая стойкая пена, мощное отмывание в условиях ташкентской пыли, экономичный расход, безопасен для ЛКП. Для любых автомобилей.',500000,NULL,'SW-SH-PINK-20',(SELECT id FROM categories WHERE slug='auto-shampoo'),TRUE,TRUE,50,4.9,27,'["/products/pink-shampoo-20kg.png"]'::jsonb),
('Автошампунь бесконтактный, белая пена — 20 кг','white-shampoo-20kg','Бесконтактный автошампунь с густой белой пеной. Отмывает сильные загрязнения после ташкентских дорог практически с одного нанесения, экономичный расход, безопасен для лакокрасочного покрытия.',450000,NULL,'SW-SH-WHITE-20',(SELECT id FROM categories WHERE slug='auto-shampoo'),TRUE,TRUE,50,4.8,21,'["/products/white-shampoo-20kg.png"]'::jsonb),
('Нано-шампунь — 5 кг','nano-shampoo-5kg','Нано-шампунь для ручной мойки. Усиливает блеск, добавляет защиту и приятный аромат после мойки.',300000,NULL,'SW-SH-NANO-5',(SELECT id FROM categories WHERE slug='auto-shampoo'),TRUE,FALSE,40,4.8,19,'["/products/nano-shampoo-5l.png"]'::jsonb),
('Воск для автомойки — 5 кг','wax-5kg','Жидкий воск для блеска и защиты кузова. Водоотталкивающий эффект и глубокий блеск после мойки.',200000,NULL,'SW-WX-5',(SELECT id FROM categories WHERE slug='wax'),TRUE,FALSE,35,4.8,22,'["/products/wax-bubblegum-5l.png"]'::jsonb),
('Чернитель резины — 10 л','tire-shine-10l','Чернитель резины: глубокий насыщенный «мокрый» чёрный цвет, держится 7–10 дней. Не оставляет жирных следов на пластике и дисках.',150000,NULL,'SW-TB-10',(SELECT id FROM categories WHERE slug='tire-blackener'),TRUE,FALSE,40,4.7,17,'["/products/tire-shine-glossy.png"]'::jsonb),
('Сухой туман — ароматизатор салона, 450 мл','dry-fog-450ml','Сухой туман для ароматизации и устранения запахов в салоне. Разные ароматы на выбор, долгосрочная свежесть.',100000,NULL,'SW-DF-450',(SELECT id FROM categories WHERE slug='dry-fog'),TRUE,TRUE,60,4.6,12,'["/products/dry-fog-450ml.png"]'::jsonb),
('Активная химия для грузовых авто — 20 кг','truck-chemistry-20kg','Активная химия для грузового транспорта. Мощное средство для больших объёмов и сильных загрязнений.',450000,NULL,'SW-TR-20',(SELECT id FROM categories WHERE slug='truck-chemicals'),FALSE,FALSE,25,4.7,8,'["/products/truck-chemistry-20kg.png"]'::jsonb);

INSERT INTO reviews (product_id, customer_name, rating, comment, is_approved) VALUES
((SELECT id FROM products WHERE slug='pink-shampoo-20kg'),'Сардор Т.',5,'Розовая пена — огонь! Грязь сходит без контакта, машина блестит. Для мойки берём только её.',TRUE),
((SELECT id FROM products WHERE slug='white-shampoo-20kg'),'Дильшод К.',5,'Белая пена отмывает ташкентскую пыль на ура, расход экономный. Берём канистрами.',TRUE),
((SELECT id FROM products WHERE slug='tire-shine-10l'),'Жасур Н.',5,'Чернитель — эффект мокрых шин держится больше недели. Клиенты доплачивают с радостью.',TRUE),
((SELECT id FROM products WHERE slug='wax-5kg'),'Алишер М.',5,'Воск даёт реальный блеск, вода скатывается шариками. Средний чек подрос.',TRUE),
((SELECT id FROM products WHERE slug='truck-chemistry-20kg'),'Бекзод Р.',5,'Для фур то что надо — мощная химия, отмывает дорожную грязь.',TRUE);

COMMIT;
