CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer
)

create table stocks (
	product_id uuid not null,
	count int not null,
	foreign key ("product_id") references "products" ("id")
)

insert into products (title, description, price) values
	('God Of War', 'New GOW Game', 30),
	('Horizon: Zero Dawn', 'Explore the world full of machines', 20),
	('God of War: Ragnarok', 'Continue the story of Kratos', 60),
	('Detroit: Become Human', 'Interactive movie about androids', 30),
	('Elden Ring', 'Explore the world of masterpiece created By J.R.R. Martin And H.Miyadzaki', 60),
	('NBA 2022', 'Basketball Simulator', 45),
	('Cyberpunk 2077', 'The most laggy game ever made but still very good', 20),
	('Hollow Knight', 'The best platformer game have ever been made', 20)

insert into stocks (product_id, count) values
	('3f2e73b2-ff85-4001-a0cc-f0f5ba0d82f1', 10),
	('62e4c7e9-ae5a-4fe9-897d-99ac946471f8', 10),
	('4c71d65d-b2fa-4206-8988-b36cd99d5554', 10),
	('ccf98db7-e318-44dc-ad94-9dbd5745ef9d', 10),
	('cb717872-2860-4227-97a4-f42215046d9d', 10),
	('c5972fd7-0c20-4968-b2a5-9febe689dca3', 10),
	('e0e308e0-fb63-4e6b-897f-6bd7693e68ea', 10),
	('46e0e07a-2b62-4af6-8889-f6e0b0b836e0', 10)
	
alter table stocks add constraint stocks_nonnegative check (count >= 0);
