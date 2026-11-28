import { defineConfig } from 'vite'
import {resolve} from 'node:path'
export default defineConfig({
  base:'/CIS3308-FinalProject/',
  build:{
    rolldownOptions:{
      input:{
        main:resolve(import.meta.dirname,'index.html'),
        budget:resolve(import.meta.dirname,'holly/BudgetPage.html'),
        setBudget:resolve(import.meta.dirname,'holly/setBudgetPage.html'),
        mainpage:resolve(import.meta.dirname,'mainpage.html'),
        income:resolve(import.meta.dirname,'incomepage.html'),
        expense:resolve(import.meta.dirname,'expensepage.html')
      }
    },
    outDir:'docs'
  }
})