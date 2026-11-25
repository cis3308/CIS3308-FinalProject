drop table if exists eventEntry cascade;
drop table if exists Categories cascade;
drop table if exists userProfile cascade;
drop table if exists Friends_List cascade;
drop table if exists transactions cascade;
drop table if exists Balance cascade;

create table eventEntry(
	E_ID serial ,
	event_title text,
	event_description text,
	event_date_start date default current_date,
	event_date_end date,
	constraint Event_PK primary key(E_ID)
);

create table Categories(
    C_ID serial primary key,
    category text
);

Create table userProfile(
	U_ID uuid primary key references auth.users on delete cascade,
	first_name text,
	last_name text
);

Create table Friends_List (
	U_ID uuid references userProfile,
	F_ID uuid primary key references userProfile on delete cascade,
	unique (U_ID,F_ID),
	check (U_ID!=F_ID)
);

create table transactions(
    t_ID serial,
    title text,
    C_ID int,
    amount decimal(65, 2),
    currency text,
    E_ID int,
	U_ID uuid references userProfile,
	F_ID uuid references Friends_List,
    T_Date date,
    T_Time time,
	T_type text,
	short_description text,

    constraint Transaction_PK primary key(t_ID),
	constraint Catergory_FK foreign key( C_ID) references Categories( C_ID),
    foreign key(E_ID) references eventEntry(E_ID)
);
Create table Balance (
	account_ID uuid references userProfile on delete cascade,
	Total_balance decimal(65, 2),
	Annual_Budget decimal(65, 2)
);

alter table userProfile enable row level security;
alter table Friends_List enable row level security;
alter table transactions enable row level security;
alter table Balance enable row level security;
alter table eventEntry enable row level security;
alter table Categories enable row level security;

create policy "user can read own profile" on userProfile for select to authenticated using (U_ID=(select auth.uid()));
create policy "user can read own friend" on Friends_List for select to authenticated using (F_ID=(select auth.uid()));
create policy "user can read own transaction" on transactions for select to authenticated using (U_ID=(select auth.uid()));
create policy "user can read own balance" on Balance for select to authenticated using (account_ID=(select auth.uid()));
create policy "user can read own event" on eventEntry for select to authenticated using (exists (select 1 from transactions t where t.E_ID=E_ID and t.U_ID=auth.uid()));
create policy "user can read own category" on Categories for select to authenticated using (exists (select 1 from transactions t where t.C_ID=C_ID and t.U_ID=auth.uid()));

create policy "user can add own friend" on Friends_List for insert to authenticated with check (F_ID=(select auth.uid()));
create policy "user can add own transaction" on transactions for insert to authenticated with check (U_ID=(select auth.uid()));
create policy "user can add own balance" on Balance for insert to authenticated with check (account_ID=(select auth.uid()));
create policy "user can add own event" on eventEntry for insert to authenticated with check (exists (select 1 from transactions t where t.E_ID=E_ID and t.U_ID=auth.uid()));
create policy "user can add own category" on Categories for insert to authenticated with check (exists (select 1 from transactions t where t.C_ID=C_ID and t.U_ID=auth.uid()));

create policy "user can edit own profile" on userProfile for update to authenticated using (U_ID=(select auth.uid())) with check (U_ID=(select auth.uid()));
create policy "user can edit own friend" on Friends_List for update to authenticated using (F_ID=(select auth.uid())) with check (F_ID=(select auth.uid()));
create policy "user can edit own transaction" on transactions for update to authenticated using (U_ID=(select auth.uid())) with check (U_ID=(select auth.uid()));
create policy "user can edit own balance" on Balance for update to authenticated using (account_ID=(select auth.uid())) with check (account_ID=(select auth.uid()));
create policy "user can edit own event" on eventEntry for update to authenticated using (exists (select 1 from transactions t where t.E_ID=E_ID and t.U_ID=auth.uid())) with check (exists (select 1 from transactions t where t.E_ID=E_ID and t.U_ID=auth.uid()));
create policy "user can edit own category" on Categories for update to authenticated using (exists (select 1 from transactions t where t.C_ID=C_ID and t.U_ID=auth.uid())) with check (exists (select 1 from transactions t where t.C_ID=C_ID and t.U_ID=auth.uid()));

create policy "user can delete own friend" on Friends_List for delete to authenticated using (F_ID=(select auth.uid()));
create policy "user can delete own transaction" on transactions for delete to authenticated using (U_ID=(select auth.uid()));
create policy "user can delete own balance" on Balance for delete to authenticated using (account_ID=(select auth.uid()));
create policy "user can delete own event" on eventEntry for delete to authenticated using (exists (select 1 from transactions t where t.E_ID=E_ID and t.U_ID=auth.uid()));
create policy "user can delete own category" on Categories for delete to authenticated using (exists (select 1 from transactions t where t.C_ID=C_ID and t.U_ID=auth.uid()));
