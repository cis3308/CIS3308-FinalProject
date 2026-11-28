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
export async function logout(){
	const {error}=await supabase.auth.signOut()
	if(error!==null)console.log(error)
	window.location.replace('/CIS3308-FinalProject/index.html')
}
export async function login(client:SupabaseClient<Database>){
	const {data:_data,error}=await client.auth.signInWithOAuth({provider:'github',options:{redirectTo:'https://cis3308.github.io/CIS3308-FinalProject/mainpage.html'}})
	if(error!==null)return console.error(error)
}
export const show_logged_in=(authstate:LoggedIn)=>{
	console.log(authstate.kind)
}
export const show_logged_out=(authstate:LoggedOut)=>{
	console.log(authstate.kind)
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