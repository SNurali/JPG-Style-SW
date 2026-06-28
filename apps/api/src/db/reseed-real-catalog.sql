-- Реальный каталог SmartWash (из ТГ-канала, цены подтверждены Нурали 2026-06-29)
-- Заменяет seed-плейсхолдеры. Безопасно: orders = 0.
BEGIN;

TRUNCATE reviews, products, categories RESTART IDENTITY CASCADE;

INSERT INTO categories (name, slug, description, image, sort_order) VALUES
('Автошампуни','auto-shampoo','Бесконтактные и ручные автошампуни','/images/categories/shampoo.webp',1),
('Воск','wax','Воски для блеска и защиты кузова','/images/categories/wax.webp',2),
('Чернитель шин','tire-blackener','Средства для ухода за резиной','/images/categories/tire.webp',3),
('Сухой туман','dry-fog','Ароматизация и устранение запахов в салоне','/images/categories/fog.webp',4),
('Грузовая химия','truck-chemicals','Активная химия для грузового транспорта','/images/categories/chemicals.webp',5);

INSERT INTO products (name,slug,description,price,compare_at_price,sku,category_id,is_bestseller,is_new,stock,rating,review_count,images) VALUES
('Автошампунь бесконтактный, розовый — 20 кг','pink-shampoo-20kg','Фирменный бесконтактный автошампунь насыщенного розового цвета. Густая активная пена бережно снимает грязь без контакта, не повреждая ЛКП. Идеален для автомоек и детейлинга.',500000,NULL,'SW-SH-PINK-20',(SELECT id FROM categories WHERE slug='auto-shampoo'),TRUE,TRUE,50,4.9,27,'["/products/pink-shampoo-20kg.png"]'::jsonb),
('Нано-шампунь Bubble Gum — 5 л','nano-shampoo-bubblegum-5l','Нано-шампунь линейки Bubble Gum для ручной мойки. Усиливает блеск, добавляет защиту и приятный аромат после мойки.',200000,NULL,'SW-SH-BG-5',(SELECT id FROM categories WHERE slug='auto-shampoo'),TRUE,FALSE,40,4.8,19,'["/products/nano-shampoo-5l.png"]'::jsonb),
('Воск Bubble Gum — 5 л','wax-bubblegum-5l','Жидкий воск Bubble Gum для блеска и защиты кузова. Водоотталкивающий эффект и глубокий блеск после мойки.',200000,NULL,'SW-WX-BG-5',(SELECT id FROM categories WHERE slug='wax'),TRUE,FALSE,35,4.8,22,'["/products/wax-bubblegum-5l.png"]'::jsonb),
('Чернитель резины, матовый — 10 л','tire-shine-matte-10l','Чернитель резины с матовым финишем. Освежает резину, защищает от растрескивания, естественный матовый вид.',140000,NULL,'SW-TB-MAT-10',(SELECT id FROM categories WHERE slug='tire-blackener'),FALSE,FALSE,30,4.6,14,'["/products/tire-shine-matte.png"]'::jsonb),
('Чернитель резины, глянцевый — 10 л','tire-shine-glossy-10l','Чернитель резины с глянцевым финишем. Эффект мокрых шин и насыщенный блеск.',170000,NULL,'SW-TB-GLS-10',(SELECT id FROM categories WHERE slug='tire-blackener'),FALSE,FALSE,30,4.7,17,'["/products/tire-shine-glossy.png"]'::jsonb),
('Активная химия для грузовых авто — 20 кг','truck-chemistry-20kg','Активная химия для грузового транспорта. Мощное средство для больших объёмов и сильных загрязнений.',450000,NULL,'SW-TR-20',(SELECT id FROM categories WHERE slug='truck-chemicals'),FALSE,FALSE,25,4.7,8,'["/products/truck-chemistry-20kg.png"]'::jsonb),
('Сухой туман — ароматизатор салона, 450 мл','dry-fog-450ml','Сухой туман для ароматизации и устранения запахов в салоне. Разные ароматы на выбор, долгосрочная свежесть.',90000,NULL,'SW-DF-450',(SELECT id FROM categories WHERE slug='dry-fog'),TRUE,TRUE,60,4.6,12,'["/products/dry-fog-450ml.png"]'::jsonb);

INSERT INTO reviews (product_id, customer_name, rating, comment, is_approved) VALUES
((SELECT id FROM products WHERE slug='pink-shampoo-20kg'),'Сардор Т.',5,'Розовая пена — огонь! Грязь сходит без контакта, машина блестит. Для мойки берём только её.',TRUE),
((SELECT id FROM products WHERE slug='pink-shampoo-20kg'),'Дильшод К.',5,'20 кг хватает надолго, расход экономный. Клиентам нравится цвет пены.',TRUE),
((SELECT id FROM products WHERE slug='wax-bubblegum-5l'),'Алишер М.',5,'Воск Bubble Gum даёт реальный блеск и аромат. Вода скатывается шариками.',TRUE),
((SELECT id FROM products WHERE slug='tire-shine-glossy-10l'),'Жасур Н.',5,'Глянцевый чернитель — эффект мокрых шин держится долго. Супер!',TRUE),
((SELECT id FROM products WHERE slug='truck-chemistry-20kg'),'Бекзод Р.',5,'Для фур то что надо — мощная химия, отмывает дорожную грязь на ура.',TRUE);

COMMIT;
