/*
insert into eventEntry
    (E_ID, event_title, event_description, event_date_start, event_date_end)
values(1, 'Chinatown_Trip', 'I had a lot of fun', '2003-06-23', '2003-06-24'),
(2, 'Shibuya_shopping_spree', 'my wallet suffered', '2026-06-23', '2026-06-24'),
(3, 'TUJ_weekend_trip', 'we visited the countryside', '2023-06-23', '2023-06-24');

----------------------------

insert into Categories
    (C_ID, category)
values( 1, 'food & drinks'),
( 2, 'transportation'),
( 3, 'entertainment'),
(4,  'living'),
( 5, 'health & care'),
( 6, 'debt'),
( 7, 'fixed_expenses');

----------------------------

insert into userProfile
    (U_ID, first_name, last_name)
values(1, 'Genghis', 'Khan');

----------------------------

insert into Balance
    (account_ID, Total_balance, Annual_Budget)
values(1, 30000.00 , 5000.00);

----------------------------

insert into transactions
    (t_ID, title, C_ID, amount, currency, E_ID, U_ID, T_Date, T_type)
values(1, 'coconut', 1, 7.00, 'usd', 3, 1, '2023-06-23', 'expense'),
(2, 'PS5', 3, 500.00, 'usd', 2, 1, '2026-06-23', 'expense');
*/