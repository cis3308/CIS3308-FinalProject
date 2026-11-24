import { createClient } from '@supabase/supabase-js'
import type {Database} from '../types/database.types.ts'
import './BudgetStyle.css'
import { set_budget_page } from './pageFunction.ts'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey)
async function login(){
	const {data:_data,error}=await supabase.auth.signInWithOAuth({
		provider:'github',
		options:{redirectTo:'https://cis3308.github.io/CIS3308-FinalProject/'}
	})
	if(error!==null){
		console.error(error)
	}
}
async function logout(){
	const {error}=await supabase.auth.signOut()
	if(error!==null){
		console.error(error)
	}
}
async function handle(){
	const {data,error}=await supabase.auth.getClaims()
	if(error!==null){
		console.error(error)
	}else if(data!==null){
		document.querySelector<HTMLDivElement>('#app')!.innerHTML=`
			<div>
				<header>
					<nav>
						<img src="" alt="logo" />
						<a href="#"> My Budget </a>
						<a href="#"> Split </a>
						<div class="profile">
							<a>Profile</a>
						</div>
						<button id="logout">logout</button>
					</nav>
				</header>
			</div>

			<div class="budget-page">
				<div class="pie-chart">
					<div class="title">
						<h1>January</h1>
					</div>
					<div id="pieChart">
						<svg width="200" height="200"></svg>
					</div>
					<a href="#">
						<button id="set-budget">Set Budget</button>
					</a>
				</div>

				<div class="budget">
					<div class="title">
						<h2>Budget</h2>
					</div>
					<div class="budget-list">
						<div class="budget-buttons">
							<button id="add">+ add category</button>
							<button id="edit">Edit</button>
						</div>
						<div class="income">income</div>
						<div class="expense">
							<div class="expense-category">
								<div class="top">
									<svg width="10" height="10"></svg>
									<span>Food</span>
									<span class="amount">$200</span>
								</div>
								<div class="bar">
									<svg width="20" height="10"></svg>
								</div>
								<span>:spent</span>
								<span>:left</span>
							</div>

							<div class="expense-category">
								<div class="top">
									<svg width="10" height="10"></svg>
									<span>Food</span>
									<span class="amount">$200</span>
								</div>
								<div class="bar">
									<svg width="20" height="10"></svg>
								</div>
								<span>:spent</span>
								<span>:left</span>
							</div>
							<div class="expense-category">
								<div class="top">
									<svg width="10" height="10"></svg>
									<span>Food</span>
									<span class="amount">$200</span>
								</div>
								<div class="bar">
									<svg width="20" height="10"></svg>
								</div>
								<span>:spent</span>
								<span>:left</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div id="category-popup-container" class="hidden">
				<div class="category-popup">
					<div class="popup-content">
						<button id="cancel">x</button>
						<h2>Add Category</h2>
						<label for="category-name">Category Name</label>
						<input id="category-name" type="text" />
						<label for="category-limit">Budget Amount</label>
						<input id="category-limit" type="number" />
						<button id="add-new">Add</button>
					</div>
				</div>
			</div>
		`
		document.querySelector<HTMLDivElement>('#logout')!.addEventListener('click',logout)
		document.querySelector<HTMLDivElement>('#set-budget')!.addEventListener('click',set_budget_page)
	}else{
		document.querySelector<HTMLDivElement>('#app')!.innerHTML=`<button id="login">login</button>`
		document.querySelector<HTMLDivElement>('#login')!.addEventListener('click',login)
	}
}
handle()
supabase.auth.onAuthStateChange(async ()=>{
	handle()
})