-- Database Functions

-- sum

create or replace function sumEventExpenses(eventID int)
returns numeric
language sql
as $$
    select sum(amount) from transactions
    where e_id = eventID;
$$;

create or replace function showTotalDebt()
returns numeric
language sql
as $$
    select sum(amount) from transactions
    where f_id is not null;
$$;

create or replace function showMonthlytotal(startDate text, endDate text)
returns numeric
language sql
as $$
    select sum(amount) from transactions
    where T_Date >= startDate::date and T_Date <= endDate::date;
    -- remove type casting from where if the input parameter types are 
    -- changed from text to date
$$;

create or replace function showLender(transactionID numeric)
returns text
language sql
as $$
     select first_name
    from userprofile up 
    join transactions tr
    on tr.u_id = up.u_id
    where tr.t_id = transactionID;
$$;

create or replace function showReceiver(transactionID numeric)
returns text
language sql
as $$
     select first_name
    from userprofile up 
    join transactions tr
    on tr.f_id = up.u_id
    where tr.t_id = transactionID;
$$;

-- Update 

create or replace function updateBalance(updateAmount int, userID uuid)
returns void
language sql
as $$
    update Balance
    set Total_balance = Total_balance + updateAmount
    where account_ID = userID;
$$;

create or replace function updateTransaction(updateAmount int, t_id numeric)
returns void
language sql
as $$
    update transactions
    set amount = amount + updateAmount
    where t_ID = t_id;
$$;