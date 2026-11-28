//-----------------------------------------------------//

import {supabase} from "../supabaseClient.ts"

//------------ Display information -------------------//

export  const showEventEntries = async() =>{
  const{data} = await supabase.from('evententry')
  .select('distinct(event_title)');
  return data;
};

export  const showTransactions = async() =>{
  const{data} = await supabase.from('transactions')
  .select('*').order('T_Date', { ascending: false });
  return data;
};

// only selects amount. This function may be necessary for updating
//the total balance by using the output as an input param for
//updateBalance rpc
export  const showTransactionAmount = async() =>{
  const{data} = await supabase.from('transactions')
  .select('amount').order('t_id', {ascending: false}).limit(1).single();
  return data;
};

export  const showAnnualBudget = async() =>{
  const{data} = await supabase.from('balance')
  .select('Annual_Budget');
  return data;
};

//maybe update
export  const showRequests = async() =>{
  const{data} = await supabase.from('transactions')
  .select('*').neq('f_id', null);
  return data;
};

export  const showFriendsList = async() =>{
  const{data} = await supabase.from('friends_list')
  .select('f_id');
  return data;
};

export const showFriendID = async(friendFName: string, friendLName: string) =>{
  const{data} = await supabase.from("userprofile").select("u_id").eq("first_name", friendFName)
  .eq("last_name", friendLName);
  return data;
}

export const showTotalBalance = async() =>{
  const{data} = await supabase.from('balance')
  .select('total_balance');
  return data;
};

export const showTotalEventExpenses = async(event: number) =>{
  const{data} = await supabase.rpc('sumeventexpenses', {eventid: event})
  return data;
};

export const showMonthlyExpenses = async(start_date: string, end_date: string) =>{
  const{data} = await supabase.from('transactions')
  .select('*').lte("t_date", end_date).gte("t_date", start_date)
  //.is('f_id', null)
  return data;
};

//This method performs the division as well. Use to find pie slice size.
export const  showPieSlicePercentage = async(start_date: string, end_date: string, categoryID: number) =>{
  const{data: total, error: error1} = await supabase.rpc('showtotalexpensesbycategory', {startdate: start_date, enddate: end_date, categorytype: categoryID});
  if(total == null){throw(error1)};
  const{data: balanceData, error: error2} = await supabase.from('balance').select('annual_budget').single();
  if(balanceData?.annual_budget == null){throw(error2)};
  const categoryPercentage = total /  (balanceData.annual_budget / 12);
  return categoryPercentage;
};

export const  showTotalExpensesByCategory = async(start_date: string, end_date: string, categoryID: number) =>{
  const{data: total} = await supabase.rpc('showtotalexpensesbycategory', {startdate: start_date, enddate: end_date, categorytype: categoryID});
  return total;
};

//this function returns the id as well as the category. The user should only see the category column in the drop down. When a row gets selected, the 
// corresponding c_id should be the parameter used for filtering in functions like showCategoryTransactions
export  const showCategories = async() =>{
  const{data} = await supabase.from('categories')
  .select('category, c_id');
  return data;
};

export  const showCategoryTransactions = async(category: number) =>{
  const{data} = await supabase.from('transactions')
  .select('*').order('T_Date', { ascending: false }).eq('c_id', category);
  return data;
};


export const showMonthlyTotal = async(start_date: string, end_date: string) =>{
  const{data} = await supabase.rpc('showmonthlytotal', {startdate: start_date, enddate: end_date})
  return data;
};

export const filterByEvent = async(e_id: number) =>{
  const{data} = await supabase.from('transactions')
  .select('*').eq("e_id", e_id);
  return data;
};


export  const showTotalDebt = async() =>{
  const{data} = await supabase.rpc('showtotaldebt');
  return data;
};

export  const showLender = async(t_id: number) =>{
  const{data} = await supabase.rpc('showlender', {transactionid: t_id});
  return data;
};

export  const showReceiver = async(t_id: number) =>{
  const{data} = await supabase.rpc('showreceiver', {transactionid: t_id});
  return data;
};


// total category amount

//-----------------------------------------------------//

//-------------- update information  ------------------//

export  const updatePayment = async(payment: number, transactionID: number, transactionOwner: string) =>{
  await supabase.rpc('updatetransaction', {updateamount: payment, t_id: transactionID});
  await supabase.rpc('updatebalance', {updateamount: payment, userid: transactionOwner});
};

export const updateBalance = async(amount: number, userID: string) =>{
  await supabase.rpc('updatebalance', {updateamount: amount, userid: userID}); 
};

//-----------------------------------------------------//

//--------     insert new information   ---------------//

export const newTransaction = async(amount: number, category: number, currency: string,
  event: number, friend: string, shortdesc: string, date: string, type: string, 
  title:string, user: string) =>{
  try{ 
    const { data: transaction } = await supabase
    .from('transactions').insert({amount: amount, c_id: category, currency: currency, 
    e_id: event, f_id: friend, short_description: shortdesc, t_date: date, t_type: type,
    title: title, u_id: user
    }).select();
  
    if(transaction){
      console.log(transaction)
    }
    return transaction;
    
  }
  catch(error){
    console.error(error)
    
  }
};

export const createBalance = async(UserID: string, 
  annualBudget: number, initializeBalance: number) =>{
  try{ 
    let { data: balance } = await supabase
    .from('balance').insert({account_id: UserID, 
      annual_budget: annualBudget, 
      total_balance: initializeBalance}).select();
  
    if(balance){console.log(balance)}
    return balance;
  }
  catch(error){
    console.error(error)
  }
};

export const addFriend = async(userID: string, friendID: string) =>{
  await supabase.from("friends_list").insert({u_id: userID, f_id: friendID});
}

//TODO create function to add expose logged user's first and last name 
// (useful for search)
//-----------------------------------------------------//