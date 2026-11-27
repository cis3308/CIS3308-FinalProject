-- create table  if not exists eventEntry(
-- 	E_ID serial ,
-- 	event_title text,
-- 	event_description text default 'no description',
-- 	event_date_start date default current_date,   
-- 	event_date_end date,

-- 	constraint Event_PK primary key(E_ID)
-- );

-- create table  if not exists Categories(
--     C_ID serial primary key,
--     category text

-- );

-- Create table  if not exists userProfile(
-- 	U_ID serial primary key,
-- 	first_name text,
-- 	last_name text
    
-- );

-- Create table if not exists Friends_List (  
-- 	U_ID int,    
-- 	F_ID int,
	
-- 	primary key( F_ID),
-- 	foreign key(U_ID) references userProfile(U_ID)
-- 	-- foreign key(F_ID) references userProfile(U_ID)
-- );

-- create table if not exists transactions(
--     t_ID serial,
--     title text,
--     C_ID int,
--     amount decimal(65, 2),
--     currency text,
--     E_ID int,
-- 	U_ID int,
-- 	F_ID int,
--     T_Date date,
--     T_Time time,
-- 	T_type text,
-- 	short_description text,

--     constraint Transaction_PK primary key(t_ID),
-- 	constraint Catergory_FK foreign key( C_ID) references Categories( C_ID),
-- 	constraint User_FK foreign key(U_ID) references userProfile(U_ID),
-- 	constraint Friend_FK foreign key(F_ID) references Friends_List(F_ID),
--     foreign key(E_ID) references eventEntry(E_ID)
-- );





-- -- create table if not exists debt(
-- -- 	T_ID int, 
-- -- 	amount decimal(65, 2),
-- -- 	U_ID int,
-- -- 	F_ID int,
-- -- 	messages text,
-- -- 	foreign key(F_ID) references Friends_List(F_ID),
-- -- 	foreign key(U_ID) references userProfile(U_ID),
-- -- 	foreign key(T_ID) references transactions(T_ID)
-- -- );

-- Create table if not exists Balance (
-- 	account_ID int,
--     foreign key (account_ID)  references userProfile(U_ID),
-- 	Total_balance decimal(65, 2),
-- 	Annual_Budget decimal(65, 2)
	

-- );

-- -- create table if not exists monthlyInfo(
-- -- 	account_ID int,
-- -- 	foreign key (account_ID)  references userProfile(U_ID),
-- -- 	M_ID serial primary key,
-- -- 	monthly_Budget decimal(65,2),
-- -- 	predicted_monthly_spending decimal(65,2)
-- -- );


