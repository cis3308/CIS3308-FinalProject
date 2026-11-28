import { renderLoginPage } from "./login";
import { renderMainPage} from "./mainpage";
import { renderIncomePage } from "./income";
import { renderExpensePage} from "./expense";
import { createClient, type SupabaseClient, type JwtPayload} from '@supabase/supabase-js'
import type {Database} from '../types/database.types.ts'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey)
export interface LoggedOut{kind:'logged-out'}
export interface Pending{kind:'pending'}
export interface LoggedIn{kind:'logged-in',claims:JwtPayload}
export interface AuthError{kind:'auth-error'}
export type AuthState=LoggedOut|Pending|LoggedIn|AuthError
export type Claims=Awaited<ReturnType<SupabaseClient['auth']['getClaims']>>
export const claims_to_state=(claims:Claims):AuthState=>{
	if(claims.data===null&&claims.error===null)return {kind:'logged-out'}
	else if(claims.error!==null)return {kind:'auth-error'}
	else return {kind:'logged-in',claims:claims.data.claims}
}
export const get_auth_state=async (client:SupabaseClient<Database>):Promise<AuthState>=>{
	const claims=await client.auth.getClaims()
	return claims_to_state(claims)
}
export const handle_auth_state=(authstate:AuthState)=>{
	show_auth_state(authstate)
}

export async function login(client:SupabaseClient<Database>){
	const {data:_data,error}=await client.auth.signInWithOAuth({provider:'github',options:{redirectTo:'https://billie-mp4.github.io/authtest/'}})
	if(error!==null)return console.error(error)
}
export const show_logged_in=(authstate:LoggedIn)=>{
	renderMainPage()
	let budget_btn=document.createElement('button')
	budget_btn.textContent='budget'
	let income_btn=document.createElement('button')
	income_btn.textContent='income'
	let expense_btn=document.createElement('button')
	expense_btn.textContent='expense'
	let logout_btn=document.createElement('button')
	logout_btn.textContent='logout'
	document.querySelector<HTMLDivElement>('nav.budget-links')?.append(logout_btn)
	logout_btn.onclick=async()=>{const{error:_error}=await supabase.auth.signOut()}
	budget_btn.onclick=()=>window.location.href='./holly/'
	income_btn.onclick=()=>renderIncomePage()
	expense_btn.onclick=()=>renderExpensePage()
	console.log(authstate)
}
export const show_logged_out=(authstate:LoggedOut)=>{
	renderLoginPage()
	let btn=document.createElement('button')
	btn.textContent='login'
	document.querySelector<HTMLDivElement>('.main')?.appendChild(btn)
	btn.onclick=async()=>{login(supabase)}
	console.log(authstate)
}
export const show_auth_state=(authstate:AuthState)=>{
	if(authstate.kind==='logged-in')show_logged_in(authstate)
	else if(authstate.kind==='logged-out')show_logged_out(authstate)
}
window.onload=async function(){
	let auth_state=await get_auth_state(supabase)
	handle_auth_state(auth_state)
	supabase.auth.onAuthStateChange(async ()=>{
		let new_auth_state=await get_auth_state(supabase)
		handle_auth_state(new_auth_state)
	})
}